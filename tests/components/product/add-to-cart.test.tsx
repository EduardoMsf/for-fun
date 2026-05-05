import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AddToCart } from '@/src/app/(shop)/product/[slug]/ui/AddToCart';
import { useCartStore } from '@/src/store/cart/cart-store';
import type { Product } from '@/src/interfaces';

const baseProduct: Product = {
  id: 'p1',
  description: 'A great shirt',
  images: [{ url: 'shirt.jpg', id: 1 }],
  inStock: 10,
  price: 49.99,
  sizes: ['S', 'M', 'L'],
  slug: 'great-shirt',
  tags: ['shirt'],
  title: 'Great Shirt',
  gender: 'men',
};

beforeEach(() => {
  useCartStore.setState({ cart: [], totalItems: 0 });
});

afterEach(() => {
  useCartStore.setState({ cart: [], totalItems: 0 });
});

describe('AddToCart', () => {
  it('renders size selector, quantity selector, and add button', () => {
    render(<AddToCart product={baseProduct} />);

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDefined();
    expect(screen.getByText('S')).toBeDefined();
    expect(screen.getByText('M')).toBeDefined();
    expect(screen.getByText('L')).toBeDefined();
  });

  it('shows "Select a size" error when adding without selecting a size', () => {
    render(<AddToCart product={baseProduct} />);

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(screen.getByText(/select a size/i)).toBeDefined();
  });

  it('adds product to cart when a size is selected and button is clicked', () => {
    render(<AddToCart product={baseProduct} />);

    fireEvent.click(screen.getByText('M'));
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    const { cart } = useCartStore.getState();
    expect(cart).toHaveLength(1);
    expect(cart[0].size).toBe('M');
    expect(cart[0].id).toBe('p1');
  });

  it('resets quantity to 1 and clears size after adding to cart', () => {
    render(<AddToCart product={baseProduct} />);

    fireEvent.click(screen.getByText('L'));
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(screen.queryByText(/select a size/i)).toBeNull();
  });
});
