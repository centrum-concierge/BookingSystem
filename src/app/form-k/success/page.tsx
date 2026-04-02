import Image from "next/image";
import Link from "next/link";

export default function FormKSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f4faf7] px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Image src="/images/logos/icon_logo.png" alt="Centrum" width={56} height={56} className="object-contain" />
        </div>

        <div className="rounded-[24px] bg-white px-8 py-10 shadow-[0_8px_40px_rgba(10,109,60,0.12)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7f1]">
            <svg className="h-7 w-7 text-[#0a6d3c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Submitted</p>
          <h1 className="mt-1 font-display text-2xl text-[#1e2a27]">Form K Received</h1>
          <p className="mt-3 text-sm leading-7 text-[#4a6358]">
            Your Form K has been submitted successfully. Centrum Concierge &amp; Security will review it and
            confirm your submission. You will be contacted if anything further is required.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-[#0a6d3c] px-8 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-[#4a6358]">Powered by Centrum Concierge &amp; Security Ltd.</p>
      </div>
    </main>
  );
}
