import Image from "next/image";
import Link from "next/link";
import { deleteBuildingAction } from "@/app/admin/actions";
import { logoutAction } from "@/app/admin/login/actions";
import { getBuildings } from "@/lib/buildings";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const buildings = await getBuildings();

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      {/* Header */}
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
          <div className="flex items-center gap-3">
            <Link
              href="/admin/buildings/new"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0a6d3c] transition duration-200 hover:bg-[#eef7f1]"
            >
              + Add Building
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:px-10 lg:px-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#00a651]">Overview</p>
          <h1 className="mt-2 font-display text-4xl text-[#1e2a27] md:text-5xl">Buildings</h1>
        </div>

        {buildings.length === 0 ? (
          <section className="rounded-[28px] bg-white px-8 py-16 shadow-[0_8px_40px_rgba(10,109,60,0.08)]">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7f1]">
                <span className="text-3xl">🏢</span>
              </div>
              <h2 className="font-display text-3xl text-[#1e2a27]">No buildings yet</h2>
              <p className="mt-3 text-base leading-7 text-[#4a6358]">
                Add your first building to get started. Each building gets its own amenity listing page for residents.
              </p>
              <Link
                href="/admin/buildings/new"
                className="mt-8 inline-flex items-center rounded-full bg-[#0a6d3c] px-8 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
              >
                Add First Building
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {buildings.map((building) => (
              <article
                key={building.id}
                className="overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.1)] transition duration-200 hover:shadow-[0_8px_40px_rgba(10,109,60,0.15)]"
              >
                <div className="relative h-56 overflow-hidden bg-[#d4ede0]">
                  {building.images[0] ? (
                    <Image
                      src={building.images[0]}
                      alt={building.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_transparent_50%,_rgba(10,40,20,0.55))]" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#0a6d3c]">
                    {building.location}
                  </span>
                </div>

                <div className="flex flex-col gap-4 px-6 py-6">
                  <div>
                    <h2 className="font-display text-2xl text-[#1e2a27]">{building.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4a6358]">{building.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[#eef7f1] pt-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00a651]">
                      {building.amenities.length} {building.amenities.length === 1 ? "amenity" : "amenities"}
                    </span>
                    <div className="flex items-center gap-2">
                      <form action={deleteBuildingAction}>
                        <input type="hidden" name="slug" value={building.slug} />
                        <button
                          type="submit"
                          className="rounded-full border border-[#e0e8e4] px-3 py-2.5 text-xs font-semibold text-[#4a6358] transition duration-200 hover:border-red-300 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </form>
                      <Link
                        href={`/admin/buildings/${building.slug}`}
                        className="rounded-full bg-[#0a6d3c] px-4 py-2.5 text-xs font-semibold text-white transition duration-200 hover:bg-[#00a651]"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
