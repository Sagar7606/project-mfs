import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function CinemaPageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border-subtle bg-background">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-5 px-4 sm:px-7 lg:px-10">
          <Link href="/" aria-label="FELLAS home" className="shrink-0">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/#movies"
              className="border-b border-border pb-1 text-[10px] text-secondary transition hover:border-accent-hover hover:text-accent-foreground"
            >
              Discover films
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-4 px-4 py-7 text-[9px] tracking-[0.12em] text-muted sm:px-7 lg:px-10">
          <span>FELLAS · WHERE CINEMA PEOPLE BELONG.</span>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-border underline-offset-4 hover:text-accent-foreground"
          >
            Movie data provided by TMDB
          </a>
        </div>
      </footer>
    </div>
  );
}
