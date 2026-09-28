'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center text-gray-900 shadow">
      <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
      <p className="mb-6 text-gray-600">
        We couldn&apos;t complete that request. Please try again in a moment.
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-ward px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/meetings"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Back to meetings
        </Link>
      </div>
    </div>
  );
}