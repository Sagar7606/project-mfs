import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CinemaPageFrame } from "@/app/components/cinema-page-frame";
import { MovieCard } from "@/app/components/movie-card";
import {
  MoviePageLoading,
  MoviePageState,
} from "@/app/components/movie-page-state";
import { TmdbImage } from "@/app/components/tmdb-image";
import {
  TmdbConfigurationError,
  TmdbNotFoundError,
  TmdbRequestError,
} from "@/lib/tmdb/api";
import {
  getPerson,
  getPersonCredits,
} from "@/lib/tmdb/data";
import type { TmdbFilmographyEntry } from "@/lib/tmdb/types";

function getErrorMessage(error: unknown) {
  if (error instanceof TmdbConfigurationError) {
    return "Person profiles require TMDB_API_READ_ACCESS_TOKEN in the app-root .env.local file. No sample profile data is shown.";
  }
  if (error instanceof TmdbRequestError && (error.status === 401 || error.status === 403)) {
    return "TMDB rejected the configured read token. Check its local configuration.";
  }
  return "TMDB could not load this profile right now. Please try again later.";
}

function formatDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Not listed";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "Not listed";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function filmographyRole(entry: TmdbFilmographyEntry) {
  return entry.character || entry.job || entry.department || "Film credit";
}

export default function PersonPage({
  params,
}: PageProps<"/people/[id]">) {
  return (
    <Suspense
      fallback={<MoviePageLoading message="Finding this profile and filmography..." />}
    >
      <PersonPageContent params={params} />
    </Suspense>
  );
}

async function PersonPageContent({
  params,
}: {
  params: PageProps<"/people/[id]">["params"];
}) {
  const { id: rawId } = await params;
  if (!/^[1-9]\d{0,8}$/.test(rawId)) notFound();

  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) notFound();

  let person;
  let credits;
  try {
    [person, credits] = await Promise.all([
      getPerson(id),
      getPersonCredits(id),
    ]);
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound();
    return (
      <MoviePageState
        eyebrow="THE PEOPLE BEHIND THE FRAME"
        title="This profile is out of frame."
        message={getErrorMessage(error)}
      />
    );
  }

  const filmographyById = new Map<number, TmdbFilmographyEntry>();
  for (const entry of [...credits.cast, ...credits.crew]) {
    if (!filmographyById.has(entry.id)) filmographyById.set(entry.id, entry);
  }
  const filmography = [...filmographyById.values()]
    .sort((a, b) => b.release_date.localeCompare(a.release_date))
    .slice(0, 60);

  return (
    <CinemaPageFrame>
      <main className="mx-auto max-w-[1240px] px-4 py-10 sm:px-7 sm:py-14 lg:px-10">
        <section className="grid gap-8 border-b border-white/[0.12] pb-10 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden bg-[#17191c] sm:mx-0">
            <TmdbImage
              path={person.profile_path}
              kind="profile"
              alt={`Profile photograph of ${person.name}`}
              sizes="(max-width: 640px) 220px, 280px"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-end">
            <p className="text-[9px] tracking-[0.2em] text-[#85878a]">
              TMDB PERSON PROFILE
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.035em] text-[#f0efec] sm:text-5xl lg:text-6xl">
              {person.name}
            </h1>
            <p className="mt-3 text-[10px] tracking-[0.14em] text-[#aaa8a3]">
              {person.known_for_department || "Department not listed"}
            </p>
            <dl className="mt-7 grid gap-5 border-y border-white/[0.12] py-5 sm:grid-cols-2">
              <div>
                <dt className="text-[9px] tracking-[0.14em] text-[#77797c]">
                  BORN
                </dt>
                <dd className="mt-1 text-xs text-[#e3e1dc]">
                  {formatDate(person.birthday)}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] tracking-[0.14em] text-[#77797c]">
                  PLACE OF BIRTH
                </dt>
                <dd className="mt-1 text-xs text-[#e3e1dc]">
                  {person.place_of_birth || "Not listed"}
                </dd>
              </div>
            </dl>
            <section aria-labelledby="person-biography-heading" className="mt-7">
              <h2
                id="person-biography-heading"
                className="text-[9px] tracking-[0.18em] text-[#85878a]"
              >
                BIOGRAPHY
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#b1b1b1]">
                {person.biography || "TMDB does not list a biography for this person."}
              </p>
            </section>
          </div>
        </section>

        <section aria-labelledby="person-filmography-heading" className="pt-10">
          <p className="text-[9px] tracking-[0.2em] text-[#85878a]">
            SELECTED CREDITS
          </p>
          <h2
            id="person-filmography-heading"
            className="mt-2 font-serif text-3xl text-[#f0efec] sm:text-4xl"
          >
            Filmography
          </h2>
          {filmography.length > 0 ? (
            <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filmography.map((entry) => (
                <div key={entry.id} className="min-w-0">
                  <MovieCard
                    movie={{
                      id: entry.id,
                      title: entry.title,
                      original_title: entry.title,
                      overview: entry.overview,
                      poster_path: entry.poster_path,
                      backdrop_path: null,
                      release_date: entry.release_date,
                      genre_ids: entry.genre_ids,
                      vote_average: entry.vote_average,
                      vote_count: 0,
                      original_language: "",
                    }}
                    showOverview
                    layout="grid"
                  />
                  <p className="mt-2 line-clamp-2 text-[10px] text-[#85878a]">
                    {filmographyRole(entry)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 border-t border-white/[0.12] py-8 text-sm text-[#929497]">
              TMDB has no movie credits listed for this person.
            </p>
          )}
        </section>
      </main>
    </CinemaPageFrame>
  );
}
