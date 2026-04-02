import { NextRequest, NextResponse } from "next/server";

// This endpoint receives webhook events from Cal.com
export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    // Log the event for debugging
    console.log("Received Cal.com webhook event:", event);

    // TODO: Process the event (e.g., store in DB, trigger notifications, etc.)
    // Example: if (event.type === "booking.created") { ... }

    // Respond with 200 OK to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling Cal.com webhook:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

// Optionally, handle GET for webhook test pings
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint is live" });
}
