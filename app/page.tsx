import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full max-w-3xl">
        <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-2xl shadow-md">
        <Image
          src="/sacrament-hero.jpg"
          alt="Hands passing bread during the sacrament ordinance"
          fill
          priority
          className="object-cover"
        />
      </div>
        <div className="mt-4 text-center sm:text-left">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-ward sm:text-4xl">
          Sacrament Meeting Planner
        </h2>
          <p className="mt-3 max-w-xl text-lg leading-5 text-zinc-600">
            Plan, manage, and review sacrament meeting agendas for Riverside
            Ward — presiding assignments, speakers, and programs, all in one
            place.
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-start">
            <Link
              href="/meetings"
              className="flex h-12 items-center justify-center rounded-full bg-ward px-6 text-white transition-colors hover:bg-blue-900"
            >
              View Meetings
            </Link>
            <Link
              href="/meetings/current"
              className="flex h-12 items-center justify-center rounded-full border border-ward px-6 text-ward transition-colors hover:bg-ward-light"
            >
              This Week&apos;s Meeting
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}