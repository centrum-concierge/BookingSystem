import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormKSubmissionById } from "@/lib/form-k";
import PrintButton from "./print-button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

function SignatureLine({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-12 border-b border-[#1e2a27]" />
      <span className="text-xs text-[#1e2a27]">{label}</span>
      {sub && <span className="text-xs text-[#4a6358]">{sub}</span>}
    </div>
  );
}

export default async function FormKViewPage({ params }: Props) {
  const { id } = await params;
  const s = await getFormKSubmissionById(id);
  if (!s) notFound();

  const address = [s.landlordNoticeAddressLine1, s.landlordNoticeAddressLine2].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-[#f4faf7] print:bg-white">
      {/* Screen-only nav bar */}
      <div className="flex items-center justify-between gap-4 border-b border-[#d4ede0] bg-white px-6 py-4 print:hidden">
        <Link
          href={`/admin/form-k/${id}`}
          className="text-sm font-semibold text-[#0a6d3c] underline underline-offset-2 hover:text-[#00a651]"
        >
          ← Back to submission
        </Link>
        <PrintButton />
      </div>

      {/* Form K Document */}
      <div className="mx-auto max-w-2xl px-6 py-12 print:px-0 print:py-6 md:px-10">
        <div className="rounded-[24px] bg-white px-10 py-12 shadow-[0_4px_40px_rgba(0,0,0,0.08)] print:rounded-none print:shadow-none">

          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4a6358]">Strata Property Act</p>
            <h1 className="mt-1 font-display text-3xl text-[#1e2a27]">Form K</h1>
            <h2 className="mt-1 text-base font-semibold text-[#1e2a27]">Notice of Tenant&apos;s Responsibilities</h2>
            <p className="mt-0.5 text-xs text-[#4a6358]">(Section 146)</p>
          </div>

          {/* Re: line */}
          <div className="mb-8 border-b border-[#eef7f1] pb-6">
            <p className="text-sm leading-7 text-[#1e2a27]">
              <strong>Re:</strong> Strata Lot {s.strataLotNumber} of Strata Plan {s.strataPlanNumber}
              {s.unitNumber ? `  ·  Unit # ${s.unitNumber}` : ""}
            </p>
            <p className="text-sm leading-7 text-[#1e2a27]">
              <strong>Street Address of Strata Lot:</strong> {s.buildingName}
            </p>
            <div className="text-sm leading-7 text-[#1e2a27]">
              <strong>Name(s) of Tenant(s):</strong>
              {s.tenants.length === 0 ? " —" : (
                <span className="ml-1">{s.tenants.map((t) => t.fullName).join("  /  ")}</span>
              )}
            </div>
            <p className="text-sm leading-7 text-[#1e2a27]">
              <strong>Tenant&apos;s Email:</strong> {s.tenants[0]?.email || "—"}
            </p>
            <p className="text-sm leading-7 text-[#1e2a27]">
              <strong>Tenant&apos;s Phone:</strong>{" "}
              {s.tenants[0]?.phoneCell ? `${s.tenants[0].phoneCell} (cell)` : ""}{" "}
              {s.tenants[0]?.phoneWork ? `${s.tenants[0].phoneWork} (work)` : ""}
              {!s.tenants[0]?.phoneCell && !s.tenants[0]?.phoneWork ? "—" : ""}
            </p>
            <p className="text-sm leading-7 text-[#1e2a27]">
              <strong>Tenancy Commencing:</strong> {formatDate(s.tenancyStartDate)}
            </p>
          </div>

          {/* Notice body */}
          <div className="mb-8 border-b border-[#eef7f1] pb-8">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1e2a27]">
              Important Notice to Tenants
            </p>
            <ol className="flex flex-col gap-4 text-sm leading-7 text-[#1e2a27]">
              <li className="flex gap-3">
                <span className="mt-0.5 font-bold">1.</span>
                <span>
                  Under the <em>Strata Property Act</em>, you must comply with the bylaws and rules of the
                  strata corporation as they are in force from time to time.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 font-bold">2.</span>
                <span>
                  If the strata corporation amends its bylaws or rules, you must comply with the bylaws
                  or rules as amended.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 font-bold">3.</span>
                <span>
                  If you, another occupant of the strata lot, or a visitor contravenes a bylaw or rule,
                  you may be fined, denied the use of a recreational facility, or required to pay the
                  costs of remedying the contravention.
                </span>
              </li>
            </ol>
          </div>

          {/* Date and signatures */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <div className="h-12 border-b border-[#1e2a27]">
                <span className="text-sm text-[#4a6358]">{formatDate(s.submittedAt)}</span>
              </div>
              <span className="text-xs text-[#1e2a27]">Date</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <SignatureLine
                label="Signature of Landlord, or Agent of Landlord"
                sub={s.landlordName || undefined}
              />
              <div className="flex flex-col gap-1">
                <div className="min-h-12 border-b border-[#1e2a27]">
                  <span className="whitespace-pre-line text-sm text-[#4a6358]">{address}</span>
                </div>
                <span className="text-xs text-[#1e2a27]">Address of landlord, or agent of landlord</span>
              </div>
            </div>

            {s.tenants.map((t, i) => (
              <SignatureLine
                key={t.id}
                label={`Signature of Tenant${s.tenants.length > 1 ? ` ${i + 1}` : ""}`}
                sub={t.fullName}
              />
            ))}
            {s.tenants.length === 0 && (
              <>
                <SignatureLine label="Signature of Tenant" />
                <SignatureLine label="Signature of Tenant" />
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-10 border-t border-[#eef7f1] pt-6 text-xs text-[#4a6358]">
            <p>
              <em>Note:</em> The landlord must attach to this notice a copy of the current bylaws and rules
              of the strata corporation (Strata Property Regulation, B.C. Reg. 43/2000).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
