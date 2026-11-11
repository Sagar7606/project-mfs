import Link from "next/link";
import { TmdbImage } from "./tmdb-image";

type PersonCreditCardProps = {
  id: number;
  name: string;
  detail: string;
  profilePath: string | null;
};

export function PersonCreditCard({
  id,
  name,
  detail,
  profilePath,
}: PersonCreditCardProps) {
  return (
    <Link
      href={`/people/${id}`}
      className="group flex min-w-0 items-center gap-3 border-t border-border-subtle py-3 transition-colors hover:bg-control-surface focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
    >
      <div className="relative h-[70px] w-[56px] shrink-0 overflow-hidden bg-panel">
        <TmdbImage
          path={profilePath}
          kind="profile"
          alt={`Profile photograph of ${name}`}
          sizes="56px"
        />
      </div>
      <span className="min-w-0">
        <span className="block truncate text-sm text-foreground group-hover:text-accent-foreground">
          {name}
        </span>
        <span className="mt-1 block line-clamp-2 text-[10px] leading-4 text-muted">
          {detail}
        </span>
      </span>
    </Link>
  );
}
