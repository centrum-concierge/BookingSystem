import Image from "next/image";
import Link from "next/link";
import { createBuildingAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default function NewBuildingPage() {
  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <header className="bg-[#0a6d3c] px-6 py-4 shadow-lg md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image src="/images/logos/icon_logo.png" alt="Centrum" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a8d9be]">Centrum</p>
              <p className="text-sm font-bold text-white">Admin Dashboard</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10 md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#00a651]">New Building</p>
          <h1 className="mt-2 font-display text-4xl text-[#1e2a27] md:text-5xl">Add Building</h1>
          <p className="mt-3 text-base leading-7 text-[#4a6358]">Fill in the building details. You can add amenities after saving.</p>
        </div>

        <form action={createBuildingAction} className="grid gap-8 rounded-[24px] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(10,109,60,0.1)] md:px-8 md:py-10">
          <section className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Building Details</p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Building Name *
              <input
                name="name"
                required
                placeholder="e.g. The Monarch Building"
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Location
              <input
                name="location"
                placeholder="e.g. Tsawwassen, BC"
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27] md:col-span-2">
              Description
              <textarea
                name="description"
                rows={4}
                placeholder="Short description shown to residents..."
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Photos</p>
              <p className="mt-1 text-sm text-[#4a6358]">Image 1 is required. Image 2 is optional.</p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Image 1 *
              <input type="file" name="buildingImage1" accept="image/*" required className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 text-[#4a6358]" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Image 2 <span className="font-normal text-[#4a6358]">(optional)</span>
              <input type="file" name="buildingImage2" accept="image/*" className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 text-[#4a6358]" />
            </label>
          </section>

          <div className="flex justify-end border-t border-[#eef7f1] pt-6">
            <button
              type="submit"
              className="rounded-full bg-[#0a6d3c] px-8 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
            >
              Save Building
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
