export default function Footer() {
  return (
    <footer className="bg-gray-600 text-white py-4 mt-2 print:hidden">
      <div className="max-w-4xl mx-auto px-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Riverside Ward | Sacrament Meeting Planner</p>
      </div>
    </footer>
  );
}