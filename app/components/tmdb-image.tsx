"use client";

import Image from "next/image";
import { useState } from "react";
import { getTmdbImageUrl, type TmdbImageKind } from "@/lib/tmdb/images";

type TmdbImageProps = {
  path: string | null | undefined;
  kind: TmdbImageKind;
  alt: string;
  sizes: string;
  className?: string;
};

export function TmdbImage({
  path,
  kind,
  alt,
  sizes,
  className = "",
}: TmdbImageProps) {
  const [failed, setFailed] = useState(false);
  const src = getTmdbImageUrl(path, kind);

  if (!src || failed) {
    return (
      <div
        aria-label={alt}
        role="img"
        className={`flex h-full w-full items-center justify-center bg-[#17191c] px-4 text-center text-[10px] tracking-[0.12em] text-[#74777a] ${className}`}
      >
        IMAGE UNAVAILABLE
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
