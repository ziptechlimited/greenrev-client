"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/apiClient";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="text-subtle text-sm">Verifying...</div>
        </main>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing token");
        return;
      }
      setStatus("loading");
      const res = await apiRequest<{ ok: boolean }>(
        "/api/v1/auth/email/verify",
        { method: "POST", body: JSON.stringify({ token }) },
        { retryOn401: false },
      );
      if (cancelled) return;
      if (res.success) {
        setStatus("ok");
        setMessage("Email verified. You can now log in.");
        router.push("/login");
      } else {
        setStatus("error");
        setMessage(res.error.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-center space-y-4">
        <h1 className="text-3xl font-display text-white">Verify Email</h1>
        <p className="text-subtle text-sm">
          {status === "loading" ? "Verifying..." : message ?? "Processing..."}
        </p>
        <Link href="/login" className="text-[10px] uppercase tracking-widest font-bold text-accent">
          Back to Login
        </Link>
      </div>
    </main>
  );
}
