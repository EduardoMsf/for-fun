import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Pagination } from '@/src/components/ui/pagination/Pagination';

const mockUsePathname = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

describe('Pagination', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it('falls back to page 1 and disables the previous arrow when the page param is missing', () => {
    render(<Pagination totalPages={5} />);

    const list = screen.getByRole('list');
    const previousArrow = list.firstElementChild as HTMLElement;

    expect(screen.getByRole('link', { name: '1' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(previousArrow.tagName).toBe('SPAN');
    expect(previousArrow.getAttribute('aria-disabled')).toBe('true');
  });

  it('highlights the current page and builds the surrounding links from the query string', () => {
    mockUsePathname.mockReturnValue('/shop');
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('page=3&take=12&sort=asc'),
    );

    render(<Pagination totalPages={5} />);

    const currentPageLink = screen.getByRole('link', { name: '3' });

    expect(currentPageLink.getAttribute('aria-current')).toBe('page');
    expect(currentPageLink.className).toContain('bg-indigo-600');
    expect(screen.getByRole('link', { name: '2' }).getAttribute('href')).toBe(
      '/shop?page=2&take=12&sort=asc',
    );
    expect(screen.getByRole('link', { name: '4' }).getAttribute('href')).toBe(
      '/shop?page=4&take=12&sort=asc',
    );
  });

  it('disables the next arrow on the last page', () => {
    mockUsePathname.mockReturnValue('/shop');
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=5'));

    render(<Pagination totalPages={5} />);

    const list = screen.getByRole('list');
    const nextArrow = list.lastElementChild as HTMLElement;

    expect(nextArrow.tagName).toBe('SPAN');
    expect(nextArrow.getAttribute('aria-disabled')).toBe('true');
  });
});
