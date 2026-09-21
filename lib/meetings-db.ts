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
function mapRow(row: any): SacramentMeeting {
  return {
    ...row,
    meetingType: VALID_MEETING_TYPES.includes(row.meetingType)
      ? row.meetingType
      : 'regular',
    speakers: row.speakers ?? [],
    wardBusiness: row.wardBusiness ?? [],
    announcements: row.announcements ?? [],
    openingHymn: row.openingHymn ?? DEFAULT_HYMN,
    sacramentHymn: row.sacramentHymn ?? DEFAULT_HYMN,
    closingHymn: row.closingHymn ?? DEFAULT_HYMN,
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

// Mutation stubs — will be wired to the database in Week 04
export async function addMeeting(
  data: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  throw new Error('addMeeting: database implementation coming in Week 04');
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>
): Promise<SacramentMeeting | null> {
  throw new Error('updateMeeting: database implementation coming in Week 04');
}

export async function deleteMeeting(id: number): Promise<boolean> {
  throw new Error('deleteMeeting: database implementation coming in Week 04');
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