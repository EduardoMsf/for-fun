import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Home from '@/src/app/(shop)/page';

vi.mock('@/src/actions', () => ({
  getPaginatedProductsWithImages: vi.fn().mockResolvedValue({
    products: [{ id: '1', title: 'Test product' }],
    currentPage: 1,
    totalPages: 5,
  }),
}));

vi.mock('@/src/components', () => ({
  Title: ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
    className?: string;
  }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  ProductGrid: () => <div data-testid="product-grid" />,
  Pagination: ({ totalPages }: { totalPages: number }) => (
    <div data-testid="pagination">{totalPages}</div>
  ),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Home page', () => {
  it('renders the shop heading', async () => {
    const page = await Home({
      searchParams: Promise.resolve({}),
    });

    render(page);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /tienda/i,
      }),
    ).toBeDefined();

    expect(screen.getByText(/todos los productos/i)).toBeDefined();
  });
});
