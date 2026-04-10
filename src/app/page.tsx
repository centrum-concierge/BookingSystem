"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Preload hint for the background video */}
      <link rel="preload" as="video" href="/videos/home_video.mp4" type="video/mp4" />
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/home_video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(11,30,20,0.55)]" />

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
        {/* Logo / wordmark */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#a8d5bc]">
          Centrum Concierge &amp; Security
        </p>

        <h1 className="mb-6 font-display text-5xl font-normal leading-tight sm:text-6xl lg:text-7xl">
          Welcome to Centrum
        </h1>

        <p className="mb-10 max-w-md text-base text-[#d0e8da] sm:text-lg">
          Your all-in-one resident portal for building registration and services.
        </p>

        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-full bg-[#0a6d3c] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition-all duration-200 hover:bg-[#00a651] hover:shadow-xl"
        >
          Begin Onboarding
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>

        <Link
          href="/auth/login"
          className="mt-4 text-sm text-[#a8d5bc] underline underline-offset-4 transition-colors duration-200 hover:text-white"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
