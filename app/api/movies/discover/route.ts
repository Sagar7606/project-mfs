import { NextResponse, type NextRequest } from "next/server";
import {
  getMovieCollection,
  getMovieGenres,
} from "@/lib/tmdb/data";
import { parsePageNumber, tmdbErrorResponse } from "@/lib/tmdb/http";
import type { MovieCollection } from "@/lib/tmdb/types";

function isMovieCollection(value: string): value is MovieCollection {
  return value === "trending" || value === "popular" || value === "discover";
}

export async function GET(request: NextRequest) {
  const collectionValue =
    request.nextUrl.searchParams.get("type") ?? "discover";
  if (!isMovieCollection(collectionValue)) {
    return NextResponse.json(
      { error: { code: "invalid_collection", message: "Unknown movie list." } },
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
      getMovieCollection(collectionValue, page),
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
