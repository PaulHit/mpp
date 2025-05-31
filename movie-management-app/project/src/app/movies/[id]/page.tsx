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
	const [expandedMovies, setExpandedMovies] = useState<Set<string>>(new Set());
	const itemsPerPage = 5;

	const toggleDescription = (movieId: string) => {
		setExpandedMovies((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(movieId)) {
				newSet.delete(movieId);
			} else {
				newSet.add(movieId);
			}
			return newSet;
		});
	};

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
									value={currentGenreInput}
									onChange={(e) => setCurrentGenreInput(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter" && currentGenreInput.trim()) {
											e.preventDefault();
											setNewMovie((prev) => ({
												...prev,
												genres: [...prev.genres, currentGenreInput.trim()],
											}));
											setCurrentGenreInput("");
										}
									}}
									placeholder="Add a genre and press Enter"
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
							min="1"
							max="10"
							value={newMovie.rating}
							onChange={(e) =>
								setNewMovie({
									...newMovie,
									rating: parseInt(e.target.value) || 1,
								})
							}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
						/>
						<textarea
							value={newMovie.description}
							onChange={(e) =>
								setNewMovie({ ...newMovie, description: e.target.value })
							}
							placeholder="Movie Description"
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
							rows={4}
						/>
						<div className="flex gap-2">
							<button
								onClick={handleCreateOrUpdate}
								className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
							>
								{isEditing ? "Update Movie" : "Add Movie"}
							</button>
							{isEditing && (
								<button
									onClick={() => {
										setIsEditing(false);
										setNewMovie({
											id: "",
											name: "",
											genres: [],
											releaseDate: "",
											rating: 1,
											description: "",
										});
									}}
									className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
								>
									Cancel
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Movie List */}
			<div className="grid gap-4">
				{paginatedMovies.map((movie) => (
					<div
						key={movie.id}
						className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
					>
						<div className="flex justify-between items-start gap-4">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-2">
									<h3 className="text-xl font-semibold">{movie.name}</h3>
									<span className="text-sm text-gray-500">
										({movie.rating}/10)
									</span>
								</div>
								<p className="text-gray-600 mb-1">
									<span className="font-medium">Genres:</span>{" "}
									{movie.genres.join(", ")}
								</p>
								<p className="text-gray-600 mb-2">
									<span className="font-medium">Released:</span>{" "}
									{movie.releaseDate}
								</p>
								<div className="flex items-center gap-3">
									{movie.id && (
										<>
											{/* --- ACTION BUTTON ROW START --- */}
											<div className="inline-flex gap-2 items-center bg-yellow-100 p-1 rounded-md action-btn-row">
												<button
													onClick={() => toggleDescription(movie.id as string)}
													className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
													type="button"
												>
													{expandedMovies.has(movie.id as string)
														? "Hide Description"
														: "Show Description"}
												</button>
												<button
													onClick={() => handleEdit(movie)}
													className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
													type="button"
												>
													Edit
												</button>
												{movie.id && (
													<button
														onClick={() => handleDelete(movie.id as string)}
														className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-400 transition-colors"
														type="button"
													>
														Delete
													</button>
												)}
											</div>
											{/* --- ACTION BUTTON ROW END --- */}
											{expandedMovies.has(movie.id as string) && (
												<p className="mt-2 text-gray-700 italic">
													{movie.description}
												</p>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			<div className="flex justify-center gap-2 mt-6">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Previous
				</button>
				<span className="px-4 py-2">
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
				</button>
			</div>

			{/* Statistics */}
			<div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
				<h2 className="text-xl font-bold mb-4">Movie Statistics</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="p-4 bg-white rounded-lg shadow-sm">
						<h3 className="font-semibold text-gray-700">Highest Rated</h3>
						<p className="text-2xl font-bold text-blue-600">
							{highestRatedMovie.name} ({highestRatedMovie.rating})
						</p>
					</div>
					<div className="p-4 bg-white rounded-lg shadow-sm">
						<h3 className="font-semibold text-gray-700">Lowest Rated</h3>
						<p className="text-2xl font-bold text-blue-600">
							{lowestRatedMovie.name} ({lowestRatedMovie.rating})
						</p>
					</div>
					<div className="p-4 bg-white rounded-lg shadow-sm">
						<h3 className="font-semibold text-gray-700">Average Rating</h3>
						<p className="text-2xl font-bold text-blue-600">{averageRating}</p>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="mt-8">
				<Charts movies={movies} />
			</div>
		</main>
	);
}
