'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addMeeting,
  updateMeeting as updateMeetingInDb,
  deleteMeeting as deleteMeetingInDb,
  type MeetingInput,
} from '@/lib/meetings-db';
import type { SpeakerItem } from '@/lib/types';


// zod schemas for validating form input

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

const hymnNumber = (label: string) =>
  z.coerce
    .number()
    .int(`${label} number must be a whole number.`)
    .min(1, `${label} number is required.`)
    .max(9999, `${label} number is too large.`);

const MeetingFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a date.'),
  meetingType: z.enum(['regular', 'testimony', 'stake', 'general'], {
    message: 'Please choose a meeting type.',
  }),
  presiding: requiredText('Presiding'),
  conducting: requiredText('Conducting'),
  openingHymnNumber: hymnNumber('Opening hymn'),
  openingHymnTitle: requiredText('Opening hymn title'),
  openingPrayer: requiredText('Opening prayer'),
  sacramentHymnNumber: hymnNumber('Sacrament hymn'),
  sacramentHymnTitle: requiredText('Sacrament hymn title'),
  closingHymnNumber: hymnNumber('Closing hymn'),
  closingHymnTitle: requiredText('Closing hymn title'),
  closingPrayer: requiredText('Closing prayer'),
  stakeBusiness: z.boolean(),
  announcements: z.string(),
  wardBusiness: z.string(),
  speakers: z.string(),
  musicalNumbers: z.string(),
});

type MeetingFormFields = z.infer<typeof MeetingFormSchema>; // this schema is genered automactically from the form fields in the form component, so we don't have to manually define it

export type MeetingFormValues = ReturnType<typeof readForm>;

// The state of the form, including any validation errors and the current values
export type MeetingFormState = {
  errors?: Partial<Record<keyof MeetingFormFields, string[]>>;
  message?: string | null;
  values?: MeetingFormValues;
};

// extract form data from the request and return it as a MeetingFormValues object
function readForm(formData: FormData) {
  const text = (name: string) => String(formData.get(name) ?? '');
  return {
    date: text('date'),
    meetingType: text('meetingType'),
    presiding: text('presiding'),
    conducting: text('conducting'),
    openingHymnNumber: text('openingHymnNumber'),
    openingHymnTitle: text('openingHymnTitle'),
    openingPrayer: text('openingPrayer'),
    sacramentHymnNumber: text('sacramentHymnNumber'),
    sacramentHymnTitle: text('sacramentHymnTitle'),
    closingHymnNumber: text('closingHymnNumber'),
    closingHymnTitle: text('closingHymnTitle'),
    closingPrayer: text('closingPrayer'),
    stakeBusiness: formData.get('stakeBusiness') === 'on',
    announcements: text('announcements'),
    wardBusiness: text('wardBusiness'),
    speakers: text('speakers'),
    musicalNumbers: text('musicalNumbers'),
  };
}

// Modify text input to an array of lines, trimming whitespace and filtering out empty lines
function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

// Convert a string of speaker names and topics into an array of SpeakerItem objects
function toSpeakerItems(value: string, type: SpeakerItem['type']): SpeakerItem[] {
  return toLines(value)
    .map((line) => {
      const [name, ...rest] = line.split('|');
      return { name: name.trim(), topic: rest.join('|').trim(), type };
    })
    .filter((item) => item.name.length > 0);
}

// Convert a ZodError into a MeetingFormState.errors object
function collectErrors(error: z.ZodError): MeetingFormState['errors'] {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0]);
    (errors[field] ??= []).push(issue.message);
  }
  return errors;
}

// Convert MeetingFormFields to MeetingInput, which is the format expected by the database functions
function toMeetingInput(fields: MeetingFormFields): MeetingInput {
  return {
    date: fields.date,
    meetingType: fields.meetingType,
    presiding: fields.presiding,
    conducting: fields.conducting,
    announcements: toLines(fields.announcements),
    openingHymn: { number: fields.openingHymnNumber, title: fields.openingHymnTitle },
    openingPrayer: fields.openingPrayer,
    wardBusiness: toLines(fields.wardBusiness).map((description) => ({ description })),
    stakeBusiness: fields.stakeBusiness,
    sacramentHymn: { number: fields.sacramentHymnNumber, title: fields.sacramentHymnTitle },
    speakers: [
      ...toSpeakerItems(fields.speakers, 'speaker'),
      ...toSpeakerItems(fields.musicalNumbers, 'musical-number'),
    ],
    closingHymn: { number: fields.closingHymnNumber, title: fields.closingHymnTitle },
    closingPrayer: fields.closingPrayer,
  };
}

// Validate that the given id is a valid integer within the range of a 32-bit signed integer
function isValidId(id: number): boolean {
  return Number.isInteger(id) && id > 0 && id <= 2147483647;
}

// Revalidate the pages that display the list of meetings and the current meeting, as well as the home page.
function revalidateMeetingPages(id?: number) {
  revalidatePath('/meetings');
  revalidatePath('/meetings/current');
  revalidatePath('/');
  if (id) revalidatePath(`/meetings/${id}`);
}

export async function createMeeting(
  prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const values = readForm(formData);
  const parsed = MeetingFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      errors: collectErrors(parsed.error),
      message: 'Some fields need attention. Please fix them and try again.',
      values,
    };
  }

  try {
    await addMeeting(toMeetingInput(parsed.data));
  } catch (error) {
    console.error('createMeeting failed:', error);
    return { message: 'Database error: failed to create the meeting.', values };
  }

  revalidateMeetingPages();
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  if (!isValidId(id)) {
    return { message: 'Invalid meeting id.' };
  }

  const values = readForm(formData);
  const parsed = MeetingFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      errors: collectErrors(parsed.error),
      message: 'Some fields need attention. Please fix them and try again.',
      values,
    };
  }

  try {
    const updated = await updateMeetingInDb(id, toMeetingInput(parsed.data));
    if (!updated) {
      return { message: 'This meeting no longer exists.', values };
    }
  } catch (error) {
    console.error('updateMeeting failed:', error);
    return { message: 'Database error: failed to update the meeting.', values };
  }

  revalidateMeetingPages(id);
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  if (!isValidId(id)) return;

  try {
    await deleteMeetingInDb(id);
  } catch (error) {
    console.error('deleteMeeting failed:', error);
    throw new Error('Failed to delete the meeting.');
  }

  revalidateMeetingPages(id);
}

