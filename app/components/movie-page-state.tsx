import Link from "next/link";
import { CinemaPageFrame } from "./cinema-page-frame";

export function MoviePageState({
  eyebrow = "THE MOVIE ARCHIVE",
  title,
  message,
}: {
  eyebrow?: string;
  title: string;
  message: string;
}) {
  return (
    <CinemaPageFrame>
      <main className="mx-auto flex min-h-[65vh] max-w-[900px] flex-col justify-center px-4 py-20 sm:px-7 lg:px-10">
        <p className="text-[9px] tracking-[0.2em] text-[#85878a]">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl text-[#efede9] sm:text-5xl">
          {title}
        </h1>
        <p role="status" className="mt-5 max-w-xl text-sm leading-6 text-[#a2a3a5]">
          {message}
        </p>
        <Link
          href="/#movies"
          className="mt-8 w-fit border-b border-white/35 pb-1.5 text-xs text-[#e2e0dc] hover:border-white hover:text-white"
        >
          Return to film discovery
        </Link>
      </main>
    </CinemaPageFrame>
  );
}

export function MoviePageLoading({ message }: { message: string }) {
  return (
    <CinemaPageFrame>
      <main className="mx-auto flex min-h-[65vh] max-w-[900px] flex-col justify-center px-4 py-20 sm:px-7 lg:px-10">
        <p role="status" className="text-sm text-[#a2a3a5]">
          {message}
        </p>
      </main>
    </CinemaPageFrame>
  );
}
