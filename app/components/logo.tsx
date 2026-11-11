import Image from "next/image";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex min-w-0 flex-col items-start">
      <Image
        src="/fellas-logo.png"
        alt="FELLAS@"
        width={900}
        height={280}
        sizes={compact ? "110px" : "154px"}
        className={`rounded-sm object-contain ${
          compact ? "h-[34px] w-[110px]" : "h-[48px] w-[154px]"
        }`}
      />
      {!compact && (
        <span className="mt-0.5 block whitespace-nowrap text-[8px] font-medium tracking-[0.14em] text-secondary">
          Where Cinema People Belong.
        </span>
      )}
    </div>
  );
}
