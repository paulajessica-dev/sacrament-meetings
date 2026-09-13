import MeetingCard from '@/components/MeetingCard';
import { getBaseUrl } from '@/lib/get-base-url';
import { SacramentMeeting } from '@/lib/types';

export default async function MeetingsPage() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meetings`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to load meetings');
  }

  const meetings: SacramentMeeting[] = await res.json();

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </section>
  );
}