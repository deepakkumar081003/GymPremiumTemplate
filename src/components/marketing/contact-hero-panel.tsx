import Image from "next/image";
import Link from "next/link";
import { GymIcon, type GymIconName } from "@/components/marketing/gym-icon";

type ContactDetail = {
  icon: GymIconName;
  label: string;
  value: string;
  href?: string;
};

type ContactHeroPanelProps = {
  image: string;
  imageAlt?: string;
  details: ContactDetail[];
  whatsappHref: string;
};

export function ContactHeroPanel({
  image,
  imageAlt = "Gym location",
  details,
  whatsappHref,
}: ContactHeroPanelProps) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-70"
        style={{
          background:
            "radial-gradient(circle at 25% 25%, rgba(34,211,238,0.14), transparent 50%), radial-gradient(circle at 75% 75%, rgba(99,102,241,0.12), transparent 45%)",
        }}
      />

      <div className="relative premium-card float-slow overflow-hidden rounded-3xl">
        <div className="relative aspect-[4/3] sm:aspect-[5/4]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/10" />
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          {details.map((item) => (
            <ContactDetailRow key={item.label} {...item} />
          ))}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <GymIcon name="message" className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function ContactDetailRow({ icon, label, value, href }: ContactDetail) {
  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
        <GymIcon name={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-white">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
      {content}
    </article>
  );
}

export type { ContactDetail };
