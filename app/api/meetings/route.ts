import { getMeetings } from '@/lib/meetings-db';
import { isValidPage, parsePage } from '@/lib/parse-page';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get('query') ?? '';
  const rawPage = searchParams.get('page');

  if (!isValidPage(rawPage)) {
    return Response.json({ error: 'Invalid page parameter' }, { status: 400 });
  }

  const currentPage = parsePage(rawPage);
  const meetings = await getMeetings(query, currentPage);
  return Response.json(meetings);
}