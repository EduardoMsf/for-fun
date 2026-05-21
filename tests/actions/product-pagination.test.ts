import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiFetch = vi.fn();

vi.mock('@/src/lib/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

vi.mock('next/cache', () => ({ unstable_noStore: vi.fn(), revalidatePath: vi.fn() }));

import { getPaginatedProductsWithImages } from '@/src/actions';

describe('getPaginatedProductsWithImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls apiFetch with default page=1 and take=12', async () => {
    mockApiFetch.mockResolvedValue({ currentPage: 1, totalPages: 5, products: [] });

    await getPaginatedProductsWithImages();

    expect(mockApiFetch).toHaveBeenCalledWith('/products?page=1&take=12');
  });

  it('returns the apiFetch response directly', async () => {
    const payload = {
      currentPage: 2,
      totalPages: 4,
      products: [{ id: 'p1', title: 'Shirt', slug: 'shirt' }],
    };
    mockApiFetch.mockResolvedValue(payload);

    const result = await getPaginatedProductsWithImages({ page: 2, take: 12 });

    expect(result).toEqual(payload);
  });

  it('normalizes page < 1 to 1', async () => {
    mockApiFetch.mockResolvedValue({ currentPage: 1, totalPages: 1, products: [] });

    await getPaginatedProductsWithImages({ page: -5 });

    expect(mockApiFetch).toHaveBeenCalledWith('/products?page=1&take=12');
  });

  it('normalizes NaN page to 1', async () => {
    mockApiFetch.mockResolvedValue({ currentPage: 1, totalPages: 1, products: [] });

    await getPaginatedProductsWithImages({ page: NaN });

    expect(mockApiFetch).toHaveBeenCalledWith('/products?page=1&take=12');
  });

  it('passes gender as a query param when provided', async () => {
    mockApiFetch.mockResolvedValue({ currentPage: 1, totalPages: 2, products: [] });

    await getPaginatedProductsWithImages({ page: 1, take: 6, gender: 'women' });

    expect(mockApiFetch).toHaveBeenCalledWith('/products?page=1&take=6&gender=women');
  });

  it('calculates skip correctly for page > 1', async () => {
    mockApiFetch.mockResolvedValue({ currentPage: 3, totalPages: 5, products: [] });

    await getPaginatedProductsWithImages({ page: 3, take: 10 });

    expect(mockApiFetch).toHaveBeenCalledWith('/products?page=3&take=10');
  });

  it('throws "Products are not available" when apiFetch rejects', async () => {
    mockApiFetch.mockRejectedValue(new Error('network error'));

    await expect(getPaginatedProductsWithImages()).rejects.toThrow('Products are not available');
  });
});
