import { ReactNode, useState } from "react";

// ====== SETTINGS ======
const TRIAL_END = new Date("2026-11-10T00:00:00+07:00"); // trial end date
const ADMIN_KEY = "maung8";              // admin bypass key
const UPGRADE_URL = "mailto:you@example.com?subject=Upgrade%20to%20Pro"; // change to your email / payment page
const APP_NAME = "Vercel";
// ======================

const STORAGE_KEY = "app_admin_bypass";

function checkAccess(): boolean {
  if (new Date() <= TRIAL_END) return true;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === ADMIN_KEY) {
      localStorage.setItem(STORAGE_KEY, ADMIN_KEY);
      params.delete("admin");
      const query = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash
      );
    }
    return localStorage.getItem(STORAGE_KEY) === ADMIN_KEY;
  } catch {
    return false;
  }
}

const features = [
  "Unlimited access to all features",
  "Priority support",
  "Continued updates and improvements",
];

export default function TrialGate({ children }: { children: ReactNode }) {
  const [allowed] = useState<boolean>(() => checkAccess());

  if (allowed) return <>{children}</>;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 text-white">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl">
          <div className="p-8">
            {/* Icon */}
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-300"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              Trial ended
            </span>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Your free trial has expired
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Access to {APP_NAME} is paused. Upgrade to Pro to restore access
              and keep using everything you rely on.
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-neutral-300">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-emerald-400"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3 rounded-b-xl border-t border-neutral-800 bg-neutral-900/50 px-8 py-4">
            <span className="text-xs text-neutral-500">Pro plan required</span>
            <a
              href={UPGRADE_URL}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-600">
          Think this is a mistake? Contact the account owner.
        </p>
      </div>
    </div>
  );
}