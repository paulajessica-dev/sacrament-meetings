import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meetings-db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const MAX_POSTGRES_INT = 2147483647;

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MeetingPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!/^\d+$/.test(id) || Number(id) > MAX_POSTGRES_INT) {
    return { title: 'Meeting not found' };
  }

  const meeting = await getMeetingById(Number(id));

  if (!meeting) {
    return { title: 'Meeting not found' };
  }

  return {
    title: `${meeting.date} Meeting`,
    description: `Sacrament meeting program for ${meeting.date} at Riverside Ward.`,
  };
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id) || Number(id) > MAX_POSTGRES_INT) {
    notFound();
  }

  let meeting;
  try {
    meeting = await getMeetingById(Number(id));
  } catch (error) {
    console.error('getMeetingById failed:', error);
    throw new Error('Failed to load meeting');
  }

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}