import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OrderPage from '@/src/app/(shop)/orders/[id]/page';
import { initialData } from '@/src/seed/seed';

describe('Order page', () => {
  it('renders the order heading from params and payment status', async () => {
    const page = await OrderPage({
      params: Promise.resolve({ id: 'abc123' }),
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /order #abc123/i }),
    ).toBeDefined();
    expect(screen.getAllByText(/payment completed/i)).toHaveLength(2);
  });

  it('renders the products in the order with totals', async () => {
    const page = await OrderPage({
      params: Promise.resolve({ id: 'abc123' }),
    });

    render(page);

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

  it('renders the shipping address and order summary', async () => {
    const page = await OrderPage({
      params: Promise.resolve({ id: 'abc123' }),
    });

    render(page);

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
  });
});
