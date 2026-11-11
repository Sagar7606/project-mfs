type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        aria-hidden="true"
        className={compact ? "h-8 w-8 shrink-0" : "h-10 w-10 shrink-0"}
        viewBox="0 0 40 40"
        fill="none"
      >
        <rect
          x="2.5"
          y="2.5"
          width="35"
          height="35"
          rx="10"
          fill="#0b0c0e"
          stroke="#eee8df"
          strokeWidth="1.5"
        />
        <path
          d="M8.5 14V8.5H14m12 0h5.5V14m0 12v5.5H26m-12 0H8.5V26"
          stroke="#eee8df"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m20 12 7 4v8l-7 4-7-4v-8l7-4Z"
          stroke="#eee8df"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M20 12v8m7-4-7 4m-7 4 7-4"
          stroke="#eee8df"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="min-w-0">
        <span
          className={`block font-bold leading-none tracking-[0.17em] text-[#f4f0e9] ${
            compact ? "text-[16px]" : "text-[19px]"
          }`}
        >
          FELLAS
        </span>
        {!compact && (
          <span className="mt-1.5 block whitespace-nowrap text-[8px] font-medium tracking-[0.14em] text-[#aaa69f]">
            Where Cinema People Belong.
          </span>
        )}
      </span>
    </div>
  );
}
