import "dotenv/config";
import { faker } from "@faker-js/faker";
import { supabase } from "../lib/supabase";

const GENRES = [
	"Action",
	"Adventure",
	"Comedy",
	"Drama",
	"Fantasy",
	"Horror",
	"Mystery",
	"Romance",
	"Sci-Fi",
	"Thriller",
	"Animation",
	"Documentary",
	"Family",
	"Musical",
	"War",
	"Western",
	"Biography",
	"Crime",
	"History",
	"Sport",
];

// Create a progress bar
function createProgressBar(total: number) {
	const width = 50;
	let lastPercent = 0;

	return {
		update: (current: number) => {
			const percent = Math.floor((current / total) * 100);
			if (percent > lastPercent) {
				const filled = Math.floor((percent / 100) * width);
				const empty = width - filled;
				process.stdout.write(
					`\r[${"=".repeat(filled)}${" ".repeat(empty)}] ${percent}%`
				);
				lastPercent = percent;
			}
		},
		complete: () => {
			process.stdout.write("\n");
		},
	};
}

async function generateMovies(count: number) {
	console.log(`Generating ${count} movies...`);
	const batchSize = 1000; // Process in batches to avoid memory issues
	const batches = Math.ceil(count / batchSize);
	const progressBar = createProgressBar(count);
	let totalProcessed = 0;

	// First, ensure all genres exist
	console.log("Creating genres...");
	for (const genreName of GENRES) {
		const { data: existingGenre } = await supabase
			.from("genres")
			.select("id")
			.eq("name", genreName)
			.single();

		if (!existingGenre) {
			const { error: genreError } = await supabase
				.from("genres")
				.insert({ name: genreName });

			if (genreError) {
				console.error(`Error creating genre ${genreName}:`, genreError);
			}
		}
	}

	// Get all genre IDs for faster lookups
	const { data: genres } = await supabase.from("genres").select("id, name");

	const genreMap = new Map(genres?.map((g) => [g.name, g.id]) || []);

	for (let i = 0; i < batches; i++) {
		const batchCount = Math.min(batchSize, count - i * batchSize);
		const movies = Array.from({ length: batchCount }, () => ({
			name: faker.music.songName(),
			release_date: faker.date.past({ years: 50 }).toISOString().split("T")[0],
			rating: Number(
				faker.number.float({ min: 1, max: 10, fractionDigits: 1 })
			),
			description: faker.lorem.paragraph(),
		}));

		const { data: insertedMovies, error: movieError } = await supabase
			.from("movies")
			.insert(movies)
			.select();

		if (movieError) {
			console.error("Error inserting movies:", movieError);
			continue;
		}

		// Generate genres for each movie
		const movieGenres = [];
		for (const movie of insertedMovies) {
			const numGenres = faker.number.int({ min: 1, max: 4 });
			const selectedGenres = faker.helpers.arrayElements(GENRES, numGenres);

			for (const genreName of selectedGenres) {
				const genreId = genreMap.get(genreName);
				if (genreId) {
					movieGenres.push({
						movie_id: movie.id,
						genre_id: genreId,
					});
				}
			}
		}

		// Batch insert movie-genre relationships
		if (movieGenres.length > 0) {
			const { error: relationError } = await supabase
				.from("movie_genres")
				.insert(movieGenres);

			if (relationError) {
				console.error(
					"Error creating movie-genre relationships:",
					relationError
				);
			}
		}

		totalProcessed += batchCount;
		progressBar.update(totalProcessed);
	}

	progressBar.complete();
	console.log("Movie generation completed!");
}

// Add database indices for performance optimization
async function createIndices() {
	console.log("Creating database indices...");

	const indices = [
		"CREATE INDEX IF NOT EXISTS idx_movies_name ON movies(name)",
		"CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(rating)",
		"CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date)",
		"CREATE INDEX IF NOT EXISTS idx_movie_genres_movie_id ON movie_genres(movie_id)",
		"CREATE INDEX IF NOT EXISTS idx_movie_genres_genre_id ON movie_genres(genre_id)",
		"CREATE INDEX IF NOT EXISTS idx_genres_name ON genres(name)",
	];

	for (const index of indices) {
		const { error } = await supabase.rpc("exec_sql", { sql: index });
		if (error) {
			console.error("Error creating index:", error);
		}
	}
}

// Generate complex statistics query
async function getMovieStatistics() {
	console.log("Generating movie statistics...");

	const { data, error } = await supabase.rpc("get_movie_statistics");

	if (error) {
		console.error("Error getting statistics:", error);
		return;
	}

	console.log("Movie Statistics:", data);
}

// Main execution
async function main() {
	try {
		console.log("Starting data generation process...");

		// Create indices first
		await createIndices();

		// Generate 100,000 movies
		await generateMovies(100000);

		console.log("Data generation completed successfully!");
	} catch (error) {
		console.error("Error in main execution:", error);
		process.exit(1);
	}
}

main();
