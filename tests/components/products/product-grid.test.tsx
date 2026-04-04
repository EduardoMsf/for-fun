import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProductGrid } from '@/src/components';
import type { Product } from '@/src/interfaces';

const products: Product[] = [
  {
    description: 'Warm hoodie',
    images: ['hoodie.jpg'],
    inStock: 5,
    price: 49.99,
    sizes: ['S', 'M'],
    slug: 'warm-hoodie',
    tags: ['hoodie'],
    title: 'Warm Hoodie',
    type: 'hoodies',
    gender: 'unisex',
  },
  {
    description: 'Classic cap',
    images: ['cap.jpg'],
    inStock: 8,
    price: 19.99,
    sizes: ['M'],
    slug: 'classic-cap',
    tags: ['hat'],
    title: 'Classic Cap',
    type: 'hats',
    gender: 'unisex',
  },
];

describe('ProductGrid', () => {
  it('renders every provided product', () => {
    render(<ProductGrid products={products} />);

    expect(screen.getByText('Warm Hoodie')).toBeDefined();
    expect(screen.getByText('Classic Cap')).toBeDefined();
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });
});
