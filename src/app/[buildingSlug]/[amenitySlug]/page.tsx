import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CalEmbed from "@/components/cal-embed";
import { getBuildingBySlug, getBuildings } from "@/lib/buildings";

export const dynamic = "force-dynamic";

type AmenityPageProps = {
  params: Promise<{ buildingSlug: string; amenitySlug: string }>;
};

export async function generateStaticParams() {
  const buildings = await getBuildings();
  return buildings.flatMap((b) => b.amenities.map((a) => ({ buildingSlug: b.slug, amenitySlug: a.slug })));
}

export default async function AmenityPage({ params }: AmenityPageProps) {
  const { buildingSlug, amenitySlug } = await params;
  const building = await getBuildingBySlug(buildingSlug);
  if (!building) notFound();

  const amenity = building.amenities.find((a) => a.slug === amenitySlug);
  if (!amenity) notFound();

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      {/* Header */}
      <header className="bg-[#0a6d3c] px-6 py-5 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 overflow-hidden">
              <Image src="/images/logos/icon_logo.png" alt="Centrum" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-[#a8d9be] sm:block">Centrum Concierge & Security</p>
              <p className="text-sm font-bold text-white">Amenity Booking</p>
            </div>
          </Link>
          <Link
            href={`/${buildingSlug}`}
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
          >
            ← {building.name}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: amenity info */}
          <div className="flex flex-col gap-6">
            {/* Photo gallery */}
            <div className="grid gap-3">
              {amenity.images[0] ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#d4ede0]">
                  <Image
                    src={amenity.images[0]}
                    alt={amenity.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : null}
              {amenity.images.length > 1 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {amenity.images.slice(1).map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-[12px] bg-[#d4ede0]">
                      <Image src={src} alt={`${amenity.name} ${i + 2}`} fill className="object-cover" sizes="25vw" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Amenity details */}
            <div className="rounded-[20px] bg-white px-6 py-7 shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
              <span className="inline-block rounded-full bg-[#eef7f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#0a6d3c]">
                {building.name}
              </span>
              <h1 className="mt-4 font-display text-3xl text-[#1e2a27] md:text-4xl">{amenity.name}</h1>
              {amenity.description ? (
                <p className="mt-4 text-base leading-8 text-[#4a6358]">{amenity.description}</p>
              ) : null}
            </div>
          </div>

          {/* Right: Cal.com booking embed */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[20px] bg-white px-6 py-6 shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Book This Space</p>
              <h2 className="mt-1 font-display text-2xl text-[#1e2a27]">Select a time</h2>
            </div>
            <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(10,109,60,0.08)]">
              {amenity.calBookingLink ? (
                <CalEmbed calLink={amenity.calBookingLink} />
              ) : (
                <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <p className="font-semibold text-[#1e2a27]">Booking coming soon</p>
                  <p className="mt-2 text-sm text-[#4a6358]">Online booking for this amenity is not yet set up. Please contact the front desk.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-10 border-t border-[#d4ede0] py-6 text-center text-xs text-[#4a6358]">
        Powered by Centrum Concierge & Security Ltd.
      </footer>
    </main>
  );
}
