import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CategoryPage, {
  generateMetadata,
} from '@/src/app/(shop)/category/[id]/page';
import { initialData } from '@/src/seed/seed';

describe('Category page', () => {
  it('renders the selected category products and translated subtitle', async () => {
    const page = await CategoryPage({
      params: Promise.resolve({ id: 'kid' }),
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /tienda/i }),
    ).toBeDefined();
    expect(screen.getByText(/todos los productos de niños/i)).toBeDefined();

    const kidProducts = initialData.products.filter(
      (product) => product.gender === 'kid',
    );

    expect(screen.getAllByRole('img')).toHaveLength(kidProducts.length);
    expect(screen.getByText(kidProducts[0].title)).toBeDefined();
  });

  it('falls back to the raw id when the category label is unknown', async () => {
    const page = await CategoryPage({
      params: Promise.resolve({ id: 'kids' as never }),
    });

    render(page);

    expect(screen.getByText(/todos los productos de kids/i)).toBeDefined();
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});

describe('generateMetadata', () => {
  it('returns translated metadata for a known category', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'women' }),
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
      params: Promise.resolve({ id: 'kids' as never }),
    });

    expect(metadata.title).toBe('kids | Tienda');
    expect(metadata.description).toBe(
      'Explora 0 productos de la categoria kids disponibles en la tienda.',
    );
  });
});
