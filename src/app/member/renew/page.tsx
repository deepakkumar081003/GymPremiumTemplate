import { Suspense } from "react";
import MemberRenewContent from "./renew-content";

function RenewFallback() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="premium-card h-64 animate-pulse rounded-3xl" />
      ))}
    </div>
  );
}

export default function MemberRenewPage() {
  return (
    <Suspense fallback={<RenewFallback />}>
      <MemberRenewContent />
    </Suspense>
  );
}
