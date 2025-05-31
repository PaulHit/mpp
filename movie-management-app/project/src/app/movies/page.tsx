"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MovieService } from "@/services/MovieService";
import { Movie } from "@/domain/Movie";
import NetworkStatus from "@/components/NetworkStatus";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

// Sample data for when no movies are found
const sampleMovies: Movie[] = [
	{
		id: "1",
		name: "The Shawshank Redemption",
		genres: ["Drama"],
		releaseDate: "1994-09-23",
		rating: 9.3,
		description:
			"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
	},
	{
		id: "2",
		name: "The Godfather",
		genres: ["Crime", "Drama"],
		releaseDate: "1972-03-24",
		rating: 9.2,
		description:
			"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
	},
	{
		id: "3",
		name: "The Dark Knight",
		genres: ["Action", "Crime", "Drama"],
		releaseDate: "2008-07-18",
		rating: 9.0,
		description:
			"When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
	},
];

export default function MoviesPage() {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const [expandedMovies, setExpandedMovies] = useState<Set<string>>(new Set());
	const movieService = new MovieService();
	const observer = useRef<IntersectionObserver | null>(null);

	const toggleDescription = (movieId: string) => {
		setExpandedMovies((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(movieId)) {
				newSet.delete(movieId);
			} else {
				newSet.add(movieId);
			}
			return newSet;
		});
	};

	const lastMovieElementRef = useCallback(
		(node: HTMLLIElement | null) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && hasMore) {
						setPage((prevPage) => prevPage + 1);
					}
				},
				{
					root: null,
					rootMargin: "20px",
					threshold: 1.0,
				}
			);
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	useEffect(() => {
		const loadMovies = async () => {
			setLoading(true);
			try {
				const allMovies = await movieService.getAllMovies();
				const start = 0;
				const end = page * ITEMS_PER_PAGE;
				const newMovies = allMovies.slice(start, end);

				setMovies(newMovies);
				setHasMore(end < allMovies.length);
			} catch (error) {
				console.error("Failed to load movies:", error);
			}
			setLoading(false);
		};

		loadMovies();
	}, [page]);

	return (
		<main>
			<NetworkStatus />
			<h1>Movie List</h1>
			<ul>
				{movies.map((movie, index) => {
					if (!movie.id) return null;
					const movieId = movie.id as string; // Type assertion since we checked it exists
					return (
						<li
							key={movieId}
							ref={index === movies.length - 1 ? lastMovieElementRef : null}
						>
							<h2>{movie.name}</h2>
							<p>Genres: {movie.genres.join(", ")}</p>
							<p>Release Date: {movie.releaseDate}</p>
							<p>Rating: {movie.rating}</p>
							<div className="description-section">
								<button
									onClick={() => toggleDescription(movieId)}
									className="description-toggle"
								>
									{expandedMovies.has(movieId)
										? "Hide Description"
										: "Show Description"}
								</button>
								{expandedMovies.has(movieId) && (
									<p className="description">{movie.description}</p>
								)}
							</div>
							<Link href={`/movies/${movieId}`}>View Details</Link>
						</li>
					);
				})}
			</ul>
			{loading && <div>Loading...</div>}
			<style jsx>{`
				main {
					max-width: 800px;
					margin: 0 auto;
					padding: 20px;
				}
				ul {
					list-style: none;
					padding: 0;
				}
				li {
					margin-bottom: 20px;
					padding: 20px;
					border: 1px solid #eaeaea;
					border-radius: 8px;
					transition: all 0.2s ease;
				}
				li:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
				}
				h2 {
					margin: 0 0 10px 0;
					color: #333;
				}
				p {
					margin: 5px 0;
					color: #666;
				}
				a {
					display: inline-block;
					margin-top: 10px;
					color: #0070f3;
					text-decoration: none;
				}
				a:hover {
					text-decoration: underline;
				}
				.description-section {
					margin: 10px 0;
				}
				.description-toggle {
					background: #0070f3;
					color: white;
					border: none;
					padding: 8px 16px;
					border-radius: 4px;
					cursor: pointer;
					font-size: 14px;
					transition: background-color 0.2s ease;
				}
				.description-toggle:hover {
					background: #0051a8;
				}
				.description {
					margin-top: 10px;
					padding: 10px;
					background: #f5f5f5;
					border-radius: 4px;
					font-style: italic;
				}
			`}</style>
		</main>
	);
}
