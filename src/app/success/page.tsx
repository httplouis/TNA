import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#60a5fa] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
