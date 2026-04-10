/**
 * Raw Supabase row shapes — snake_case, matching DB column names exactly.
 * Used only in lib/ mapper functions to replace `any` parameter types.
 * Do not use these directly in components; import the app-level types from lib/ instead.
 */

// ─── amenity_images ───────────────────────────────────────────────────────────

export type AmenityImageRow = {
  url: string
  position: number
}

// ─── amenities ────────────────────────────────────────────────────────────────

export type AmenityRow = {
  id: string
  building_id: number
  slug: string
  name: string
  description: string | null
  cal_booking_link: string | null
  terms_and_conditions: string | null
  created_at: string
  updated_at: string
  amenity_images: AmenityImageRow[]
}

// ─── buildings (with nested amenities join) ───────────────────────────────────

export type BuildingRow = {
  id: number
  name: string
  address: string | null
  strata_plan: string | null
  created_at: string
  amenities: AmenityRow[]
}

// ─── tenants (used in form_k_submissions join) ────────────────────────────────

export type FormKTenantRow = {
  id: string
  submission_id: string
  full_name: string
  email: string | null
  phone_cell: string | null
  phone_work: string | null
  created_at: string
  updated_at: string
}

// ─── form_k_submissions (with nested buildings + tenants) ─────────────────────

export type FormKSubmissionRow = {
  id: string
  building_id: string
  strata_plan_number: string
  strata_lot_number: string
  unit_number: string
  tenancy_start_date: string
  landlord_name: string
  landlord_email: string | null
  landlord_contact_number: string | null
  landlord_notice_address_line1: string | null
  landlord_notice_address_line2: string | null
  status: string
  submitted_at: string
  created_at: string
  updated_at: string
  buildings: { name: string } | null
  tenants: FormKTenantRow[]
}

// ─── form_k (with nested tenants / owners / units+buildings join) ─────────────

export type FormKBuildingJoin = {
  name: string
  address: string | null
  strata_plan: string | null
}

export type FormKUnitJoin = {
  unit_number: number | null
  strata_lot: string | null
  buildings: FormKBuildingJoin | null
}

export type FormKTenantJoin = {
  name: string
  phone_number: number | null
  email: string | null
}

export type FormKOwnerJoin = {
  full_name: string
  phone_number: string | null
  current_address: string | null
}

export type FormKRow = {
  id: string
  tenancy_commencing: string | null
  signature_tenant: string | null
  signature_owner: string | null
  status: string | null
  created_at: string
  form_k_file: string | null
  // Hyphenated column name — accessed via bracket notation
  'k-form_id': string | null
  tenants: FormKTenantJoin | null
  owners: FormKOwnerJoin | null
  units: FormKUnitJoin | null
}

// ─── form_k summary (dashboard query — partial select) ────────────────────────

export type FormKSummaryRow = {
  id: string
  tenancy_commencing: string | null
  status: string | null
  created_at: string
  signature_tenant: string | null
  signature_owner: string | null
}

// ─── residents (with nested tenants / owners / units+buildings join) ──────────

export type ResidentBuildingJoin = {
  id: number
  name: string
  address: string
  strata_plan: string | null
}

export type ResidentUnitJoin = {
  id: number
  unit_number: number | null
  building: number | null
  buildings: ResidentBuildingJoin | null
}

export type ResidentTenantJoin = {
  id: string
  name: string
  phone_number: number | null
  email: string
}

export type ResidentOwnerJoin = {
  id: string
  full_name: string
  phone_number: string | null
  email: string
  current_address: string | null
}

export type ResidentRow = {
  id: string
  tenant: string | null
  owner: string | null
  unit: number | null
  tenants: ResidentTenantJoin | null
  owners: ResidentOwnerJoin | null
  units: ResidentUnitJoin | null
}
