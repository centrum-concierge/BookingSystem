"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Building = { name: string; slug: string; description: string; image: string };

export default function BuildingSearch({ buildings }: { buildings: Building[] }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions =
    value.length >= 5
      ? buildings.filter((b) =>
          b.name.toLowerCase().includes(value.toLowerCase())
        )
      : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    // If exactly one suggestion, go directly
    if (suggestions.length === 1) {
      router.push(`/${suggestions[0].slug}`);
      return;
    }
    // Exact match (case-insensitive)
    const exact = buildings.find(
      (b) => b.name.toLowerCase() === value.toLowerCase()
    );
    if (exact) {
      router.push(`/${exact.slug}`);
    } else {
      router.push(`/?error=not-found&name=${encodeURIComponent(value)}`);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            type="text"
            required
            placeholder="Enter your building name..."
            className="w-full rounded-full border border-white/30 bg-white/15 px-6 py-4 text-base text-white placeholder-white/55 shadow-sm backdrop-blur-sm outline-none transition focus:bg-white/20 focus:ring-2 focus:ring-white/30"
          />
          {open && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.30)]">
              {suggestions.map((b, i) => (
                <li key={b.slug} className={i > 0 ? "border-t border-[#eef7f1]" : ""}>
                  <button
                    type="button"
                    onClick={() => router.push(`/${b.slug}`)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[#f4faf7] active:bg-[#eef7f1]"
                  >
                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-[#1e2a27]">{b.name}</p>
                      {b.description && (
                        <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-[#4a6358]">{b.description}</p>
                      )}
                    </div>
                    {/* Image */}
                    {b.image && (
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#d4ede0]">
                        <Image
                          src={b.image}
                          alt={b.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="rounded-full bg-[#0a6d3c] px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(10,109,60,0.5)] transition duration-200 hover:bg-[#00a651]"
        >
          Find Building
        </button>
      </form>
    </div>
  );
}
