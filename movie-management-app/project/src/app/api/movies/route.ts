import { NextResponse } from "next/server";
import { z } from "zod";
import { Movie } from "@/domain/Movie";
import { MovieRepository } from "@/repositories/MovieRepository";

// Movie schema for validation
const movieSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	genres: z.array(z.string()).min(1, "At least one genre is required"),
	releaseDate: z
		.string()
		.refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
	rating: z.number().min(1).max(10, "Rating must be between 1 and 10"),
	description: z.string().optional(),
});

// GET: Fetch all movies (with optional filtering and sorting)
export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const filter = url.searchParams.get("filter");
		const sort = url.searchParams.get("sort");
		const order = url.searchParams.get("order") || "asc";

		const movieRepository = MovieRepository.getInstance();
		const movies = await movieRepository.getAllMovies(
			filter || undefined,
			sort || undefined,
			order as "asc" | "desc"
		);

		return NextResponse.json(movies);
	} catch (error) {
		console.error("Error fetching movies:", error);
		return NextResponse.json(
			{ error: "Failed to fetch movies" },
			{ status: 500 }
		);
	}
}

// POST: Add a new movie
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsedMovie = movieSchema.parse(body);

		const movieRepository = MovieRepository.getInstance();
		const newMovie = await movieRepository.addMovie({
			name: parsedMovie.name,
			genres: parsedMovie.genres,
			releaseDate: parsedMovie.releaseDate,
			rating: parsedMovie.rating,
			description: parsedMovie.description || "",
		});

		return NextResponse.json(newMovie, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error adding movie:", error);
		return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
	}
}

// PATCH: Update a movie
export async function PATCH(request: Request) {
	try {
		const body = await request.json();
		const parsedMovie = movieSchema.parse(body);

		if (!parsedMovie.id) {
			return NextResponse.json(
				{ error: "Movie ID is required for update" },
				{ status: 400 }
			);
		}

		const movieRepository = MovieRepository.getInstance();
		const updatedMovie = await movieRepository.updateMovie({
			id: parsedMovie.id,
			name: parsedMovie.name,
			genres: parsedMovie.genres,
			releaseDate: parsedMovie.releaseDate,
			rating: parsedMovie.rating,
			description: parsedMovie.description || "",
		});

		return NextResponse.json(updatedMovie);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		console.error("Error updating movie:", error);
		return NextResponse.json(
			{ error: "Failed to update movie" },
			{ status: 500 }
		);
	}
}

// DELETE: Remove a movie
export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Movie ID is required" },
				{ status: 400 }
			);
		}

		const movieRepository = MovieRepository.getInstance();
		await movieRepository.deleteMovie(id);

		return NextResponse.json({ message: "Movie deleted successfully" });
	} catch (error) {
		console.error("Error deleting movie:", error);
		return NextResponse.json(
			{ error: "Failed to delete movie" },
			{ status: 500 }
		);
	}
}
