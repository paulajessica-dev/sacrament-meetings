import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { getMeetingById } from '@/lib/meetings-db';

const MAX_POSTGRES_INT = 2147483647;

export const metadata: Metadata = {
  title: 'Edit Meeting | Sacrament Meeting Planner',
};

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id) || Number(id) > MAX_POSTGRES_INT) {
    notFound();
  }

  const meeting = await getMeetingById(Number(id));

  if (!meeting) {
    notFound();
  }

  // Pre-fill the first argument (the id) so the form only sends FormData.
  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold">Edit Sacrament Meeting</h2>
      <MeetingForm
        action={updateMeetingWithId}
        meeting={meeting}
        submitLabel="Save changes"
      />
    </div>
  );
}