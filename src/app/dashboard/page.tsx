import { getResidentProfile } from '@/lib/dashboard'
import { getAmenitiesForBuilding, slugify } from '@/lib/buildings'
import { createClient } from '@/lib/supabase/server'
import { supabase as serviceSupabase } from '@/lib/supabase'
import { FormStatusBadge, BookingStatusBadge } from '@/components/ui/badges'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function StatusBadge({ status }: { status: string | null }) {
  const map: Record<string, { label: string; color: string }> = {
    pending:   { label: 'Pending',   color: 'bg-amber-50 text-amber-700 border-amber-200' },
    signed:    { label: 'Signed',    color: 'bg-blue-50 text-blue-700 border-blue-200' },
    completed: { label: 'Completed', color: 'bg-[#eef7f1] text-[#0a6d3c] border-[#d4ede0]' },
  }
  const s = map[status ?? ''] ?? { label: status ?? 'Unknown', color: 'bg-gray-50 text-gray-600 border-gray-200' }
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.color}`}>
      {s.label}
    </span>
  )
}

async function MyBookingsSection({ userId }: { userId?: string }) {
  if (!userId) return null

  const { data } = await serviceSupabase
    .from('bookings')
    .select('id, status, start_time')
    .eq('user_id', userId)

  const bookings = data ?? []
  const now = new Date().toISOString()

  const upcomingCount = bookings.filter(b =>
    (b.status === 'ACCEPTED' || b.status === 'APPROVED' || b.status === 'CONFIRMED' || b.status === 'RESCHEDULED') &&
    (b.start_time ?? '') >= now
  ).length
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length
  const totalActive = upcomingCount + pendingCount

  return (
    <section className="mb-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#4a6358]">My Bookings</h2>
      <Link
        href="/dashboard/bookings"
        className="group flex items-center justify-between rounded-2xl border border-[#d4ede0] bg-white p-6 shadow-sm transition hover:border-[#0a6d3c] hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef7f1]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#0a6d3c]">
              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[#1e2a27]">My Bookings</p>
            <p className="mt-0.5 text-sm text-[#4a6358]">
              {bookings.length === 0
                ? 'No bookings yet'
                : `${upcomingCount} upcoming · ${pendingCount} pending · ${bookings.length} total`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {totalActive > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0a6d3c] text-xs font-bold text-white">
              {totalActive}
            </span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#d4ede0] transition group-hover:text-[#0a6d3c]">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </div>
      </Link>
    </section>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await getResidentProfile()

  const amenities = profile.building
    ? await getAmenitiesForBuilding(profile.building.id)
    : []
  const buildingSlug = profile.building ? slugify(profile.building.name) : ''

  const firstName = user?.user_metadata?.first_name ?? profile.tenant?.name?.split(' ')[0] ?? 'Resident'
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      {/* Top nav */}
      <nav className="border-b border-[#d4ede0] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center">
              <img src="/images/logos/icon_logo.png" alt="Centrum" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-sm font-semibold text-[#1e2a27]">Centrum Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-[#4a6358] sm:block">{user?.email}</span>
            <form action="/auth/signout" method="post">
              <button className="min-h-[44px] rounded-full border border-[#d4ede0] px-4 py-2 text-xs font-semibold text-[#4a6358] transition hover:border-[#0a6d3c] hover:text-[#0a6d3c]">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a6d3c]">
            Centrum Concierge &amp; Security
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#1e2a27] sm:text-4xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1.5 text-sm text-[#4a6358]">
            Here's everything about your residency.
          </p>
        </div>

        {/* Top row: Building + Profile */}
        <div className="mb-6 grid gap-5 sm:grid-cols-2">
          {/* Building card */}
          <Link
            href="/dashboard/building"
            className="group relative overflow-hidden rounded-2xl border border-[#d4ede0] bg-white p-6 shadow-sm transition hover:border-[#0a6d3c] hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f1]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#0a6d3c]">
                  <path fillRule="evenodd" d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 19.5v-2.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 010 1.5h-.75A.75.75 0 016 6.75zM6.75 9a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 6a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm-.75 3.75A.75.75 0 0110.5 9h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 12a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM16.5 6.75v15h5.25a.75.75 0 000-1.5H21v-12a.75.75 0 000-1.5h-4.5zm1.5 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm.75 2.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM18 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#d4ede0] transition group-hover:text-[#0a6d3c]">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Your Building</p>
            <p className="mt-1 text-lg font-semibold text-[#1e2a27]">
              {profile.building?.name ?? 'Not linked yet'}
            </p>
            {profile.building?.address && (
              <p className="mt-0.5 text-sm text-[#4a6358]">{profile.building.address}</p>
            )}
            {profile.unitNumber && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#eef7f1] px-3 py-1 text-xs font-semibold text-[#0a6d3c]">
                Unit {profile.unitNumber}
              </div>
            )}
          </Link>

          {/* Profile card */}
          <div className="rounded-2xl border border-[#d4ede0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f1]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#0a6d3c]">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                profile.role === 'tenant'
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-[#d4ede0] bg-[#eef7f1] text-[#0a6d3c]'
              }`}>
                {profile.role}
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Your Profile</p>
            <p className="mt-1 text-lg font-semibold text-[#1e2a27]">
              {profile.tenant?.name ?? profile.owner?.fullName ?? firstName}
            </p>
            <p className="mt-0.5 text-sm text-[#4a6358]">{user?.email}</p>
            {(profile.tenant?.phone ?? profile.owner?.phone) && (
              <p className="mt-0.5 text-sm text-[#4a6358]">
                {profile.tenant?.phone ?? profile.owner?.phone}
              </p>
            )}
          </div>
        </div>

        {/* Amenity Bookings */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#4a6358]">
            Book an Amenity
          </h2>

          {amenities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d4ede0] bg-white px-6 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef7f1]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#0a6d3c]">
                  <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#1e2a27]">No amenities available yet</p>
              <p className="mt-1 text-xs text-[#4a6358]">
                Bookable spaces will appear here once your building manager adds them.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((amenity) => (
                <Link
                  key={amenity.id}
                  href={`/${buildingSlug}/${amenity.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#d4ede0] bg-white shadow-sm transition hover:border-[#0a6d3c] hover:shadow-md"
                >
                  {amenity.images[0] ? (
                    <div className="relative h-36 overflow-hidden bg-[#d4ede0]">
                      <Image
                        src={amenity.images[0]}
                        alt={amenity.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-[#eef7f1]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[#a8d5bc]">
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#1e2a27]">{amenity.name}</p>
                        {amenity.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-[#4a6358]">{amenity.description}</p>
                        )}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-[#d4ede0] transition group-hover:text-[#0a6d3c]">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-[#0a6d3c]">
                      {amenity.calBookingLink ? 'Book now →' : 'Coming soon'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* My Bookings */}
        <MyBookingsSection userId={user?.id} />

        {/* Available Forms */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#4a6358]">
            Available Forms
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/onboarding"
              className="group flex items-start gap-4 rounded-2xl border border-[#d4ede0] bg-white p-5 shadow-sm transition hover:border-[#0a6d3c] hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef7f1]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#0a6d3c]">
                  <path fillRule="evenodd" d="M5.625 1.5H9a3.375 3.375 0 013.375 3.375M5.625 1.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9M5.625 1.5H9a3.375 3.375 0 013.375 3.375m0 0A3.375 3.375 0 0115.75 8.25H18M9 12.75h6M9 15.75h4.5" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#1e2a27]">Building Registration</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-[#d4ede0] transition group-hover:text-[#0a6d3c]">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="mt-0.5 text-sm text-[#4a6358]">
                  Register your unit and tenancy details with Centrum.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Submitted Forms — Form K */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#4a6358]">
            Submitted Forms
          </h2>

          {profile.formK.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d4ede0] bg-white px-6 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef7f1]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#0a6d3c]">
                  <path fillRule="evenodd" d="M5.625 1.5H9a3.375 3.375 0 013.375 3.375M5.625 1.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9M12 10.5h.008v.008H12V10.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#1e2a27]">No submitted forms yet</p>
              <p className="mt-1 text-xs text-[#4a6358]">
                Your Form K submission will appear here once processed.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profile.formK.map((form, i) => (
                <Link
                  key={form.id}
                  href={`/dashboard/forms/form-k/${form.id}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-[#d4ede0] bg-white p-5 shadow-sm transition hover:border-[#0a6d3c] hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f1]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#0a6d3c]">
                        <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                        <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25z" />
                      </svg>
                    </div>
                    <StatusBadge status={form.status} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e2a27]">Form K{i > 0 ? ` #${i + 1}` : ''}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">Tenancy Notice</p>
                  </div>
                  <div className="space-y-1">
                    {form.tenancyCommencing && (
                      <div className="flex items-center gap-2 text-xs text-[#4a6358]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                          <path fillRule="evenodd" d="M4 1.75a.75.75 0 01.75.75V3h6.5V2.5a.75.75 0 011.5 0V3h.75A1.75 1.75 0 0115.25 4.75v8.5A1.75 1.75 0 0113.5 15h-11A1.75 1.75 0 01.75 13.25v-8.5A1.75 1.75 0 012.5 3h.75V2.5A.75.75 0 014 1.75zm-.25 5.5a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm.75 2.75a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4z" clipRule="evenodd" />
                        </svg>
                        Commencing {new Date(form.tenancyCommencing).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[#4a6358]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                        <path fillRule="evenodd" d="M1 8a7 7 0 1114 0A7 7 0 011 8zm7.75-4.25a.75.75 0 00-1.5 0V8c0 .414.336.75.75.75h3a.75.75 0 000-1.5h-2.25V3.75z" clipRule="evenodd" />
                      </svg>
                      Submitted {new Date(form.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-[#0a6d3c] opacity-0 transition group-hover:opacity-100">
                    View details
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>


      </div>
    </main>
  )
}
