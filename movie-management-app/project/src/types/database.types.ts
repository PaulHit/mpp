export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			movies: {
				Row: {
					id: string;
					created_at: string;
					name: string;
					release_date: string;
					rating: number;
					description: string | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					name: string;
					release_date: string;
					rating: number;
					description?: string | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					name?: string;
					release_date?: string;
					rating?: number;
					description?: string | null;
				};
			};
			genres: {
				Row: {
					id: string;
					created_at: string;
					name: string;
				};
				Insert: {
					id?: string;
					created_at?: string;
					name: string;
				};
				Update: {
					id?: string;
					created_at?: string;
					name?: string;
				};
			};
			movie_genres: {
				Row: {
					id: string;
					created_at: string;
					movie_id: string;
					genre_id: string;
				};
				Insert: {
					id?: string;
					created_at?: string;
					movie_id: string;
					genre_id: string;
				};
				Update: {
					id?: string;
					created_at?: string;
					movie_id?: string;
					genre_id?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
