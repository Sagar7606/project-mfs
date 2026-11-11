import "server-only";

const TMDB_API_URL = "https://api.themoviedb.org/3/";
const REQUEST_TIMEOUT_MS = 8_000;

export class TmdbConfigurationError extends Error {
  constructor() {
    super("TMDB_API_READ_ACCESS_TOKEN is not configured.");
    this.name = "TmdbConfigurationError";
  }
}

export class TmdbRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "TmdbRequestError";
  }
}

export class TmdbNotFoundError extends TmdbRequestError {
  constructor() {
    super("The requested TMDB resource was not found.", 404);
    this.name = "TmdbNotFoundError";
  }
}

export class TmdbResponseError extends Error {
  constructor() {
    super("TMDB returned an invalid response.");
    this.name = "TmdbResponseError";
  }
}

function getAccessToken() {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN?.trim();
  if (!token) throw new TmdbConfigurationError();
  return token;
}

export async function tmdbGet(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = 3_600,
): Promise<unknown> {
  const url = new URL(path.replace(/^\/+/, ""), TMDB_API_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
      next: { revalidate },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (
      error instanceof TypeError ||
      (error instanceof Error &&
        ["AbortError", "TimeoutError"].includes(error.name))
    ) {
      throw new TmdbRequestError("TMDB could not be reached.");
    }

    throw error;
  }

  if (response.status === 404) throw new TmdbNotFoundError();
  if (!response.ok) {
    throw new TmdbRequestError(
      "TMDB returned an unsuccessful response.",
      response.status,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new TmdbRequestError("TMDB returned an invalid response.");
  }
}
