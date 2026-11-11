import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./logo";

export function CinemaPageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#eeece8]">
      <header className="border-b border-white/[0.08] bg-[#0b0c0e]">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-5 px-4 sm:px-7 lg:px-10">
          <Link href="/" aria-label="FELLAS home" className="shrink-0">
            <Logo />
          </Link>
          <Link
            href="/#movies"
            className="border-b border-white/30 pb-1 text-[10px] text-[#d3d1cd] transition hover:border-white hover:text-white"
          >
            Discover films
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/[0.1]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-4 px-4 py-7 text-[9px] tracking-[0.12em] text-[#85878a] sm:px-7 lg:px-10">
          <span>FELLAS · WHERE CINEMA PEOPLE BELONG.</span>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/20 underline-offset-4 hover:text-white"
          >
            Movie data provided by TMDB
          </a>
        </div>
      </footer>
    </div>
  );
}
