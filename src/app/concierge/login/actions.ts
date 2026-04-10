"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "concierge_session";

export async function conciergeLoginAction(formData: FormData) {
  const pin = String(formData.get("pin") ?? "").trim();
  const expectedPin = process.env.CONCIERGE_PIN;

  if (!expectedPin) {
    throw new Error("Concierge PIN is not configured.");
  }

  if (pin !== expectedPin) {
    redirect("/concierge/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  redirect("/concierge");
}

export async function conciergeLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/concierge/login");
}
