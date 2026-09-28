'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { MeetingFormState, MeetingFormValues } from '@/lib/actions';
import type { SacramentMeeting } from '@/lib/types';

type FormAction = (
  prevState: MeetingFormState,
  formData: FormData
) => Promise<MeetingFormState>;

interface MeetingFormProps {
  action: FormAction;
  meeting?: SacramentMeeting;
  submitLabel: string;
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-ward focus:outline-none focus:ring-2 focus:ring-ward/30';

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
      {errors?.map((message) => (
        <p key={message} className="mt-1 text-sm text-red-600">
          {message}
        </p>
      ))}
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  errors,
  type = 'text',
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  errors?: string[];
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={`${name}-error`}
        className={inputClass}
      />
      <FieldError id={name} errors={errors} />
    </div>
  );
}

function HymnFields({
  prefix,
  label,
  values,
  state,
}: {
  prefix: 'openingHymn' | 'sacramentHymn' | 'closingHymn';
  label: string;
  values: MeetingFormValues;
  state: MeetingFormState;
}) {
  return (
    <fieldset className="grid grid-cols-[6rem_1fr] gap-3">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      <TextField
        name={`${prefix}Number`}
        label="Number"
        type="number"
        defaultValue={values[`${prefix}Number`]}
        errors={state.errors?.[`${prefix}Number`]}
      />
      <TextField
        name={`${prefix}Title`}
        label="Title"
        defaultValue={values[`${prefix}Title`]}
        errors={state.errors?.[`${prefix}Title`]}
      />
    </fieldset>
  );
}

function ListField({
  name,
  label,
  hint,
  defaultValue,
  errors,
}: {
  name: string;
  label: string;
  hint: string;
  defaultValue?: string;
  errors?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <p id={`${name}-hint`} className="mb-1 text-xs text-gray-500">
        {hint}
      </p>
      <textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={defaultValue}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={`${name}-hint ${name}-error`}
        className={inputClass}
      />
      <FieldError id={name} errors={errors} />
    </div>
  );
}

function valuesFromMeeting(meeting?: SacramentMeeting): MeetingFormValues {
  const pairs = (type: 'speaker' | 'musical-number') =>
    (meeting?.speakers ?? [])
      .filter((s) => s.type === type)
      .map((s) => (s.topic ? `${s.name} | ${s.topic}` : s.name))
      .join('\n');
  const hymnNumber = (n?: number) => (n ? String(n) : '');

  return {
    date: meeting?.date ?? '',
    meetingType: meeting?.meetingType ?? '',
    presiding: meeting?.presiding ?? '',
    conducting: meeting?.conducting ?? '',
    openingHymnNumber: hymnNumber(meeting?.openingHymn.number),
    openingHymnTitle: meeting?.openingHymn.title ?? '',
    openingPrayer: meeting?.openingPrayer ?? '',
    sacramentHymnNumber: hymnNumber(meeting?.sacramentHymn.number),
    sacramentHymnTitle: meeting?.sacramentHymn.title ?? '',
    closingHymnNumber: hymnNumber(meeting?.closingHymn.number),
    closingHymnTitle: meeting?.closingHymn.title ?? '',
    closingPrayer: meeting?.closingPrayer ?? '',
    stakeBusiness: meeting?.stakeBusiness ?? false,
    announcements: meeting?.announcements?.join('\n') ?? '',
    wardBusiness: meeting?.wardBusiness.map((w) => w.description).join('\n') ?? '',
    speakers: pairs('speaker'),
    musicalNumbers: pairs('musical-number'),
  };
}

export default function MeetingForm({ action, meeting, submitLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, { errors: {}, message: null });

  // After a failed submit, show what the user typed; otherwise the saved meeting.
  const v = state.values ?? valuesFromMeeting(meeting);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-lg bg-white p-6 text-gray-900 shadow"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="date" label="Date" type="date" defaultValue={v.date} errors={state.errors?.date} />
        <div>
          <label htmlFor="meetingType" className="mb-1 block text-sm font-medium">
            Meeting type
          </label>
          <select
            id="meetingType"
            name="meetingType"
            defaultValue={v.meetingType}
            aria-invalid={state.errors?.meetingType ? true : undefined}
            aria-describedby="meetingType-error"
            className={inputClass}
          >
            <option value="" disabled>Select a type</option>
            <option value="regular">Regular</option>
            <option value="testimony">Testimony</option>
            <option value="stake">Stake</option>
            <option value="general">General</option>
          </select>
          <FieldError id="meetingType" errors={state.errors?.meetingType} />
        </div>
        <TextField name="presiding" label="Presiding" defaultValue={v.presiding} errors={state.errors?.presiding} />
        <TextField name="conducting" label="Conducting" defaultValue={v.conducting} errors={state.errors?.conducting} />
      </div>

      <ListField name="announcements" label="Announcements" hint="One announcement per line." defaultValue={v.announcements} errors={state.errors?.announcements}/>

      <HymnFields prefix="openingHymn" label="Opening hymn" values={v} state={state} />
      <TextField name="openingPrayer" label="Opening prayer" defaultValue={v.openingPrayer} errors={state.errors?.openingPrayer} />

      <ListField name="wardBusiness" label="Ward business" hint="One item per line." defaultValue={v.wardBusiness} errors={state.errors?.wardBusiness} />

      <div>
        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            type="checkbox"
            name="stakeBusiness"
            defaultChecked={v.stakeBusiness}
            aria-describedby="stakeBusiness-error"
            className="h-4 w-4 accent-ward"
          />
          <label htmlFor="stakeBusiness" className="text-sm font-medium">
            This meeting includes stake business
          </label>
        </div>
        <FieldError id="stakeBusiness" errors={state.errors?.stakeBusiness} />
      </div>

      <HymnFields prefix="sacramentHymn" label="Sacrament hymn" values={v} state={state} />

      <ListField name="speakers" label="Speakers" hint="One per line, as: Name | Topic" defaultValue={v.speakers} errors={state.errors?.speakers} />
      <ListField name="musicalNumbers" label="Musical numbers" hint="One per line, as: Performer | Piece" defaultValue={v.musicalNumbers} errors={state.errors?.musicalNumbers} />

      <HymnFields prefix="closingHymn" label="Closing hymn" values={v} state={state} />
      <TextField name="closingPrayer" label="Closing prayer" defaultValue={v.closingPrayer} errors={state.errors?.closingPrayer} />

      <div aria-live="polite">
        {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/meetings" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-ward px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}