type CreatorArt = "amara" | "theo" | "priya" | "eli";

const palettes: Record<
  CreatorArt,
  {
    night: string;
    light: string;
    skin: string;
    shade: string;
    hair: string;
    coat: string;
  }
> = {
  amara: {
    night: "#11161c",
    light: "#77818a",
    skin: "#906d5d",
    shade: "#4e3b35",
    hair: "#171719",
    coat: "#292c31",
  },
  theo: {
    night: "#101419",
    light: "#737b83",
    skin: "#c28d6d",
    shade: "#805945",
    hair: "#29201c",
    coat: "#303941",
  },
  priya: {
    night: "#141417",
    light: "#827e80",
    skin: "#b97959",
    shade: "#794c3b",
    hair: "#1d1716",
    coat: "#34323a",
  },
  eli: {
    night: "#121619",
    light: "#7e8789",
    skin: "#d0a47e",
    shade: "#8a644c",
    hair: "#37302d",
    coat: "#30383a",
  },
};

export function CreatorPortrait({
  variant,
  name,
  className = "",
}: {
  variant: CreatorArt;
  name: string;
  className?: string;
}) {
  const colors = palettes[variant];

  return (
    <svg
      role="img"
      aria-label={`Illustrated portrait of ${name}`}
      className={className}
      viewBox="0 0 480 560"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`portrait-bg-${variant}`} x1="0" y1="0" x2="480" y2="560">
          <stop stopColor={colors.light} stopOpacity=".48" />
          <stop offset=".45" stopColor={colors.night} />
          <stop offset="1" stopColor="#08090B" />
        </linearGradient>
        <radialGradient id={`portrait-light-${variant}`} cx="0" cy="0" r="1" gradientTransform="matrix(0 240 -210 0 260 182)">
          <stop stopColor={colors.light} stopOpacity=".65" />
          <stop offset="1" stopColor={colors.light} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`portrait-skin-${variant}`} x1="174" y1="160" x2="292" y2="348">
          <stop stopColor={colors.skin} />
          <stop offset="1" stopColor={colors.shade} />
        </linearGradient>
        <linearGradient id={`portrait-coat-${variant}`} x1="240" y1="340" x2="240" y2="560">
          <stop stopColor={colors.coat} />
          <stop offset="1" stopColor="#111317" />
        </linearGradient>
      </defs>
      <path fill={`url(#portrait-bg-${variant})`} d="M0 0h480v560H0z" />
      <path fill={`url(#portrait-light-${variant})`} d="M0 0h480v560H0z" />
      <path stroke="#E8EAEC" strokeOpacity=".2" d="M35 0v560M445 0v560M0 476h480" />
      <path fill={`url(#portrait-coat-${variant})`} d="M60 560c17-122 71-190 154-205 13-3 27-4 40-4s27 1 40 4c83 15 137 83 154 205H60Z" />
      <path fill={colors.shade} d="M181 304h118v82c0 31-25 56-56 56h-6c-31 0-56-25-56-56v-82Z" />
      <path fill={`url(#portrait-skin-${variant})`} d="M166 204c0-63 31-104 76-104s76 41 76 104v56c0 61-33 106-76 106s-76-45-76-106v-56Z" />
      <path
        fill={colors.hair}
        d={
          variant === "theo"
            ? "M157 224c-13-86 25-145 86-145 58 0 93 47 82 133-17-7-31-22-42-43-31 28-73 42-126 43Z"
            : variant === "eli"
              ? "M159 224c-9-82 21-136 82-136 61 0 91 47 84 134-23-8-43-27-55-48-28 25-64 42-111 50Z"
              : "M155 238c-18-86 12-155 87-155 75 0 102 59 83 154-9-42-23-65-43-87-26 35-68 61-127 88Z"
        }
      />
      <path stroke="#1B1716" strokeOpacity=".48" strokeWidth="4" d="M193 236h22m48 0h22" />
      <path stroke={colors.shade} strokeWidth="3" strokeLinecap="round" d="m222 291 18 5 18-5" />
      <path stroke="#E8D8CF" strokeOpacity=".22" strokeWidth="2" d="M160 238c4 58 20 103 47 126m116-126c-4 58-20 103-47 126" />
      <path fill="#E8EAEC" fillOpacity=".08" d="M0 0h480v560H0z" />
    </svg>
  );
}
