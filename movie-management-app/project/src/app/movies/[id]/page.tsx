"use client";

import { useState, useEffect } from "react";
import { MovieService } from "../../../services/MovieService";
import { Movie } from "../../../domain/Movie";
import Link from "next/link";
import Charts from "../../../components/Charts";

export default function MovieList() {
	const movieService = new MovieService();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [newMovie, setNewMovie] = useState<Movie>({
		id: "",
		name: "",
		genres: [],
		releaseDate: "",
		rating: 1,
		description: "",
	});
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [showForm, setShowForm] = useState<boolean>(false);
	const [currentGenreInput, setCurrentGenreInput] = useState<string>("");
	const [filterText, setFilterText] = useState<string>("");
	const [sortBy, setSortBy] = useState<string>("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 5;

	useEffect(() => {
		async function fetchMovies() {
			try {
				const queryParams = new URLSearchParams();
				if (filterText) queryParams.append("filter", filterText);
				if (sortBy) queryParams.append("sort", sortBy);
				if (sortOrder) queryParams.append("order", sortOrder);

				const response = await fetch(`/api/movies?${queryParams.toString()}`);
				if (!response.ok) throw new Error("Failed to fetch movies");
				const data = await response.json();
				setMovies(data);
			} catch (error) {
				console.error("Error fetching movies:", error);
				setError("Failed to load movies");
			}
		}
		fetchMovies();
	}, [filterText, sortBy, sortOrder]);

	const validateMovie = (): boolean => {
		if (!newMovie.name.trim()) {
			setError("Movie name is required.");
			return false;
		}
		if (newMovie.genres.length === 0) {
			setError("At least one genre is required.");
			return false;
		}
		if (!newMovie.releaseDate) {
			setError("Release date is required.");
			return false;
		}
		if (newMovie.rating < 1 || newMovie.rating > 10) {
			setError("Rating must be between 1 and 10.");
			return false;
		}
		setError("");
		return true;
	};

	const handleCreateOrUpdate = async () => {
		if (!validateMovie()) return;

		try {
			if (isEditing) {
				await movieService.updateMovie(newMovie);
			} else {
				const newMovieWithId = { ...newMovie, id: Date.now().toString() };
				await movieService.addMovie(newMovieWithId);
			}

			const updatedMovies = await movieService.getAllMovies();
			setMovies(updatedMovies);
			setIsEditing(false);
			setNewMovie({
				id: "",
				name: "",
				genres: [],
				releaseDate: "",
				rating: 1,
				description: "",
			});
			setShowForm(false);
		} catch (error) {
			console.error("Error saving movie:", error);
			setError("Failed to save movie");
		}
	};

	const handleEdit = (movie: Movie) => {
		setNewMovie(movie);
		setIsEditing(true);
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await movieService.deleteMovie(id);
			const updatedMovies = await movieService.getAllMovies();
			setMovies(updatedMovies);
		} catch (error) {
			console.error("Error deleting movie:", error);
			setError("Failed to delete movie");
		}
	};

	const totalPages = Math.ceil(movies.length / itemsPerPage);
	const paginatedMovies = movies.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	// Calculate statistics
	const highestRatedMovie = movies.reduce(
		(prev, current) => (current.rating > prev.rating ? current : prev),
		movies[0] || {
			id: "",
			name: "",
			genres: [],
			releaseDate: "",
			rating: 0,
			description: "",
		}
	);
	const lowestRatedMovie = movies.reduce(
		(prev, current) => (current.rating < prev.rating ? current : prev),
		movies[0] || {
			id: "",
			name: "",
			genres: [],
			releaseDate: "",
			rating: 0,
			description: "",
		}
	);
	const averageRating =
		movies.length > 0
			? parseFloat(
					(
						movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length
					).toFixed(1)
				)
			: 0;

	return (
		<main className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Movie Management</h1>

			{/* Filter and Sort Controls */}
			<div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Search movies by name or description..."
						value={filterText}
						onChange={(e) => setFilterText(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
					/>
				</div>
				<div className="flex gap-2">
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
					>
						<option value="name">Sort by Name</option>
						<option value="rating">Sort by Rating</option>
						<option value="releaseDate">Sort by Release Date</option>
					</select>
					<button
						onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
						className="p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
					>
						{sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
					</button>
				</div>
			</div>

			{/* Add Movie Button */}
			<button
				onClick={() => setShowForm(!showForm)}
				className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
			>
				{showForm ? "Close Form" : "Add Movie"}
			</button>

			{/* Create/Update Movie Form */}
			{showForm && (
				<div className="mb-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
					<h2 className="text-2xl font-bold mb-4">
						{isEditing ? "Edit Movie" : "Add a New Movie"}
					</h2>
					{error && (
						<p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
							{error}
						</p>
					)}
					<div className="space-y-4">
						<input
							type="text"
							placeholder="Movie Name"
							value={newMovie.name}
							onChange={(e) =>
								setNewMovie({ ...newMovie, name: e.target.value })
							}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
						/>
						<div className="genre-input-container">
							<div className="mb-3">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Genres
								</label>
								<div className="flex flex-wrap gap-2 mb-2">
									{newMovie.genres.map((genre, index) => (
										<span
											key={index}
											className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
										>
											{genre}
											<button
												onClick={() => {
													setNewMovie((prev) => ({
														...prev,
														genres: prev.genres.filter((_, i) => i !== index),
													}));
												}}
												className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
											>
												×
											</button>
										</span>
									))}
								</div>
								<input
									type="text"
									placeholder="Type a genre and press Enter"
									value={currentGenreInput}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											const value = currentGenreInput.trim();
											if (value && !newMovie.genres.includes(value)) {
												setNewMovie((prev) => ({
													...prev,
													genres: [...prev.genres, value],
												}));
												setCurrentGenreInput("");
											}
										}
									}}
									onChange={(e) => setCurrentGenreInput(e.target.value)}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
							</div>
						</div>
						<input
							type="date"
							value={newMovie.releaseDate}
							onChange={(e) =>
								setNewMovie({ ...newMovie, releaseDate: e.target.value })
							}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
						/>
						<input
							type="number"
							placeholder="Rating (1-10)"
							min="1"
							max="10"
							value={newMovie.rating || ""}
							onChange={(e) => {
								const value = e.target.value;
								const numValue =
									value === "" ? 1 : Math.min(10, Math.max(1, Number(value)));
								setNewMovie({ ...newMovie, rating: numValue });
							}}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
						/>
						<textarea
							placeholder="Movie Description"
							value={newMovie.description}
							onChange={(e) =>
								setNewMovie({ ...newMovie, description: e.target.value })
							}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px]"
						/>
						<button
							onClick={handleCreateOrUpdate}
							className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all"
						>
							{isEditing ? "Update Movie" : "Add Movie"}
						</button>
					</div>
				</div>
			)}

			{/* Statistics */}
			<div className="mb-4 p-4 border rounded">
				<h2 className="text-xl font-bold mb-2">Statistics</h2>
				<p>Highest Rated Movie: {highestRatedMovie.name || "N/A"}</p>
				<p>Lowest Rated Movie: {lowestRatedMovie.name || "N/A"}</p>
				<p>Average Rating: {averageRating.toFixed(1)}</p>
			</div>

			{/* Movie List */}
			<ul className="space-y-4">
				{paginatedMovies.map((movie) => {
					let backgroundColor = "bg-white";
					if (movie.id === highestRatedMovie.id)
						backgroundColor = "bg-green-100";
					else if (movie.id === lowestRatedMovie.id)
						backgroundColor = "bg-red-100";
					else if (parseFloat(movie.rating.toFixed(1)) === averageRating)
						backgroundColor = "bg-yellow-100";

					return (
						<li
							key={movie.id}
							className={`p-4 border rounded ${backgroundColor}`}
						>
							<h2 className="text-xl font-bold">{movie.name}</h2>
							<p>Genres: {movie.genres.join(", ")}</p>
							<p>Release Date: {movie.releaseDate}</p>
							<p>Rating: {movie.rating}</p>
							<div className="mt-2 space-x-2">
								<Link
									href={`/movies/${movie.id}`}
									className="text-blue-500 hover:underline"
								>
									View Details
								</Link>
								<button
									onClick={() => handleEdit(movie)}
									className="text-green-500 hover:underline"
								>
									Edit
								</button>
								<button
									onClick={() => movie.id && handleDelete(movie.id)}
									className="text-red-500 hover:underline"
								>
									Delete
								</button>
							</div>
						</li>
					);
				})}
			</ul>

			{/* Pagination Controls */}
			<div className="mt-4 flex items-center justify-center space-x-2">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-4 py-2 border rounded disabled:opacity-50"
				>
					Previous
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="px-4 py-2 border rounded disabled:opacity-50"
				>
					Next
				</button>
			</div>

			{/* Charts */}
			<div className="mt-8">
				<Charts movies={movies} />
			</div>
		</main>
	);
}
