"use client";

import { useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [storageError, setStorageError] = useState(false);

  function toggleTheme() {
    const nextTheme: Theme =
      document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;

    try {
      localStorage.setItem("fellas-theme", nextTheme);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }

  }

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-9 shrink-0 items-center gap-2 border border-border px-2.5 text-[10px] tracking-[0.08em] text-accent-foreground transition-colors hover:border-accent-hover hover:text-accent-foreground"
      >
        <svg
          aria-hidden="true"
          className="theme-dark-icon h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
        </svg>
        <svg
          aria-hidden="true"
          className="theme-light-icon h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
        <span className="theme-dark-label">Dark</span>
        <span className="theme-light-label">Light</span>
        <span className="sr-only theme-action-light">Switch to light mode</span>
        <span className="sr-only theme-action-dark">Switch to dark mode</span>
      </button>
      {storageError && (
        <span role="status" className="sr-only">
          The theme changed, but this browser could not save your preference.
        </span>
      )}
    </>
  );
}
