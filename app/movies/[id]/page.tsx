import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CinemaPageFrame } from "@/app/components/cinema-page-frame";
import { MovieCard } from "@/app/components/movie-card";
import {
  MoviePageLoading,
  MoviePageState,
} from "@/app/components/movie-page-state";
import { PersonCreditCard } from "@/app/components/person-credit-card";
import { TmdbImage } from "@/app/components/tmdb-image";
import {
  TmdbConfigurationError,
  TmdbNotFoundError,
  TmdbRequestError,
} from "@/lib/tmdb/api";
import {
  getMovie,
  getMovieCredits,
  getMovieRecommendations,
  getMovieRecommendationsWithReasons,
  getSimilarMovies,
} from "@/lib/tmdb/data";
import type { TmdbCredits, TmdbMovie } from "@/lib/tmdb/types";

const crewGroups = [
  {
    title: "Director",
    match: (job: string) => job === "Director",
  },
  {
    title: "Screenwriter",
    match: (job: string) => /writer|screenplay|story|adaptation/i.test(job),
  },
  {
    title: "Cinematography",
    match: (job: string) =>
      /director of photography|cinematograph/i.test(job),
  },
  {
    title: "Editing",
    match: (job: string) => /editor/i.test(job),
  },
  {
    title: "Music",
    match: (job: string) => /composer|original music/i.test(job),
  },
  {
    title: "Production",
    match: (job: string) => /producer/i.test(job),
  },
  {
    title: "Production Design",
    match: (job: string) => /production design|production designer/i.test(job),
  },
];

function formatDate(value: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00Z`)
    : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date)
    : "Not listed";
}

function languageName(code: string) {
  if (!code) return "Not listed";
  return (
    new Intl.DisplayNames(["en"], { type: "language" }).of(code) ??
    code.toUpperCase()
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof TmdbConfigurationError) {
    return "Movie details require TMDB_API_READ_ACCESS_TOKEN in the app-root .env.local file. No sample movie data is shown.";
  }
  if (error instanceof TmdbRequestError && (error.status === 401 || error.status === 403)) {
    return "TMDB rejected the configured read token. Check its local configuration.";
  }
  return "TMDB could not load this film right now. Please try again later.";
}

async function loadCandidateCredits(movies: TmdbMovie[]) {
  const results = await Promise.allSettled(
    movies
      .slice(0, 5)
      .map(async (movie) => [movie.id, await getMovieCredits(movie.id)] as const),
  );

  const credits = new Map<number, TmdbCredits>();
  let unavailableCount = 0;
  for (const result of results) {
    if (result.status === "fulfilled") {
      credits.set(result.value[0], result.value[1]);
    } else {
      unavailableCount += 1;
    }
  }
  return { credits, unavailableCount };
}

export default function MoviePage({
  params,
}: PageProps<"/movies/[id]">) {
  return (
    <Suspense
      fallback={<MoviePageLoading message="Finding this film and its credits..." />}
    >
      <MoviePageContent params={params} />
    </Suspense>
  );
}

async function MoviePageContent({
  params,
}: {
  params: PageProps<"/movies/[id]">["params"];
}) {
  const { id: rawId } = await params;
  if (!/^[1-9]\d{0,8}$/.test(rawId)) notFound();

  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) notFound();

  let movie: TmdbMovie;
  let credits: TmdbCredits;
  let recommendationPage: Awaited<ReturnType<typeof getMovieRecommendations>>;
  let similarPage: Awaited<ReturnType<typeof getSimilarMovies>>;
  try {
    [movie, credits, recommendationPage, similarPage] = await Promise.all([
      getMovie(id),
      getMovieCredits(id),
      getMovieRecommendations(id),
      getSimilarMovies(id),
    ]);
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound();
    return (
      <MoviePageState
        title="This film is out of frame."
        message={getErrorMessage(error)}
      />
    );
  }

  const seen = new Set<number>();
  const candidateSources = new Map<number, "TMDB recommendation" | "TMDB similar">();
  const candidates: TmdbMovie[] = [];
  for (const candidate of recommendationPage.results) {
    if (candidate.id === movie.id || seen.has(candidate.id)) continue;
    seen.add(candidate.id);
    candidateSources.set(candidate.id, "TMDB recommendation");
    candidates.push(candidate);
  }
  for (const candidate of similarPage.results) {
    if (candidate.id === movie.id || seen.has(candidate.id)) continue;
    seen.add(candidate.id);
    candidateSources.set(candidate.id, "TMDB similar");
    candidates.push(candidate);
  }
  const { credits: candidateCredits, unavailableCount } =
    await loadCandidateCredits(candidates);
  const recommendations = getMovieRecommendationsWithReasons(
    movie,
    credits,
    candidates,
    candidateCredits,
    candidateSources,
  );
  const releaseYear = /^\d{4}/.exec(movie.release_date)?.[0] ?? "Year not listed";
  const crew = crewGroups
    .map((group) => ({
      ...group,
      members: credits.crew.filter((member) => group.match(member.job)),
    }))
    .filter((group) => group.members.length > 0);

  return (
    <CinemaPageFrame>
      <main>
        <section className="cinematic-surface relative isolate min-h-[390px] overflow-hidden border-b border-border-subtle sm:min-h-[480px]">
          <TmdbImage
            path={movie.backdrop_path}
            kind="backdrop"
            alt={`Backdrop for ${movie.title}`}
            sizes="100vw"
            className="z-0"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-cinematic via-cinematic/75 to-cinematic/15" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-cinematic via-transparent to-black/20" />
          <div className="relative z-20 mx-auto flex min-h-[390px] max-w-[1240px] items-end px-4 pb-10 pt-28 sm:min-h-[480px] sm:px-7 sm:pb-14 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-[9px] tracking-[0.2em] text-inverse-secondary">
                FILM / {releaseYear}
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="mt-4 font-serif text-lg italic text-secondary sm:text-xl">
                  {movie.tagline}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                {(movie.genres ?? []).map((genre) => (
                  <span
                    key={genre.id}
                    className="border border-border px-2.5 py-1 text-[9px] tracking-[0.12em] text-inverse-secondary"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-10 sm:px-7 sm:py-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 lg:px-10">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[240px] overflow-hidden bg-panel lg:mx-0">
            <TmdbImage
              path={movie.poster_path}
              kind="poster"
              alt={`Poster for ${movie.title}`}
              sizes="(max-width: 1024px) 220px, 240px"
            />
          </div>

          <div className="min-w-0">
            <section aria-labelledby="movie-overview-heading">
              <p className="text-[9px] tracking-[0.2em] text-muted">
                THE FILM
              </p>
              <h2
                id="movie-overview-heading"
                className="mt-2 font-serif text-3xl text-foreground sm:text-4xl"
              >
                About the picture
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-secondary">
                {movie.overview || "TMDB does not list a synopsis for this film."}
              </p>
              <dl className="mt-7 grid gap-x-8 gap-y-5 border-y border-border-subtle py-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-[9px] tracking-[0.14em] text-muted">
                    RELEASED
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {formatDate(movie.release_date)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] tracking-[0.14em] text-muted">
                    RUNTIME
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {movie.runtime ? `${movie.runtime} minutes` : "Not listed"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] tracking-[0.14em] text-muted">
                    ORIGINAL LANGUAGE
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {languageName(movie.original_language)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] tracking-[0.14em] text-muted">
                    PRODUCTION COUNTRY
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {movie.production_countries?.map((country) => country.name).join(", ") ||
                      "Not listed"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] tracking-[0.14em] text-muted">
                    TMDB RATING
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {movie.vote_count > 0
                      ? `${movie.vote_average.toFixed(1)} / 10`
                      : "Not yet rated"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] tracking-[0.14em] text-muted">
                    GENRES
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {movie.genres?.map((genre) => genre.name).join(", ") ||
                      "Not listed"}
                  </dd>
                </div>
              </dl>
            </section>

            {credits.cast.length > 0 && (
              <section
                aria-labelledby="movie-cast-heading"
                className="mt-12"
              >
                <p className="text-[9px] tracking-[0.2em] text-muted">
                  THE PEOPLE IN FRONT OF THE LENS
                </p>
                <h2
                  id="movie-cast-heading"
                  className="mt-2 font-serif text-3xl text-foreground"
                >
                  Cast
                </h2>
                <div className="mt-5 grid gap-x-5 sm:grid-cols-2 xl:grid-cols-3">
                  {credits.cast.slice(0, 18).map((person) => (
                    <PersonCreditCard
                      key={`${person.id}-${person.order}`}
                      id={person.id}
                      name={person.name}
                      detail={person.character || "Cast"}
                      profilePath={person.profile_path}
                    />
                  ))}
                </div>
              </section>
            )}

            {crew.length > 0 && (
              <section
                aria-labelledby="movie-crew-heading"
                className="mt-12"
              >
                <p className="text-[9px] tracking-[0.2em] text-muted">
                  THE HANDS BEHIND THE FRAME
                </p>
                <h2
                  id="movie-crew-heading"
                  className="mt-2 font-serif text-3xl text-foreground"
                >
                  Crew
                </h2>
                <div className="mt-7 grid gap-8 md:grid-cols-2">
                  {crew.map((group) => (
                    <section
                      key={group.title}
                      aria-labelledby={`crew-${group.title.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      <h3
                        id={`crew-${group.title.toLowerCase().replaceAll(" ", "-")}`}
                        className="mb-2 text-[10px] tracking-[0.15em] text-secondary"
                      >
                        {group.title.toUpperCase()}
                      </h3>
                      {group.members.map((person) => (
                        <PersonCreditCard
                          key={`${group.title}-${person.id}-${person.job}`}
                          id={person.id}
                          name={person.name}
                          detail={person.job}
                          profilePath={person.profile_path}
                        />
                      ))}
                    </section>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <section
          aria-labelledby="movie-recommendations-heading"
          className="border-y border-border-subtle bg-surface"
        >
          <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-7 sm:py-16 lg:px-10">
            <p className="text-[9px] tracking-[0.2em] text-muted">
              RELATED STORIES
            </p>
            <h2
              id="movie-recommendations-heading"
              className="mt-2 font-serif text-3xl text-foreground sm:text-4xl"
            >
              You May Also Like
            </h2>
            <p className="mt-3 max-w-2xl text-xs leading-5 text-muted">
              TMDB recommendations and similar titles, with shared genres and
              credited collaborators noted when available.
            </p>
            {unavailableCount > 0 && (
              <p className="mt-2 text-[10px] text-muted">
                Some collaborator details could not be loaded.
              </p>
            )}
            {recommendations.length > 0 ? (
              <div className="mt-7 flex gap-4 overflow-x-auto pb-5">
                {recommendations.slice(0, 10).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="w-[176px] shrink-0 sm:w-[204px]"
                  >
                    <MovieCard movie={candidate} />
                    <p className="mt-2 min-h-4 text-[9px] text-muted">
                      {candidate.source}
                      {candidate.reasons.length > 0 &&
                        ` · ${candidate.reasons.join(" · ")}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted">
                TMDB has no similar titles listed for this film yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </CinemaPageFrame>
  );
}
