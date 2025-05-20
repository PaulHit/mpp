import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
	try {
		const { data, error } = await supabase.rpc("get_movie_statistics");

		if (error) {
			console.error("Error fetching movie statistics:", error);
			return NextResponse.json(
				{ error: "Failed to fetch movie statistics" },
				{ status: 500 }
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in statistics endpoint:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
