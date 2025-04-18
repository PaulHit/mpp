"use client";

import { useState } from "react";
import { Movie } from "@/app/types/movie";
import TagInput from "@/app/components/TagInput";
import { v4 as uuidv4 } from "uuid";
import React from "react";

export default function AddMovieForm({
	onAdd,
}: {
	onAdd: (movie: Movie) => void;
}) {
	const [movie, setMovie] = useState<Movie>({
		id: uuidv4(),
		name: "",
		releaseDate: "",
		genres: [],
		rating: 0,
		description: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!movie.name || movie.rating < 1 || movie.rating > 10) {
			alert("Please provide valid inputs.");
			return;
		}

		onAdd(movie);
		setMovie({
			...movie,
			id: uuidv4(),
			name: "",
			releaseDate: "",
			genres: [],
			rating: 0,
			description: "",
		});
	};

	return (
		<form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-4">
			<input
				type="text"
				placeholder="Name"
				value={movie.name}
				onChange={(e) => setMovie({ ...movie, name: e.target.value })}
				required
				className="border border-gray-300 p-2 rounded w-full md:w-1/4"
			/>
			<TagInput
				tags={movie.genres}
				onChange={(newGenres) => setMovie({ ...movie, genres: newGenres })}
				placeholder="Enter genres (press space or enter to add)"
				className="border border-gray-300 p-2 rounded w-full md:w-1/4"
			/>
			<input
				type="date"
				value={movie.releaseDate}
				onChange={(e) => setMovie({ ...movie, releaseDate: e.target.value })}
				required
				className="border border-gray-300 p-2 rounded w-full md:w-1/16"
			/>
			<input
				type="number"
				placeholder="Rating (1-10)"
				value={movie.rating}
				onChange={(e) =>
					setMovie({ ...movie, rating: parseFloat(e.target.value) })
				}
				required
				className="border border-gray-300 p-2 rounded w-full md:w-1/24 appearance-none"
			/>
			<textarea
				placeholder="Description (optional)"
				value={movie.description}
				onChange={(e) => setMovie({ ...movie, description: e.target.value })}
				className="border border-gray-300 p-2 rounded w-full md:w-1/4 resize-none align-middle"
			/>
			<button
				type="submit"
				className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 cursor-pointer w-full md:w-auto"
			>
				Add Movie
			</button>
		</form>
	);
}
