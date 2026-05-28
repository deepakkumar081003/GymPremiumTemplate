"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { gymConfig } from "@/config/gym-config";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/plans", label: "Plans" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const whatsappLink = `https://wa.me/${gymConfig.whatsappNumber.replace(/\D/g, "")}`;

  const linkClass = (href: string) =>
    `transition hover:text-white ${pathname === href ? "text-cyan-300" : "text-slate-300"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          {gymConfig.gymName}
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!loading && (
            <Link
              href={user ? "/dashboard" : "/auth/login"}
              className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40 hover:text-white sm:inline-flex"
            >
              {user ? "Dashboard" : "Login"}
            </Link>
          )}
          <Link
            href="/plans"
            className="hidden rounded-full border border-cyan-400/70 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-200 sm:inline-flex"
          >
            Join Now
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex rounded-full border border-white/20 p-2 text-slate-200 transition hover:bg-white/10 md:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
              {isMenuOpen ? (
                <path strokeLinecap="round" d="M6 6L18 18M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={linkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
            {!loading && (
              <Link
                href={user ? "/dashboard" : "/auth/login"}
                onClick={() => setIsMenuOpen(false)}
                className="text-cyan-300"
              >
                {user ? "Dashboard" : "Login"}
              </Link>
            )}
            <a href={`tel:${gymConfig.phone}`} className="text-slate-300">
              Call: {gymConfig.phone}
            </a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-slate-300">
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
