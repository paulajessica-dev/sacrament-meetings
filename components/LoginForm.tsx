'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-ward focus:outline-none focus:ring-2 focus:ring-ward/30';

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-lg bg-white p-6 text-gray-900 shadow"
    >
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby="login-error"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          aria-describedby="login-error"
          className={inputClass}
        />
      </div>

      {/* Where to go after logging in (the page the visitor tried to open) */}
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div id="login-error" aria-live="polite" aria-atomic="true">
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-ward px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  );
}