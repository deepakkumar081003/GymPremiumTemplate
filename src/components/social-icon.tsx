type SocialPlatform = "instagram" | "facebook" | "youtube";

const iconPaths: Record<SocialPlatform, string> = {
  instagram:
    "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 12.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm5.25-9.875a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z",
  facebook: "M14 8h3V4h-3c-2.76 0-5 2.24-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13v-3c0-.55.45-1 1-1z",
  youtube:
    "M21.8 8.001a2.5 2.5 0 00-1.76-1.77C18.36 6 12 6 12 6s-6.36 0-8.04.231A2.5 2.5 0 002.2 8.001 26.3 26.3 0 002 12a26.3 26.3 0 00.2 3.999 2.5 2.5 0 001.76 1.77C5.64 18 12 18 12 18s6.36 0 8.04-.224a2.5 2.5 0 001.76-1.77C22 15.36 22 12 22 12s0-3.36-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z",
};

export function SocialIcon({
  platform,
  className = "h-5 w-5",
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={iconPaths[platform]} />
    </svg>
  );
}

export function SocialIconLink({
  href,
  platform,
  label,
}: {
  href: string;
  platform: SocialPlatform;
  label: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
    >
      <SocialIcon platform={platform} />
    </a>
  );
}
