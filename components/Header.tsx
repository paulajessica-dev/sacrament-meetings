import NavLinks from "./NavLinks";
import TodayDate from "./TodayDate";

export default function Header() {
  return (
    <header className="bg-ward text-white py-4 shadow-md print:hidden">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Riverside Ward</h1>
          <TodayDate />
        </div>
        <NavLinks />
      </div>
    </header>
  );
}