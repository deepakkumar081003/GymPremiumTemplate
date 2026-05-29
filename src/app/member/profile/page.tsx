import { Suspense } from "react";
import MemberProfileContent from "./profile-content";

export default function MemberProfilePage() {
  return (
    <Suspense fallback={<div className="premium-card h-64 animate-pulse rounded-3xl" />}>
      <MemberProfileContent />
    </Suspense>
  );
}
