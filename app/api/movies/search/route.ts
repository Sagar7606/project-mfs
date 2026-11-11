import { NextResponse, type NextRequest } from "next/server";
import { getMovieGenres, searchMovies } from "@/lib/tmdb/data";
import { parsePageNumber, tmdbErrorResponse } from "@/lib/tmdb/http";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";
  if (query.length < 2 || query.length > 120) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_query",
          message: "Enter a title with 2 to 120 characters.",
        },
      },
      { status: 400 },
    );
  }

  const page = parsePageNumber(request.nextUrl.searchParams.get("page"));
  if (page === null) {
    return NextResponse.json(
      { error: { code: "invalid_page", message: "The page is invalid." } },
      { status: 400 },
    );
  }

  try {
    const [movies, genres] = await Promise.all([
      searchMovies(query, page),
      getMovieGenres(),
    ]);

    return NextResponse.json(
      { ...movies, genres },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return tmdbErrorResponse(error);
  }
}
