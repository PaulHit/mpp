"use client";

import { useState, useEffect } from "react";
import { MovieService } from "../../../services/MovieService";
import { Movie } from "../../../domain/Movie";
import Link from "next/link";
import Charts from "../../../components/Charts";

export default function Home() {
	const movieService = new MovieService();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [newMovie, setNewMovie] = useState<Movie>({
		id: "",
		name: "",
		genres: [],
		releaseDate: "",
		rating: 0,
		description: "",
	});
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [showForm, setShowForm] = useState<boolean>(false); // Toggle for the form

	// Pagination state
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 5;

	useEffect(() => {
		async function fetchMovies() {
			const response = await fetch("/api/movies");
			const data = await response.json();
			setMovies(data);
		}
		fetchMovies();
	}, []);

	const validateMovie = (): boolean => {
		if (!newMovie.name.trim()) {
			setError("Movie name is required.");
			return false;
		}
		if (newMovie.genres.length === 0 || newMovie.genres[0].trim() === "") {
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
		setError(""); // Clear any previous errors
		return true;
	};

	const handleCreateOrUpdate = () => {
		if (!validateMovie()) return;

		if (isEditing) {
			// Update existing movie
			movieService.updateMovie(newMovie); // Update the movie in the service
			setMovies(movieService.getAllMovies()); // Refresh the movies list
			setIsEditing(false);
		} else {
			// Create new movie
			const newMovieWithId = { ...newMovie, id: Date.now().toString() };
			movieService.addMovie(newMovieWithId); // Add the movie to the service
			setMovies(movieService.getAllMovies()); // Refresh the movies list
		}
		setNewMovie({
			id: "",
			name: "",
			genres: [],
			releaseDate: "",
			rating: 0,
			description: "",
		});
		setShowForm(false); // Hide the form after adding/updating
	};

	const handleEdit = (movie: Movie) => {
		setNewMovie(movie);
		setIsEditing(true);
		setShowForm(true); // Show the form when editing
	};

	const handleDelete = (id: string) => {
		movieService.deleteMovie(id); // Delete the movie from the service
		setMovies(movieService.getAllMovies()); // Refresh the movies list
	};

	const handleSort = (criteria: string) => {
		const sortedMovies = [...movies].sort((a, b) => {
			if (criteria === "rating") return b.rating - a.rating;
			if (criteria === "releaseDate")
				return (
					new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
				);
			return 0;
		});
		setMovies(sortedMovies);
	};

	// Pagination logic
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
		<main>
			<h1>Movie Management</h1>

			{/* Add Movie Button */}
			<button onClick={() => setShowForm(!showForm)}>
				{showForm ? "Close Form" : "Add Movie"}
			</button>

			{/* Create/Update Movie Form */}
			{showForm && (
				<div>
					<h2>{isEditing ? "Edit Movie" : "Add a New Movie"}</h2>
					{error && <p style={{ color: "red" }}>{error}</p>}
					<input
						type="text"
						placeholder="Name"
						value={newMovie.name}
						onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
					/>
					<input
						type="text"
						placeholder="Genres (comma-separated)"
						value={newMovie.genres.join(", ")}
						onChange={(e) =>
							setNewMovie({
								...newMovie,
								genres: e.target.value.split(",").map((g) => g.trim()),
							})
						}
					/>
					<input
						type="date"
						value={newMovie.releaseDate}
						onChange={(e) =>
							setNewMovie({ ...newMovie, releaseDate: e.target.value })
						}
					/>
					<input
						type="number"
						placeholder="Rating (1-10)"
						value={newMovie.rating}
						onChange={(e) =>
							setNewMovie({ ...newMovie, rating: parseFloat(e.target.value) })
						}
					/>
					<textarea
						placeholder="Description"
						value={newMovie.description}
						onChange={(e) =>
							setNewMovie({ ...newMovie, description: e.target.value })
						}
					/>
					<button onClick={handleCreateOrUpdate}>
						{isEditing ? "Update Movie" : "Add Movie"}
					</button>
				</div>
			)}

			{/* Statistics */}
			<div>
				<h2>Statistics</h2>
				<p>Highest Rated Movie: {highestRatedMovie.name || "N/A"}</p>
				<p>Lowest Rated Movie: {lowestRatedMovie.name || "N/A"}</p>
				<p>Average Rating: {averageRating.toFixed(1)}</p>
			</div>

			{/* Movie List */}
			<ul>
				{paginatedMovies.map((movie) => {
					let backgroundColor = "white";
					if (movie.id === highestRatedMovie.id)
						backgroundColor = "#d4edda"; // Green
					else if (movie.id === lowestRatedMovie.id)
						backgroundColor = "#f8d7da"; // Red
					else if (parseFloat(movie.rating.toFixed(1)) === averageRating)
						backgroundColor = "#fff3cd"; // Yellow

					return (
						<li key={movie.id} style={{ backgroundColor }}>
							<h2>{movie.name}</h2>
							<p>Genres: {movie.genres.join(", ")}</p>
							<p>Release Date: {movie.releaseDate}</p>
							<p>Rating: {movie.rating}</p>
							<Link href={`/movies/${movie.id}`}>View Details</Link>
							<button
								onClick={() => handleEdit(movie)}
								style={{ marginLeft: "10px" }}
							>
								Edit
							</button>
							<button onClick={() => handleDelete(movie.id)}>Delete</button>
						</li>
					);
				})}
			</ul>

			{/* Pagination Controls */}
			<div>
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>

			{/* Charts */}
			<Charts movies={movies} />
		</main>
	);
}
