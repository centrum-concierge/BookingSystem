// Shared badge components used across admin, concierge, and dashboard pages.

/** For Form K submission statuses: pending / confirmed */
export function FormStatusBadge({ status }: { status: string }) {
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

/** For Cal.com booking statuses: PENDING / ACCEPTED / REJECTED / CANCELLED / RESCHEDULED */
export function BookingStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    PENDING:     "bg-amber-100 text-amber-700",
    ACCEPTED:    "bg-[#eef7f1] text-[#0a6d3c]",
    APPROVED:    "bg-[#eef7f1] text-[#0a6d3c]",
    REJECTED:    "bg-red-100 text-red-700",
    DENIED:      "bg-red-100 text-red-700",
    CANCELLED:   "bg-gray-100 text-gray-500",
    RESCHEDULED: "bg-blue-100 text-blue-700",
    NO_SHOW:     "bg-orange-100 text-orange-700",
  };
  const labels: Record<string, string> = {
    PENDING:     "Pending",
    ACCEPTED:    "Confirmed",
    APPROVED:    "Confirmed",
    REJECTED:    "Denied",
    DENIED:      "Denied",
    CANCELLED:   "Cancelled",
    RESCHEDULED: "Rescheduled",
    NO_SHOW:     "No Show",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {labels[status] ?? status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
