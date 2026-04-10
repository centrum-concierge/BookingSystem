import { getResidentProfile } from '@/lib/dashboard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 border-b border-[#f0f7f4] py-3 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#4a6358]">{label}</span>
      <span className="text-sm font-medium text-[#1e2a27]">{value}</span>
    </div>
  )
}

export default async function BuildingPage() {
  const profile = await getResidentProfile()
  const building = profile.building

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      {/* Header */}
      <div className="border-b border-[#d4ede0] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-[#4a6358] transition hover:text-[#0a6d3c]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0a6d3c]">Building Info</p>
          <div className="w-28" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        {/* Building hero */}
        <div className="rounded-2xl border border-[#d4ede0] bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eef7f1]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[#0a6d3c]">
                <path fillRule="evenodd" d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 19.5v-2.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 010 1.5h-.75A.75.75 0 016 6.75zM6.75 9a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 6a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm-.75 3.75A.75.75 0 0110.5 9h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 12a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM16.5 6.75v15h5.25a.75.75 0 000-1.5H21v-12a.75.75 0 000-1.5h-4.5zm1.5 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm.75 2.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM18 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0a6d3c]">Your Building</p>
              <h1 className="mt-1 font-display text-2xl text-[#1e2a27]">
                {building?.name ?? 'Not linked'}
              </h1>
              {building?.address && (
                <p className="mt-0.5 text-sm text-[#4a6358]">{building.address}</p>
              )}
            </div>
          </div>

          <div className="divide-y divide-[#f0f7f4] rounded-xl border border-[#d4ede0] bg-[#f9fdfa] px-5">
            <InfoRow label="Street Address" value={building?.address} />
            <InfoRow label="Strata Plan" value={building?.strataPlan} />
            <InfoRow label="Your Unit" value={profile.unitNumber ? `Unit ${profile.unitNumber}` : null} />
          </div>
        </div>

        {/* Resident details */}
        <div className="rounded-2xl border border-[#d4ede0] bg-white p-8 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f1]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#0a6d3c]">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-[#1e2a27]">Resident Details</h2>
              <p className="text-xs text-[#4a6358] capitalize">{profile.role}</p>
            </div>
          </div>

          <div className="divide-y divide-[#f0f7f4] rounded-xl border border-[#d4ede0] bg-[#f9fdfa] px-5">
            {profile.role === 'tenant' && profile.tenant && (
              <>
                <InfoRow label="Full Name" value={profile.tenant.name} />
                <InfoRow label="Email" value={profile.tenant.email} />
                <InfoRow label="Phone" value={profile.tenant.phone} />
              </>
            )}
            {profile.role === 'owner' && profile.owner && (
              <>
                <InfoRow label="Full Name" value={profile.owner.fullName} />
                <InfoRow label="Email" value={profile.owner.email} />
                <InfoRow label="Phone" value={profile.owner.phone} />
                <InfoRow label="Address" value={profile.owner.currentAddress} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
