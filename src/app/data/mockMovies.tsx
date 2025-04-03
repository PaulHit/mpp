import { Movie } from "@/app/types/movie";

export const getMockMovies = (): Movie[] => {
	return [
		{
			id: "1",
			name: "The Shawshank Redemption",
			releaseDate: "1994-09-23",
			genres: ["Drama"],
			rating: 9.3,
			description:
				"Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency.",
		},
		{
			id: "2",
			name: "The Godfather",
			releaseDate: "1972-03-24",
			genres: ["Crime", "Drama"],
			rating: 9.2,
			description:
				"The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
		},
		{
			id: "3",
			name: "The Dark Knight",
			releaseDate: "2008-07-18",
			genres: ["Action", "Crime", "Drama"],
			rating: 9.0,
			description: "Batman faces the Joker in this iconic movie.",
		},
		{
			id: "4",
			name: "Pulp Fiction",
			releaseDate: "1994-10-14",
			genres: ["Crime", "Drama"],
			rating: 8.9,
			description:
				"The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.",
		},
		{
			id: "5",
			name: "Inception",
			releaseDate: "2010-07-16",
			genres: ["Sci-Fi", "Thriller"],
			rating: 8.8,
			description: "A mind-bending thriller by Christopher Nolan.",
		},
		{
			id: "6",
			name: "Parasite",
			releaseDate: "2019-05-21",
			genres: ["Drama", "Thriller", "Dark Comedy"],
			rating: 8.6,
			description:
				"Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
		},
		{
			id: "7",
			name: "Interstellar",
			releaseDate: "2014-11-07",
			genres: ["Sci-Fi", "Drama"],
			rating: 8.6,
			description: "A journey through space and time to save humanity.",
		},
		{
			id: "8",
			name: "The Grand Budapest Hotel",
			releaseDate: "2014-03-28",
			genres: ["Comedy", "Drama", "Adventure"],
			rating: 8.1,
			description:
				"A writer encounters the owner of an aging high-class hotel, who tells him of his early years as a lobby boy.",
		},
		{
			id: "9",
			name: "Get Out",
			releaseDate: "2017-02-24",
			genres: ["Horror", "Thriller", "Mystery"],
			rating: 7.7,
			description:
				"A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
		},
		{
			id: "10",
			name: "La La Land",
			releaseDate: "2016-12-09",
			genres: ["Musical", "Romance", "Drama"],
			rating: 8.0,
			description:
				"While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
		},
		{
			id: "11",
			name: "The Social Network",
			releaseDate: "2010-10-01",
			genres: ["Biography", "Drama"],
			rating: 7.7,
			description:
				"Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, but is later sued by two brothers who claimed he stole their idea.",
		},
		{
			id: "12",
			name: "Mad Max: Fury Road",
			releaseDate: "2015-05-15",
			genres: ["Action", "Adventure", "Sci-Fi"],
			rating: 8.1,
			description:
				"In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
		},
		{
			id: "13",
			name: "Whiplash",
			releaseDate: "2014-10-10",
			genres: ["Drama", "Music"],
			rating: 8.5,
			description:
				"A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
		},
		{
			id: "14",
			name: "Spirited Away",
			releaseDate: "2001-07-20",
			genres: ["Animation", "Adventure", "Fantasy"],
			rating: 8.6,
			description:
				"During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
		},
		{
			id: "15",
			name: "The Wolf of Wall Street",
			releaseDate: "2013-12-25",
			genres: ["Biography", "Comedy", "Crime"],
			rating: 8.2,
			description:
				"Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.",
		},
	];
};
