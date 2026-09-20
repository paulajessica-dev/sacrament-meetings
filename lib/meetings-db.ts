import { SacramentMeeting } from './types';

/**
 * Temporary in-memory data store.
 * This will be replaced by a real database in a future assignment.
 */
const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-08-16',
    meetingType: 'regular',
    presiding: 'Bishop James Carter',
    conducting: 'Brother David Nguyen',
    announcements: [
      'Ward temple night this Friday at 6 PM.',
      'Youth activity moved to Saturday afternoon.',
    ],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'Sister Emily Park',
    wardBusiness: [
      { description: 'Sustaining of Brother Michael Reyes as Elders Quorum Secretary' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      { name: 'Sister Ana Souza', topic: 'Faith in Christ', type: 'speaker' },
      { name: 'Brother Kevin Lee', topic: 'Service in the Ward', type: 'speaker' },
    ],
    closingHymn: { number: 219, title: 'Praise to the Lord, the Almighty' },
    closingPrayer: 'Brother Thomas Alama',
  },
  {
    id: 2,
    date: '2026-08-23',
    meetingType: 'testimony',
    presiding: 'Bishop James Carter',
    conducting: 'Brother David Nguyen',
    announcements: ['Fast and Testimony Meeting today.'],
    openingHymn: { number: 30, title: 'Come, Come, Ye Saints' },
    openingPrayer: 'Brother Caleb Mwangi',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: "In Humility, Our Savior" },
    speakers: [],
    closingHymn: { number: 85, title: 'How Firm a Foundation' },
    closingPrayer: 'Sister Grace Kim',
  },
  {
    id: 3,
    date: '2026-08-30',
    meetingType: 'regular',
    presiding: 'Bishop James Carter',
    conducting: 'Brother Mark Ferreira',
    announcements: [
      'Primary Sharing Time begins next Sunday.',
      'Ward Family History Day is September 12th.',
    ],
    openingHymn: { number: 1, title: 'The Morning Breaks' },
    openingPrayer: 'Sister Paula Jessica Silva',
    wardBusiness: [
      { description: 'Release of Sister Linda Osei as Primary Chorister, with thanks.' },
      { description: 'Sustaining of Brother Andre Costa as Primary Chorister' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 174, title: "God, Our Father, Hear Us Pray" },
    speakers: [
      { name: 'Youth Speaker: Sophia Almeida', topic: 'Keeping the Sabbath Day Holy', type: 'speaker' },
      { name: 'Ward Choir', topic: 'Musical Number', type: 'musical-number' },
      { name: 'Elder Bruno Tanaka', topic: 'The Book of Mormon', type: 'speaker' },
    ],
    closingHymn: { number: 136, title: 'Choose the Right' },
    closingPrayer: 'Brother Felipe Duarte',
  },
  {
    id: 4,
    date: '2026-09-06',
    meetingType: 'stake',
    presiding: 'President Robert Hansen',
    conducting: 'President Robert Hansen',
    announcements: ['Combined Stake Conference session — no regular ward meetings today.'],
    openingHymn: { number: 249, title: 'Called to Serve' },
    openingPrayer: 'Sister Karen Whitfield',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: "In Humility, Our Savior" },
    speakers: [
      { name: 'Elder Samuel Okoye', topic: 'Area Authority Message', type: 'speaker' },
    ],
    closingHymn: { number: 259, title: 'Called to Serve' },
    closingPrayer: 'Brother Lucas Martins',
  },
  {
    id: 5,
    date: '2026-09-13',
    meetingType: 'regular',
    presiding: 'Bishop James Carter',
    conducting: 'Brother David Nguyen',
    announcements: ['Missionary farewell for Sister Rachel Chen next week.'],
    openingHymn: { number: 66, title: 'Rejoice, the Lord Is King!' },
    openingPrayer: 'Brother Henrique Lima',
    wardBusiness: [
      { description: 'Sustaining of Sister Rachel Chen as she departs for missionary service' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      { name: 'Sister Rachel Chen', topic: 'Farewell Testimony', type: 'speaker' },
      { name: 'Bishop James Carter', topic: 'Missionary Work', type: 'speaker' },
    ],
    closingHymn: { number: 214, title: 'Ye Elders of Israel' },
    closingPrayer: 'Sister Olivia Barros',
  },
  {
    id: 6,
    date: '2026-09-20',
    meetingType: 'general',
    presiding: 'Bishop James Carter',
    conducting: 'Bishop James Carter',
    announcements: ['General Conference weekend — watch sessions at home or at the church building.'],
    openingHymn: { number: 1, title: 'The Morning Breaks' },
    openingPrayer: 'Brother William Osei',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: "In Humility, Our Savior" },
    speakers: [],
    closingHymn: { number: 1, title: 'The Morning Breaks' },
    closingPrayer: 'Sister Fernanda Rocha',
  },
];

/**
 * Returns all meetings, sorted from most recent to oldest.
 */
export function getMeetings(date?: string | null): SacramentMeeting[] {
  const sorted = [...meetings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (date) {
    return sorted.filter((meeting) => meeting.date === date);
  }

  return sorted;
}

/**
 * Returns a single meeting by its id, or undefined if not found.
 */
export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
}

/**
 * Returns the meeting for the current (or most recent past) Sunday.
 * Falls back to the closest past meeting if today has no exact match.
 */
export function getCurrentMeeting(): SacramentMeeting | undefined {
  const today = new Date();
  const sorted = getMeetings(); // already sorted newest first

  // Try to find an exact date match first
  const todayIso = today.toISOString().split('T')[0];
  const exactMatch = sorted.find((meeting) => meeting.date === todayIso);
  if (exactMatch) return exactMatch;

  // Otherwise, return the most recent meeting that is on or before today
  return sorted.find((meeting) => new Date(meeting.date) <= today) ?? sorted[0];
}

/**
 * Returns meetings filtered by type (e.g. 'testimony', 'stake').
 */
export function getMeetingsByType(type: SacramentMeeting['meetingType']): SacramentMeeting[] {
  return getMeetings().filter((meeting) => meeting.meetingType === type);
}

/* ---------------------------------------------------------------------
 * Mutation functions (stretch goals for this week).
 * These modify the in-memory array directly. Once a real database is
 * introduced in a later assignment, these will be replaced by actual
 * create/update/delete operations against that database.
 * ------------------------------------------------------------------- */

let nextId = meetings.length + 1;

/**
 * Adds a new meeting to the in-memory store. Assigns the next available id.
 */
export function addMeeting(meeting: Omit<SacramentMeeting, 'id'>): SacramentMeeting {
  const newMeeting: SacramentMeeting = { ...meeting, id: nextId };
  meetings.push(newMeeting);
  nextId += 1;
  return newMeeting;
}

/**
 * Updates an existing meeting by id. Returns the updated meeting,
 * or undefined if no meeting with that id exists.
 */
export function updateMeeting(
  id: number,
  updates: Partial<Omit<SacramentMeeting, 'id'>>
): SacramentMeeting | undefined {
  const index = meetings.findIndex((meeting) => meeting.id === id);
  if (index === -1) return undefined;

  meetings[index] = { ...meetings[index], ...updates };
  return meetings[index];
}

/**
 * Deletes a meeting by id. Returns true if a meeting was removed,
 * false if no meeting with that id existed.
 */
export function deleteMeeting(id: number): boolean {
  const index = meetings.findIndex((meeting) => meeting.id === id);
  if (index === -1) return false;

  meetings.splice(index, 1);
  return true;
}