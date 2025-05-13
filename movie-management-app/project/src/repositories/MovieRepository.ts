import { supabase } from "@/lib/supabase";
import { Movie } from "@/domain/Movie";

export class MovieRepository {
	private static instance: MovieRepository;

	private constructor() {}

	public static getInstance(): MovieRepository {
		if (!MovieRepository.instance) {
			MovieRepository.instance = new MovieRepository();
		}
		return MovieRepository.instance;
	}

	async getAllMovies(filter?: string, sort?: string): Promise<Movie[]> {
		let query = supabase.from("movies").select(`
				id,
				name,
				release_date,
				rating,
				description,
				genres:movie_genres(
					genre:genres(name)
				)
			`);

		if (filter) {
			query = query.ilike("name", `%${filter}%`);
		}

		if (sort === "rating") {
			query = query.order("rating", { ascending: false });
		} else if (sort === "releaseDate") {
			query = query.order("release_date", { ascending: false });
		}

		const { data, error } = await query;

		if (error) {
			throw new Error(`Error fetching movies: ${error.message}`);
		}

		return data.map((movie) => ({
			id: movie.id,
			name: movie.name,
			releaseDate: movie.release_date,
			rating: movie.rating,
			description: movie.description || "",
			genres: movie.genres.map((g: any) => g.genre.name),
		}));
	}

	async getMovieById(id: string): Promise<Movie | null> {
		const { data, error } = await supabase
			.from("movies")
			.select(
				`
				id,
				name,
				release_date,
				rating,
				description,
				genres:movie_genres(
					genre:genres(name)
				)
			`
			)
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(`Error fetching movie: ${error.message}`);
		}

		if (!data) return null;

		return {
			id: data.id,
			name: data.name,
			releaseDate: data.release_date,
			rating: data.rating,
			description: data.description || "",
			genres: data.genres.map((g: any) => g.genre.name),
		};
	}

	async addMovie(movie: Omit<Movie, "id">): Promise<Movie> {
		// Start a transaction
		const { data: movieData, error: movieError } = await supabase
			.from("movies")
			.insert({
				name: movie.name,
				release_date: movie.releaseDate,
				rating: movie.rating,
				description: movie.description,
			})
			.select()
			.single();

		if (movieError) {
			throw new Error(`Error adding movie: ${movieError.message}`);
		}

		// Add genres
		for (const genreName of movie.genres) {
			// First, ensure the genre exists
			const { data: genreData, error: genreError } = await supabase
				.from("genres")
				.upsert({ name: genreName })
				.select()
				.single();

			if (genreError) {
				throw new Error(`Error adding genre: ${genreError.message}`);
			}

			// Then create the movie-genre relationship
			const { error: relationError } = await supabase
				.from("movie_genres")
				.insert({
					movie_id: movieData.id,
					genre_id: genreData.id,
				});

			if (relationError) {
				throw new Error(
					`Error creating movie-genre relationship: ${relationError.message}`
				);
			}
		}

		return this.getMovieById(movieData.id) as Promise<Movie>;
	}

	async updateMovie(movie: Movie): Promise<Movie> {
		if (!movie.id) {
			throw new Error("Movie ID is required for update");
		}

		const { error: movieError } = await supabase
			.from("movies")
			.update({
				name: movie.name,
				release_date: movie.releaseDate,
				rating: movie.rating,
				description: movie.description,
			})
			.eq("id", movie.id);

		if (movieError) {
			throw new Error(`Error updating movie: ${movieError.message}`);
		}

		// Delete existing genre relationships
		const { error: deleteError } = await supabase
			.from("movie_genres")
			.delete()
			.eq("movie_id", movie.id);

		if (deleteError) {
			throw new Error(`Error deleting existing genres: ${deleteError.message}`);
		}

		// Add new genre relationships
		for (const genreName of movie.genres) {
			// First, ensure the genre exists
			const { data: genreData, error: genreError } = await supabase
				.from("genres")
				.upsert({ name: genreName })
				.select()
				.single();

			if (genreError) {
				throw new Error(`Error adding genre: ${genreError.message}`);
			}

			// Then create the movie-genre relationship
			const { error: relationError } = await supabase
				.from("movie_genres")
				.insert({
					movie_id: movie.id,
					genre_id: genreData.id,
				});

			if (relationError) {
				throw new Error(
					`Error creating movie-genre relationship: ${relationError.message}`
				);
			}
		}

		return this.getMovieById(movie.id) as Promise<Movie>;
	}

	async deleteMovie(id: string): Promise<void> {
		const { error } = await supabase.from("movies").delete().eq("id", id);

		if (error) {
			throw new Error(`Error deleting movie: ${error.message}`);
		}
	}
}
