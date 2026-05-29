import Link from "next/link";
import { GymIcon, type GymIconName } from "@/components/marketing/gym-icon";

type SocialLinks = {
  instagram: string;
  facebook: string;
  youtube: string;
};

type ContactInfoPanelProps = {
  address: string;
  phone: string;
  email: string;
  businessHours: string[];
  whatsappHref: string;
  socialLinks: SocialLinks;
};

export function ContactInfoPanel({
  address,
  phone,
  email,
  businessHours,
  whatsappHref,
  socialLinks,
}: ContactInfoPanelProps) {
  return (
    <div className="premium-card rounded-3xl p-6 md:p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Direct Contact</p>
      <h2 className="mt-3 text-2xl font-semibold">Reach Our Team</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Call, message, or visit — we respond quickly during business hours.
      </p>

      <div className="mt-6 space-y-4">
        <InfoRow icon="map-pin" label="Address" value={address} />
        <InfoRow icon="phone" label="Phone" value={phone} href={`tel:${phone.replace(/\s/g, "")}`} />
        <InfoRow icon="mail" label="Email" value={email} href={`mailto:${email}`} />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
            <GymIcon name="clock" className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-white">Business Hours</p>
        </div>
        <ul className="mt-3 space-y-2">
          {businessHours.map((hour) => (
            <li key={hour} className="text-sm text-slate-300">
              {hour}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          <GymIcon name="message" className="h-4 w-4" />
          WhatsApp
        </a>
        {socialLinks.instagram && (
          <SocialPill href={socialLinks.instagram} label="Instagram" />
        )}
        {socialLinks.facebook && <SocialPill href={socialLinks.facebook} label="Facebook" />}
        {socialLinks.youtube && <SocialPill href={socialLinks.youtube} label="YouTube" />}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: GymIconName;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300">
        <GymIcon name={icon} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
        <p className="mt-1 text-sm text-slate-200">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl border border-transparent p-1 transition hover:border-cyan-400/20 hover:bg-white/[0.03]"
      >
        {inner}
      </Link>
    );
  }

  return <div className="p-1">{inner}</div>;
}

function SocialPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/5"
    >
      {label}
    </a>
  );
}
