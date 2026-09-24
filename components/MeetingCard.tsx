import Link from 'next/link';
import { SacramentMeeting } from '@/lib/types';
import { Users, Heart, Building2, Globe, HelpCircle } from 'lucide-react';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

function getTypeStyle(type: SacramentMeeting['meetingType']): string {
  switch (type) {
    case 'regular':
      return 'bg-blue-100 text-blue-800';
    case 'testimony':
      return 'bg-purple-100 text-purple-800';
    case 'stake':
      return 'bg-amber-100 text-amber-800';
    case 'general':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function TypeIcon({ type, className, size }: { type: SacramentMeeting['meetingType']; className?: string; size?: number }) {
  switch (type) {
    case 'regular':
      return <Users size={size} className={className} aria-hidden="true" />;
    case 'testimony':
      return <Heart size={size} className={className} aria-hidden="true" />;
    case 'stake':
      return <Building2 size={size} className={className} aria-hidden="true" />;
    case 'general':
      return <Globe size={size} className={className} aria-hidden="true" />;
    default:
      return <HelpCircle size={size} className={className} aria-hidden="true" />;
    }
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formattedDate = new Date(`${meeting.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const speakerCount = meeting.speakers.filter((s) => s.type === 'speaker').length;

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="block p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-ward hover:-translate-y-1 transition-all duration-200 bg-white text-gray-900"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">{formattedDate}</h3>
        <span className={`inline-flex flex-row items-center gap-1 whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full ${getTypeStyle(meeting.meetingType)}`}>
          <TypeIcon type={meeting.meetingType} size={12} className="shrink-0" />
          {meeting.meetingType}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        Presiding: {meeting.presiding}
      </p>
      {speakerCount > 0 && (
        <p className="text-sm text-gray-600 mt-1">
          {speakerCount} speaker{speakerCount > 1 ? 's' : ''}
        </p>
      )}
    </Link>
  );
}