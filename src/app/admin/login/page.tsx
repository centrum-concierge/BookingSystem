import Image from "next/image";
import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f4faf7] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logos/icon_logo.png"
            alt="Centrum"
            width={56}
            height={56}
            className=""
          />
        </div>

        <div className="rounded-[24px] bg-white px-8 py-10 shadow-[0_8px_40px_rgba(10,109,60,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">
            Admin Access
          </p>
          <h1 className="mt-1 font-display text-2xl text-[#1e2a27]">
            Enter your PIN
          </h1>
          <p className="mt-2 text-sm text-[#4a6358]">
            This area is restricted to Centrum staff.
          </p>

          <form action={loginAction} className="mt-8 flex flex-col gap-4">
            <input
              type="password"
              name="pin"
              required
              autoFocus
              autoComplete="current-password"
              placeholder="PIN"
              className="w-full rounded-full border border-[#d4ede0] bg-[#f4faf7] px-5 py-3 text-base text-[#1e2a27] outline-none transition focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20"
            />

            {error === "invalid" && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                Incorrect PIN. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#0a6d3c] py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
            >
              Continue
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#4a6358]">
          Powered by Centrum Concierge &amp; Security Ltd.
        </p>
      </div>
    </main>
  );
}
