declare module "@supabase/ssr" {
	import { SupabaseClient } from "@supabase/supabase-js";
	import { CookieOptions } from "@supabase/ssr";

	export function createBrowserClient(
		supabaseUrl: string,
		supabaseKey: string
	): SupabaseClient;

	export function createServerClient(
		supabaseUrl: string,
		supabaseKey: string,
		options: {
			cookies: {
				get(name: string): string | undefined;
				set(name: string, value: string, options: CookieOptions): void;
				remove(name: string, options: CookieOptions): void;
			};
		}
	): SupabaseClient;

	export type CookieOptions = {
		name?: string;
		path?: string;
		domain?: string;
		maxAge?: number;
		expires?: Date;
		secure?: boolean;
		httpOnly?: boolean;
		sameSite?: "lax" | "strict" | "none";
	};
}
