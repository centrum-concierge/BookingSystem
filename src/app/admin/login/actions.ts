"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";

export async function loginAction(formData: FormData) {
  const pin = String(formData.get("pin") ?? "").trim();
  const expectedPin = process.env.ADMIN_PIN;

  if (!expectedPin) {
    throw new Error("Admin PIN is not configured.");
  }

  if (pin !== expectedPin) {
    redirect("/admin/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    // Session cookie — expires when browser closes
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
