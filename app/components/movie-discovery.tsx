"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type {
  MovieCollection,
  TmdbGenre,
  TmdbMovie,
  TmdbPage,
} from "@/lib/tmdb/types";
import { MovieCard } from "./movie-card";
import { TmdbImage } from "./tmdb-image";

type MoviePageResponse = TmdbPage<TmdbMovie> & {
  genres: TmdbGenre[];
};

type FeedState = {
  data: MoviePageResponse | null;
  loading: boolean;
  loadingMore: boolean;
  error: string;
};

type SearchState = {
  data: MoviePageResponse | null;
  loading: boolean;
  loadingMore: boolean;
  error: string;
};

type MovieRailName = MovieCollection | "recommended";

class MovieApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
  }
}

const collectionOrder: MovieCollection[] = [
  "trending",
  "popular",
  "discover",
];

const collectionLabels: Record<MovieCollection, string> = {
  trending: "Trending films",
  popular: "Popular films",
  discover: "Random discoveries",
};

const recommendationLabel = "Recommended films";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMovie(value: unknown): value is TmdbMovie {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    Array.isArray(value.genre_ids) &&
    typeof value.release_date === "string" &&
    typeof value.vote_average === "number" &&
    typeof value.vote_count === "number"
  );
}

function isGenre(value: unknown): value is TmdbGenre {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string"
  );
}

async function requestMoviePage(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = isRecord(payload) ? payload.error : null;
    const message =
      isRecord(error) && typeof error.message === "string"
        ? error.message
        : "Movie data is temporarily unavailable.";
    const code =
      isRecord(error) && typeof error.code === "string"
        ? error.code
        : "request_failed";
    throw new MovieApiError(message, code);
  }

  if (
    !isRecord(payload) ||
    !Array.isArray(payload.results) ||
    !payload.results.every(isMovie) ||
    !Array.isArray(payload.genres) ||
    !payload.genres.every(isGenre) ||
    typeof payload.page !== "number" ||
    typeof payload.total_pages !== "number" ||
    typeof payload.total_results !== "number"
  ) {
    throw new MovieApiError(
      "The movie service returned an unexpected response.",
      "invalid_response",
    );
  }

  return {
    page: payload.page,
    total_pages: payload.total_pages,
    total_results: payload.total_results,
    results: payload.results,
    genres: payload.genres,
  };
}

function initialFeedState(): Record<MovieCollection, FeedState> {
  return {
    trending: { data: null, loading: true, loadingMore: false, error: "" },
    popular: { data: null, loading: true, loadingMore: false, error: "" },
    discover: { data: null, loading: true, loadingMore: false, error: "" },
  };
}

function displayYear(date: string) {
  return /^\d{4}/.exec(date)?.[0] ?? "Year unavailable";
}

function LoadingRail() {
  return (
    <div
      aria-label="Loading movies"
      className="flex gap-4 overflow-hidden"
      role="status"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="w-[148px] shrink-0 animate-pulse sm:w-[172px]"
        >
          <div className="aspect-[2/3] bg-skeleton" />
          <div className="mt-3 h-4 w-4/5 bg-skeleton" />
          <div className="mt-2 h-3 w-1/2 bg-skeleton" />
        </div>
      ))}
    </div>
  );
}

function MovieRail({
  collection,
  state,
  onLoadMore,
}: {
  collection: MovieRailName;
  state: FeedState;
  onLoadMore: () => void;
}) {
  const movies = state.data?.results ?? [];
  const heading =
    collection === "recommended"
      ? recommendationLabel
      : collectionLabels[collection];

  return (
    <section
      aria-labelledby={`movie-${collection}-heading`}
      className="border-t border-border-subtle py-8 sm:py-10"
    >
      <div className="mb-5 flex items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-[9px] tracking-[0.2em] text-muted">
            {collection === "recommended"
              ? "INSPIRED BY A TRENDING FILM"
              : collection === "trending"
                ? "THE CONVERSATION RIGHT NOW"
                : collection === "popular"
                  ? "FROM THE TMDB CATALOG"
                  : "A DIFFERENT PAGE OF THE CATALOG"}
          </p>
          <h3
            id={`movie-${collection}-heading`}
            className="font-serif text-2xl tracking-[-0.03em] text-foreground sm:text-3xl"
          >
            {heading}
          </h3>
        </div>
        {state.data && state.data.total_pages > state.data.page && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={state.loadingMore}
            className="shrink-0 border-b border-border pb-1.5 text-[10px] text-secondary transition hover:border-accent-hover hover:text-accent-foreground disabled:opacity-50"
          >
            {state.loadingMore ? "Loading…" : "Load more"}
          </button>
        )}
      </div>

      {state.loading && !state.data ? (
        <LoadingRail />
      ) : state.error && !state.data ? (
        <p role="alert" className="py-8 text-sm text-warning">
          {state.error}
        </p>
      ) : movies.length === 0 ? (
        <p className="py-8 text-sm text-muted">
          No movies were returned for this collection.
        </p>
      ) : (
        <>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-7 sm:px-7 lg:-mx-10 lg:px-10">
            {movies.map((movie) => (
              <MovieCard
                key={`${collection}-${movie.id}`}
                movie={movie}
                genres={state.data?.genres}
              />
            ))}
            {state.loadingMore && (
              <div className="w-[148px] shrink-0 animate-pulse bg-skeleton sm:w-[172px]" />
            )}
          </div>
          {state.error && (
            <p role="alert" className="mt-2 text-xs text-warning">
              {state.error}
            </p>
          )}
        </>
      )}
    </section>
  );
}

export function MovieDiscovery() {
  const [feeds, setFeeds] = useState(initialFeedState);
  const [recommendations, setRecommendations] = useState<FeedState>({
    data: null,
    loading: false,
    loadingMore: false,
    error: "",
  });
  const [configurationError, setConfigurationError] = useState("");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState<SearchState>({
    data: null,
    loading: false,
    loadingMore: false,
    error: "",
  });
  const recommendationSeedId = feeds.trending.data?.results[0]?.id;

  useEffect(() => {
    let active = true;

    collectionOrder.forEach(async (collection) => {
      try {
        const page = await requestMoviePage(
          `/api/movies/discover?type=${collection}`,
        );
        if (!active) return;
        setFeeds((current) => ({
          ...current,
          [collection]: {
            data: page,
            loading: false,
            loadingMore: false,
            error: "",
          },
        }));
      } catch (error) {
        if (!active) return;
        if (
          error instanceof MovieApiError &&
          error.code === "tmdb_not_configured"
        ) {
          setConfigurationError(error.message);
        }
        setFeeds((current) => ({
          ...current,
          [collection]: {
            ...current[collection],
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Movie data is temporarily unavailable.",
          },
        }));
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!recommendationSeedId) return;

    const controller = new AbortController();
    let active = true;
    setRecommendations({
      data: null,
      loading: true,
      loadingMore: false,
      error: "",
    });

    const params = new URLSearchParams({
      movieId: String(recommendationSeedId),
    });
    requestMoviePage(
      `/api/movies/recommendations?${params.toString()}`,
      controller.signal,
    )
      .then((data) => {
        if (!active) return;
        setRecommendations({
          data,
          loading: false,
          loadingMore: false,
          error: "",
        });
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return;
        if (
          error instanceof MovieApiError &&
          error.code === "tmdb_not_configured"
        ) {
          setConfigurationError(error.message);
        }
        setRecommendations((current) => ({
          ...current,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Recommended movies are temporarily unavailable.",
        }));
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [recommendationSeedId]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchTerm("");
      return;
    }

    const timer = window.setTimeout(() => setSearchTerm(trimmed), 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!searchTerm) {
      setSearch({
        data: null,
        loading: false,
        loadingMore: false,
        error: "",
      });
      return;
    }

    const controller = new AbortController();
    setSearch((current) => ({
      ...current,
      data: null,
      loading: true,
      loadingMore: false,
      error: "",
    }));

    const searchParams = new URLSearchParams({ query: searchTerm });

    requestMoviePage(
      `/api/movies/search?${searchParams.toString()}`,
      controller.signal,
    )
      .then((data) => {
        setSearch({
          data,
          loading: false,
          loadingMore: false,
          error: "",
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (
          error instanceof MovieApiError &&
          error.code === "tmdb_not_configured"
        ) {
          setConfigurationError(error.message);
        }
        setSearch({
          data: null,
          loading: false,
          loadingMore: false,
          error:
            error instanceof Error
              ? error.message
              : "Search is temporarily unavailable.",
        });
      });

    return () => controller.abort();
  }, [searchTerm]);

  const featured = feeds.trending.data?.results[0];

  async function loadMore(collection: MovieCollection) {
    const currentFeed = feeds[collection];
    if (
      !currentFeed.data ||
      currentFeed.loadingMore ||
      currentFeed.data.page >= currentFeed.data.total_pages
    ) {
      return;
    }

    const pageNumber = currentFeed.data.page + 1;
    setFeeds((current) => ({
      ...current,
      [collection]: { ...current[collection], loadingMore: true, error: "" },
    }));

    try {
      const nextPage = await requestMoviePage(
        `/api/movies/discover?type=${collection}&page=${pageNumber}`,
      );
      setFeeds((current) => {
        const existing = current[collection].data?.results ?? [];
        const movieIds = new Set(existing.map((movie) => movie.id));
        return {
          ...current,
          [collection]: {
            data: {
              ...nextPage,
              results: [
                ...existing,
                ...nextPage.results.filter((movie) => !movieIds.has(movie.id)),
              ],
            },
            loading: false,
            loadingMore: false,
            error: "",
          },
        };
      });
    } catch (error) {
      setFeeds((current) => ({
        ...current,
        [collection]: {
          ...current[collection],
          loadingMore: false,
          error:
            error instanceof Error
              ? error.message
              : "More movies could not be loaded.",
        },
      }));
    }
  }

  async function loadMoreRecommendations() {
    const currentData = recommendations.data;
    if (
      !recommendationSeedId ||
      !currentData ||
      recommendations.loadingMore ||
      currentData.page >= currentData.total_pages
    ) {
      return;
    }

    const pageNumber = currentData.page + 1;
    setRecommendations((current) => ({
      ...current,
      loadingMore: true,
      error: "",
    }));

    try {
      const params = new URLSearchParams({
        movieId: String(recommendationSeedId),
        page: String(pageNumber),
      });
      const nextPage = await requestMoviePage(
        `/api/movies/recommendations?${params.toString()}`,
      );
      setRecommendations((current) => {
        const existing = current.data?.results ?? [];
        const movieIds = new Set(existing.map((movie) => movie.id));
        return {
          data: {
            ...nextPage,
            results: [
              ...existing,
              ...nextPage.results.filter((movie) => !movieIds.has(movie.id)),
            ],
          },
          loading: false,
          loadingMore: false,
          error: "",
        };
      });
    } catch (error) {
      setRecommendations((current) => ({
        ...current,
        loadingMore: false,
        error:
          error instanceof Error
            ? error.message
            : "More recommendations could not be loaded.",
      }));
    }
  }

  async function loadMoreSearch() {
    const currentData = search.data;
    if (
      !currentData ||
      search.loadingMore ||
      currentData.page >= currentData.total_pages
    ) {
      return;
    }

    const pageNumber = currentData.page + 1;
    setSearch((current) => ({ ...current, loadingMore: true, error: "" }));

    try {
      const searchParams = new URLSearchParams({
        query: searchTerm,
        page: String(pageNumber),
      });
      const nextPage = await requestMoviePage(
        `/api/movies/search?${searchParams.toString()}`,
      );
      setSearch((current) => {
        const existing = current.data?.results ?? [];
        const movieIds = new Set(existing.map((movie) => movie.id));
        return {
          data: {
            ...nextPage,
            results: [
              ...existing,
              ...nextPage.results.filter((movie) => !movieIds.has(movie.id)),
            ],
          },
          loading: false,
          loadingMore: false,
          error: "",
        };
      });
    } catch (error) {
      setSearch((current) => ({
        ...current,
        loadingMore: false,
        error:
          error instanceof Error
            ? error.message
            : "More search results could not be loaded.",
      }));
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearch({
        data: null,
        loading: false,
        loadingMore: false,
        error: "Enter at least two characters to search movie titles.",
      });
      return;
    }
    setSearchTerm(trimmed);
  }

  function clearSearch() {
    setQuery("");
    setSearchTerm("");
  }

  return (
    <section
      id="movies"
      aria-labelledby="movie-discovery-heading"
      className="scroll-mt-32 border-y border-border-subtle bg-surface"
    >
      <div className="mx-auto max-w-[1240px] overflow-hidden px-4 py-12 sm:px-7 sm:py-16 lg:px-10 lg:py-20">
        <div className="pb-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-[9px] tracking-[0.22em] text-muted">
              01 <span className="px-2 text-muted">/</span> FILM DISCOVERY
            </p>
            <h2
              id="movie-discovery-heading"
              className="font-serif text-4xl leading-[1.08] tracking-[-0.04em] text-foreground sm:text-5xl"
            >
              Find a film.
              <br />
              <span className="italic text-secondary">Follow the story.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
              Search by title, follow what’s moving, or take an unexpected turn
              through the catalog.
            </p>
          </div>
        </div>
        <form
          role="search"
          onSubmit={submitSearch}
          className="mb-8 flex min-h-14 w-full max-w-[760px] items-center gap-3 border border-border bg-control-surface px-4 transition focus-within:border-border-strong sm:px-5"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5 shrink-0 text-secondary"
          >
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4 4" />
          </svg>
          <label className="sr-only" htmlFor="movie-search">
            Search movie titles
          </label>
          <input
            id="movie-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a film by title..."
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear movie search"
              className="text-[10px] text-secondary hover:text-accent-foreground"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="border-l border-border py-2 pl-4 text-[10px] tracking-[0.12em] text-foreground transition hover:text-accent-foreground"
          >
            SEARCH FILMS
          </button>
        </form>

        {configurationError && (
          <div
            role="alert"
            className="mb-8 border-l border-border bg-control-surface px-4 py-3 text-xs leading-5 text-secondary"
          >
            {configurationError}
          </div>
        )}

        {search.error && !configurationError && (
          <p role="alert" className="mb-5 text-xs text-warning">
            {search.error}
          </p>
        )}

        {searchTerm && (
          <section
            aria-labelledby="movie-search-results-heading"
            className="mb-10 border-y border-border-subtle py-7"
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[9px] tracking-[0.18em] text-muted">
                  TMDB TITLE SEARCH
                </p>
                <h3
                  id="movie-search-results-heading"
                  className="font-serif text-2xl text-foreground"
                >
                  Results for “{searchTerm}”
                </h3>
              </div>
            </div>
            {configurationError ? null : search.loading && !search.data ? (
              <LoadingRail />
            ) : search.data?.results.length ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {search.data.results.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      genres={search.data?.genres}
                      showOverview
                      layout="grid"
                    />
                  ))}
                </div>
                {search.data.page < search.data.total_pages && (
                  <button
                    type="button"
                    onClick={loadMoreSearch}
                    disabled={search.loadingMore}
                    className="mt-8 border-b border-border pb-1.5 text-[10px] text-secondary hover:border-accent-hover disabled:opacity-50"
                  >
                    {search.loadingMore ? "Loading…" : "Load more results"}
                  </button>
                )}
              </>
            ) : !search.loading ? (
              <p className="py-8 text-sm text-muted">
                No titles matched that search. Try another spelling or title.
              </p>
            ) : null}
          </section>
        )}

        {featured && (
          <Link
            href={`/movies/${featured.id}`}
            aria-label={`Explore ${featured.title}, currently trending on TMDB`}
            className="cinematic-surface group relative mb-10 flex min-h-[260px] items-end overflow-hidden bg-panel sm:min-h-[340px]"
          >
            <TmdbImage
              path={featured.backdrop_path}
              kind="backdrop"
              alt={`Cinematic backdrop for ${featured.title}`}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="transition-transform duration-700 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 max-w-2xl p-6 sm:p-9">
              <p className="text-[9px] tracking-[0.2em] text-inverse-secondary">
                IN THE CONVERSATION · TMDB TRENDING
              </p>
              <h3 className="mt-3 font-serif text-3xl text-inverse sm:text-5xl">
                {featured.title}
              </h3>
              <p className="mt-2 text-[10px] tracking-[0.14em] text-inverse-secondary">
                {displayYear(featured.release_date)}
                {featured.vote_count > 0 && (
                  <span> · {featured.vote_average.toFixed(1)} TMDB</span>
                )}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 border-b border-border-strong pb-1 text-[10px] text-inverse">
                Open film notes <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        )}

        <div className="mb-5 flex items-center justify-between gap-5">
          <p className="text-[9px] tracking-[0.18em] text-muted">
            MOVIE DATA AND IMAGES PROVIDED BY TMDB
          </p>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="text-[9px] text-muted underline decoration-border underline-offset-4 hover:text-accent-foreground"
          >
            About TMDB
          </a>
        </div>

        {!configurationError &&
          collectionOrder.map((collection) => (
            <MovieRail
              key={collection}
              collection={collection}
              state={feeds[collection]}
              onLoadMore={() => loadMore(collection)}
            />
          ))}
        {!configurationError && recommendationSeedId && (
          <MovieRail
            collection="recommended"
            state={recommendations}
            onLoadMore={loadMoreRecommendations}
          />
        )}

        <section
          id="film-exploration"
          aria-labelledby="film-exploration-heading"
          className="mt-12 border-t border-border-subtle py-10 sm:py-12"
        >
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-muted">
                ADVANCED EXPLORATION · IN DEVELOPMENT
              </p>
              <h3
                id="film-exploration-heading"
                className="mt-3 max-w-xl font-serif text-3xl leading-tight text-foreground sm:text-4xl"
              >
                Discover films through the people and choices behind them.
              </h3>
              <p className="mt-3 max-w-xl text-xs leading-5 text-muted">
                These filters are not active yet. Combined crew roles and
                advanced AND/OR groups require additional server-side data
                retrieval.
              </p>
            </div>
            <ul
              aria-label="Planned film filters"
              className="flex flex-wrap gap-2 text-[10px] text-secondary"
            >
              {[
                "Directors",
                "Actors",
                "Cinematographers",
                "Screenwriters",
                "Editors",
                "Composers",
                "Genres",
                "Languages",
                "Countries",
                "Release years",
                "Themes",
              ].map((filter) => (
                <li
                  key={filter}
                  className="border border-border px-3 py-2"
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
