"use server";

import { redirect } from "next/navigation";
import { insertFormKSubmission } from "@/lib/form-k";

function getText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function submitFormKAction(formData: FormData) {
  const buildingId = getText(formData, "buildingId");
  const strataPlanNumber = getText(formData, "strataPlanNumber");
  const strataLotNumber = getText(formData, "strataLotNumber");
  const unitNumber = getText(formData, "unitNumber");
  const tenancyStartDate = getText(formData, "tenancyStartDate");
  const landlordName = getText(formData, "landlordName");

  if (!buildingId || !strataPlanNumber || !strataLotNumber || !unitNumber || !tenancyStartDate || !landlordName) {
    throw new Error("Please fill in all required fields.");
  }

  // Email and phone are shared across tenants (matches Form K layout)
  const sharedEmail = getText(formData, "tenantEmail") || undefined;
  const sharedPhoneCell = getText(formData, "tenantPhoneCell") || undefined;
  const sharedPhoneWork = getText(formData, "tenantPhoneWork") || undefined;

  const tenants: { fullName: string; email?: string; phoneCell?: string; phoneWork?: string }[] = [];

  const tenant1Name = getText(formData, "tenant1FullName");
  if (tenant1Name) {
    tenants.push({
      fullName: tenant1Name,
      email: sharedEmail,
      phoneCell: sharedPhoneCell,
      phoneWork: sharedPhoneWork,
    });
  }

  const tenant2Name = getText(formData, "tenant2FullName");
  if (tenant2Name) {
    tenants.push({ fullName: tenant2Name });
  }

  await insertFormKSubmission(
    {
      buildingId,
      strataPlanNumber,
      strataLotNumber,
      unitNumber,
      tenancyStartDate,
      landlordName,
      landlordContactNumber: getText(formData, "landlordContactNumber") || undefined,
      landlordNoticeAddressLine1: getText(formData, "landlordNoticeAddressLine1") || undefined,
      landlordNoticeAddressLine2: getText(formData, "landlordNoticeAddressLine2") || undefined,
    },
    tenants
  );

  redirect("/form-k/success");
}
