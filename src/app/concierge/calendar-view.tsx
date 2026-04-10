"use client";

import { useState, useMemo } from "react";
import { BookingStatusBadge } from "@/components/ui/badges";

export type CalBooking = {
  id: number;
  status: string;
  start_time: string | null;
  end_time: string | null;
  event_type_title: string | null;
  location: string | null;
  residents: {
    tenants: { name: string; email: string } | null;
    units: { unit_number: number | null; buildings: { name: string } | null } | null;
  } | null;
};

const STATUS_DOT: Record<string, string> = {
  PENDING:     "bg-amber-400",
  ACCEPTED:    "bg-[#0a6d3c]",
  APPROVED:    "bg-[#0a6d3c]",
  CONFIRMED:   "bg-[#0a6d3c]",
  RESCHEDULED: "bg-blue-500",
  CANCELLED:   "bg-gray-400",
  REJECTED:    "bg-red-400",
  DENIED:      "bg-red-400",
  NO_SHOW:     "bg-orange-400",
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(iso: string) {
  // Returns "YYYY-MM-DD" in local time
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function CalendarView({ bookings }: { bookings: CalBooking[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Build map: dateKey → bookings[]
  const bookingMap = useMemo(() => {
    const map = new Map<string, CalBooking[]>();
    for (const b of bookings) {
      if (!b.start_time) continue;
      const key = toDateKey(b.start_time);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    return map;
  }, [bookings]);

  const selectedBookings = selectedDay ? (bookingMap.get(selectedDay) ?? []) : [];

  // Build calendar grid
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstOfMonth.getDay(); // 0=Sun
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  const monthLabel = new Date(year, month, 1).toLocaleString("en-CA", { month: "long", year: "numeric" });

  const todayKey = toDateKey(today.toISOString());

  // Count bookings this month
  const monthBookings = bookings.filter(b => {
    if (!b.start_time) return false;
    const d = new Date(b.start_time);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#4a6358]">Calendar</p>
          <h2 className="mt-1 font-display text-3xl text-[#1e2a27]">{monthLabel}</h2>
          <p className="mt-0.5 text-sm text-[#4a6358]">{monthBookings.length} booking{monthBookings.length !== 1 ? "s" : ""} this month</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4ede0] bg-white text-[#4a6358] transition hover:border-[#0a6d3c] hover:text-[#0a6d3c]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); setSelectedDay(todayKey); }}
            className="rounded-full border border-[#d4ede0] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6358] transition hover:border-[#0a6d3c] hover:text-[#0a6d3c]"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4ede0] bg-white text-[#4a6358] transition hover:border-[#0a6d3c] hover:text-[#0a6d3c]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Pending",     dot: "bg-amber-400" },
          { label: "Confirmed",   dot: "bg-[#0a6d3c]" },
          { label: "Rescheduled", dot: "bg-blue-500" },
          { label: "Cancelled",   dot: "bg-gray-400" },
          { label: "Denied",      dot: "bg-red-400" },
          { label: "No Show",     dot: "bg-orange-400" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
            <span className="text-xs text-[#4a6358]">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[#eef7f1]">
          {DAY_LABELS.map(d => (
            <div key={d} className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[#4a6358]">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: totalCells }, (_, i) => {
            const dayNum = i - startOffset + 1;
            const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
            const dateKey = isCurrentMonth
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
              : null;
            const dayBookings = dateKey ? (bookingMap.get(dateKey) ?? []) : [];
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDay;
            const col = i % 7;
            const isLastRow = i >= totalCells - 7;

            return (
              <div
                key={i}
                onClick={() => isCurrentMonth && dateKey && setSelectedDay(isSelected ? null : dateKey)}
                className={`min-h-[80px] border-b border-r border-[#f4faf7] p-2 transition
                  ${col === 6 ? "border-r-0" : ""}
                  ${isLastRow ? "border-b-0" : ""}
                  ${!isCurrentMonth ? "bg-[#fafffe]" : ""}
                  ${isCurrentMonth ? "cursor-pointer hover:bg-[#f4faf7]" : ""}
                  ${isSelected ? "bg-[#eef7f1]" : ""}
                `}
              >
                {isCurrentMonth && (
                  <>
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                          ${isToday ? "bg-[#0a6d3c] text-white" : "text-[#1e2a27]"}
                          ${isSelected && !isToday ? "ring-2 ring-[#0a6d3c]" : ""}
                        `}
                      >
                        {dayNum}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[10px] font-semibold text-[#4a6358]">{dayBookings.length}</span>
                      )}
                    </div>
                    {/* Status dots — one per unique color, +n if color repeats */}
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(
                        dayBookings.reduce<Record<string, number>>((acc, b) => {
                          const color = STATUS_DOT[b.status] ?? "bg-gray-300";
                          acc[color] = (acc[color] ?? 0) + 1;
                          return acc;
                        }, {})
                      ).map(([color, count]) => (
                        <span key={color} className="flex items-center gap-0.5">
                          <span className={`h-2 w-2 flex-shrink-0 rounded-full ${color}`} />
                          {count > 1 && (
                            <span className="text-[9px] font-semibold leading-none text-[#4a6358]">+{count}</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day detail panel */}
      {selectedDay && (
        <div className="rounded-[20px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.1)]">
          <div className="flex items-center justify-between border-b border-[#eef7f1] px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6358]">
                {formatDate(selectedDay + "T12:00:00")}
              </p>
              <p className="mt-0.5 text-sm text-[#1e2a27]">
                {selectedBookings.length === 0
                  ? "No bookings"
                  : `${selectedBookings.length} booking${selectedBookings.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#4a6358] transition hover:bg-[#f4faf7]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {selectedBookings.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#4a6358]">Nothing scheduled for this day.</div>
          ) : (
            <div className="divide-y divide-[#f4faf7]">
              {selectedBookings
                .sort((a, b) => (a.start_time ?? "").localeCompare(b.start_time ?? ""))
                .map(b => {
                  const tenant = b.residents?.tenants;
                  const unit = b.residents?.units;
                  const building = unit?.buildings;
                  return (
                    <div key={b.id} className="flex items-start justify-between gap-4 px-6 py-4">
                      <div className="flex items-start gap-3">
                        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[b.status] ?? "bg-gray-300"}`} />
                        <div>
                          <p className="font-semibold text-[#1e2a27]">{b.event_type_title ?? "Amenity Booking"}</p>
                          {tenant && (
                            <p className="text-sm text-[#4a6358]">{tenant.name}
                              {tenant.email ? <span className="text-xs"> · {tenant.email}</span> : null}
                            </p>
                          )}
                          {(building || unit?.unit_number) && (
                            <p className="text-xs text-[#4a6358]">
                              {building?.name}{unit?.unit_number ? ` · Unit ${unit.unit_number}` : ""}
                            </p>
                          )}
                          {b.start_time && (
                            <p className="mt-1 text-xs font-semibold text-[#0a6d3c]">
                              {formatTime(b.start_time)}
                              {b.end_time ? ` → ${formatTime(b.end_time)}` : ""}
                            </p>
                          )}
                          {b.location && <p className="text-xs text-[#4a6358]">{b.location}</p>}
                        </div>
                      </div>
                      <BookingStatusBadge status={b.status} />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
