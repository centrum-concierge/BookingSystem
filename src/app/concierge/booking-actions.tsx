"use client";

import { useState, useTransition } from "react";
import { acceptBooking, denyBooking, cancelBooking, rescheduleBooking, noShowBooking } from "./actions";

type Props = {
  calBookingId: number | null;
  uid: string;
  status: string;
};

export function BookingActions({ calBookingId, uid, status }: Props) {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "deny" | "cancel" | "reschedule">("idle");
  const [reason, setReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (status !== "PENDING" && status !== "ACCEPTED" && status !== "APPROVED" && status !== "CONFIRMED" && status !== "RESCHEDULED") return null;
  if (!calBookingId) return <p className="mt-3 text-xs text-gray-400">No Cal.com booking ID — action unavailable</p>;

  function handleAccept() {
    setError(null);
    startTransition(async () => {
      try {
        await acceptBooking(calBookingId!, uid);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to accept booking");
      }
    });
  }

  function handleDenyConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await denyBooking(calBookingId!, uid, reason || undefined);
        setMode("idle");
        setReason("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to deny booking");
      }
    });
  }

  function handleCancelConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await cancelBooking(calBookingId!, uid, reason || undefined);
        setMode("idle");
        setReason("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to cancel booking");
      }
    });
  }

  function handleNoShow() {
    setError(null);
    startTransition(async () => {
      try {
        await noShowBooking(calBookingId!, uid);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to mark as no-show");
      }
    });
  }

  function handleRescheduleConfirm() {
    if (!rescheduleDate || !rescheduleTime) {
      setError("Please select both a date and time.");
      return;
    }
    // Combine date + time into an ISO string (local time, n8n can convert if needed)
    const newStart = new Date(`${rescheduleDate}T${rescheduleTime}:00`).toISOString();
    setError(null);
    startTransition(async () => {
      try {
        await rescheduleBooking(calBookingId!, uid, newStart, reason || undefined);
        setMode("idle");
        setReason("");
        setRescheduleDate("");
        setRescheduleTime("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to reschedule booking");
      }
    });
  }

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-[#eef7f1] pt-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      {mode === "idle" && (
        <div className="flex flex-wrap gap-2">
          {status === "PENDING" && (
            <>
              <button
                onClick={handleAccept}
                disabled={isPending}
                className="rounded-full bg-[#0a6d3c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00a651] disabled:opacity-50"
              >
                {isPending ? "Processing…" : "Accept"}
              </button>
              <button
                onClick={() => { setMode("deny"); setReason(""); }}
                disabled={isPending}
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                Deny
              </button>
            </>
          )}
          {(status === "ACCEPTED" || status === "APPROVED" || status === "CONFIRMED" || status === "RESCHEDULED") && (
            <>
              <button
                onClick={() => { setMode("reschedule"); setReason(""); setRescheduleDate(""); setRescheduleTime(""); }}
                disabled={isPending}
                className="rounded-full border border-[#d4ede0] px-4 py-2 text-sm font-semibold text-[#0a6d3c] transition hover:bg-[#eef7f1] disabled:opacity-50"
              >
                Reschedule
              </button>
              <button
                onClick={() => { setMode("cancel"); setReason(""); }}
                disabled={isPending}
                className="rounded-full border border-[#d4ede0] px-4 py-2 text-sm font-semibold text-[#4a6358] transition hover:bg-[#f4faf7] disabled:opacity-50"
              >
                Cancel Booking
              </button>
              <button
                onClick={handleNoShow}
                disabled={isPending}
                className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
              >
                {isPending ? "Processing…" : "No Show"}
              </button>
            </>
          )}
        </div>
      )}

      {(mode === "deny" || mode === "cancel") && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={mode === "deny" ? "Reason for denial (optional)" : "Cancellation reason (optional)"}
            className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-3 py-2 text-sm text-[#1e2a27] outline-none focus:border-[#00a651]"
          />
          <div className="flex gap-2">
            <button
              onClick={mode === "deny" ? handleDenyConfirm : handleCancelConfirm}
              disabled={isPending}
              className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 ${
                mode === "deny" ? "bg-red-600 hover:bg-red-700" : "bg-[#4a6358] hover:bg-[#1e2a27]"
              }`}
            >
              {isPending ? "Processing…" : mode === "deny" ? "Confirm Deny" : "Confirm Cancel"}
            </button>
            <button
              onClick={() => setMode("idle")}
              disabled={isPending}
              className="rounded-full border border-[#d4ede0] px-4 py-2 text-sm font-semibold text-[#4a6358] transition hover:bg-[#f4faf7]"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {mode === "reschedule" && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-[#4a6358]">Select new date &amp; time</p>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={rescheduleDate}
              onChange={e => setRescheduleDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="flex-1 rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-3 py-2 text-sm text-[#1e2a27] outline-none focus:border-[#00a651]"
            />
            <input
              type="time"
              value={rescheduleTime}
              onChange={e => setRescheduleTime(e.target.value)}
              className="flex-1 rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-3 py-2 text-sm text-[#1e2a27] outline-none focus:border-[#00a651]"
            />
          </div>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason for rescheduling (optional)"
            className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-3 py-2 text-sm text-[#1e2a27] outline-none focus:border-[#00a651]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRescheduleConfirm}
              disabled={isPending}
              className="rounded-full bg-[#0a6d3c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00a651] disabled:opacity-50"
            >
              {isPending ? "Processing…" : "Confirm Reschedule"}
            </button>
            <button
              onClick={() => setMode("idle")}
              disabled={isPending}
              className="rounded-full border border-[#d4ede0] px-4 py-2 text-sm font-semibold text-[#4a6358] transition hover:bg-[#f4faf7]"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
