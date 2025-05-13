"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MovieService } from "../services/MovieService";
import { Movie } from "../domain/Movie";
import NetworkStatus from "../components/NetworkStatus";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function Home() {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const movieService = new MovieService();
	const observer = useRef<IntersectionObserver | null>(null);

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
				{movies.map((movie, index) => (
					<li
						key={movie.id}
						ref={index === movies.length - 1 ? lastMovieElementRef : null}
					>
						<h2>{movie.name}</h2>
						<p>Genres: {movie.genres.join(", ")}</p>
						<p>Release Date: {movie.releaseDate}</p>
						<p>Rating: {movie.rating}</p>
						<Link href={`/movies/${movie.id}`}>View Details</Link>
					</li>
				))}
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
			`}</style>
		</main>
	);
}
