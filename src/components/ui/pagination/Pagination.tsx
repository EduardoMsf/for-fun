'use client';

import { generatePagination } from '@/src/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const allPages = generatePagination(currentPage, totalPages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);

    if (pageNumber === '...' || +pageNumber <= 0 || +pageNumber > totalPages) {
      return `${pathName}?${params.toString()}`;
    }

    params.set('page', pageNumber.toString());
    return `${pathName}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center mt-10 mb-32">
      <nav aria-label="Pagination Navigation">
        <ul className="flex items-center gap-1 list-none">
          {/* Previous Button */}
          <PaginationArrow
            direction="left"
            href={createPageUrl(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />

          {/* Page Numbers */}
          {allPages.map((page, index) => (
            <li key={`${page}-${index}`}>
              <PaginationNumber
                page={page}
                href={createPageUrl(page)}
                isActive={currentPage === page}
              />
            </li>
          ))}

          {/* Next Button */}
          <PaginationArrow
            direction="right"
            href={createPageUrl(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
          />
        </ul>
      </nav>
    </div>
  );
};

// Sub-components to keep the main return clean
const PaginationNumber = ({
  page,
  href,
  isActive,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
}) => {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-colors',
    {
      'z-10 bg-indigo-600 text-white border-indigo-600': isActive,
      'hover:bg-gray-100 text-gray-800 border-transparent':
        !isActive && page !== '...',
      'cursor-default text-gray-400 border-transparent': page === '...',
    },
  );

  if (page === '...') return <span className={className}>{page}</span>;

  return (
    <Link
      href={href}
      className={className}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </Link>
  );
};

const PaginationArrow = ({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled: boolean;
}) => {
  const Icon =
    direction === 'left' ? IoChevronBackOutline : IoChevronForwardOutline;
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border transition-colors',
    isDisabled
      ? 'pointer-events-none text-gray-300 border-transparent'
      : 'hover:bg-gray-100 text-gray-800 border-transparent',
  );

  return isDisabled ? (
    <span className={className} aria-disabled="true">
      <Icon size={20} />
    </span>
  ) : (
    <Link href={href} className={className}>
      <Icon size={20} />
    </Link>
  );
};
