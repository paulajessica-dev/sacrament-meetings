import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/get-base-url';
import { SacramentMeeting } from '@/lib/types';
import { notFound } from 'next/navigation';

interface MeetingPageProps {
  params: Promise<{ id: string }>; //takes a promise because the params are async in nextjs 13 and params from url are always strings, so we need to convert it to a number before passing it to getMeetingById
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meetings/${id}`, { cache: 'no-store' });

  // The API route returns 400 for a malformed id and 404 for a
  // well-formed id with no matching meeting — either way, this page
  // shows the standard "not found" UI.
  if (res.status === 400 || res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error('Failed to load meeting');
  }

  const meeting: SacramentMeeting = await res.json();

  return <MeetingDetail meeting={meeting} />;
}