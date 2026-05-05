import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import CartPage from '@/src/app/(shop)/cart/page';
import { useCartStore } from '@/src/store/cart/cart-store';
import type { CartProduct } from '@/src/interfaces';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

const testCart: CartProduct[] = [
  {
    id: 'p1',
    slug: 's1',
    title: 'Alpha Shirt',
    price: 50,
    quantity: 1,
    size: 'M',
    image: { url: 's1.jpg', id: 1 },
  },
  {
    id: 'p2',
    slug: 's2',
    title: 'Beta Hoodie',
    price: 50,
    quantity: 1,
    size: 'L',
    image: { url: 's2.jpg', id: 2 },
  },
];

beforeEach(() => {
  useCartStore.setState({ cart: testCart, totalItems: 2 });
});

afterEach(() => {
  useCartStore.setState({ cart: [], totalItems: 0 });
});

describe('Cart page', () => {
  it('renders the cart heading and navigation links', () => {
    render(<CartPage />);

    expect(screen.getByRole('heading', { level: 1, name: /cart/i })).toBeDefined();
    expect(screen.getByText(/add more items/i)).toBeDefined();
    expect(
      screen.getByRole('link', { name: /keep shopping/i }).getAttribute('href'),
    ).toBe('/');
    expect(
      screen
        .getByRole('link', { name: /proceed to checkout/i })
        .getAttribute('href'),
    ).toBe('/checkout/address');
  });

  it('renders each cart product image and remove button', () => {
    render(<CartPage />);

    expect(screen.getAllByRole('img')).toHaveLength(testCart.length);
    expect(
      screen.getAllByRole('button', { name: /remove/i }),
    ).toHaveLength(testCart.length);
  });

  it('renders the order summary heading', () => {
    render(<CartPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: /order summary/i }),
    ).toBeDefined();
    expect(screen.getByText('2 items')).toBeDefined();
  });
});
