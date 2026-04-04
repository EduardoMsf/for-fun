import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CheckoutPage from '@/src/app/(shop)/checkout/page';
import { initialData } from '@/src/seed/seed';

describe('Checkout page', () => {
  it('renders the order confirmation heading and cart navigation', () => {
    render(<CheckoutPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /confirm order/i }),
    ).toBeDefined();
    expect(screen.getByText('Elements')).toBeDefined();
    expect(screen.getByRole('link', { name: /edit cart/i }).getAttribute('href')).toBe(
      '/cart',
    );
  });

  it('renders the products from the mocked cart', () => {
    render(<CheckoutPage />);

    const productsInCart = [
      initialData.products[0],
      initialData.products[1],
      initialData.products[2],
    ];

    expect(screen.getAllByRole('img')).toHaveLength(productsInCart.length);

    for (const product of productsInCart) {
      expect(screen.getByText(product.title)).toBeDefined();
      expect(
        screen.getByText(`$${product.price.toFixed(2)} x 3`),
      ).toBeDefined();
      expect(
        screen.getByText(`$${(product.price * 3).toFixed(2)}`),
      ).toBeDefined();
    }

    expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(
      productsInCart.length,
    );
  });

  it('renders the shipping address, summary, and place order link', () => {
    render(<CheckoutPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: /address shipping/i }),
    ).toBeDefined();
    expect(screen.getByText('Eduardo Samaniego')).toBeDefined();
    expect(
      screen.getByRole('heading', { level: 2, name: /order summary/i }),
    ).toBeDefined();
    expect(screen.getByText('3 items')).toBeDefined();
    expect(screen.getByText('$100')).toBeDefined();
    expect(screen.getAllByText('$15')).toHaveLength(2);
    expect(
      screen.getByRole('link', { name: /place order/i }).getAttribute('href'),
    ).toBe('/orders/abc');
  });
});
