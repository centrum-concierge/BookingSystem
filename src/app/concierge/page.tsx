import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { conciergeLogoutAction } from "@/app/concierge/login/actions";
import { supabase } from "@/lib/supabase";
import { BookingActions } from "./booking-actions";
import { ConciergeTabBar, StatusFilterBar } from "./all-bookings-filter";
import { CalendarView } from "./calendar-view";

export const dynamic = "force-dynamic";

type Booking = {
  id: number;
  cal_booking_id: number | null;
  cal_booking_uid: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  event_type_title: string | null;
  location: string | null;
  notes: string | null;
  residents: {
    no_show_count: number | null;
    tenants: { name: string; email: string; phone_number: number | null } | null;
    units: {
      unit_number: number | null;
      buildings: { name: string } | null;
    } | null;
  } | null;
};

import { BookingStatusBadge as StatusBadge } from "@/components/ui/badges";

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BookingCard({ booking }: { booking: Booking }) {
  const tenant = booking.residents?.tenants ?? null;
  const unit = booking.residents?.units ?? null;
  const building = unit?.buildings ?? null;

  return (
    <article className="rounded-[20px] bg-white p-6 shadow-[0_4px_24px_rgba(10,109,60,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl text-[#1e2a27]">
              {tenant?.name ?? booking.event_type_title ?? "Booking"}
            </h3>
            <StatusBadge status={booking.status} />
          </div>
          {tenant && (
            <p className="mt-1 text-sm text-[#4a6358]">
              {tenant.email}{tenant.phone_number ? ` · ${tenant.phone_number}` : ""}
            </p>
          )}
          {(unit || building) && (
            <p className="mt-0.5 text-xs text-[#4a6358]">
              {building?.name}{unit?.unit_number ? ` · Unit ${unit.unit_number}` : ""}
            </p>
          )}
          {booking.residents != null && (
            <p className={`mt-0.5 text-xs font-semibold ${(booking.residents.no_show_count ?? 0) > 0 ? "text-red-500" : "text-gray-400"}`}>
              {(booking.residents.no_show_count ?? 0) > 0 ? "⚠" : "✓"} {booking.residents.no_show_count ?? 0} no-show{booking.residents.no_show_count !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {booking.event_type_title && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00a651]">Amenity</p>
            <p className="mt-0.5 text-sm text-[#1e2a27]">{booking.event_type_title}</p>
          </div>
        )}
        {booking.location && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00a651]">Location</p>
            <p className="mt-0.5 text-sm text-[#1e2a27]">{booking.location}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00a651]">Start</p>
          <p className="mt-0.5 text-sm text-[#1e2a27]">{formatDateTime(booking.start_time)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00a651]">End</p>
          <p className="mt-0.5 text-sm text-[#1e2a27]">{formatDateTime(booking.end_time)}</p>
        </div>
        {booking.notes && (
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00a651]">Notes</p>
            <p className="mt-0.5 text-sm text-[#1e2a27]">{booking.notes}</p>
          </div>
        )}
      </div>

      <BookingActions
        calBookingId={booking.cal_booking_id}
        uid={booking.cal_booking_uid}
        status={booking.status}
      />
    </article>
  );
}

export default async function ConciergePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; status?: string }>;
}) {
  const { view, status } = await searchParams;
  const cookieStore = await cookies();
  if (!cookieStore.get("concierge_session")) {
    redirect("/concierge/login");
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id, cal_booking_id, cal_booking_uid, status, start_time, end_time,
      event_type_title, location, notes,
      residents (
        no_show_count,
        tenants ( name, email, phone_number ),
        units!residents_unit_fkey (
          unit_number,
          buildings!unit_building_fkey ( name )
        )
      )
    `)
    .order("start_time", { ascending: true });

  console.log("CONCIERGE QUERY — rows:", data?.length, "error:", error?.message, "statuses:", data?.map(b => b.status));

  const bookings = (data ?? []) as unknown as Booking[];

  const isAllView = view === "all";
  const isCalendarView = view === "calendar";
  const activeStatus = status ?? "";

  // All bookings view: filter by status if set
  const allBookings = isAllView && activeStatus
    ? bookings.filter(b => b.status === activeStatus)
    : bookings;

  const pending = bookings.filter(b => b.status === "PENDING");
  const nowMs = Date.now();

  const upcoming = bookings.filter(b =>
    (b.status === "ACCEPTED" || b.status === "APPROVED" || b.status === "CONFIRMED" || b.status === "RESCHEDULED") &&
    new Date(b.start_time ?? 0).getTime() >= nowMs,
  );
  const history = bookings.filter(b =>
    b.status === "REJECTED" ||
    b.status === "CANCELLED" ||
    b.status === "NO_SHOW" ||
    b.status === "DENIED" ||
    ((b.status === "ACCEPTED" || b.status === "APPROVED" || b.status === "CONFIRMED" || b.status === "RESCHEDULED") &&
      new Date(b.start_time ?? 0).getTime() < nowMs),
  );

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
              <p className="text-sm font-bold text-white">Concierge</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ← Admin
            </Link>
            <form action={conciergeLogoutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-[#d4ede0] bg-white px-6 py-3 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <ConciergeTabBar activeTab={view ?? "board"} />
          <span className="text-xs text-[#4a6358]">{bookings.length} total bookings</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-16">

        {isCalendarView ? (
          /* ── CALENDAR VIEW ── */
          <CalendarView bookings={bookings.map(b => ({
            id: b.id,
            status: b.status,
            start_time: b.start_time,
            end_time: b.end_time,
            event_type_title: b.event_type_title,
            location: b.location,
            residents: b.residents ? {
              tenants: b.residents.tenants ? {
                name: b.residents.tenants.name,
                email: b.residents.tenants.email,
              } : null,
              units: b.residents.units ? {
                unit_number: b.residents.units.unit_number,
                buildings: b.residents.units.buildings ?? null,
              } : null,
            } : null,
          }))} />
        ) : isAllView ? (
          /* ── ALL BOOKINGS VIEW ── */
          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#4a6358]">All Bookings</p>
                <h2 className="mt-1 font-display text-3xl text-[#1e2a27]">
                  {activeStatus || "Every Booking"}
                  {activeStatus && <span className="ml-2 text-lg text-[#4a6358]">({allBookings.length})</span>}
                </h2>
              </div>
            </div>
            <div className="mb-6">
              <StatusFilterBar active={activeStatus} />
            </div>
            {allBookings.length === 0 ? (
              <div className="rounded-[20px] bg-white px-8 py-10 text-center shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
                <p className="text-[#4a6358]">No bookings match this filter</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#eef7f1] bg-[#f4faf7]">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#4a6358]">Resident</th>
                      <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#4a6358] sm:table-cell">Unit / Building</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#4a6358]">Amenity</th>
                      <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#4a6358] md:table-cell">Start</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#4a6358]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map((b, i) => {
                      const tenant = b.residents?.tenants;
                      const unit = b.residents?.units;
                      const building = unit?.buildings;
                      return (
                        <tr key={b.id} className={`border-b border-[#f4faf7] transition hover:bg-[#f9fdfa] ${i % 2 === 0 ? "" : "bg-[#fafffe]"}`}>
                          <td className="px-5 py-3">
                            <p className="font-semibold text-[#1e2a27]">{tenant?.name ?? "—"}</p>
                            {tenant?.email && <p className="text-xs text-[#4a6358]">{tenant.email}</p>}
                          </td>
                          <td className="hidden px-5 py-3 sm:table-cell">
                            <p className="text-[#1e2a27]">{building?.name ?? "—"}</p>
                            {unit?.unit_number && <p className="text-xs text-[#4a6358]">Unit {unit.unit_number}</p>}
                          </td>
                          <td className="px-5 py-3 text-[#1e2a27]">{b.event_type_title ?? "—"}</td>
                          <td className="hidden px-5 py-3 text-xs text-[#4a6358] md:table-cell">{formatDateTime(b.start_time)}</td>
                          <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <>
        {/* Pending Approvals */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.42em] text-amber-600">Needs Action</p>
              <h2 className="mt-1 font-display text-3xl text-[#1e2a27]">Pending Approvals</h2>
            </div>
            {pending.length > 0 && (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                {pending.length}
              </span>
            )}
          </div>
          {pending.length === 0 ? (
            <div className="rounded-[20px] bg-white px-8 py-10 text-center shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
              <p className="text-[#4a6358]">No pending booking requests — you&#39;re all caught up</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pending.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          )}
        </section>

        {/* Upcoming Confirmed */}
        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#00a651]">Confirmed</p>
            <h2 className="mt-1 font-display text-3xl text-[#1e2a27]">Upcoming Bookings</h2>
          </div>
          {upcoming.length === 0 ? (
            <div className="rounded-[20px] bg-white px-8 py-10 text-center shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
              <p className="text-[#4a6358]">No upcoming confirmed bookings</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          )}
        </section>

        {/* History */}
        {history.length > 0 && (
          <section>
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#4a6358]">Archive</p>
              <h2 className="mt-1 font-display text-3xl text-[#1e2a27]">History</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {history.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          </section>
        )}
          </>
        )}

      </div>
    </main>
  );
}
