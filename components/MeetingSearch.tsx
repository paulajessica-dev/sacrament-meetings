'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search } from 'lucide-react';

export function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // always reset to page 1 on a new search
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    push(`${pathname}?${params.toString()}`);
  }, 300);

    return (
      <div className="relative mb-6">
        <label htmlFor="meeting-search" className="sr-only">
          Search meetings
        </label>
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          id="meeting-search"
          type="search"
          placeholder="Search by speaker, leader, or meeting type..."
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 shadow-sm placeholder:text-gray-500 transition-colors focus:border-ward focus:outline-none focus:ring-2 focus:ring-ward/30"
        />
      </div>
    );
}