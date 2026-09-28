import type { Metadata } from 'next';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export const metadata: Metadata = {
  title: 'New Meeting | Sacrament Meeting Planner',
};

export default function NewMeetingPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold">New Sacrament Meeting</h2>
      <MeetingForm action={createMeeting} submitLabel="Create meeting" />
    </div>
  );
}