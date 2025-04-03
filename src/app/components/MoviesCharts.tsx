import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	ArcElement,
	Tooltip,
	Legend,
	PointElement,
	LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	ArcElement,
	Tooltip,
	Legend,
	PointElement,
	LineElement
);

export default function MoviesCharts() {
	const [ratingsData, setRatingsData] = useState<number[]>([]);
	const [genreData, setGenreData] = useState<{ [key: string]: number }>({});
	const [averageRatingOverTime, setAverageRatingOverTime] = useState<number[]>(
		[]
	);
	const [timeLabels, setTimeLabels] = useState<string[]>([]);

	// Simulate asynchronous data updates
	useEffect(() => {
		const interval = setInterval(() => {
			// Simulate new ratings data
			const newRating = Math.floor(Math.random() * 10) + 1; // Random rating between 1 and 10
			setRatingsData((prev) => [...prev, newRating]);

			// Simulate genre popularity updates
			const genres = ["Action", "Drama", "Comedy", "Horror", "Sci-Fi"];
			const randomGenre = genres[Math.floor(Math.random() * genres.length)];
			setGenreData((prev) => ({
				...prev,
				[randomGenre]: (prev[randomGenre] || 0) + 1,
			}));

			// Simulate average rating over time
			const newAverage =
				[...ratingsData, newRating].reduce((sum, rating) => sum + rating, 0) /
				([...ratingsData, newRating].length || 1);
			setAverageRatingOverTime((prev) => [...prev, newAverage]);

			// Update time labels
			const currentTime = new Date().toLocaleTimeString();
			setTimeLabels((prev) => [...prev, currentTime]);
		}, 2000); // Update every 2 seconds

		return () => clearInterval(interval);
	}, [ratingsData]);

	// Chart 1: Ratings Distribution (Bar Chart)
	const ratingsChartData = {
		labels: ratingsData.map((_, index) => `Movie ${index + 1}`),
		datasets: [
			{
				label: "Ratings",
				data: ratingsData,
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	// Chart 2: Genre Popularity (Pie Chart)
	const genreChartData = {
		labels: Object.keys(genreData),
		datasets: [
			{
				label: "Genre Popularity",
				data: Object.values(genreData),
				backgroundColor: [
					"rgba(255, 99, 132, 0.6)",
					"rgba(54, 162, 235, 0.6)",
					"rgba(255, 206, 86, 0.6)",
					"rgba(75, 192, 192, 0.6)",
					"rgba(153, 102, 255, 0.6)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	// Chart 3: Average Rating Over Time (Line Chart)
	const averageRatingChartData = {
		labels: timeLabels,
		datasets: [
			{
				label: "Average Rating",
				data: averageRatingOverTime,
				fill: false,
				backgroundColor: "rgba(255, 99, 132, 0.6)",
				borderColor: "rgba(255, 99, 132, 1)",
			},
		],
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Real-Time Movie Metrics</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Chart 1: Ratings Distribution */}
				<div>
					<h2 className="text-lg font-semibold mb-2">Ratings Distribution</h2>
					<Bar data={ratingsChartData} />
				</div>

				{/* Chart 2: Genre Popularity */}
				<div>
					<h2 className="text-lg font-semibold mb-2">Genre Popularity</h2>
					<Pie data={genreChartData} />
				</div>

				{/* Chart 3: Average Rating Over Time */}
				<div>
					<h2 className="text-lg font-semibold mb-2">
						Average Rating Over Time
					</h2>
					<Line data={averageRatingChartData} />
				</div>
			</div>
		</div>
	);
}
