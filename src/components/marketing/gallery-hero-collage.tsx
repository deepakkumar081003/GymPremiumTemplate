import Image from "next/image";

type GalleryHeroCollageProps = {
  images: string[];
};

export function GalleryHeroCollage({ images }: GalleryHeroCollageProps) {
  const [primary, secondary, tertiary, wide] = images;

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-70"
        style={{
          background:
            "radial-gradient(circle at 25% 25%, rgba(34,211,238,0.14), transparent 50%), radial-gradient(circle at 75% 75%, rgba(99,102,241,0.12), transparent 45%)",
        }}
      />

      <div className="relative grid grid-cols-2 gap-3 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[155px]">
        <CollageTile src={primary} alt="Gym training floor" className="row-span-2" priority />
        <CollageTile src={secondary} alt="Strength training area" />
        <CollageTile src={tertiary} alt="Cardio and conditioning zone" />
        {wide && (
          <CollageTile
            src={wide}
            alt="Premium gym atmosphere"
            className="col-span-2 h-[120px] sm:h-[140px] md:h-[155px]"
          />
        )}
      </div>
    </div>
  );
}

function CollageTile({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article
      className={`premium-card group relative overflow-hidden rounded-2xl ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
    </article>
  );
}
