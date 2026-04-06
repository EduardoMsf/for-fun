import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CategoryPage, {
  generateMetadata,
} from '@/src/app/(shop)/gender/[gender]/page';
import { initialData } from '@/src/seed/seed';

const mockGetPaginatedProductsWithImages = vi.fn();

vi.mock('@/src/actions', () => ({
  getPaginatedProductsWithImages: (...args: unknown[]) =>
    mockGetPaginatedProductsWithImages(...args),
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
  ProductGrid: ({
    products,
  }: {
    products: Array<{ title: string }>;
  }) => (
    <div>
      {products.map((product) => (
        <img key={product.title} alt={product.title} />
      ))}
      {products[0] ? <span>{products[0].title}</span> : null}
    </div>
  ),
  Pagination: ({ totalPages }: { totalPages: number }) => (
    <div data-testid="pagination">{totalPages}</div>
  ),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Category page', () => {
  it('renders the selected category products and translated subtitle', async () => {
    const kidProducts = initialData.products
      .filter((product) => product.gender === 'kid')
      .map((product) => ({
        ...product,
        id: product.slug,
      }));

    mockGetPaginatedProductsWithImages.mockResolvedValue({
      products: kidProducts,
      currentPage: 1,
      totalPages: 1,
    });

    const page = await CategoryPage({
      params: Promise.resolve({ gender: 'kid' }),
      searchParams: Promise.resolve({}),
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /tienda/i }),
    ).toBeDefined();
    expect(
      screen.getByText((content) =>
        content.toLowerCase().includes('todos los productos de') &&
        /ni(?:ñ|Ã±)os/i.test(content),
      ),
    ).toBeDefined();
    expect(screen.getAllByRole('img')).toHaveLength(kidProducts.length);
    expect(screen.getByText(kidProducts[0].title)).toBeDefined();
  });

  it('falls back to the raw id when the category label is unknown', async () => {
    mockGetPaginatedProductsWithImages.mockResolvedValue({
      products: [],
      currentPage: 1,
      totalPages: 0,
    });

    const page = await CategoryPage({
      params: Promise.resolve({ gender: 'kids' as never }),
      searchParams: Promise.resolve({}),
    });

    render(page);

    expect(screen.getByText(/todos los productos de kids/i)).toBeDefined();
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});

describe('generateMetadata', () => {
  it('returns translated metadata for a known category', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ gender: 'women' }),
      searchParams: Promise.resolve({}),
    });

    const womenProducts = initialData.products.filter(
      (product) => product.gender === 'women',
    );

    expect(metadata.title).toBe('Mujeres | Tienda');
    expect(metadata.description).toBe(
      `Explora ${womenProducts.length} productos de la categoria mujeres disponibles en la tienda.`,
    );
  });

  it('returns fallback metadata for an unknown category', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ gender: 'kids' as never }),
      searchParams: Promise.resolve({}),
    });

    expect(metadata.title).toBe('kids | Tienda');
    expect(metadata.description).toBe(
      'Explora 0 productos de la categoria kids disponibles en la tienda.',
    );
  });
});
