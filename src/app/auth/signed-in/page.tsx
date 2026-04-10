import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignedInContent from './signed-in-content'

export default async function SignedInPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const firstName = user.user_metadata?.first_name ?? 'Resident'

  return <SignedInContent firstName={firstName} email={user.email ?? ''} />
}
