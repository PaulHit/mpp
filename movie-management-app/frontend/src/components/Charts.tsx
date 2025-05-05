"use client";

import { Pie, Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import { Movie } from "../domain/Movie";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
);

type ChartsProps = {
	movies: Movie[];
};

export default function Charts({ movies }: ChartsProps) {
	// Calculate genre distribution
	const genreCounts = movies.reduce((acc: Record<string, number>, movie) => {
		movie.genres.forEach((genre) => {
			acc[genre] = (acc[genre] || 0) + 1;
		});
		return acc;
	}, {});

	// Calculate rating distribution
	const ratingCounts = Array(10).fill(0);
	movies.forEach((movie) => {
		const ratingIndex = Math.floor(movie.rating) - 1;
		if (ratingIndex >= 0 && ratingIndex < 10) {
			ratingCounts[ratingIndex]++;
		}
	});

	// Calculate release year distribution
	const releaseYearCounts = movies.reduce(
		(acc: Record<string, number>, movie) => {
			const releaseYear = new Date(movie.releaseDate).getFullYear().toString();
			acc[releaseYear] = (acc[releaseYear] || 0) + 1;
			return acc;
		},
		{}
	);

	// Chart options
	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
			},
		},
	};

	return (
		<div>
			<h3>Genre Distribution</h3>
			<Pie
				data={{
					labels: Object.keys(genreCounts),
					datasets: [
						{
							data: Object.values(genreCounts),
							backgroundColor: [
								"#FF6384",
								"#36A2EB",
								"#FFCE56",
								"#4BC0C0",
								"#9966FF",
								"#FF9F40",
							],
						},
					],
				}}
				options={chartOptions}
			/>

			<h3>Rating Distribution</h3>
			<Bar
				data={{
					labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
					datasets: [
						{
							label: "Number of Movies",
							data: ratingCounts,
							backgroundColor: "#36A2EB",
						},
					],
				}}
				options={chartOptions}
			/>

			<h3>Release Year Distribution</h3>
			<Bar
				data={{
					labels: Object.keys(releaseYearCounts),
					datasets: [
						{
							label: "Number of Movies",
							data: Object.values(releaseYearCounts),
							backgroundColor: "#FF9F40",
						},
					],
				}}
				options={chartOptions}
			/>
		</div>
	);
}
