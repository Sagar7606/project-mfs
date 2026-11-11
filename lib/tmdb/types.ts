export type TmdbGenre = {
  id: number;
  name: string;
};

export type MovieCollection = "trending" | "popular" | "discover";

export type TmdbMovie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  genres?: TmdbGenre[];
  vote_average: number;
  vote_count: number;
  original_language: string;
  runtime?: number | null;
  tagline?: string;
  origin_country?: string[];
  production_countries?: Array<{
    iso_3166_1: string;
    name: string;
  }>;
};

export type TmdbPage<T> = {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
};

export type TmdbCastMember = {
  id: number;
  name: string;
  character: string;
  order: number;
  profile_path: string | null;
};

export type TmdbCrewMember = {
  id: number;
  name: string;
  department: string;
  job: string;
  profile_path: string | null;
};

export type TmdbCredits = {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
};

export type TmdbPerson = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  profile_path: string | null;
};

export type TmdbFilmographyEntry = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  genre_ids: number[];
  character?: string;
  job?: string;
  department?: string;
  vote_average: number;
};

export type TmdbPersonCredits = {
  cast: TmdbFilmographyEntry[];
  crew: TmdbFilmographyEntry[];
};

export type MovieRecommendation = TmdbMovie & {
  reasons: string[];
  source: "TMDB recommendation" | "TMDB similar";
};
