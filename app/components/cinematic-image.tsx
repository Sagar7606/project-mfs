import Image from "next/image";

type CinematicImageProps = {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  preload?: boolean;
};

export function CinematicImage({
  src,
  alt,
  className = "",
  objectPosition = "center",
  preload = false,
}: CinematicImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      preload={preload}
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
      className={`object-cover ${className}`}
      style={{ objectPosition }}
    />
  );
}
