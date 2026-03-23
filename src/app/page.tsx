import Image from "next/image";
import { getBuildings } from "@/lib/buildings";
import BuildingSearch from "@/components/building-search";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const [buildings, params] = await Promise.all([getBuildings(), searchParams]);
  const buildingList = buildings.map((b) => ({
    name: b.name,
    slug: b.slug,
    description: b.description ?? "",
    image: b.images?.[0] ?? "",
  }));
  const { error, name } = params;

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background video — preloaded via layout <head> link */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/videos/home_video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(8,32,16,0.60)]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl text-center">
          {/* Banner logo */}
          <div className="mx-auto mb-10 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Image
              src="/images/logos/cen_tran.png"
              alt="Centrum Concierge & Security"
              width={480}
              height={180}
              className="mx-auto w-full object-contain drop-shadow-[0_4px_32px_rgba(0,0,0,0.5)] mix-blend-screen"
              priority
            />
          </div>

          <h1 className="font-display text-4xl font-black text-white drop-shadow-md md:text-5xl lg:text-6xl">
            Book Your Amenity
          </h1>
          <p className="mt-4 text-lg leading-8 text-white/75">
            Enter your building name to see available amenities and book your space.
          </p>

          <div className="mt-10">
            <BuildingSearch buildings={buildingList} />
          </div>

          {error === "not-found" && name && (
            <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
              No building found matching &ldquo;<strong>{decodeURIComponent(name)}</strong>&rdquo;. Please check the name and try again.
            </p>
          )}
          {error === "empty" && (
            <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
              Please enter a building name.
            </p>
          )}
        </div>
      </div>

      <footer className="relative z-10 py-5 text-center text-xs text-white/40">
        Powered by Centrum Concierge &amp; Security Ltd.
      </footer>
    </main>
  );
}

