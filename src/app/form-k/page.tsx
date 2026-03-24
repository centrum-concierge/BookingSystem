
import Image from "next/image";
import Link from "next/link";
import OpenFormsEmbed from "@/components/OpenFormsEmbed";

export default async function FormKPage() {

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <header className="bg-[#0a6d3c] px-6 py-5 shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image src="/images/logos/icon_logo.png" alt="Centrum" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-[#a8d9be] sm:block">
                Centrum Concierge &amp; Security
              </p>
              <p className="text-sm font-bold text-white">Form K Submission</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#00a651]">Strata Property Act — Section 146</p>
          <h1 className="mt-2 font-display text-4xl text-[#1e2a27] md:text-5xl">Form K</h1>
          <p className="mt-3 text-base leading-7 text-[#4a6358]">
            Notice of Tenant&apos;s Responsibilities. Complete this form before or at the start of your tenancy
            in a strata lot. Your submission will be reviewed and confirmed by Centrum Concierge &amp; Security.
          </p>
          <p className="mt-2 text-sm text-[#4a6358]">
            View the official form:{" "}
            <a
              href="/documents/form-k-official.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1a5aff] underline underline-offset-2 hover:text-[#1448e0] transition-colors"
            >
              Form K — Notice of Tenant&apos;s Responsibilities (PDF)
            </a>
          </p>
        </div>

        {/* OpenForms embed */}
        <div className="mt-8">
          <OpenFormsEmbed />
        </div>
      </div>

      <footer className="mt-10 border-t border-[#d4ede0] py-6 text-center text-xs text-[#4a6358]">
        Powered by Centrum Concierge &amp; Security Ltd.
      </footer>
    </main>
  );
}
