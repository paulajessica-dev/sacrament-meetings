import Link from "next/link";
import NavLinks from "./NavLinks";
import TodayDate from "./TodayDate";
import LogoutButton from "./LogoutButton";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-ward text-white py-4 shadow-md print:hidden">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Riverside Ward</h1>
          <TodayDate />
        </div>
        <div className="flex items-center gap-4">
          <NavLinks />
          {session?.user ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="text-blue-100 hover:underline px-3 py-1">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}