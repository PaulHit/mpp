export interface Movie {
	id: string;
	name: string;
	releaseDate: string;
	genres: string[];
	rating: number;
	description?: string;
}
