import { Suspense } from "react";
import LoginPage from "./login-content";

function LoginFallback() {
  return (
    <div className="flex justify-center py-24">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPage />
    </Suspense>
  );
}
