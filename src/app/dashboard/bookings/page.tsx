import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { supabase as serviceSupabase } from '@/lib/supabase'
import { BookingStatusBadge } from '@/components/ui/badges'

export const dynamic = 'force-dynamic'

function formatDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-CA', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function BookingCard({ b }: { b: { id: number; status: string; start_time: string | null; end_time: string | null; event_type_title: string | null; location: string | null } }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[#d4ede0] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-[#1e2a27]">{b.event_type_title ?? 'Amenity Booking'}</p>
        {b.location && <p className="text-xs text-[#4a6358]">{b.location}</p>}
        <p className="text-xs text-[#4a6358]">
          {formatDateTime(b.start_time)}
          {b.end_time ? ` → ${new Date(b.end_time).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}` : ''}
        </p>
      </div>
      <BookingStatusBadge status={b.status ?? 'PENDING'} />
    </div>
  )
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data } = await serviceSupabase
    .from('bookings')
    .select('id, status, start_time, end_time, event_type_title, location')
    .eq('user_id', user.id)
    .order('start_time', { ascending: true })

  const bookings = data ?? []
  const now = new Date().toISOString()

  const pending = bookings.filter(b => b.status === 'PENDING')
  const upcoming = bookings.filter(b =>
    (b.status === 'ACCEPTED' || b.status === 'APPROVED' || b.status === 'CONFIRMED' || b.status === 'RESCHEDULED') &&
    (b.start_time ?? '') >= now
  )
  const past = bookings.filter(b =>
    b.status === 'CANCELLED' || b.status === 'REJECTED' || b.status === 'DENIED' ||
    b.status === 'NO_SHOW' ||
    ((b.status === 'ACCEPTED' || b.status === 'APPROVED' || b.status === 'CONFIRMED') && (b.start_time ?? '') < now)
  )

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <nav className="border-b border-[#d4ede0] bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-[#4a6358] transition hover:text-[#0a6d3c]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              Dashboard
            </Link>
          </div>
          <img src="/images/logos/icon_logo.png" alt="Centrum" className="h-7 w-7 object-contain" />
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a6d3c]">Centrum Portal</p>
          <h1 className="mt-1 font-display text-3xl text-[#1e2a27]">My Bookings</h1>
          <p className="mt-1 text-sm text-[#4a6358]">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d4ede0] bg-white px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7f1]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-[#0a6d3c]">
                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-semibold text-[#1e2a27]">No bookings yet</p>
            <p className="mt-1 text-sm text-[#4a6358]">Your amenity bookings will appear here once you make one.</p>
            <Link href="/dashboard" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#0a6d3c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00a651]">
              Browse Amenities
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">

            {pending.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-600">Awaiting Approval</h2>
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">{pending.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {pending.map(b => <BookingCard key={b.id} b={b} />)}
                </div>
              </section>
            )}

            {upcoming.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0a6d3c]" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0a6d3c]">Upcoming</h2>
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#eef7f1] text-[10px] font-bold text-[#0a6d3c]">{upcoming.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {upcoming.map(b => <BookingCard key={b.id} b={b} />)}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#4a6358]" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">History</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {past.map(b => <BookingCard key={b.id} b={b} />)}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </main>
  )
}
