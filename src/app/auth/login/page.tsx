'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn } from './actions'
import GoogleButton from '../google-button'

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4faf7] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a6d3c]">
            Centrum Concierge &amp; Security
          </p>
          <h1 className="mt-2 font-display text-3xl text-[#1e2a27]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#4a6358]">Sign in to continue to your account.</p>
        </div>

        <div className="rounded-2xl border border-[#d4ede0] bg-white p-6 shadow-sm sm:p-8">
          <GoogleButton label="Sign in with Google" />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d4ede0]" />
            <span className="text-xs font-medium text-[#4a6358]">or sign in with email</span>
            <div className="h-px flex-1 bg-[#d4ede0]" />
          </div>

          {state?.error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
              {state.notFound && (
                <p className="mt-1.5">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="font-semibold underline">
                    Sign up here
                  </Link>
                </p>
              )}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4a6358]">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-[#d4ede0] bg-[#f4faf7] px-3 py-2.5 text-sm text-[#1e2a27] outline-none transition focus:border-[#0a6d3c] focus:ring-2 focus:ring-[#0a6d3c]/20"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4a6358]">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-[#d4ede0] bg-[#f4faf7] px-3 py-2.5 text-sm text-[#1e2a27] outline-none transition focus:border-[#0a6d3c] focus:ring-2 focus:ring-[#0a6d3c]/20"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-full bg-[#0a6d3c] py-3 text-sm font-semibold uppercase tracking-widest text-white shadow transition hover:bg-[#00a651] disabled:opacity-60"
            >
              {pending ? 'Signing inâ€¦' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-[#4a6358]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-semibold text-[#0a6d3c] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}

