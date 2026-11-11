const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type TmdbImageKind = "poster" | "backdrop" | "profile";

const imageSizes: Record<TmdbImageKind, string> = {
  poster: "w500",
  backdrop: "w1280",
  profile: "w185",
};

export function getTmdbImageUrl(
  path: string | null | undefined,
  kind: TmdbImageKind,
) {
  if (!path || !/^\/[A-Za-z0-9._/-]+$/.test(path)) return null;
  return `${TMDB_IMAGE_BASE_URL}/${imageSizes[kind]}${path}`;
}
