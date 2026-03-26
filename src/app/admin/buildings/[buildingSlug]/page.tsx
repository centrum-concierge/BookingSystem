// ...existing code...
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteAmenityAction, deleteBuildingAction } from "@/app/admin/actions";
import { getBuildingBySlug, getBuildings } from "@/lib/buildings";

export const dynamic = "force-dynamic";

type BuildingAdminPageProps = {
  params: Promise<{
    buildingSlug: string;
  }>;
};

export async function generateStaticParams() {
  const buildings = await getBuildings();
  return buildings.map((building) => ({ buildingSlug: building.slug }));
}

export default async function BuildingAdminPage({ params }: BuildingAdminPageProps) {
  const { buildingSlug } = await params;
  const building = await getBuildingBySlug(buildingSlug);

  if (!building) notFound();

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <header className="bg-[#0a6d3c] px-6 py-4 shadow-lg md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
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

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:px-10 lg:px-16">
        {/* Building hero card */}
        <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.1)] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[280px] bg-[#d4ede0] lg:min-h-[360px]">
            {building.images[0] ? (
              <Image
                src={building.images[0]}
                alt={building.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_transparent_40%,_rgba(10,40,20,0.45))]" />
          </div>

          <div className="flex flex-col justify-between gap-6 px-6 py-8 md:px-8">
            <div>
              <span className="inline-block rounded-full bg-[#eef7f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#0a6d3c]">
                {building.location}
              </span>
              <h1 className="mt-4 font-display text-4xl text-[#1e2a27] md:text-5xl">{building.name}</h1>
              <p className="mt-3 text-base leading-7 text-[#4a6358]">{building.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admin/buildings/${building.slug}/bookings`}
                className="rounded-full border border-blue-200 px-5 py-2.5 text-sm font-semibold text-blue-700 transition duration-200 hover:bg-blue-50"
              >
                Bookings
              </Link>
              <Link
                href={`/admin/buildings/${building.slug}/amenities/new`}
                className="rounded-full bg-[#0a6d3c] px-6 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
              >
                + Add Amenity
              </Link>
              <Link
                href={`/admin/buildings/${building.slug}/edit`}
                className="rounded-full border border-[#d4ede0] px-5 py-2.5 text-sm font-semibold text-[#0a6d3c] transition duration-200 hover:bg-[#eef7f1]"
              >
                Edit Building
              </Link>
              <form action={deleteBuildingAction}>
                <input type="hidden" name="slug" value={building.slug} />
                <button
                  type="submit"
                  className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition duration-200 hover:bg-red-50"
                >
                  Remove Building
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Amenities</p>
              <h2 className="mt-1 font-display text-3xl text-[#1e2a27]">{building.name}</h2>
            </div>
            <Link
              href={`/admin/buildings/${building.slug}/amenities/new`}
              className="rounded-full border border-[#d4ede0] px-5 py-2 text-sm font-semibold text-[#0a6d3c] transition duration-200 hover:bg-[#eef7f1]"
            >
              + Add Amenity
            </Link>
          </div>

          {building.amenities.length === 0 ? (
            <div className="rounded-[20px] bg-white px-8 py-14 text-center shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7f1]">
                <span className="text-2xl">🏋️</span>
              </div>
              <h3 className="font-display text-2xl text-[#1e2a27]">No amenities yet</h3>
              <p className="mt-2 text-sm leading-6 text-[#4a6358]">Add amenities that residents can browse and book.</p>
              <Link
                href={`/admin/buildings/${building.slug}/amenities/new`}
                className="mt-6 inline-flex rounded-full bg-[#0a6d3c] px-6 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
              >
                Add First Amenity
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {building.amenities.map((amenity) => (
                <article
                  key={amenity.id}
                  className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.08)]"
                >
                  <div className="relative h-52 overflow-hidden bg-[#d4ede0]">
                    {amenity.images[0] ? (
                      <Image
                        src={amenity.images[0]}
                        alt={amenity.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-4 px-5 py-5">
                    <div>
                      <h3 className="font-display text-xl text-[#1e2a27]">{amenity.name}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[#4a6358]">{amenity.description}</p>
                    </div>
                    {amenity.calBookingLink ? (
                      <span className="inline-block rounded-full bg-[#eef7f1] px-3 py-1 text-xs font-medium text-[#0a6d3c]">
                        ✓ Cal.com linked
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        No booking link yet
                      </span>
                    )}
                    <div className="flex items-center justify-end gap-2 border-t border-[#eef7f1] pt-3">
                      <Link
                        href={`/admin/buildings/${building.slug}/amenities/${amenity.slug}/edit`}
                        className="rounded-full border border-[#d4ede0] px-4 py-1.5 text-xs font-semibold text-[#0a6d3c] transition duration-200 hover:bg-[#eef7f1]"
                      >
                        Edit
                      </Link>
                      <form action={deleteAmenityAction}>
                        <input type="hidden" name="buildingSlug" value={building.slug} />
                        <input type="hidden" name="amenitySlug" value={amenity.slug} />
                        <button
                          type="submit"
                          className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition duration-200 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
