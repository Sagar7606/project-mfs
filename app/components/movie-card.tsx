import Link from "next/link";
import type { TmdbGenre, TmdbMovie } from "@/lib/tmdb/types";
import { TmdbImage } from "./tmdb-image";

type MovieCardProps = {
  movie: TmdbMovie;
  genres?: TmdbGenre[];
  showOverview?: boolean;
  layout?: "rail" | "grid";
};

function releaseYear(releaseDate: string) {
  const match = /^\d{4}/.exec(releaseDate);
  return match?.[0] ?? "Year unavailable";
}

export function MovieCard({
  movie,
  genres = [],
  showOverview = false,
  layout = "rail",
}: MovieCardProps) {
  const genreLookup = new Map(genres.map((genre) => [genre.id, genre.name]));
  const movieGenres =
    movie.genres?.map((genre) => genre.name) ??
    movie.genre_ids
      .map((id) => genreLookup.get(id))
      .filter((name): name is string => Boolean(name));

  return (
    <article
      className={`group min-w-0 ${
        layout === "grid"
          ? "w-full"
          : "w-[176px] sm:w-[204px]"
      }`}
    >
      <Link
        href={`/movies/${movie.id}`}
        className="block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
        aria-label={`View ${movie.title} (${releaseYear(movie.release_date)})`}
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-[#17191c]">
          <TmdbImage
            path={movie.poster_path}
            kind="poster"
            alt={`Poster for ${movie.title}`}
            sizes="(max-width: 640px) 176px, 204px"
            className="transition-transform duration-500 group-hover:scale-[1.035]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
        </div>
        <h3 className="mt-3 line-clamp-2 font-serif text-[17px] leading-tight text-[#eceae6] transition-colors group-hover:text-white sm:text-lg">
          {movie.title}
        </h3>
        <p className="mt-1 text-[10px] tracking-[0.12em] text-[#85878a]">
          {releaseYear(movie.release_date)}
          {movie.vote_count > 0 && (
            <span className="ml-2">
              · {movie.vote_average.toFixed(1)} TMDB
            </span>
          )}
        </p>
        {movieGenres.length > 0 && (
          <p className="mt-2 line-clamp-1 text-[10px] text-[#a2a3a5]">
            {movieGenres.slice(0, 2).join(" · ")}
          </p>
        )}
        {showOverview && (
          <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#929497]">
            {movie.overview || "No synopsis is available from TMDB."}
          </p>
        )}
      </Link>
    </article>
  );
}
