import { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const formattedDate = new Date(`${meeting.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const speakers = meeting.speakers.filter((item) => item.type === 'speaker');
  const musicalNumbers = meeting.speakers.filter((item) => item.type === 'musical-number');

  return (
    <article className="max-w-2xl mx-auto bg-white text-gray-900 p-8 rounded-lg shadow print:shadow-none print:p-0">
      <header className="text-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold font-serif">Sacrament Meeting</h2>
        <p className="text-gray-600">{formattedDate}</p>
        <p className="text-sm text-gray-500 mt-1 capitalize">{meeting.meetingType} meeting</p>
      </header>

      <section className="mb-4">
        <p><strong>Presiding:</strong> {meeting.presiding}</p>
        <p><strong>Conducting:</strong> {meeting.conducting}</p>
      </section>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-lg mb-2">Announcements</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {meeting.announcements.map((announcement, index) => (
              <li key={index}>{announcement}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-4">
        <p><strong>Opening Hymn:</strong> #{meeting.openingHymn.number} — {meeting.openingHymn.title}</p>
        <p><strong>Opening Prayer:</strong> {meeting.openingPrayer}</p>
      </section>

      {meeting.wardBusiness.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-lg mb-2">Ward Business</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {meeting.wardBusiness.map((item, index) => (
              <li key={index}>{item.description}</li>
            ))}
          </ul>
        </section>
      )}

      {meeting.stakeBusiness && (
        <p className="mb-4 text-amber-700 font-medium">This meeting includes stake business.</p>
      )}

      <section className="mb-6">
        <p><strong>Sacrament Hymn:</strong> #{meeting.sacramentHymn.number} — {meeting.sacramentHymn.title}</p>
      </section>

      {speakers.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-lg mb-2">Speakers</h3>
          <ul className="space-y-1 text-gray-700">
            {speakers.map((speaker, index) => (
              <li key={index}>{speaker.name} — <em>{speaker.topic}</em></li>
            ))}
          </ul>
        </section>
      )}

      {musicalNumbers.length > 0 && (
        <section className="mb-6">
          <h3 className="font-bold text-lg mb-2">Musical Numbers</h3>
          <ul className="space-y-1 text-gray-700">
            {musicalNumbers.map((item, index) => (
              <li key={index}>{item.name} — <em>{item.topic}</em></li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <p><strong>Closing Hymn:</strong> #{meeting.closingHymn.number} — {meeting.closingHymn.title}</p>
        <p><strong>Closing Prayer:</strong> {meeting.closingPrayer}</p>
      </section>
    </article>
  );
}