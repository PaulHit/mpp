import { Movie } from "../domain/Movie";
import { MovieRepository } from "../repositories/MovieRepository";

export class MovieService {
	private movieRepository: MovieRepository;

	constructor() {
		this.movieRepository = MovieRepository.getInstance(); // Use the singleton instance
	}

	getAllMovies(): Movie[] {
		return this.movieRepository.getAllMovies();
	}

	getMovieById(id: string): Movie | undefined {
		return this.movieRepository.getMovieById(id);
	}

	addMovie(movie: Movie): void {
		this.movieRepository.addMovie(movie);
	}

	updateMovie(movie: Movie): void {
		this.movieRepository.updateMovie(movie);
	}

	deleteMovie(id: string): void {
		this.movieRepository.deleteMovie(id);
	}
}
