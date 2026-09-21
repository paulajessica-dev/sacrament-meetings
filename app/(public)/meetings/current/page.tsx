import { getUpcomingMeeting } from '@/lib/meetings-db';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CurrentMeetingPage() {
  const meeting = await getUpcomingMeeting();

  if (!meeting) {
    redirect('/meetings');
  }

  redirect(`/meetings/${meeting.id}`);
}