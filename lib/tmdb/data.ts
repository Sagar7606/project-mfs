import "server-only";

import { TmdbResponseError, tmdbGet } from "./api";
import type {
  MovieCollection,
  MovieRecommendation,
  TmdbCredits,
  TmdbFilmographyEntry,
  TmdbGenre,
  TmdbMovie,
  TmdbPage,
  TmdbPerson,
  TmdbPersonCredits,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TmdbResponseError();
  }

  return value as Record<string, unknown>;
}

function requiredString(value: unknown) {
  if (typeof value !== "string") {
    throw new TmdbResponseError();
  }
  return value;
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function nullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function finiteNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function idNumber(value: unknown) {
  const id = finiteNumber(value, -1);
  if (!Number.isInteger(id) || id < 1) {
    throw new TmdbResponseError();
  }
  return id;
}

function numberArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is number =>
      typeof item === "number" && Number.isInteger(item) && item > 0,
  );
}

function parseGenre(value: unknown): TmdbGenre {
  const record = asRecord(value);
  return {
    id: idNumber(record.id),
    name: requiredString(record.name),
  };
}

function parseMovie(value: unknown): TmdbMovie {
  const record = asRecord(value);
  const genres = Array.isArray(record.genres)
    ? record.genres.map(parseGenre)
    : undefined;
  const genreIds = numberArray(record.genre_ids);

  return {
    id: idNumber(record.id),
    title: requiredString(record.title),
    original_title: optionalString(record.original_title),
    overview: optionalString(record.overview),
    poster_path: nullableString(record.poster_path),
    backdrop_path: nullableString(record.backdrop_path),
    release_date: optionalString(record.release_date),
    genre_ids: genreIds.length ? genreIds : (genres?.map((genre) => genre.id) ?? []),
    genres,
    vote_average: finiteNumber(record.vote_average),
    vote_count: finiteNumber(record.vote_count),
    original_language: optionalString(record.original_language),
    runtime:
      typeof record.runtime === "number" && Number.isFinite(record.runtime)
        ? record.runtime
        : null,
    tagline: optionalString(record.tagline),
    origin_country: Array.isArray(record.origin_country)
      ? record.origin_country.filter(
          (country): country is string => typeof country === "string",
        )
      : [],
    production_countries: Array.isArray(record.production_countries)
      ? record.production_countries.flatMap((country) => {
          if (!country || typeof country !== "object") return [];
          const item = country as Record<string, unknown>;
          if (
            typeof item.iso_3166_1 !== "string" ||
            typeof item.name !== "string"
          ) {
            return [];
          }
          return [{ iso_3166_1: item.iso_3166_1, name: item.name }];
        })
      : [],
  };
}

function parseMoviePage(value: unknown): TmdbPage<TmdbMovie> {
  const record = asRecord(value);
  if (!Array.isArray(record.results)) {
    throw new TmdbResponseError();
  }

  return {
    page: finiteNumber(record.page, 1),
    total_pages: finiteNumber(record.total_pages, 1),
    total_results: finiteNumber(record.total_results),
    results: record.results.map(parseMovie),
  };
}

function parseCredits(value: unknown): TmdbCredits {
  const record = asRecord(value);
  const cast = Array.isArray(record.cast) ? record.cast : [];
  const crew = Array.isArray(record.crew) ? record.crew : [];

  return {
    cast: cast.map((entry) => {
      const person = asRecord(entry);
      return {
        id: idNumber(person.id),
        name: requiredString(person.name),
        character: optionalString(person.character),
        order: finiteNumber(person.order),
        profile_path: nullableString(person.profile_path),
      };
    }),
    crew: crew.map((entry) => {
      const person = asRecord(entry);
      return {
        id: idNumber(person.id),
        name: requiredString(person.name),
        department: optionalString(person.department),
        job: optionalString(person.job),
        profile_path: nullableString(person.profile_path),
      };
    }),
  };
}

function parsePerson(value: unknown): TmdbPerson {
  const record = asRecord(value);
  return {
    id: idNumber(record.id),
    name: requiredString(record.name),
    biography: optionalString(record.biography),
    birthday: nullableString(record.birthday),
    place_of_birth: nullableString(record.place_of_birth),
    known_for_department: optionalString(record.known_for_department),
    profile_path: nullableString(record.profile_path),
  };
}

function parseFilmographyEntry(value: unknown): TmdbFilmographyEntry {
  const record = asRecord(value);
  return {
    id: idNumber(record.id),
    title:
      optionalString(record.title) || requiredString(record.name),
    overview: optionalString(record.overview),
    release_date: optionalString(record.release_date),
    poster_path: nullableString(record.poster_path),
    genre_ids: numberArray(record.genre_ids),
    character: optionalString(record.character),
    job: optionalString(record.job),
    department: optionalString(record.department),
    vote_average: finiteNumber(record.vote_average),
  };
}

function parsePersonCredits(value: unknown): TmdbPersonCredits {
  const record = asRecord(value);
  return {
    cast: Array.isArray(record.cast)
      ? record.cast.map(parseFilmographyEntry)
      : [],
    crew: Array.isArray(record.crew)
      ? record.crew.map(parseFilmographyEntry)
      : [],
  };
}

export async function getMovieGenres(): Promise<TmdbGenre[]> {
  const response = asRecord(
    await tmdbGet("/genre/movie/list", { language: "en-US" }, 86_400),
  );
  if (!Array.isArray(response.genres)) {
    throw new TmdbResponseError();
  }
  return response.genres.map(parseGenre);
}

export async function getMovieCollection(
  collection: MovieCollection,
  page?: number,
): Promise<TmdbPage<TmdbMovie>> {
  const resolvedPage =
    page ??
    (collection === "discover"
      ? Math.floor(Math.random() * 50) + 1
      : 1);
  const path =
    collection === "trending"
      ? "/trending/movie/week"
      : collection === "popular"
        ? "/movie/popular"
        : "/discover/movie";
  const params: Record<string, string | number> =
    collection === "discover"
      ? {
          include_adult: "false",
          language: "en-US",
          page: resolvedPage,
          sort_by: "popularity.desc",
        }
      : { language: "en-US", page: resolvedPage };

  return parseMoviePage(
    await tmdbGet(path, params, collection === "discover" ? 600 : 1_800),
  );
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<TmdbPage<TmdbMovie>> {
  return parseMoviePage(
    await tmdbGet(
      "/search/movie",
      {
        include_adult: "false",
        language: "en-US",
        page,
        query,
      },
      300,
    ),
  );
}

export async function getMovie(id: number): Promise<TmdbMovie> {
  return parseMovie(
    await tmdbGet(`/movie/${id}`, { language: "en-US" }, 86_400),
  );
}

export async function getMovieCredits(id: number): Promise<TmdbCredits> {
  return parseCredits(
    await tmdbGet(`/movie/${id}/credits`, { language: "en-US" }, 86_400),
  );
}

export async function getMovieRecommendations(
  id: number,
  page = 1,
): Promise<TmdbPage<TmdbMovie>> {
  return parseMoviePage(
    await tmdbGet(
      `/movie/${id}/recommendations`,
      { language: "en-US", page },
      21_600,
    ),
  );
}

export async function getSimilarMovies(
  id: number,
): Promise<TmdbPage<TmdbMovie>> {
  return parseMoviePage(
    await tmdbGet(
      `/movie/${id}/similar`,
      { language: "en-US", page: 1 },
      21_600,
    ),
  );
}

export async function getPerson(id: number): Promise<TmdbPerson> {
  return parsePerson(
    await tmdbGet(`/person/${id}`, { language: "en-US" }, 86_400),
  );
}

export async function getPersonCredits(
  id: number,
): Promise<TmdbPersonCredits> {
  return parsePersonCredits(
    await tmdbGet(`/person/${id}/movie_credits`, { language: "en-US" }, 43_200),
  );
}

export function getMovieRecommendationsWithReasons(
  movie: TmdbMovie,
  credits: TmdbCredits,
  candidates: TmdbMovie[],
  candidateCredits: Map<number, TmdbCredits>,
  candidateSources: Map<number, MovieRecommendation["source"]>,
): MovieRecommendation[] {
  const sourceGenres = new Set(
    movie.genres?.map((genre) => genre.id) ?? movie.genre_ids,
  );
  const sourceDirectors = new Set(
    credits.crew
      .filter((member) => member.job === "Director")
      .map((member) => member.id),
  );
  const sourceCrew = new Set(credits.crew.map((member) => member.id));
  const sourceCast = new Set(credits.cast.map((member) => member.id));

  return candidates.map((candidate) => {
    const sharedGenres = candidate.genre_ids.filter((id) =>
      sourceGenres.has(id),
    );
    const candidateCredit = candidateCredits.get(candidate.id);
    const sharedDirector = candidateCredit?.crew.find(
      (member) =>
        member.job === "Director" && sourceDirectors.has(member.id),
    );
    const sharedCrewMember = candidateCredit?.crew.find((member) =>
      sourceCrew.has(member.id),
    );
    const sharedCast = candidateCredit?.cast.find((member) =>
      sourceCast.has(member.id),
    );
    const reasons = [
      sharedGenres.length
        ? "Shared genre"
        : undefined,
      sharedDirector ? "Same director" : undefined,
      sharedCrewMember && !sharedDirector ? "Shared crew" : undefined,
      sharedCast ? "Shared cast" : undefined,
    ].filter((reason): reason is string => Boolean(reason));

    return {
      ...candidate,
      reasons,
      source: candidateSources.get(candidate.id) ?? "TMDB similar",
    };
  });
}
