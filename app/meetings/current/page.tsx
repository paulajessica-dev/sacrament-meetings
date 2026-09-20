import { getMeetings } from '@/lib/meetings-db';
import { redirect } from 'next/navigation';

export default function CurrentMeetingPage() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) through 6 (Sat)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek); // roll back to Sunday

  const sundayIso = sunday.toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const [meeting] = getMeetings(sundayIso);

  if (!meeting) {
    redirect('/meetings');
  }

  redirect(`/meetings/${meeting.id}`);
}