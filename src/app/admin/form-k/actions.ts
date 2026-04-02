"use server";

import { revalidatePath } from "next/cache";
import { updateFormKStatus } from "@/lib/form-k";

export async function approveFormKAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing submission ID.");
  await updateFormKStatus(id, "confirmed");
  revalidatePath(`/admin/form-k/${id}`);
  revalidatePath("/admin/form-k");
}
