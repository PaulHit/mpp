import { Movie } from "../domain/Movie";
import { mockMovies } from "../data/mockMovies";

export class MovieRepository {
	private static instance: MovieRepository;
	private movies: Movie[];

	private constructor() {
		this.movies = [...mockMovies]; // Initialize with mock data
	}

	// Get the singleton instance of the repository
	public static getInstance(): MovieRepository {
		if (!MovieRepository.instance) {
			MovieRepository.instance = new MovieRepository();
		}
		return MovieRepository.instance;
	}

	getAllMovies(): Movie[] {
		return this.movies;
	}

	getMovieById(id: string): Movie | undefined {
		return this.movies.find((movie) => movie.id === id);
	}

	addMovie(movie: Movie): void {
		this.movies.push(movie);
	}

	updateMovie(updatedMovie: Movie): void {
		const index = this.movies.findIndex(
			(movie) => movie.id === updatedMovie.id
		);
		if (index !== -1) {
			this.movies[index] = updatedMovie;
		}
	}

	deleteMovie(id: string): void {
		this.movies = this.movies.filter((movie) => movie.id !== id);
	}
}
