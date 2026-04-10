'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { signUp } from './actions'
import GoogleButton from '../google-button'

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUp, null)
  const [formSubmitted, setFormSubmitted] = useState<boolean | null>(null)

  useEffect(() => {
    setFormSubmitted(sessionStorage.getItem('diamond_form_submitted') === 'true')
  }, [])

  // Still checking sessionStorage
  if (formSubmitted === null) return null

  // Blocked â€” form not submitted yet
  if (!formSubmitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4faf7] px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-amber-500">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0a6d3c]">One step first</p>
          <h1 className="mt-2 font-display text-3xl text-[#1e2a27]">Complete the form first</h1>
          <p className="mt-3 text-sm text-[#4a6358]">
            You need to submit the building registration form before creating your account.
          </p>
          <Link
            href="/onboarding"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0a6d3c] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow transition hover:bg-[#00a651]"
          >
            Go to Registration Form
          </Link>
          <p className="mt-5 text-xs text-[#4a6358]">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-[#0a6d3c] hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4faf7] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a6d3c]">
            Centrum Concierge &amp; Security
          </p>
          <h1 className="mt-2 font-display text-3xl text-[#1e2a27]">Create your account</h1>
          <p className="mt-2 text-sm text-[#4a6358]">
            Start your onboarding &mdash; it only takes a minute.
          </p>
        </div>

        <div className="rounded-2xl border border-[#d4ede0] bg-white p-6 shadow-sm sm:p-8">
          <GoogleButton label="Sign up with Google" />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d4ede0]" />
            <span className="text-xs font-medium text-[#4a6358]">or sign up with email</span>
            <div className="h-px flex-1 bg-[#d4ede0]" />
          </div>

          {state?.error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4a6358]">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  className="w-full rounded-lg border border-[#d4ede0] bg-[#f4faf7] px-3 py-2.5 text-sm text-[#1e2a27] outline-none transition focus:border-[#0a6d3c] focus:ring-2 focus:ring-[#0a6d3c]/20"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4a6358]">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  className="w-full rounded-lg border border-[#d4ede0] bg-[#f4faf7] px-3 py-2.5 text-sm text-[#1e2a27] outline-none transition focus:border-[#0a6d3c] focus:ring-2 focus:ring-[#0a6d3c]/20"
                  placeholder="Smith"
                />
              </div>
            </div>

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
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-[#d4ede0] bg-[#f4faf7] px-3 py-2.5 text-sm text-[#1e2a27] outline-none transition focus:border-[#0a6d3c] focus:ring-2 focus:ring-[#0a6d3c]/20"
                placeholder="Min. 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-full bg-[#0a6d3c] py-3 text-sm font-semibold uppercase tracking-widest text-white shadow transition hover:bg-[#00a651] disabled:opacity-60"
            >
              {pending ? 'Creating accountâ€¦' : 'Create Account & Continue'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-[#4a6358]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-[#0a6d3c] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
