import "dotenv/config";
import { supabase } from "../lib/supabase";

async function checkData() {
	try {
		// Check total number of movies
		const { count: movieCount, error: movieError } = await supabase
			.from("movies")
			.select("*", { count: "exact", head: true });

		if (movieError) throw movieError;
		console.log(`Total movies in database: ${movieCount}`);

		// Check total number of genres
		const { count: genreCount, error: genreError } = await supabase
			.from("genres")
			.select("*", { count: "exact", head: true });

		if (genreError) throw genreError;
		console.log(`Total genres in database: ${genreCount}`);

		// Check total number of movie-genre relationships
		const { count: relationCount, error: relationError } = await supabase
			.from("movie_genres")
			.select("*", { count: "exact", head: true });

		if (relationError) throw relationError;
		console.log(`Total movie-genre relationships: ${relationCount}`);

		// Get a sample of movies with their genres
		const { data: sampleMovies, error: sampleError } = await supabase
			.from("movies")
			.select(
				`
                *,
                movie_genres (
                    genres (
                        name
                    )
                )
            `
			)
			.limit(5);

		if (sampleError) throw sampleError;

		console.log("\nSample Movies:");
		sampleMovies.forEach((movie) => {
			console.log(`\nMovie: ${movie.name}`);
			console.log(`Rating: ${movie.rating}`);
			console.log(`Release Date: ${movie.release_date}`);
			console.log(
				"Genres:",
				movie.movie_genres.map((mg) => mg.genres.name).join(", ")
			);
		});

		// Get some statistics
		const { data: stats, error: statsError } = await supabase.rpc(
			"get_movie_statistics"
		);

		if (statsError) throw statsError;

		console.log("\nMovie Statistics:");
		console.log(`Average Rating: ${stats[0].avg_rating.toFixed(2)}`);
		console.log(`Highest Rated Movie: ${stats[0].highest_rated_movie}`);
		console.log(`Lowest Rated Movie: ${stats[0].lowest_rated_movie}`);
		console.log(
			`Most Common Genre: ${stats[0].most_common_genre} (${stats[0].genre_count} movies)`
		);
	} catch (error) {
		console.error("Error checking data:", error);
	}
}

checkData();
