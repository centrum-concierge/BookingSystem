import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAmenityAction } from "@/app/admin/actions";
import { getBuildingBySlug } from "@/lib/buildings";

export const dynamic = "force-dynamic";

type NewAmenityPageProps = {
  params: Promise<{
    buildingSlug: string;
  }>;
};

export default async function NewAmenityPage({ params }: NewAmenityPageProps) {
  const { buildingSlug } = await params;
  const building = await getBuildingBySlug(buildingSlug);

  if (!building) notFound();

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <header className="bg-[#0a6d3c] px-6 py-4 shadow-lg md:px-10">
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
            href={`/admin/buildings/${buildingSlug}`}
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
          >
            ← Back to Building
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10 md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#00a651]">{building.name}</p>
          <h1 className="mt-2 font-display text-4xl text-[#1e2a27] md:text-5xl">Add Amenity</h1>
          <p className="mt-3 text-base leading-7 text-[#4a6358]">
            After saving, paste in the Cal.com booking path to connect the booking calendar.
          </p>
        </div>

        <form action={createAmenityAction} className="grid gap-8 rounded-[24px] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(10,109,60,0.1)] md:px-8 md:py-10">
          <input type="hidden" name="buildingSlug" value={building.slug} />

          <section className="grid gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Details</p>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Amenity Name *
              <input
                name="name"
                required
                placeholder="e.g. Rooftop Terrace"
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Description
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the amenity for residents..."
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Terms &amp; Conditions
              <span className="text-xs font-normal text-[#4a6358]">Optional. If set, residents must agree before they can access the booking calendar.</span>
              <textarea
                name="termsAndConditions"
                rows={6}
                placeholder="Enter any rules, restrictions, or conditions residents must agree to before booking..."
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
          </section>

          <section className="grid gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Cal.com Booking Link</p>
              <p className="mt-1 text-sm text-[#4a6358]">
                Paste only the path — no domain. Example:
                <span className="ml-1 rounded bg-[#eef7f1] px-1.5 py-0.5 font-mono text-xs text-[#0a6d3c]">dsenteu/bbqm</span>
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Booking Path
              <input
                name="calBookingLink"
                placeholder="dsenteu/bbqm"
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 font-mono text-sm outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="md:col-span-2 xl:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Photos</p>
              <p className="mt-1 text-sm text-[#4a6358]">Image 1 is required. Up to 5 images total.</p>
            </div>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
                Image {n} {n === 1 ? "*" : <span className="font-normal text-[#4a6358]">(optional)</span>}
                <input
                  type="file"
                  name={`amenityImage${n}`}
                  accept="image/*"
                  required={n === 1}
                  className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 text-[#4a6358]"
                />
              </label>
            ))}
          </section>

          <div className="flex justify-end border-t border-[#eef7f1] pt-6">
            <button
              type="submit"
              className="rounded-full bg-[#0a6d3c] px-8 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
            >
              Save Amenity
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
