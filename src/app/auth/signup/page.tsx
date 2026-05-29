import { Suspense } from "react";
import SignUpContent from "./signup-content";

function SignUpFallback() {
  return (
    <div className="flex justify-center py-24">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpFallback />}>
      <SignUpContent />
    </Suspense>
  );
}
