'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AuthState = { error: string; notFound?: boolean } | null

export async function signIn(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return {
      error: 'No account found with those details. Please check your credentials or sign up.',
      notFound: true,
    }
  }

  redirect('/dashboard')
}
