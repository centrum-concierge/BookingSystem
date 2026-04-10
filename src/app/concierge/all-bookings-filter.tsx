"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "ACCEPTED" },
  { label: "Rescheduled", value: "RESCHEDULED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Denied", value: "DENIED" },
  { label: "No Show", value: "NO_SHOW" },
];

export function ConciergeTabBar({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchTab(tab: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", tab);
    if (tab !== "all") params.delete("status");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 rounded-full border border-[#d4ede0] bg-white p-1 shadow-sm">
      <button
        onClick={() => switchTab("board")}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
          activeTab === "board" || activeTab === ""
            ? "bg-[#0a6d3c] text-white"
            : "text-[#4a6358] hover:bg-[#f4faf7]"
        }`}
      >
        Dashboard
      </button>
      <button
        onClick={() => switchTab("all")}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
          activeTab === "all"
            ? "bg-[#0a6d3c] text-white"
            : "text-[#4a6358] hover:bg-[#f4faf7]"
        }`}
      >
        All Bookings
      </button>
      <button
        onClick={() => switchTab("calendar")}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
          activeTab === "calendar"
            ? "bg-[#0a6d3c] text-white"
            : "text-[#4a6358] hover:bg-[#f4faf7]"
        }`}
      >
        Calendar
      </button>
    </div>
  );
}

export function StatusFilterBar({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setStatus(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("status", value);
    else params.delete("status");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => setStatus(f.value)}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
            active === f.value
              ? "border-[#0a6d3c] bg-[#0a6d3c] text-white"
              : "border-[#d4ede0] bg-white text-[#4a6358] hover:border-[#0a6d3c] hover:text-[#0a6d3c]"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
