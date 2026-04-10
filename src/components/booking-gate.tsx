"use client";

import { useState } from "react";
import CalEmbed from "./cal-embed";

type BookingGateProps = {
  calLink: string;
  termsAndConditions?: string;
  amenityName: string;
  userId?: string;
};

export default function BookingGate({ calLink, termsAndConditions, amenityName, userId }: BookingGateProps) {
  const [agreed, setAgreed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  // No T&C set — go straight to the calendar
  if (!termsAndConditions) {
    return <CalEmbed calLink={calLink} userId={userId} />;
  }

  // User has accepted — show the calendar
  if (confirmed) {
    return <CalEmbed calLink={calLink} userId={userId} />;
  }

  return (
    <>
      {/* T&C Gate */}
      <div className="flex flex-col gap-6 px-6 py-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">
            Before You Book
          </p>
          <h3 className="mt-1 font-display text-2xl text-[#1e2a27]">
            Terms &amp; Conditions
          </h3>
          <p className="mt-1 text-sm text-[#4a6358]">
            Please read and agree to the following before accessing the booking calendar for{" "}
            <strong>{amenityName}</strong>.
          </p>
        </div>

        {/* Scrollable T&C text */}
        <div className="max-h-56 overflow-y-auto rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-4 text-sm leading-7 text-[#4a6358] whitespace-pre-wrap">
          {termsAndConditions}
        </div>

        {/* Checkbox */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#0a6d3c] cursor-pointer"
          />
          <span className="text-sm leading-6 text-[#1e2a27]">
            By ticking this box you agree to the{" "}
            <button
              type="button"
              onClick={() => setOverlayOpen(true)}
              className="font-semibold text-[#0a6d3c] underline underline-offset-2 hover:text-[#00a651] transition-colors"
            >
              terms and conditions
            </button>{" "}
            of this amenity.
          </span>
        </label>

        {/* Continue button */}
        <button
          type="button"
          disabled={!agreed}
          onClick={() => setConfirmed(true)}
          className="w-full rounded-full bg-[#0a6d3c] py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to Booking
        </button>
      </div>

      {/* Full T&C Overlay */}
      {overlayOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setOverlayOpen(false)}
        >
          <div
            className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Overlay header */}
            <div className="flex items-center justify-between border-b border-[#eef7f1] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">
                  {amenityName}
                </p>
                <h3 className="mt-0.5 font-display text-xl text-[#1e2a27]">
                  Terms &amp; Conditions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOverlayOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#4a6358] transition hover:bg-[#eef7f1] hover:text-[#1e2a27]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Overlay scrollable content */}
            <div className="overflow-y-auto px-6 py-6 text-sm leading-7 text-[#4a6358] whitespace-pre-wrap">
              {termsAndConditions}
            </div>

            {/* Overlay footer */}
            <div className="border-t border-[#eef7f1] px-6 py-4">
              <button
                type="button"
                onClick={() => setOverlayOpen(false)}
                className="w-full rounded-full bg-[#0a6d3c] py-2.5 text-sm font-semibold text-white transition hover:bg-[#00a651]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
