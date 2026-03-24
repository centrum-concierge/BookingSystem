import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { logoutAction } from "@/app/admin/login/actions";
import { approveFormKAction } from "@/app/admin/form-k/actions";
import { getFormKSubmissionById } from "@/lib/form-k";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-[#eef7f1] py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="w-52 shrink-0 text-xs font-semibold uppercase tracking-[0.26em] text-[#4a6358]">{label}</span>
      <span className="text-sm text-[#1e2a27]">{value}</span>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

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

export default async function AdminFormKDetailPage({ params }: Props) {
  const { id } = await params;
  const submission = await getFormKSubmissionById(id);
  if (!submission) notFound();

  const address = [submission.landlordNoticeAddressLine1, submission.landlordNoticeAddressLine2]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <header className="bg-[#0a6d3c] px-6 py-4 shadow-lg md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
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
              href="/admin/form-k"
              className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
            >
              ← Form K
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

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 md:px-10">
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#00a651]">Form K Submission</p>
            <h1 className="mt-2 font-display text-4xl text-[#1e2a27] md:text-5xl">
              Unit {submission.unitNumber}
            </h1>
            <p className="mt-1 text-sm text-[#4a6358]">
              {submission.buildingName} · Submitted {formatDate(submission.submittedAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={submission.status} />
            {submission.status === "pending" && (
              <form action={approveFormKAction}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="rounded-full bg-[#0a6d3c] px-6 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
                >
                  Approve
                </button>
              </form>
            )}
            <Link
              href={`/admin/form-k/${id}/view`}
              className="rounded-full bg-[#1a5aff] px-6 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#1448e0]"
            >
              View K Form
            </Link>
          </div>
        </div>

        {/* Property details */}
        <section className="rounded-[24px] bg-white px-6 py-7 shadow-[0_4px_24px_rgba(10,109,60,0.08)] md:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Property</p>
          <Row label="Building" value={submission.buildingName} />
          <Row label="Strata Plan" value={submission.strataPlanNumber} />
          <Row label="Strata Lot" value={submission.strataLotNumber} />
          <Row label="Unit Number" value={submission.unitNumber} />
          <Row label="Tenancy Start Date" value={formatDate(submission.tenancyStartDate)} />
        </section>

        {/* Landlord details */}
        <section className="rounded-[24px] bg-white px-6 py-7 shadow-[0_4px_24px_rgba(10,109,60,0.08)] md:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Landlord / Owner</p>
          <Row label="Name" value={submission.landlordName} />
          <Row label="Contact Number" value={submission.landlordContactNumber} />
          <Row label="Notice Address" value={address} />
        </section>

        {/* Tenants */}
        <section className="rounded-[24px] bg-white px-6 py-7 shadow-[0_4px_24px_rgba(10,109,60,0.08)] md:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">
            Tenant{submission.tenants.length !== 1 ? "s" : ""}
          </p>
          {submission.tenants.length === 0 ? (
            <p className="text-sm text-[#4a6358]">No tenant information recorded.</p>
          ) : (
            <div className="flex flex-col gap-8">
              {submission.tenants.map((t, i) => (
                <div key={t.id}>
                  {submission.tenants.length > 1 && (
                    <p className="mb-3 text-xs font-semibold text-[#1e2a27]">Tenant {i + 1}</p>
                  )}
                  <Row label="Full Name" value={t.fullName} />
                  <Row label="Email" value={t.email} />
                  <Row label="Cell Phone" value={t.phoneCell} />
                  <Row label="Work Phone" value={t.phoneWork} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
