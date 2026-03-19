import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateBuildingAction } from "@/app/admin/actions";
import { getBuildingBySlug } from "@/lib/buildings";

export const dynamic = "force-dynamic";

type EditBuildingPageProps = {
  params: Promise<{ buildingSlug: string }>;
};

export default async function EditBuildingPage({ params }: EditBuildingPageProps) {
  const { buildingSlug } = await params;
  const building = await getBuildingBySlug(buildingSlug);
  if (!building) notFound();

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <header className="bg-[#0a6d3c] px-6 py-4 shadow-lg md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 overflow-hidden">
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
            ← Cancel
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10 md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#00a651]">Edit Building</p>
          <h1 className="mt-2 font-display text-4xl text-[#1e2a27] md:text-5xl">{building.name}</h1>
        </div>

        <form action={updateBuildingAction} className="grid gap-8 rounded-[24px] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(10,109,60,0.1)] md:px-8 md:py-10">
          <input type="hidden" name="currentSlug" value={building.slug} />

          <section className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Building Details</p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Building Name *
              <input
                name="name"
                required
                defaultValue={building.name}
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
              Location
              <input
                name="location"
                defaultValue={building.location}
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27] md:col-span-2">
              Description
              <textarea
                name="description"
                rows={4}
                defaultValue={building.description}
                className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20"
              />
            </label>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Photos</p>
              <p className="mt-1 text-sm text-[#4a6358]">Leave blank to keep the current image. Upload a new file to replace it.</p>
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                {building.images[i] && (
                  <div className="relative h-36 overflow-hidden rounded-xl bg-[#d4ede0]">
                    <Image
                      src={building.images[i]}
                      alt={`Current image ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                      Current
                    </span>
                  </div>
                )}
                <label className="flex flex-col gap-1 text-sm font-medium text-[#1e2a27]">
                  Image {i + 1}{" "}
                  {i === 0 && !building.images[0] ? (
                    "*"
                  ) : (
                    <span className="font-normal text-[#4a6358]">(optional)</span>
                  )}
                  <input
                    type="file"
                    name={`buildingImage${i + 1}`}
                    accept="image/*"
                    className="rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 text-[#4a6358]"
                  />
                </label>
              </div>
            ))}
          </section>

          <div className="flex justify-end border-t border-[#eef7f1] pt-6">
            <button
              type="submit"
              className="rounded-full bg-[#0a6d3c] px-8 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
