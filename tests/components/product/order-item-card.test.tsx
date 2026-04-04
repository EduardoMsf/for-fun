import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OrderItemCard } from '@/src/components/product/order-item-card/OrderItemCard';
import type { Product } from '@/src/interfaces';

const product: Readonly<Product> = {
  description: 'Soft premium hoodie',
  images: ['hoodie-front.jpg', 'hoodie-back.jpg'],
  inStock: 12,
  price: 49.99,
  sizes: ['S', 'M', 'L'],
  slug: 'soft-premium-hoodie',
  tags: ['hoodie'],
  title: 'Soft Premium Hoodie',
  type: 'hoodies',
  gender: 'unisex',
};

describe('OrderItemCard', () => {
  it('renders the product image and title', () => {
    render(<OrderItemCard product={product} quantity={3} />);

    expect(screen.getByText('Soft Premium Hoodie')).toBeDefined();
    expect(screen.getByAltText('Soft Premium Hoodie').getAttribute('src')).toBe(
      '/products/hoodie-front.jpg',
    );
  });

  it('renders the unit price, quantity, subtotal, and remove button', () => {
    render(<OrderItemCard product={product} quantity={3} />);

    expect(screen.getByText('$49.99 x 3')).toBeDefined();
    expect(screen.getByText('$149.97')).toBeDefined();
    expect(screen.getByRole('button', { name: /remove/i })).toBeDefined();
  });
});
