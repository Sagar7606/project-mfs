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
        <p className="text-[9px] tracking-[0.2em] text-muted">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
          {title}
        </h1>
        <p role="status" className="mt-5 max-w-xl text-sm leading-6 text-secondary">
          {message}
        </p>
        <Link
          href="/#movies"
          className="mt-8 w-fit border-b border-border pb-1.5 text-xs text-foreground hover:border-accent-hover hover:text-accent-foreground"
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
        <p role="status" className="text-sm text-secondary">
          {message}
        </p>
      </main>
    </CinemaPageFrame>
  );
}
