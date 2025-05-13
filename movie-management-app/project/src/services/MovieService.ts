import { Movie } from "../domain/Movie";
import { MovieRepository } from "../repositories/MovieRepository";
import { NetworkService } from "./NetworkService";

export class MovieService {
	private movieRepository: MovieRepository;
	private networkService: NetworkService;
	private localMovies: Movie[] = [];

	constructor() {
		this.movieRepository = MovieRepository.getInstance();
		this.networkService = NetworkService.getInstance();
		this.loadLocalMovies();
	}

	private loadLocalMovies(): void {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("localMovies");
			if (stored) {
				this.localMovies = JSON.parse(stored);
			}
		}
	}

	private saveLocalMovies(): void {
		if (typeof window !== "undefined") {
			localStorage.setItem("localMovies", JSON.stringify(this.localMovies));
		}
	}

	public async getAllMovies(): Promise<Movie[]> {
		if (this.networkService.getStatus() === "online") {
			try {
				const response = await fetch("/api/movies");
				if (response.ok) {
					const movies = await response.json();
					this.localMovies = movies;
					this.saveLocalMovies();
					return movies;
				}
			} catch (error) {
				console.error("Failed to fetch movies:", error);
			}
		}
		return this.localMovies;
	}

	public async getMovieById(id: string): Promise<Movie | undefined> {
		if (this.networkService.getStatus() === "online") {
			try {
				const response = await fetch(`/api/movies/${id}`);
				if (response.ok) {
					return await response.json();
				}
			} catch (error) {
				console.error("Failed to fetch movie:", error);
			}
		}
		return this.localMovies.find((movie) => movie.id === id);
	}

	public async addMovie(movie: Movie): Promise<void> {
		if (this.networkService.getStatus() === "online") {
			try {
				const response = await fetch("/api/movies", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(movie),
				});
				if (response.ok) {
					const newMovie = await response.json();
					this.localMovies.push(newMovie);
					this.saveLocalMovies();
					return;
				}
			} catch (error) {
				console.error("Failed to add movie:", error);
			}
		}

		// Offline handling
		const newMovie = { ...movie, id: Date.now().toString() };
		this.localMovies.push(newMovie);
		this.saveLocalMovies();
		this.networkService.addPendingOperation("create", newMovie);
	}

	public async updateMovie(movie: Movie): Promise<void> {
		if (this.networkService.getStatus() === "online") {
			try {
				const response = await fetch(`/api/movies/${movie.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(movie),
				});
				if (response.ok) {
					const updatedMovie = await response.json();
					const index = this.localMovies.findIndex((m) => m.id === movie.id);
					if (index !== -1) {
						this.localMovies[index] = updatedMovie;
						this.saveLocalMovies();
					}
					return;
				}
			} catch (error) {
				console.error("Failed to update movie:", error);
			}
		}

		// Offline handling
		const index = this.localMovies.findIndex((m) => m.id === movie.id);
		if (index !== -1) {
			this.localMovies[index] = movie;
			this.saveLocalMovies();
			this.networkService.addPendingOperation("update", movie);
		}
	}

	public async deleteMovie(id: string): Promise<void> {
		if (this.networkService.getStatus() === "online") {
			try {
				const response = await fetch(`/api/movies?id=${id}`, {
					method: "DELETE",
				});
				if (response.ok) {
					this.localMovies = this.localMovies.filter(
						(movie) => movie.id !== id
					);
					this.saveLocalMovies();
					return;
				}
			} catch (error) {
				console.error("Failed to delete movie:", error);
			}
		}

		// Offline handling
		const movie = this.localMovies.find((m) => m.id === id);
		if (movie) {
			this.localMovies = this.localMovies.filter((m) => m.id !== id);
			this.saveLocalMovies();
			this.networkService.addPendingOperation("delete", { id });
		}
	}

	public async syncPendingOperations(): Promise<void> {
		if (this.networkService.getStatus() !== "online") return;

		const pendingOps = this.networkService.getPendingOperations();
		for (const op of pendingOps) {
			try {
				switch (op.type) {
					case "create":
						await this.addMovie(op.data);
						break;
					case "update":
						await this.updateMovie(op.data);
						break;
					case "delete":
						await this.deleteMovie(op.data.id);
						break;
				}
			} catch (error) {
				console.error("Failed to sync operation:", error);
			}
		}
		this.networkService.clearPendingOperations();
	}
}
