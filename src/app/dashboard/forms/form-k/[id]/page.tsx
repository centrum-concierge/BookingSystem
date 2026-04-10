import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFormKById } from '@/lib/form-k'
import { getResidentProfile } from '@/lib/dashboard'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

function isUrl(val?: string | null): boolean {
  return !!val && (val.startsWith('http://') || val.startsWith('https://'))
}

function SignatureField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="min-h-14 rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3">
        {isUrl(value) ? (
          <a
            href={value!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0a6d3c] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#00a651]"
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
  )
}

export default async function ResidentFormKDetailPage({ params }: Props) {
  const { id } = await params
  await getResidentProfile()

  const s = await getFormKById(id)
  if (!s) notFound()

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      {/* Nav */}
      <div className="grid grid-cols-3 items-center border-b border-[#d4ede0] bg-white px-6 py-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#d4ede0] bg-[#f4faf7] px-4 py-1.5 text-sm font-semibold text-[#0a6d3c] transition hover:bg-[#eef7f1]"
          >
            &#8592; Back to Dashboard
          </Link>
        </div>
        <div className="flex justify-center">
          <span className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${
            s.status === 'confirmed'
              ? 'border-[#0a6d3c] bg-[#eef7f1] text-[#0a6d3c]'
              : 'border-amber-400 bg-amber-50 text-amber-700'
          }`}>
            {s.status === 'confirmed' ? '\u2713 Confirmed' : 'Pending Review'}
          </span>
        </div>
        <div />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 md:px-10">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_8px_48px_rgba(10,109,60,0.12)]">

          <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-12">
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
                  Strata Lot {s.unitNumber} of Strata Plan {s.strataPlan}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Street Address</p>
                <p className="mt-0.5 text-sm text-[#1e2a27]">{s.buildingAddress || s.buildingName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Tenant(s)</p>
                <p className="mt-0.5 text-sm text-[#1e2a27]">{s.tenantName || 'â€”'}</p>
              </div>
              {s.tenantEmail && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Email</p>
                  <p className="mt-0.5 text-sm text-[#1e2a27]">{s.tenantEmail}</p>
                </div>
              )}
              {s.tenantPhone && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Phone</p>
                  <p className="mt-0.5 text-sm text-[#1e2a27]">{s.tenantPhone}</p>
                </div>
              )}
              {s.tenancyCommencing && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Tenancy Commencing</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#1e2a27]">{formatDate(s.tenancyCommencing)}</p>
                </div>
              )}
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
                <span className="text-sm font-semibold text-[#4a6358]">{formatDate(s.createdAt)}</span>
              </div>
              <span className="text-xs font-medium text-[#4a6358]">Date</span>
            </div>

            {/* Signatures */}
            <div className="flex flex-col gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <SignatureField
                  label="Signature of Landlord, or Agent of Landlord"
                  value={s.signatureOwner || s.ownerFullName || null}
                />
                {s.ownerAddress && (
                  <div className="flex flex-col gap-2">
                    <div className="min-h-14 rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3">
                      <span className="whitespace-pre-line text-sm text-[#4a6358]">{s.ownerAddress}</span>
                    </div>
                    <span className="text-xs font-medium text-[#4a6358]">Address of landlord, or agent of landlord</span>
                  </div>
                )}
              </div>
              <SignatureField
                label="Signature of Tenant"
                value={s.signatureTenant || s.tenantName || null}
              />
            </div>

            {/* Footer note */}
            <div className="mt-10 rounded-xl bg-[#f4faf7] px-5 py-4 text-xs text-[#4a6358]">
              <em>Note:</em> The landlord must attach to this notice a copy of the current bylaws and rules of the strata corporation (Strata Property Regulation, B.C. Reg. 43/2000).
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
