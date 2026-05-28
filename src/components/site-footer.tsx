import { gymConfig } from "@/config/gym-config";

export function SiteFooter() {
  const whatsappLink = `https://wa.me/${gymConfig.whatsappNumber.replace(/\D/g, "")}`;

  return (
    <footer className="border-t border-white/10 bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 border-b border-white/10 pb-8 md:grid-cols-4">
          <div>
            <p className="font-semibold text-white">{gymConfig.gymName}</p>
            <p className="mt-2 text-sm text-slate-300">Built for premium transformations.</p>
          </div>
          <div className="text-sm text-slate-300">
            <p className="mb-2 font-medium text-slate-100">Quick Contact</p>
            <a href={`tel:${gymConfig.phone}`} className="block transition hover:text-cyan-300">
              {gymConfig.phone}
            </a>
            <a href={`mailto:${gymConfig.contactEmail}`} className="mt-1 block transition hover:text-cyan-300">
              {gymConfig.contactEmail}
            </a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-1 block transition hover:text-cyan-300">
              WhatsApp Quick Chat
            </a>
          </div>
          <div className="text-sm text-slate-300">
            <p className="mb-2 font-medium text-slate-100">Address & Hours</p>
            <p>{gymConfig.address}</p>
            <div className="mt-2 space-y-1">
              {gymConfig.businessHours.map((hour) => (
                <p key={hour}>{hour}</p>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-300">
            <p className="mb-2 font-medium text-slate-100">Social Links</p>
            <a href={gymConfig.socialLinks.instagram} target="_blank" rel="noreferrer" className="block transition hover:text-cyan-300">
              Instagram
            </a>
            <a href={gymConfig.socialLinks.facebook} target="_blank" rel="noreferrer" className="mt-1 block transition hover:text-cyan-300">
              Facebook
            </a>
            <a href={gymConfig.socialLinks.youtube} target="_blank" rel="noreferrer" className="mt-1 block transition hover:text-cyan-300">
              YouTube
            </a>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 pt-5 text-sm text-slate-400 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {gymConfig.gymName}. All rights reserved.</p>
          <a
            href="https://www.thuliedu.in"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-cyan-300"
          >
            Built by THULI
          </a>
        </div>
      </div>
    </footer>
  );
}
