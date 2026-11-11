# FELLAS

**Where Cinema People Belong.**

Meet. Create. Collaborate. FELLAS is a home for filmmakers, film students,
and cinema enthusiasts to learn, share ideas, and make things together.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available scripts

- `npm run dev` — start the development server
- `npm run lint` — run ESLint
- `npm run build` — create a production build
- `npm run start` — serve the production build

FELLAS is built with Next.js, React, TypeScript, and Tailwind CSS.

## Supabase connection

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in
`.env.local` at the project root. Use a Supabase publishable key (`sb_publishable_…`);
never put a secret or service-role key in a `NEXT_PUBLIC_` variable. `.env.local`
is ignored by Git.

The browser and server clients are available from `lib/supabase/client.ts` and
`lib/supabase/server.ts`. Next.js 16's root `proxy.ts` refreshes auth cookies.
After configuring the environment, request `/api/supabase/health` to check the
Supabase Auth endpoint. It performs no database reads or writes and returns only
a generic connection status.

## TMDB movie discovery

Set `TMDB_API_READ_ACCESS_TOKEN` in the app-root `.env.local` file. This token is
read only by the server-side TMDB utility and must not use a `NEXT_PUBLIC_`
variable. If it is missing or rejected, movie discovery shows an explicit
configuration error rather than sample titles.

The homepage movie section uses the `/api/movies/discover`,
`/api/movies/search`, and `/api/movies/recommendations` route handlers. Its
recommendation rail is based on the first trending film, not personalized user
preferences. Movie and person pages fetch TMDB data on the server at
`/movies/[id]` and `/people/[id]`. TMDB responses are runtime validated and
cached by endpoint; title searches and movie rails are paginated. Image URLs
use TMDB's poster, backdrop, and profile size paths.

Advanced filters are not enabled yet. TMDB Discover can directly filter by
genres, cast/crew/person IDs, original language, country, release-date ranges,
and keyword IDs. TMDB supports comma-separated AND and pipe-separated OR for
supported multi-value parameters. Role-specific matches for several directors,
screenwriters, cinematographers, editors, or composers require retrieving movie
credits because the API does not expose a distinct filter for every crew job.
Arbitrary nested AND/OR groups across genres, people, roles, and keywords will
need server-side filtering and merging. The homepage only previews planned
filter dimensions; no filter controls are active yet.
