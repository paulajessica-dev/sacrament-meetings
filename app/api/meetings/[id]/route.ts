import { getMeetingById } from '@/lib/meetings-db';

const MAX_POSTGRES_INT = 2147483647;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^\d+$/.test(id) || Number(id) > MAX_POSTGRES_INT) {
    return Response.json({ error: 'Invalid meeting id' }, { status: 400 });
  }

  try {
    const meeting = await getMeetingById(Number(id));

    if (!meeting) {
      return Response.json({ error: 'Meeting not found' }, { status: 404 });
    }

    return Response.json(meeting);
  } catch (error) {
    console.error('getMeetingById failed:', error);
    return Response.json({ error: 'Failed to load meeting' }, { status: 500 });
  }
}