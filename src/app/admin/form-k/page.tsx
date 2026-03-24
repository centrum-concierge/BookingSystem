import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/app/admin/login/actions";
import { getFormKSubmissions } from "@/lib/form-k";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#eef7f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0a6d3c]">
        Confirmed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
      Pending
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

export default async function AdminFormKListPage() {
  const submissions = await getFormKSubmissions();

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <header className="bg-[#0a6d3c] px-6 py-4 shadow-lg md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image src="/images/logos/icon_logo.png" alt="Centrum" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a8d9be]">Centrum</p>
              <p className="text-sm font-bold text-white">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
            >
              ← Buildings
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:px-10 lg:px-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#00a651]">Strata Property Act — Section 146</p>
          <h1 className="mt-2 font-display text-4xl text-[#1e2a27] md:text-5xl">Form K Submissions</h1>
        </div>

        {submissions.length === 0 ? (
          <section className="rounded-[28px] bg-white px-8 py-16 shadow-[0_8px_40px_rgba(10,109,60,0.08)]">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7f1]">
                <span className="text-3xl">📋</span>
              </div>
              <h2 className="font-display text-3xl text-[#1e2a27]">No submissions yet</h2>
              <p className="mt-3 text-base leading-7 text-[#4a6358]">
                Form K submissions from tenants will appear here.
              </p>
            </div>
          </section>
        ) : (
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#eef7f1]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.28em] text-[#4a6358]">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.28em] text-[#4a6358]">Building</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.28em] text-[#4a6358]">Unit</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.28em] text-[#4a6358]">Tenant(s)</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.28em] text-[#4a6358]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.28em] text-[#4a6358]"></th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => (
                    <tr
                      key={s.id}
                      className={i < submissions.length - 1 ? "border-b border-[#eef7f1]" : ""}
                    >
                      <td className="px-6 py-4 text-[#4a6358]">{formatDate(s.submittedAt)}</td>
                      <td className="px-6 py-4 font-medium text-[#1e2a27]">{s.buildingName}</td>
                      <td className="px-6 py-4 text-[#4a6358]">{s.unitNumber}</td>
                      <td className="px-6 py-4 text-[#4a6358]">
                        {s.tenants.map((t) => t.fullName).join(", ") || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/form-k/${s.id}`}
                          className="font-semibold text-[#0a6d3c] underline underline-offset-2 hover:text-[#00a651]"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
