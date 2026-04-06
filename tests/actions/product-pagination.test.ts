import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFindMany = vi.fn();
const mockCount = vi.fn();

vi.mock('@/src/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
    },
  },
}));

import { getPaginatedProductsWithImages } from '@/src/actions';

describe('getPaginatedProductsWithImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses default pagination values and maps prisma fields into product cards', async () => {
    mockFindMany.mockResolvedValue([
      {
        id: 'p1',
        title: 'Test product',
        slug: 'test-product',
        description: 'desc',
        inStock: 5,
        price: 25,
        size: ['M', 'L'],
        tags: ['shirt'],
        gender: 'men',
        productImages: [{ url: 'a.jpg' }, { url: 'b.jpg' }],
      },
    ]);
    mockCount.mockResolvedValue(24);

    const result = await getPaginatedProductsWithImages();

    expect(mockFindMany).toHaveBeenCalledWith({
      take: 12,
      skip: 0,
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        gender: undefined,
      },
    });
    expect(mockCount).toHaveBeenCalledWith({
      where: {
        gender: undefined,
      },
    });
    expect(result).toEqual({
      currentPage: 1,
      totalPages: 2,
      products: [
        {
          id: 'p1',
          title: 'Test product',
          slug: 'test-product',
          description: 'desc',
          inStock: 5,
          price: 25,
          tags: ['shirt'],
          gender: 'men',
          images: ['a.jpg', 'b.jpg'],
          sizes: ['M', 'L'],
        },
      ],
    });
  });

  it('normalizes invalid page values and applies gender and take filters', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(3);

    const result = await getPaginatedProductsWithImages({
      page: -2,
      take: 3,
      gender: 'kid',
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      take: 3,
      skip: 0,
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        gender: 'kid',
      },
    });
    expect(mockCount).toHaveBeenCalledWith({
      where: {
        gender: 'kid',
      },
    });
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.products).toEqual([]);
  });

  it('uses the sanitized page to calculate skip', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(50);

    await getPaginatedProductsWithImages({
      page: 3,
      take: 10,
      gender: 'women',
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      take: 10,
      skip: 20,
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        gender: 'women',
      },
    });
  });

  it('throws a friendly error when prisma fails', async () => {
    mockFindMany.mockRejectedValue(new Error('db failed'));

    await expect(getPaginatedProductsWithImages()).rejects.toThrow(
      'Products are not available',
    );
  });
});
