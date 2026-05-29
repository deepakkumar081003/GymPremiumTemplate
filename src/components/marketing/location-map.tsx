type LocationMapProps = {
  latitude: number;
  longitude: number;
  zoom?: number;
  label: string;
  address?: string;
};

function buildEmbedUrl(latitude: number, longitude: number, zoom: number) {
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&hl=en&output=embed`;
}

function buildDirectionsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

export function LocationMap({
  latitude,
  longitude,
  zoom = 14,
  label,
  address,
}: LocationMapProps) {
  const embedUrl = buildEmbedUrl(latitude, longitude, zoom);
  const directionsUrl = buildDirectionsUrl(latitude, longitude);

  return (
    <div className="premium-card overflow-hidden rounded-3xl border border-white/10">
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <iframe
          title={`Map showing ${label}`}
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0 grayscale-[20%] invert-[92%] contrast-[90%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-slate-950/60 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Pinned Location</p>
          <p className="mt-1 text-sm font-semibold text-white">{label}</p>
          {address && <p className="mt-1 text-sm text-slate-400">{address}</p>}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/5"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}

export type { LocationMapProps };
