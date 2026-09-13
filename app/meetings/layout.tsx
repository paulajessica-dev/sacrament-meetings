export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 border-b pb-4 print:hidden">
        <h2 className="text-2xl font-bold">Sacrament Meetings</h2>
        <p className="text-gray-600 text-sm">
          Browse, review, and print sacrament meeting programs.
        </p>
      </div>
      {children}
    </div>
  );
}