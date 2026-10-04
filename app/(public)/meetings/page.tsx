import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import { MeetingSearch } from '@/components/MeetingSearch';
import MeetingCard from '@/components/MeetingCard';
import { Pagination } from '@/components/Pagination';
import { parsePage } from '@/lib/parse-page';

import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';
import { DeleteMeetingButton } from '@/components/DeleteMeetingButton';

export const metadata: Metadata = {
  title: 'All Meetings | Sacrament Meeting Planner',
};

export default async function MeetingsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? '';
  const requestedPage = parsePage(searchParams?.page);

  const totalPages = await getMeetingsTotalPages(query);

  if (totalPages > 0 && requestedPage > totalPages) {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    params.set('page', String(totalPages));
    redirect(`/meetings?${params.toString()}`);
  }

  const meetings = await getMeetings(query, requestedPage);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link
          href="/meetings/new"
          className="inline-flex items-center gap-1 rounded-lg bg-ward px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} aria-hidden="true" />
          New meeting
        </Link>
      </div>

      <Suspense fallback={<div className="mb-6 h-11" />}>
        <MeetingSearch />
      </Suspense>

      {meetings.length === 0 ? (
        <p role="status" className="text-gray-600 mt-4">
          No meetings found.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {meetings.map((m) => (
            <li key={m.id}>
              <MeetingCard meeting={m} />
              <div className="mt-2 flex justify-end gap-2">
                <Link
                  href={`/meetings/${m.id}/edit`}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  <Pencil size={14} aria-hidden="true" />
                  Edit
                  <span className="sr-only"> meeting on {m.date}</span>
                </Link>
                <DeleteMeetingButton id={m.id} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Suspense fallback={null}>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </div>
  );
}