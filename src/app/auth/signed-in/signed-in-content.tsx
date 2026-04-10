"use client";

import Link from "next/link";

export default function SignedInContent({
  firstName,
  email,
}: {
  firstName: string;
  email: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4faf7] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7f1]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[#0a6d3c]">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a6d3c]">
          Centrum Concierge &amp; Security
        </p>
        <h1 className="mt-2 font-display text-3xl text-[#1e2a27]">
          You&apos;re signed in, {firstName}!
        </h1>
        <p className="mt-3 text-sm text-[#4a6358]">
          Signed in as <span className="font-semibold">{email}</span>
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a6d3c] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow transition hover:bg-[#00a651]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
