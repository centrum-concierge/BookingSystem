import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBuildingBySlug, getBuildings } from "@/lib/buildings";

export const revalidate = 3600; // Re-generate at most once per hour

type BuildingPageProps = {
  params: Promise<{ buildingSlug: string }>;
};

export async function generateStaticParams() {
  try {
    const buildings = await getBuildings();
    return buildings.map((b) => ({ buildingSlug: b.slug }));
  } catch {
    return [];
  }
}

export default async function BuildingPage({ params }: BuildingPageProps) {
  const { buildingSlug } = await params;
  const building = await getBuildingBySlug(buildingSlug);
  if (!building) notFound();

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      {/* Header */}
      <header className="bg-[#0a6d3c] px-6 py-5 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image src="/images/logos/icon_logo.png" alt="Centrum" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-[#a8d9be] sm:block">Centrum Concierge & Security</p>
              <p className="text-sm font-bold text-white">Amenity Booking</p>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
          >
            ← Search
          </Link>
        </div>
      </header>

      {/* Building hero */}
      <div className="relative h-72 overflow-hidden bg-[#d4ede0] md:h-96">
        {building.images[0] ? (
          <Image
            src={building.images[0]}
            alt={building.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_transparent_30%,_rgba(10,40,20,0.65))]" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            {building.location ? (
              <span className="mb-3 inline-block rounded-full bg-[#00a651] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white">
                {building.location}
              </span>
            ) : null}
            <h1 className="font-display text-3xl text-white sm:text-4xl md:text-5xl lg:text-6xl">{building.name}</h1>
          </div>
        </div>
      </div>

      {/* Building description + amenities */}
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-16">
        {building.description ? (
          <p className="mb-10 max-w-3xl text-lg leading-8 text-[#4a6358]">{building.description}</p>
        ) : null}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Available Amenities</p>
          <h2 className="mt-1 font-display text-3xl text-[#1e2a27]">
            {building.amenities.length === 0
              ? "No amenities available yet"
              : `${building.amenities.length} ${building.amenities.length === 1 ? "space" : "spaces"} to book`}
          </h2>
        </div>

        {building.amenities.length === 0 ? (
          <div className="mt-8 rounded-[20px] bg-white px-8 py-12 text-center shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
            <p className="text-[#4a6358]">Amenities are coming soon. Check back later.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {building.amenities.map((amenity) => (
              <Link
                key={amenity.id}
                href={`/${building.slug}/${amenity.slug}`}
                className="group overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.08)] transition duration-200 hover:shadow-[0_8px_40px_rgba(10,109,60,0.18)]"
              >
                <div className="relative h-52 overflow-hidden bg-[#d4ede0]">
                  {amenity.images[0] ? (
                    <Image
                      src={amenity.images[0]}
                      alt={amenity.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_transparent_50%,_rgba(10,40,20,0.4))]" />
                </div>
                <div className="px-5 py-5">
                  <h3 className="font-display text-xl text-[#1e2a27]">{amenity.name}</h3>
                  {amenity.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4a6358]">{amenity.description}</p>
                  ) : null}
                  <p className="mt-4 text-xs font-semibold text-[#00a651]">Book this space →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-[#d4ede0] py-6 text-center text-xs text-[#4a6358]">
        Powered by Centrum Concierge & Security Ltd.
      </footer>
    </main>
  );
}
