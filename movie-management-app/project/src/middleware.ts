import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name: string, options: CookieOptions) {
					response.cookies.set({
						name,
						value: "",
						...options,
					});
				},
			},
		}
	);

	// Refresh session if expired
	await supabase.auth.getSession();

	// Get the pathname of the request
	const path = request.nextUrl.pathname;

	// Define public routes that don't require authentication
	const publicRoutes = ["/login", "/register", "/auth/callback"];

	// Check if the path is a public route
	const isPublicRoute = publicRoutes.includes(path);

	// Get the session
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// If there's no session and the user is trying to access a protected route
	if (!session && !isPublicRoute) {
		// Redirect to login
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// If there's a session and the user is trying to access a public route
	if (session && isPublicRoute) {
		// Redirect to movies page
		return NextResponse.redirect(new URL("/movies", request.url));
	}

	// If the user is on the root path, redirect to movies
	if (path === "/") {
		return NextResponse.redirect(new URL("/movies", request.url));
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
