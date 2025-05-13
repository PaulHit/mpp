export interface Movie {
	id?: string; // Optional for new movies
	name: string;
	genres: string[];
	releaseDate: string; // ISO format (e.g., "2025-05-04")
	rating: number; // 1 to 10
	description: string;
}
