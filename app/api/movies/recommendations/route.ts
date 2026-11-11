import { NextResponse, type NextRequest } from "next/server";
import {
  getMovieGenres,
  getMovieRecommendations,
} from "@/lib/tmdb/data";
import { parsePageNumber, tmdbErrorResponse } from "@/lib/tmdb/http";

export async function GET(request: NextRequest) {
  const rawMovieId = request.nextUrl.searchParams.get("movieId") ?? "";
  if (!/^[1-9]\d{0,8}$/.test(rawMovieId)) {
    return NextResponse.json(
      { error: { code: "invalid_movie_id", message: "The film is invalid." } },
      { status: 400 },
    );
  }

  const movieId = Number(rawMovieId);
  if (!Number.isSafeInteger(movieId)) {
    return NextResponse.json(
      { error: { code: "invalid_movie_id", message: "The film is invalid." } },
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
      getMovieRecommendations(movieId, page),
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
