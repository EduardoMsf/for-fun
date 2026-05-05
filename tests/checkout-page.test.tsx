import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import CheckoutPage from '@/src/app/(shop)/checkout/(checkout)/page';
import { useCartStore } from '@/src/store/cart/cart-store';
import { useAddressStore } from '@/src/store/address/address-store';
import type { CartProduct } from '@/src/interfaces';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  redirect: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: { user: { id: 'u1' } } })),
}));

vi.mock('@/src/actions', () => ({
  placeORder: vi.fn(),
}));

const testCart: CartProduct[] = [
  {
    id: 'p1',
    slug: 's1',
    title: 'Alpha Shirt',
    price: 50,
    quantity: 2,
    size: 'M',
    image: { url: 's1.jpg', id: 1 },
  },
];

beforeEach(() => {
  useCartStore.setState({ cart: testCart, totalItems: 2 });
  useAddressStore.setState({
    address: {
      firstName: 'Jane',
      lastName: 'Doe',
      address: '123 Main St',
      address2: '',
      postalCode: '10001',
      city: 'New York',
      country: 'US',
      phone: '5550001111',
    },
  });
});

afterEach(() => {
  useCartStore.setState({ cart: [], totalItems: 0 });
});

describe('Checkout page', () => {
  it('renders the order confirmation heading and cart navigation', () => {
    render(<CheckoutPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /confirm order/i }),
    ).toBeDefined();
    expect(screen.getByText('Elements')).toBeDefined();
    expect(
      screen.getByRole('link', { name: /edit cart/i }).getAttribute('href'),
    ).toBe('/cart');
  });

  it('renders the products from the cart', () => {
    render(<CheckoutPage />);

    expect(screen.getAllByRole('img')).toHaveLength(testCart.length);
    expect(screen.getByText(/alpha shirt/i)).toBeDefined();
  });

  it('renders the shipping address and order summary headings', () => {
    render(<CheckoutPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: /address shipping/i }),
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { level: 2, name: /order summary/i }),
    ).toBeDefined();
    expect(screen.getByText(/jane/i)).toBeDefined();
  });
});
