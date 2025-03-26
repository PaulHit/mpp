"use client";

import { useState } from "react";
import AddMovieForm from "@/components/AddMovieForm";
import { Movie } from "@/types/movie";
import MovieDetails from "@/components/MovieDetails";
import { getMockMovies } from "@/data/mockMovies";

export default function MoviesPage() {
	const [movies, setMovies] = useState<Movie[]>(getMockMovies());
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [filterGenre, setFilterGenre] = useState<string>("");
	const [sortKey, setSortKey] = useState<"name" | "releaseDate" | "rating">(
		"name"
	);

	const addMovie = (movie: Movie) => setMovies((prev) => [...prev, movie]);
	const removeMovie = (id: string) =>
		setMovies((prev) => prev.filter((movie) => movie.id !== id));
	const updateMovie = (updatedMovie: Movie) =>
		setMovies((prev) =>
			prev.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie))
		);

	const filteredMovies = movies.filter((movie) =>
		filterGenre ? movie.genres.includes(filterGenre) : true
	);

	const sortedMovies = [...filteredMovies].sort((a, b) => {
		if (sortKey === "name") return a.name.localeCompare(b.name);
		if (sortKey === "releaseDate")
			return (
				new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
			);
		if (sortKey === "rating") return b.rating - a.rating;
		return 0;
	});

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Movie Collection</h1>
			<AddMovieForm onAdd={addMovie} />
			<div className="my-4">
				<label>Filter by Genre:</label>
				<input
					type="text"
					value={filterGenre}
					onChange={(e) => setFilterGenre(e.target.value)}
					placeholder="Enter genre"
					className="border p-2 ml-2"
				/>
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
					{sortedMovies.map((movie) => (
						<tr key={movie.id}>
							<td className="border border-gray-300 p-2">{movie.name}</td>
							<td className="border border-gray-300 p-2">
								{movie.genres.join(", ")}
							</td>
							<td className="border border-gray-300 p-2">
								{movie.releaseDate}
							</td>
							<td className="border border-gray-300 p-2">{movie.rating}</td>
							<td className="border border-gray-300 p-2">
								<button
									onClick={() => setSelectedMovie(movie)}
									className="bg-blue-600 text-white px-2 py-1 rounded mr-2 hover:bg-blue-500 cursor-pointer"
								>
									Edit
								</button>
								<button
									onClick={() => removeMovie(movie.id)}
									className="bg-red-600 text-white-px-2 py-1 rounded hover:bg-red-500 cursor-pointer"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{selectedMovie && (
				<MovieDetails
					movie={selectedMovie}
					onUpdate={updateMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</div>
	);
}
