'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-6">
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)} aria-label="Previous page" className="p-2 rounded hover:bg-ward-light">
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span aria-disabled="true" className="p-2 text-gray-300">
          <ChevronLeft size={18} />
        </span>
      )}

      <span aria-current="page">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)} aria-label="Next page" className="p-2 rounded hover:bg-ward-light">
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span aria-disabled="true" className="p-2 text-gray-300">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}