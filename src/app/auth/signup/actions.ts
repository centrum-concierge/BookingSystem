'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export type AuthState = { error: string } | null

/**
 * Finds the residents row linked to this email via the tenants or owners table.
 * Returns the resident id if found, null if no registration exists.
 */
async function findResidentIdByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient()

  // Look for a matching tenant
  const { data: tenantRows } = await admin
    .from('tenants')
    .select('id')
    .eq('email', email)
    .limit(1)

  if (tenantRows && tenantRows.length > 0) {
    const { data: resident } = await admin
      .from('residents')
      .select('id')
      .eq('tenant', tenantRows[0].id)
      .maybeSingle()
    if (resident) return resident.id
  }

  // Look for a matching owner
  const { data: ownerRows } = await admin
    .from('owners')
    .select('id')
    .eq('email', email)
    .limit(1)

  if (ownerRows && ownerRows.length > 0) {
    const { data: resident } = await admin
      .from('residents')
      .select('id')
      .eq('owner', ownerRows[0].id)
      .maybeSingle()
    if (resident) return resident.id
  }

  return null
}

export async function signUp(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const admin = createAdminClient()
  const supabase = await createClient()

  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string
  const firstName = (formData.get('firstName') as string).trim()
  const lastName = (formData.get('lastName') as string).trim()

  if (!email || !password || !firstName || !lastName) {
    return { error: 'All fields are required.' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  // ── Step 1: Small delay then verify a registration exists for this email ──
  await new Promise((r) => setTimeout(r, 1500))

  const residentId = await findResidentIdByEmail(email)

  if (!residentId) {
    return {
      error:
        'No registration found for this email. Please complete the building registration form before creating an account.',
    }
  }

  // ── Step 2: Create the auth account ──
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  })

  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      return { error: 'An account with this email already exists. Please sign in instead.' }
    }
    return { error: signUpError.message }
  }

  const userId = signUpData.user?.id
  if (!userId) return { error: 'Signup failed unexpectedly. Please try again.' }

  // ── Step 3: Link the resident row to the new auth user ──
  const { error: linkError } = await admin
    .from('residents')
    .update({ user_id: userId })
    .eq('id', residentId)

  if (linkError) {
    console.error('[signup] Failed to link resident to user:', linkError.message)
  }

  redirect('/dashboard')
}


