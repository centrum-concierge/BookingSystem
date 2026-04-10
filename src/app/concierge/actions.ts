"use server";

import { revalidatePath } from "next/cache";

async function fireN8nWebhook(
  webhookUrl: string,
  payload: Record<string, unknown>,
  expectedStatus: string,
  failureMessage: string,
) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`n8n webhook error ${res.status}: ${text}`);
  }
  // Parse the Respond to Webhook response body
  // e.g. { "status": "accepted" } or { "status": "denied", "message": "..." }
  try {
    const json = await res.json();
    if (json?.status !== expectedStatus) {
      throw new Error(json?.message ?? failureMessage);
    }
  } catch (e) {
    if (e instanceof SyntaxError) return; // non-JSON response — treat as success
    throw e;
  }
}

export async function acceptBooking(calBookingId: number, uid: string) {
  const webhookUrl = process.env.N8N_WEBHOOK_ACCEPT;
  if (!webhookUrl) throw new Error("N8N_WEBHOOK_ACCEPT is not configured");

  await fireN8nWebhook(
    webhookUrl,
    { calBookingId, uid, action: "accept" },
    "accepted",
    "Failed to approve booking. Please try again later.",
  );

  revalidatePath("/concierge");
}

export async function denyBooking(calBookingId: number, uid: string, reason?: string) {
  const webhookUrl = process.env.N8N_WEBHOOK_DENY;
  if (!webhookUrl) throw new Error("N8N_WEBHOOK_DENY is not configured");

  await fireN8nWebhook(
    webhookUrl,
    { calBookingId, uid, action: "deny", reason: reason ?? "" },
    "accepted",
    "Failed to deny booking. Please try again later.",
  );

  revalidatePath("/concierge");
}

export async function cancelBooking(calBookingId: number, uid: string, reason?: string) {
  const webhookUrl = process.env.N8N_WEBHOOK_CANCEL;
  if (!webhookUrl) throw new Error("N8N_WEBHOOK_CANCEL is not configured");

  await fireN8nWebhook(
    webhookUrl,
    { calBookingId, uid, action: "cancel", reason: reason ?? "" },
    "accepted",
    "Failed to cancel booking. Please try again later.",
  );

  revalidatePath("/concierge");
}

export async function rescheduleBooking(
  calBookingId: number,
  uid: string,
  newStart: string,
  reason?: string,
) {
  const webhookUrl = process.env.N8N_WEBHOOK_RESCHEDULE;
  if (!webhookUrl) throw new Error("N8N_WEBHOOK_RESCHEDULE is not configured");

  await fireN8nWebhook(
    webhookUrl,
    { calBookingId, uid, action: "reschedule", newStart, reason: reason ?? "" },
    "accepted",
    "Failed to reschedule booking. Please try again later.",
  );

  revalidatePath("/concierge");
}

export async function noShowBooking(calBookingId: number, uid: string) {
  const webhookUrl = process.env.N8N_WEBHOOK_NO_SHOW;
  if (!webhookUrl) throw new Error("N8N_WEBHOOK_NO_SHOW is not configured");

  await fireN8nWebhook(
    webhookUrl,
    { calBookingId, uid, action: "no-show" },
    "accepted",
    "Failed to mark booking as no-show. Please try again later.",
  );

  revalidatePath("/concierge");
}

