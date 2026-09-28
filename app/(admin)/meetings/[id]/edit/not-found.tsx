import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center text-gray-900 shadow">
      <h2 className="mb-2 text-xl font-bold">Meeting not found</h2>
      <p className="mb-6 text-gray-600">
        We couldn&apos;t find the meeting you&apos;re looking for. It may have been deleted.
      </p>
      <Link
        href="/meetings"
        className="inline-block rounded-lg bg-ward px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Back to meetings
      </Link>
    </div>
  );
}