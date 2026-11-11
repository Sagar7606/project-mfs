import { NextResponse } from "next/server";
import {
  TmdbConfigurationError,
  TmdbNotFoundError,
  TmdbRequestError,
  TmdbResponseError,
} from "./api";

export function tmdbErrorResponse(error: unknown) {
  if (error instanceof TmdbConfigurationError) {
    return NextResponse.json(
      {
        error: {
          code: "tmdb_not_configured",
          message:
            "Movie discovery is not configured. Add TMDB_API_READ_ACCESS_TOKEN to the app's local environment.",
        },
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (error instanceof TmdbNotFoundError) {
    return NextResponse.json(
      { error: { code: "not_found", message: "This TMDB item was not found." } },
      { status: 404 },
    );
  }

  if (error instanceof TmdbRequestError) {
    const rejectedToken = error.status === 401 || error.status === 403;
    const rateLimited = error.status === 429;
    const status = rejectedToken || rateLimited || !error.status ? 503 : 502;

    return NextResponse.json(
      {
        error: {
          code: rejectedToken
            ? "tmdb_token_rejected"
            : rateLimited
              ? "tmdb_rate_limited"
              : "tmdb_unavailable",
          message: rejectedToken
            ? "TMDB rejected the configured read token."
            : rateLimited
              ? "TMDB is temporarily rate-limiting requests."
              : "Movie data is temporarily unavailable.",
        },
      },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (error instanceof TmdbResponseError) {
    return NextResponse.json(
      {
        error: {
          code: "tmdb_invalid_response",
          message: "TMDB returned data in an unexpected format.",
        },
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "internal_error",
        message: "The movie request could not be completed.",
      },
    },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}

export function parsePageNumber(value: string | null) {
  if (value === null) return undefined;
  if (!/^[1-9]\d{0,2}$/.test(value)) return null;

  const page = Number(value);
  return page <= 500 ? page : null;
}
