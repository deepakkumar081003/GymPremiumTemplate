"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GymIcon } from "@/components/marketing/gym-icon";
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
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuth();
  const whatsappLink = `https://wa.me/${gymConfig.whatsappNumber.replace(/\D/g, "")}`;

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const linkClass = (href: string, mobile = false) => {
    const active = pathname === href;
    if (mobile) {
      return `flex items-center justify-between rounded-2xl border px-4 py-3.5 text-base font-medium transition ${
        active
          ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-100"
          : "border-white/15 bg-slate-900 text-slate-100 hover:border-white/25 hover:bg-slate-800"
      }`;
    }
    return `transition hover:text-white ${active ? "text-cyan-300" : "text-slate-300"}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  const mobileMenu = mounted ? (
    <div
      className={`fixed inset-0 z-[100] md:hidden ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isMenuOpen}
    >
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
        className={`absolute inset-0 bg-black/75 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
        className={`absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-white/15 bg-slate-950 shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/15 bg-slate-900 px-5 py-4">
          <p id="mobile-nav-title" className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Menu
          </p>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-800 text-white transition hover:bg-slate-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-slate-950 px-4 py-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={linkClass(item.href, true)}
            >
              {item.label}
              {pathname === item.href && (
                <span className="text-xs uppercase tracking-wider text-cyan-300">Active</span>
              )}
            </Link>
          ))}
        </div>

        <div className="space-y-3 border-t border-white/15 bg-slate-900 px-4 py-5">
          {!loading && (
            <Link
              href={user ? "/dashboard" : "/auth/login"}
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-full border border-white/25 bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {user ? "Dashboard" : "Login"}
            </Link>
          )}
          <Link
            href="/plans"
            onClick={closeMenu}
            className="flex w-full items-center justify-center rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Join Now
          </Link>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${gymConfig.phone}`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-800 px-3 py-3 text-sm text-slate-100 transition hover:bg-slate-700"
            >
              <GymIcon name="phone" className="h-4 w-4 text-cyan-300" />
              Call
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-800 px-3 py-3 text-sm text-slate-100 transition hover:bg-slate-700"
            >
              <GymIcon name="message" className="h-4 w-4 text-cyan-300" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-wide text-white" onClick={closeMenu}>
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
              id="mobile-nav-toggle"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-panel"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border-2 transition md:hidden ${
                isMenuOpen
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-100"
                  : "border-white/30 bg-slate-800 text-white hover:border-white/50 hover:bg-slate-700"
              }`}
            >
              <span className="sr-only">Menu</span>
              <span className="relative block h-5 w-5">
                <span
                  className={`absolute left-0 top-0.5 block h-[2.5px] w-5 rounded-full bg-current transition duration-300 ${
                    isMenuOpen ? "top-[9px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[9px] block h-[2.5px] w-5 rounded-full bg-current transition duration-300 ${
                    isMenuOpen ? "scale-x-0 opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[17px] block h-[2.5px] w-5 rounded-full bg-current transition duration-300 ${
                    isMenuOpen ? "top-[9px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {mounted && mobileMenu ? createPortal(mobileMenu, document.body) : null}
    </>
  );
}
