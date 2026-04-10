import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { unstable_cache, revalidateTag } from 'next/cache'
import type { ResidentRow, FormKSummaryRow } from '@/types/database'

export type ResidentProfile = {
  id: string
  role: 'tenant' | 'owner'
  unit: string | null
  unitNumber: number | null
  building: {
    id: number
    name: string
    address: string
    strataPlan: string | null
  } | null
  tenant: {
    id: string
    name: string
    email: string
    phone: string | null
  } | null
  owner: {
    id: string
    fullName: string
    email: string
    phone: string | null
    currentAddress: string | null
  } | null
  formK: {
    id: string
    tenancyCommencing: string | null
    status: string | null
    createdAt: string
    signatureTenant: string | null
    signatureOwner: string | null
  }[]
}

/**
 * Fetches the full resident profile for the currently authenticated user.
 * Redirects to /auth/login if not signed in.
 * Redirects to /onboarding if no resident record is linked yet.
 */
const RESIDENT_SELECT = `
  id,
  tenant,
  owner,
  unit,
  tenants ( id, name, phone_number, email ),
  owners ( id, full_name, phone_number, email, current_address ),
  units!residents_unit_fkey (
    id,
    unit_number,
    building,
    buildings!unit_building_fkey ( id, name, address, strata_plan )
  )
`

// Cached DB fetch — keyed per user ID, revalidates every 60 seconds
function fetchResidentProfile(userId: string, userEmail: string | undefined) {
  return unstable_cache(
    async (): Promise<ResidentProfile | null> => {
      const admin = createAdminClient()

      // --- Primary lookup: by user_id ---
      let resident: ResidentRow | null = null
      const { data: byUserId } = await admin
        .from('residents')
        .select(RESIDENT_SELECT)
        .eq('user_id', userId)
        .maybeSingle()
      resident = (byUserId ?? null) as ResidentRow | null

      // --- Fallback: look up by email via tenants table ---
      if (!resident && userEmail) {
        const { data: tenantRow } = await admin
          .from('tenants')
          .select('id')
          .ilike('email', userEmail)
          .maybeSingle()

        if (tenantRow) {
          const { data } = await admin
            .from('residents')
            .select(RESIDENT_SELECT)
            .eq('tenant', tenantRow.id)
            .maybeSingle()
          resident = (data ?? null) as ResidentRow | null

          if (resident) {
            await admin.from('residents').update({ user_id: userId }).eq('id', resident.id)
          }
        }
      }

      // --- Fallback: look up by email via owners table ---
      if (!resident && userEmail) {
        const { data: ownerRow } = await admin
          .from('owners')
          .select('id')
          .ilike('email', userEmail)
          .maybeSingle()

        if (ownerRow) {
          const { data } = await admin
            .from('residents')
            .select(RESIDENT_SELECT)
            .eq('owner', ownerRow.id)
            .maybeSingle()
          resident = (data ?? null) as ResidentRow | null

          if (resident) {
            await admin.from('residents').update({ user_id: userId }).eq('id', resident.id)
          }
        }
      }

      if (!resident) return null

      const unitData = resident.units ?? null
      const buildingData = unitData?.buildings ?? null

      // Fetch form_k submissions linked to this tenant
      let formKRows: ResidentProfile['formK'] = []
      if (resident.tenant) {
        const { data } = await admin
          .from('form_k')
          .select('id, tenancy_commencing, status, created_at, signature_tenant, signature_owner')
          .eq('tenants', resident.tenants?.id ?? resident.tenant)
          .order('created_at', { ascending: false })
        formKRows = (data ?? []).map((r: FormKSummaryRow) => ({
          id: r.id,
          tenancyCommencing: r.tenancy_commencing,
          status: r.status,
          createdAt: r.created_at,
          signatureTenant: r.signature_tenant,
          signatureOwner: r.signature_owner,
        }))
      }

      return {
        id: resident.id,
        role: resident.tenant ? 'tenant' : 'owner',
        unit: resident.unit ? String(resident.unit) : null,
        unitNumber: unitData?.unit_number ?? null,
        building: buildingData
          ? {
              id: buildingData.id,
              name: buildingData.name,
              address: buildingData.address,
              strataPlan: buildingData.strata_plan ?? null,
            }
          : null,
        tenant: resident.tenants
          ? {
              id: resident.tenants.id,
              name: resident.tenants.name,
              email: resident.tenants.email,
              phone: resident.tenants.phone_number != null ? String(resident.tenants.phone_number) : null,
            }
          : null,
        owner: resident.owners
          ? {
              id: resident.owners.id,
              fullName: resident.owners.full_name,
              email: resident.owners.email,
              phone: resident.owners.phone_number ?? null,
              currentAddress: resident.owners.current_address ?? null,
            }
          : null,
        formK: formKRows,
      }
    },
    [`resident-profile-${userId}`],
    { revalidate: 60, tags: [`resident-${userId}`] }
  )()
}

export async function getResidentProfile(): Promise<ResidentProfile> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await fetchResidentProfile(user.id, user.email ?? undefined)
  if (!profile) redirect('/onboarding')
  return profile
}

/**
 * Bust the per-user dashboard cache after mutations (e.g. Form K signed).
 * Call with the resident's user ID: invalidateResidentCache(userId)
 */
export function invalidateResidentCache(userId: string) {
  revalidateTag(`resident-${userId}`, {})
}

