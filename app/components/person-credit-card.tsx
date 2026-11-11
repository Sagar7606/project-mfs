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
      className="group flex min-w-0 items-center gap-3 border-t border-white/[0.1] py-3 transition-colors hover:bg-white/[0.025] focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
    >
      <div className="relative h-[70px] w-[56px] shrink-0 overflow-hidden bg-[#17191c]">
        <TmdbImage
          path={profilePath}
          kind="profile"
          alt={`Profile photograph of ${name}`}
          sizes="56px"
        />
      </div>
      <span className="min-w-0">
        <span className="block truncate text-sm text-[#e9e7e2] group-hover:text-white">
          {name}
        </span>
        <span className="mt-1 block line-clamp-2 text-[10px] leading-4 text-[#85878a]">
          {detail}
        </span>
      </span>
    </Link>
  );
}
