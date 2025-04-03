"use client";

import { useState } from "react";
import { Movie } from "@/app/types/movie";
import TagInput from "@/app/components/TagInput";

export default function MovieDetails({
	movie,
	onUpdate,
	onClose,
}: {
	movie: Movie;
	onUpdate: (movie: Movie) => void;
	onClose: () => void;
}) {
	const [updatedMovie, setUpdatedMovie] = useState<Movie>({ ...movie });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!updatedMovie.name ||
			updatedMovie.rating < 0 ||
			updatedMovie.rating > 10
		) {
			alert("Please provide valid inputs.");
			return;
		}
		onUpdate(updatedMovie);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
			<div className="bg-gray-900 text-white p-6 rounded shadow-lg w-96">
				<h2 className="text-xl font-bold mb-4">Edit Movie</h2>
				<form onSubmit={handleSubmit}>
					<label className="block mb-2">Name</label>
					<input
						type="text"
						value={updatedMovie.name}
						onChange={(e) =>
							setUpdatedMovie({ ...updatedMovie, name: e.target.value })
						}
						required
						className="border p-2 mb-2 w-full"
					/>
					<label className="block mb-2">Release Date</label>
					<input
						type="date"
						value={updatedMovie.releaseDate}
						onChange={(e) =>
							setUpdatedMovie({ ...updatedMovie, releaseDate: e.target.value })
						}
						required
						className="border p-2 mb-2 w-full"
					/>
					<label className="block mb-2">Genres</label>
					<TagInput
						tags={updatedMovie.genres}
						onChange={(newGenres) =>
							setUpdatedMovie({ ...updatedMovie, genres: newGenres })
						}
						placeholder="Enter genres (press space or enter to add)"
						className="flex-nowrap overflow-x-auto whitespace-nowrap"
					/>
					<label className="block mb-2">Rating (1-10)</label>
					<input
						type="number"
						value={updatedMovie.rating}
						onChange={(e) =>
							setUpdatedMovie({
								...updatedMovie,
								rating: parseFloat(e.target.value),
							})
						}
						required
						className="border p-2 mb-2 w-full"
					/>
					<label className="block mb-2">Description</label>
					<textarea
						value={updatedMovie.description}
						onChange={(e) =>
							setUpdatedMovie({ ...updatedMovie, description: e.target.value })
						}
						className="border p-2 mb-2 w-full"
					/>
					<div className="flex justify-end">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-600 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500 cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 cursor-pointer"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
