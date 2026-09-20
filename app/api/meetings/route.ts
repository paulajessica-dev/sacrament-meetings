import { getMeetings } from '@/lib/meetings-db';

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get('date');
  const meetings = getMeetings(date);
  return Response.json(meetings);
}