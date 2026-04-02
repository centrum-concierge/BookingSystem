"use client";

import Image from "next/image";
import { useEffect } from "react";

function DiamondRegistrationForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://forms.resolverestoration.ca/widgets/iframe.min.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).initEmbed) {
        (window as any).initEmbed("diamond-registration", { autoResize: true });
      }
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <iframe
      style={{ border: "none", width: "100%", minHeight: "700px" }}
      id="diamond-registration"
      src="https://forms.resolverestoration.ca/forms/diamond-registration"
      title="Tenant Registration"
      allowFullScreen
    />
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#f4faf7]">
      {/* Header */}
      <header className="bg-[#0a6d3c] px-6 py-5 shadow-lg">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <Image
              src="/images/logos/icon_logo.png"
              alt="Centrum"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a8d9be]">Centrum</p>
            <p className="text-sm font-bold text-white">Concierge & Security</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12 md:px-10">
        {/* Intro */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#00a651]">Welcome</p>
          <h1 className="mt-2 font-display text-4xl text-[#1e2a27] md:text-5xl">
            Resident Registration
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#4a6358]">
            Please complete the form below to register as a resident. This helps us verify your building, suite, and contact information so you can access all Centrum services.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-[24px] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(10,109,60,0.1)] md:px-10 md:py-10">
          <DiamondRegistrationForm />
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-[#4a6358]">
          Already registered? Contact your building concierge for assistance.
        </p>
      </div>
    </main>
  );
}
