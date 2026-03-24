import "server-only";

import { randomUUID } from "node:crypto";
import { supabase } from "./supabase";

export type FormKTenant = {
  id: string;
  submissionId: string;
  fullName: string;
  email: string;
  phoneCell: string;
  phoneWork: string;
  createdAt: string;
  updatedAt: string;
};

export type FormKSubmission = {
  id: string;
  buildingId: string;
  buildingName: string;
  strataPlanNumber: string;
  strataLotNumber: string;
  unitNumber: string;
  tenancyStartDate: string;
  landlordName: string;
  landlordEmail: string;
  landlordContactNumber: string;
  landlordNoticeAddressLine1: string;
  landlordNoticeAddressLine2: string;
  status: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  tenants: FormKTenant[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTenant(row: any): FormKTenant {
  return {
    id: row.id,
    submissionId: row.submission_id,
    fullName: row.full_name,
    email: row.email ?? "",
    phoneCell: row.phone_cell ?? "",
    phoneWork: row.phone_work ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSubmission(row: any): FormKSubmission {
  return {
    id: row.id,
    buildingId: row.building_id,
    buildingName: row.buildings?.name ?? "",
    strataPlanNumber: row.strata_plan_number,
    strataLotNumber: row.strata_lot_number,
    unitNumber: row.unit_number,
    tenancyStartDate: row.tenancy_start_date,
    landlordName: row.landlord_name,
    landlordEmail: row.landlord_email ?? "",
    landlordContactNumber: row.landlord_contact_number ?? "",
    landlordNoticeAddressLine1: row.landlord_notice_address_line1 ?? "",
    landlordNoticeAddressLine2: row.landlord_notice_address_line2 ?? "",
    status: row.status,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tenants: (row.tenants ?? []).map(rowToTenant),
  };
}

export async function getFormKSubmissions(): Promise<FormKSubmission[]> {
  const { data, error } = await supabase
    .from("form_k_submissions")
    .select("*, buildings(name), tenants(*)")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToSubmission);
}

export async function getFormKSubmissionById(id: string): Promise<FormKSubmission | null> {
  const { data, error } = await supabase
    .from("form_k_submissions")
    .select("*, buildings(name), tenants(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToSubmission(data);
}

export async function insertFormKSubmission(
  data: {
    buildingId: string;
    strataPlanNumber: string;
    strataLotNumber: string;
    unitNumber: string;
    tenancyStartDate: string;
    landlordName: string;
    landlordContactNumber?: string;
    landlordNoticeAddressLine1?: string;
    landlordNoticeAddressLine2?: string;
  },
  tenants: { fullName: string; email?: string; phoneCell?: string; phoneWork?: string }[]
): Promise<string> {
  const id = `fk_${randomUUID()}`;

  const { error: subError } = await supabase.from("form_k_submissions").insert({
    id,
    building_id: data.buildingId,
    strata_plan_number: data.strataPlanNumber,
    strata_lot_number: data.strataLotNumber,
    unit_number: data.unitNumber,
    tenancy_start_date: data.tenancyStartDate,
    landlord_name: data.landlordName,
    landlord_contact_number: data.landlordContactNumber || null,
    landlord_notice_address_line1: data.landlordNoticeAddressLine1 || null,
    landlord_notice_address_line2: data.landlordNoticeAddressLine2 || null,
    status: "pending",
  });
  if (subError) throw subError;

  if (tenants.length > 0) {
    const tenantRows = tenants.map((t) => ({
      id: `tenant_${randomUUID()}`,
      submission_id: id,
      full_name: t.fullName,
      email: t.email || null,
      phone_cell: t.phoneCell || null,
      phone_work: t.phoneWork || null,
    }));
    const { error: tenantError } = await supabase.from("tenants").insert(tenantRows);
    if (tenantError) throw tenantError;
  }

  return id;
}

export async function updateFormKStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("form_k_submissions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
