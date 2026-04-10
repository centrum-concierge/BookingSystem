import Image from "next/image";
import { conciergeLoginAction } from "./actions";

export default async function ConciergeLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f4faf7] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logos/icon_logo.png"
            alt="Centrum"
            width={56}
            height={56}
            className=""
          />
        </div>

        <div className="rounded-[24px] bg-white p-8 shadow-[0_8px_40px_rgba(10,109,60,0.1)]">
          <h1 className="mb-1 text-center font-display text-2xl text-[#1e2a27]">Concierge Access</h1>
          <p className="mb-6 text-center text-sm text-[#4a6358]">Enter your PIN to continue</p>

          {error === "invalid" && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
              Incorrect PIN. Try again.
            </div>
          )}

          <form action={conciergeLoginAction} className="flex flex-col gap-4">
            <input
              type="password"
              name="pin"
              placeholder="Enter PIN"
              autoComplete="current-password"
              className="w-full rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 text-center text-xl tracking-[0.5em] text-[#1e2a27] outline-none transition focus:border-[#0a6d3c] focus:ring-2 focus:ring-[#0a6d3c]/20"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#0a6d3c] py-3 text-sm font-semibold text-white transition hover:bg-[#00a651]"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
