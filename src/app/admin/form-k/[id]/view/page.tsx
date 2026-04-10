import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormKSubmissionById } from "@/lib/form-k";
import PrintButton from "./print-button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

function isUrl(val?: string): boolean {
  return !!val && (val.startsWith("http://") || val.startsWith("https://"));
}

function SignatureLine({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="min-h-14 rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 print:rounded-none print:border-0 print:border-b print:border-[#1e2a27] print:bg-transparent">
        {isUrl(value) ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0a6d3c] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#00a651] print:hidden"
          >
            View Signature
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
              <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
              <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
            </svg>
          </a>
        ) : (
          value && <span className="text-sm text-[#4a6358]">{value}</span>
        )}
      </div>
      <span className="text-xs font-medium text-[#4a6358]">{label}</span>
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
      <div className="mx-auto max-w-2xl px-4 py-10 print:px-0 print:py-6 sm:px-6 md:px-10">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_8px_48px_rgba(10,109,60,0.12)] print:rounded-none print:shadow-none">

          {/* Status banner */}
          <div className={`px-10 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] print:hidden ${
            s.status === "confirmed"
              ? "bg-[#eef7f1] text-[#0a6d3c]"
              : "bg-amber-50 text-amber-600"
          }`}>
            {s.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending Review"}
          </div>

          <div className="px-8 py-10 sm:px-12">
            {/* Header */}
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4a6358]">Strata Property Act</p>
              <h1 className="mt-2 font-display text-4xl text-[#1e2a27]">Form K</h1>
              <h2 className="mt-1 text-base font-semibold text-[#1e2a27]">Notice of Tenant&apos;s Responsibilities</h2>
              <p className="mt-1 text-xs text-[#4a6358]">(Section 146)</p>
            </div>

            {/* Info grid */}
            <div className="mb-8 grid gap-3 rounded-2xl bg-[#f4faf7] p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Re</p>
                <p className="mt-0.5 text-sm font-semibold text-[#1e2a27]">
                  Strata Lot {s.strataLotNumber} of Strata Plan {s.strataPlanNumber}
                  {s.unitNumber ? ` · Unit ${s.unitNumber}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Street Address</p>
                <p className="mt-0.5 text-sm text-[#1e2a27]">{s.buildingName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Tenant(s)</p>
                <p className="mt-0.5 text-sm text-[#1e2a27]">
                   {s.tenants.length === 0 ? "—" : s.tenants.map((t) => t.fullName).join(" / ")}
               </p>
              </div>
              {s.tenants[0]?.email && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Email</p>
                  <p className="mt-0.5 text-sm text-[#1e2a27]">{s.tenants[0].email}</p>
                </div>
              )}
              {(s.tenants[0]?.phoneCell || s.tenants[0]?.phoneWork) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Phone</p>
                  <p className="mt-0.5 text-sm text-[#1e2a27]">
                    {s.tenants[0]?.phoneCell ? `${s.tenants[0].phoneCell} (cell)` : ""}
                    {s.tenants[0]?.phoneWork ? ` ${s.tenants[0].phoneWork} (work)` : ""}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Tenancy Commencing</p>
                <p className="mt-0.5 text-sm font-semibold text-[#1e2a27]">{formatDate(s.tenancyStartDate)}</p>
              </div>
            </div>

            {/* Notice body */}
            <div className="mb-8 border-b border-[#eef7f1] pb-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#1e2a27]">Important Notice to Tenants</p>
              <ol className="flex flex-col gap-4 text-sm leading-7 text-[#1e2a27]">
                <li className="flex gap-3">
                  <span className="mt-0.5 font-bold">1.</span>
                  <span>Under the <em>Strata Property Act</em>, you must comply with the bylaws and rules of the strata corporation as they are in force from time to time.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 font-bold">2.</span>
                  <span>If the strata corporation amends its bylaws or rules, you must comply with the bylaws or rules as amended.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 font-bold">3.</span>
                  <span>If you, another occupant of the strata lot, or a visitor contravenes a bylaw or rule, you may be fined, denied the use of a recreational facility, or required to pay the costs of remedying the contravention.</span>
                </li>
              </ol>
            </div>

            {/* Date */}
            <div className="mb-6 flex flex-col gap-1">
              <div className="flex h-12 items-end border-b border-[#1e2a27] pb-2">
                <span className="text-sm font-semibold text-[#4a6358]">{formatDate(s.submittedAt)}</span>
              </div>
              <span className="text-xs font-medium text-[#4a6358]">Date</span>
            </div>

            {/* Signatures */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <SignatureLine
                  label="Signature of Landlord, or Agent of Landlord"
                  value={s.landlordName || undefined}
                />
                <div className="flex flex-col gap-2">
                  <div className="min-h-14 rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3">
                    {address && <span className="whitespace-pre-line text-sm text-[#4a6358]">{address}</span>}
                  </div>
                  <span className="text-xs font-medium text-[#4a6358]">Address of landlord, or agent of landlord</span>
                </div>
              </div>

              {s.tenants.map((t, i) => (
                <SignatureLine
                  key={t.id}
                  label={`Signature of Tenant${s.tenants.length > 1 ? ` ${i + 1}` : ""}`}
                  value={t.fullName || undefined}
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
            <div className="mt-10 rounded-xl bg-[#f4faf7] px-5 py-4 text-xs text-[#4a6358]">
              <em>Note:</em> The landlord must attach to this notice a copy of the current bylaws and rules of the strata corporation (Strata Property Regulation, B.C. Reg. 43/2000).
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

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
