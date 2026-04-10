"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function OnboardingPage() {
  const continueBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Form submission
      if (e.data?.type === "form-submitted" && e.data?.form?.slug === "diamond-registration") {
        sessionStorage.setItem("diamond_form_submitted", "true");
        if (continueBlockRef.current) {
          continueBlockRef.current.style.display = "block";
          continueBlockRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      // Dynamic resize — covers all known postMessage shapes Open Forms may send:
      //   { type: "resize", payload: { height } }  — Open Forms SDK
      //   { type: "resize", height }               — variant
      //   { height } | { iframe: { height } } | { frameHeight } — generic
      const h =
        e.data?.payload?.height ??
        e.data?.iframe?.height ??
        e.data?.height ??
        e.data?.frameHeight;
      if (h && typeof h === "number" && h > 100) {
        const iframe = document.getElementById("diamond-registration") as HTMLIFrameElement | null;
        if (iframe) iframe.style.height = Math.ceil(h) + "px";
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      {/* Header bar */}
      <div className="border-b border-[#d4ede0] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#4a6358] transition-colors hover:text-[#0a6d3c]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0a6d3c]">
            Centrum Onboarding
          </p>
          <div className="w-12" />
        </div>
      </div>

      {/* Step indicator */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a6d3c] text-xs font-bold text-white">
            1
          </span>
          <span className="text-sm font-semibold uppercase tracking-widest text-[#0a6d3c]">
            Step 1 of 2 — Building Registration
          </span>
        </div>
        <h1 className="mb-1 font-display text-3xl text-[#1e2a27] sm:text-4xl">
          Register your unit
        </h1>
        <p className="text-sm text-[#4a6358]">
          Fill out the form below to register your tenancy with Centrum.
        </p>
      </div>

      {/* Embedded form */}
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl border border-[#d4ede0] bg-white shadow-sm overflow-hidden">
          {/* scrolling="no" removes the internal scrollbar; height grows via postMessage resize */}
          <iframe
            id="diamond-registration"
            src="https://forms.resolverestoration.ca/forms/diamond-registration"
            scrolling="no"
            style={{ border: "none", width: "100%", height: "1500px", display: "block" }}
            title="Diamond Registration"
          />
        </div>
      </div>

      {/* Proceed button — hidden until form is submitted */}
      <div ref={continueBlockRef} style={{ display: "none" }} className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#0a6d3c] bg-white px-8 py-10 text-center shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef7f1]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#0a6d3c]">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0a6d3c]">Form submitted</p>
            <p className="mt-1 text-sm text-[#4a6358]">Your registration was received. Click below to continue.</p>
          </div>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-full bg-[#0a6d3c] px-10 py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow transition hover:bg-[#00a651]"
          >
            Proceed
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
