'use client';

import { Trash2 } from 'lucide-react';
import { deleteMeeting } from '@/lib/actions';

export function DeleteMeetingButton({ id }: { id: number }) {
  const deleteMeetingWithId = deleteMeeting.bind(null, id);

  return (
    <form
      action={deleteMeetingWithId}
      onSubmit={(e) => {
        if (!window.confirm('Delete this meeting? This cannot be undone.')) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        <Trash2 size={14} aria-hidden="true" />
        Delete
      </button>
    </form>
  );
}