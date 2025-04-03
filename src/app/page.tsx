"use client";

import { useState } from "react";
import AddMovieForm from "@/app/components/AddMovieForm";
import { Movie } from "@/app/types/movie";
import MovieDetails from "@/app/components/MovieDetails";
import { getMockMovies } from "@/app/data/mockMovies";
import MoviesCharts from "@/app/components/MoviesCharts";

export default function MoviesPage() {
	const [movies, setMovies] = useState<Movie[]>(getMockMovies());
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [filterGenre, setFilterGenre] = useState<string>("");
	const [sortKey, setSortKey] = useState<"name" | "releaseDate" | "rating">(
		"name"
	);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState<number>(1);

	const moviesPerPage = 5;
	const totalPages = Math.ceil(movies.length / moviesPerPage);

	const addMovie = (movie: Movie) => setMovies((prev) => [...prev, movie]);
	const removeMovie = (id: string) =>
		setMovies((prev) => prev.filter((movie) => movie.id !== id));
	const updateMovie = (updatedMovie: Movie) =>
		setMovies((prev) =>
			prev.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie))
		);

	// Extract unique genres from the movies list
	const uniqueGenres = Array.from(
		new Set(movies.flatMap((movie) => movie.genres))
	);

	const filteredMovies = movies.filter((movie) =>
		filterGenre ? movie.genres.includes(filterGenre) : true
	);

	const sortedMovies = [...filteredMovies].sort((a, b) => {
		let comparison = 0;
		if (sortKey === "name") comparison = a.name.localeCompare(b.name);
		if (sortKey === "releaseDate")
			comparison =
				new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
		if (sortKey === "rating") comparison = a.rating - b.rating;

		// Reverse the order if sortDirection is "desc"
		return sortDirection === "asc" ? comparison : -comparison;
	});

	// get movies from the current page
	const paginatedMovies = sortedMovies.slice(
		(currentPage - 1) * moviesPerPage,
		currentPage * moviesPerPage
	);

	// Calculate statistics
	const highestRatedMovie = Math.max(...movies.map((movie) => movie.rating));
	const lowestRatedMovie = Math.min(...movies.map((movie) => movie.rating));
	const averageRating =
		movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length || 0;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Movie Collection</h1>
			<AddMovieForm onAdd={addMovie} />
			<div className="my-4">
				<label>Filter by Genre: </label>
				<select
					value={filterGenre}
					onChange={(e) => setFilterGenre(e.target.value)}
					className="border border-gray-300 p-2 rounded w-full md:w-1/12 appearance-none"
				>
					<option value="">All Genres</option>
					{uniqueGenres.map((genre) => (
						<option key={genre} value={genre}>
							{genre}
						</option>
					))}
				</select>
				<label className="ml-4">Sort by: </label>
				<select
					value={sortKey}
					onChange={(e) => setSortKey(e.target.value as any)}
					className="border border-gray-300 p-2 rounded w-full md:w-1/12 appearance-none"
				>
					<option value="name">Name</option>
					<option value="releaseDate">Release Date</option>
					<option value="rating">Rating</option>
				</select>
				<button
					onClick={() =>
						setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
					}
					className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
				>
					{sortDirection === "asc" ? "Sort Descending" : "Sort Ascending"}
				</button>
			</div>
			<table className="table-auto w-full border-collapse border border-gray-300">
				<thead>
					<tr>
						<th className="border border-gray-300 p-2">Name</th>
						<th className="border border-gray-300 p-2">Genres</th>
						<th className="border border-gray-300 p-2">Release Date</th>
						<th className="border border-gray-300 p-2">Rating</th>
						<th className="border border-gray-300 p-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{paginatedMovies.map((movie) => (
						<tr key={movie.id}>
							<td className="border border-gray-300 p-2">{movie.name}</td>
							<td className="border border-gray-300 p-2">
								{movie.genres.join(", ")}
							</td>
							<td className="border border-gray-300 p-2">
								{movie.releaseDate}
							</td>
							<td
								className={`border border-gray-300 p-2 ${
									movie.rating === highestRatedMovie
										? "bg-green-800"
										: movie.rating === lowestRatedMovie
											? "bg-red-800"
											: Math.abs(movie.rating - averageRating) < 0.1
												? "bg-yellow-800"
												: ""
								}`}
							>
								{movie.rating}
							</td>
							<td className="border border-gray-300 p-2">
								<button
									onClick={() => setSelectedMovie(movie)}
									className="bg-blue-600 text-white px-2 py-1 rounded mr-2 hover:bg-blue-500 cursor-pointer"
								>
									Edit
								</button>
								<button
									onClick={() => removeMovie(movie.id)}
									className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 cursor-pointer"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination Controls */}
			<div className="flex justify-between items-center mt-4">
				<button
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
					className={`px-4 py-2 rounded ${
						currentPage === 1
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-blue-600 text-white hover:bg-blue-500"
					}`}
				>
					Previous
				</button>
				<span className="text-gray-700">
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					disabled={currentPage === totalPages}
					className={`px-4 py-2 rounded ${
						currentPage === totalPages
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-blue-600 text-white hover:bg-blue-500"
					}`}
				>
					Next
				</button>
			</div>

			{selectedMovie && (
				<MovieDetails
					movie={selectedMovie}
					onUpdate={updateMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}

			{/* Charts */}
			<MoviesCharts />
		</div>
	);
}
