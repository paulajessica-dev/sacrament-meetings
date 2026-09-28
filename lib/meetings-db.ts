import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';
import { cache } from 'react';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Check your .env.local file (see the Neon integration Quickstart tab).'
  );
}
const sql = neon(databaseUrl);

const ITEMS_PER_PAGE = 5;

const VALID_MEETING_TYPES: SacramentMeeting['meetingType'][] = [
  'regular',
  'testimony',
  'stake',
  'general',
];

const DEFAULT_HYMN = { number: 0, title: 'Unknown hymn' };

// Normalizes a raw DB row into a SacramentMeeting we can trust in the UI:
// unexpected/missing values get safe fallbacks instead of crashing render.
function mapRow(row: Record<string, unknown>): SacramentMeeting {
  const meeting = row as unknown as SacramentMeeting;
  return {
    ...meeting,
    meetingType: VALID_MEETING_TYPES.includes(meeting.meetingType)
      ? meeting.meetingType
      : 'regular',
    speakers: meeting.speakers ?? [],
    wardBusiness: meeting.wardBusiness ?? [],
    announcements: meeting.announcements ?? [],
    openingHymn: meeting.openingHymn ?? DEFAULT_HYMN,
    sacramentHymn: meeting.sacramentHymn ?? DEFAULT_HYMN,
    closingHymn: meeting.closingHymn ?? DEFAULT_HYMN,
  };
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export async function getMeetings(
  query: string = '',
  currentPage: number = 1,
  date?: string
): Promise<SacramentMeeting[]> {
  const searchTerm = `%${escapeLikePattern(query)}%`;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE
      (
        presiding     ILIKE ${searchTerm}
        OR conducting ILIKE ${searchTerm}
        OR meeting_type ILIKE ${searchTerm}
        OR EXISTS (
          SELECT 1 FROM jsonb_array_elements(speakers) AS s
          WHERE s->>'name' ILIKE ${searchTerm}
        )
      )
      AND (${date ?? null}::date IS NULL OR date = ${date ?? null}::date)
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;
  return rows.map(mapRow);
}

export async function getMeetingsTotalPages(
  query: string = ''
): Promise<number> {
  const searchTerm = `%${escapeLikePattern(query)}%`;
  const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(speakers) AS s
        WHERE s->>'name' ILIKE ${searchTerm}
      )
  `;
  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export const getMeetingById = cache(async (
  id: number
): Promise<SacramentMeeting | null> => {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings WHERE id = ${id}
  `;
  return rows[0] ? mapRow(rows[0]) : null;
});

// Mutation stubs
export type MeetingInput = Omit<SacramentMeeting, 'id'>;

export async function addMeeting(data: MeetingInput): Promise<number> {
  const rows = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${data.date}::date,
      ${data.meetingType},
      ${data.presiding},
      ${data.conducting},
      ${data.announcements ?? []}::text[],
      ${JSON.stringify(data.openingHymn)}::jsonb,
      ${data.openingPrayer},
      ${JSON.stringify(data.wardBusiness)}::jsonb,
      ${data.stakeBusiness},
      ${JSON.stringify(data.sacramentHymn)}::jsonb,
      ${JSON.stringify(data.speakers)}::jsonb,
      ${JSON.stringify(data.closingHymn)}::jsonb,
      ${data.closingPrayer}
    )
    RETURNING id
  `;
  return Number(rows[0].id);
}

export async function updateMeeting(
  id: number,
  data: MeetingInput
): Promise<boolean> {
  const rows = await sql`
    UPDATE meetings SET
      date           = ${data.date}::date,
      meeting_type   = ${data.meetingType},
      presiding      = ${data.presiding},
      conducting     = ${data.conducting},
      announcements  = ${data.announcements ?? []}::text[],
      opening_hymn   = ${JSON.stringify(data.openingHymn)}::jsonb,
      opening_prayer = ${data.openingPrayer},
      ward_business  = ${JSON.stringify(data.wardBusiness)}::jsonb,
      stake_business = ${data.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(data.sacramentHymn)}::jsonb,
      speakers       = ${JSON.stringify(data.speakers)}::jsonb,
      closing_hymn   = ${JSON.stringify(data.closingHymn)}::jsonb,
      closing_prayer = ${data.closingPrayer}
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function getUpcomingMeeting(): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE date >= CURRENT_DATE
    ORDER BY date ASC
    LIMIT 1
  `;
  return rows[0] ? mapRow(rows[0]) : null;
}