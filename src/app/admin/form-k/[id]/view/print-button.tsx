"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full border border-[#d4ede0] bg-white px-6 py-2.5 text-sm font-semibold text-[#0a6d3c] transition hover:bg-[#eef7f1] print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
