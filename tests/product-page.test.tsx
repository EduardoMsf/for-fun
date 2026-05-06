import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initialData } from '@/src/seed/seed';

const notFoundError = new Error('NEXT_NOT_FOUND');
const mockNotFound = vi.fn(() => {
  throw notFoundError;
});

vi.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}));

vi.mock('@/src/actions', async () => {
  const { initialData: seed } = await import('@/src/seed/seed');
  return {
    getProductBySlug: vi.fn((slug: string) => {
      const seedProduct = seed.products.find((p) => p.slug === slug);
      if (!seedProduct) return Promise.resolve(null);
      return Promise.resolve({
        ...seedProduct,
        id: 'test-id',
        images: seedProduct.images.map((url, id) => ({ url, id })),
      });
    }),
  };
});

import ProductPage from '@/src/app/(shop)/product/[slug]/page';

describe('Product page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the selected product details', async () => {
    const product = initialData.products[0];

    const page = await ProductPage({
      params: Promise.resolve({ slug: product.slug }),
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: product.title }),
    ).toBeDefined();
    expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeDefined();
    expect(screen.getByText(product.description)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeDefined();
    expect(screen.getAllByAltText(product.title).length).toBeGreaterThan(0);
  });

  it('calls notFound when the product slug does not exist', async () => {
    await expect(
      ProductPage({
        params: Promise.resolve({ slug: 'missing-product' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });
});
