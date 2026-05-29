import { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-16 md:py-24">
        {children}
      </div>
    </PageShell>
  );
}
