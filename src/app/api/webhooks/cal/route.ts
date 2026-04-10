import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

function verifySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  // Cal.com sends either "sha256=<hex>" or just "<hex>" depending on version
  return safeCompare(`sha256=${hmac}`, signatureHeader) || safeCompare(hmac, signatureHeader);
}

function mapStatus(triggerEvent: string, payloadStatus?: string): string {
  if (triggerEvent === "BOOKING_CANCELLED") return "CANCELLED";
  if (triggerEvent === "BOOKING_REJECTED") return "REJECTED";
  if (triggerEvent === "BOOKING_RESCHEDULED") return "RESCHEDULED";
  if (payloadStatus) return payloadStatus;
  // BOOKING_REQUESTED = pending confirmation; BOOKING_CREATED = auto-confirmed
  if (triggerEvent === "BOOKING_REQUESTED") return "PENDING";
  if (triggerEvent === "BOOKING_CREATED") return "ACCEPTED";
  return "PENDING";
}

export async function POST(req: NextRequest) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CAL_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("X-Cal-Signature-256") ?? req.headers.get("x-cal-signature-256") ?? "";

  console.log("[cal-webhook] signature header:", JSON.stringify(signatureHeader));
  console.log("[cal-webhook] secret set:", !!secret);

  if (!verifySignature(rawBody, signatureHeader, secret)) {
    console.log("[cal-webhook] signature mismatch — rejecting");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { triggerEvent: string; payload?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    console.error("[cal-webhook] Failed to parse JSON body:", e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { triggerEvent, payload } = event;

  // Ping events have no payload — acknowledge immediately
  if (!payload?.uid) {
    return NextResponse.json({ ok: true });
  }

  const attendee = (payload.attendees as Array<{ name?: string; email?: string; timeZone?: string; phoneNumber?: string }>)?.[0];
  const responses = payload.responses as Record<string, { value?: unknown }> | undefined;
  const suiteNumber =
    (responses?.["suiteNumebr"]?.value as string | undefined) ??
    (responses?.["suiteNumber"]?.value as string | undefined) ??
    null;

  const bookingData = {
    cal_booking_id:
      typeof payload.bookingId === "number"
        ? payload.bookingId
        : typeof payload.id === "number"
          ? payload.id
          : null,
    cal_booking_uid: payload.uid as string,
    status: mapStatus(triggerEvent, payload.status as string | undefined),
    user_id: (payload.metadata as Record<string, string> | undefined)?.userId ?? null,
    attendee_name: attendee?.name ?? null,
    attendee_email: attendee?.email ?? null,
    attendee_phone: attendee?.phoneNumber ?? null,
    attendee_timezone: attendee?.timeZone ?? null,
    start_time: (payload.startTime as string) ?? null,
    end_time: (payload.endTime as string) ?? null,
    event_type_id: (payload.eventTypeId as number) ?? null,
    event_type_title:
      (payload.eventTitle as string) ?? (payload.title as string) ?? null,
    location: (payload.location as string) ?? null,
    notes: (payload.additionalNotes as string) || (payload.description as string) || null,
    suite_number: suiteNumber,
    cal_raw: payload,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("bookings")
    .upsert(bookingData, { onConflict: "cal_booking_uid" });

  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
