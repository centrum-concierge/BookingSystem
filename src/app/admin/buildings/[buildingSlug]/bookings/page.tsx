import { getBuildingBySlug } from "@/lib/buildings";
import { notFound } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

async function fetchCalBookings(calcomUserId: string) {
  const apiKey = process.env.CALCOM_API_KEY;
  if (!apiKey) throw new Error("Cal.com API key not set");
  const res = await fetch(`https://api.cal.com/v2/bookings?userId=${calcomUserId}&take=100`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": "2026-02-25",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export default async function BuildingBookingsPage({ params }: { params: { buildingSlug: string } }) {
  const building = await getBuildingBySlug(params.buildingSlug);
  if (!building) notFound();
  let bookings: any[] = [];
  let error = null;
  try {
    const data = await fetchCalBookings(building.calcomUserId);
    bookings = data.data || [];
  } catch (e: any) {
    error = e.message;
  }

  return (
    <main className="min-h-screen bg-[#f4faf7]">
      <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
        <h1 className="font-display text-3xl text-[#1e2a27] mb-6">Bookings for {building.name}</h1>
        {error && <div className="mb-4 text-red-600">Error: {error}</div>}
        <div className="rounded-xl bg-white p-6 shadow">
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Title</th>
                  <th className="py-2">Start</th>
                  <th className="py-2">End</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="py-2">{b.title}</td>
                    <td className="py-2">{b.start}</td>
                    <td className="py-2">{b.end}</td>
                    <td className="py-2">{b.status}</td>
                    <td className="py-2">
                      {/* Placeholder for approve/schedule actions */}
                      <button className="mr-2 rounded bg-green-100 px-3 py-1 text-xs text-green-800">Approve</button>
                      <button className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-800">Schedule</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
