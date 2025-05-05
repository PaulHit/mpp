import { NextResponse } from "next/server";
import { z } from "zod";
import { Movie } from "@/domain/Movie";
import { mockMovies } from "@/data/mockMovies";

// In-memory database (replace with a real database in production)
let movies: Movie[] = [...mockMovies];

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
	const url = new URL(request.url);
	const filter = url.searchParams.get("filter");
	const sort = url.searchParams.get("sort");

	let filteredMovies = [...movies];

	// Apply filtering
	if (filter) {
		filteredMovies = filteredMovies.filter((movie) =>
			movie.name.toLowerCase().includes(filter.toLowerCase())
		);
	}

	// Apply sorting
	if (sort === "rating") {
		filteredMovies.sort((a, b) => b.rating - a.rating);
	} else if (sort === "releaseDate") {
		filteredMovies.sort(
			(a, b) =>
				new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
		);
	}

	return NextResponse.json(filteredMovies);
}

// POST: Add a new movie
export async function POST(request: Request) {
	const body = await request.json();

	try {
		// Parse and validate the input
		const parsedMovie = movieSchema.parse(body);

		// Ensure `id` and `description` are always defined
		const newMovie: Movie = {
			...parsedMovie,
			id: Date.now().toString(), // Generate a unique ID
			description: parsedMovie.description || "", // Provide a default value for description
		};

		movies.push(newMovie); // Push the validated movie into the array
		return NextResponse.json(newMovie, { status: 201 });
	} catch (error) {
		// Handle validation errors
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		// Handle other unexpected errors
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}

// PATCH: Update an existing movie
export async function PATCH(request: Request) {
	const body = await request.json();

	try {
		const updatedMovie = movieSchema.parse(body);
		const index = movies.findIndex((movie) => movie.id === updatedMovie.id);

		if (index === -1) {
			return NextResponse.json({ error: "Movie not found" }, { status: 404 });
		}

		movies[index] = { ...movies[index], ...updatedMovie };
		return NextResponse.json(movies[index]);
	} catch (error) {
		// Check if the error is a Zod validation error
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		// Handle other unexpected errors
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}

// DELETE: Remove a movie
export async function DELETE(request: Request) {
	const url = new URL(request.url);
	const id = url.searchParams.get("id");

	if (!id) {
		return NextResponse.json({ error: "ID is required" }, { status: 400 });
	}

	const index = movies.findIndex((movie) => movie.id === id);

	if (index === -1) {
		return NextResponse.json({ error: "Movie not found" }, { status: 404 });
	}

	movies.splice(index, 1);
	return NextResponse.json({ message: "Movie deleted successfully" });
}
