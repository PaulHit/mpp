import { MovieService } from "../services/MovieService";
import Link from "next/link";

export default function Home() {
	const movieService = new MovieService();
	const movies = movieService.getAllMovies();

	return (
		<main>
			<h1>Movie List</h1>
			<ul>
				{movies.map((movie) => (
					<li key={movie.id}>
						<h2>{movie.name}</h2>
						<p>Genres: {movie.genres.join(", ")}</p>
						<p>Release Date: {movie.releaseDate}</p>
						<p>Rating: {movie.rating}</p>
						<Link href={`/movies/${movie.id}`}>View Details</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
