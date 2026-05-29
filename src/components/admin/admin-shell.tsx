"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

function isNavActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  if (pathname === href) return true;
  // Avoid matching /admin/members when on /admin/memberships
  if (href === "/admin/members") {
    return pathname.startsWith("/admin/members/");
  }
  return pathname.startsWith(`${href}/`);
}

const navItems = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/memberships", label: "Plans" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await signOut();
    if (!error) router.push("/");
    setLoggingOut(false);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-slate-400 transition hover:text-white">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-bold">Admin Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/5 disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 pb-3">
          <div className="flex gap-2">
            {navItems.map((item) => {
              const active = isNavActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-cyan-400/15 text-cyan-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
