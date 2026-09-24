import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import { MeetingSearch } from '@/components/MeetingSearch';
import MeetingCard from '@/components/MeetingCard';
import { Pagination } from '@/components/Pagination';
import { parsePage } from '@/lib/parse-page';

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
      <Suspense fallback={<div className="mb-4 h-10" />}>
        <MeetingSearch />
      </Suspense>

      {meetings.length === 0 ? (
        <p role="status" className="text-gray-600 mt-4">
          No meetings found.
        </p>
      ) : (
        meetings.map((m) => <MeetingCard key={m.id} meeting={m} />)
      )}

      <Suspense fallback={null}>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </div>
  );
}