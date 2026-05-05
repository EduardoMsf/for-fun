import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockGetOrderById = vi.fn();

vi.mock('@/src/actions', () => ({
  getOrderById: (...args: unknown[]) => mockGetOrderById(...args),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@paypal/react-paypal-js', () => ({
  usePayPalScriptReducer: () => [{ isPending: false }],
  PayPalButtons: () => null,
}));

import OrderPage from '@/src/app/(shop)/orders/[id]/page';

const testOrder = {
  id: 'order-abc-123',
  isPaid: true,
  itemsInOrder: 2,
  subTotal: 100,
  tax: 15,
  total: 115,
  OrderAddress: {
    firstName: 'Jane',
    lastName: 'Doe',
    address: '123 Main St',
    address2: '',
    city: 'New York',
    countryId: 'US',
    postalCode: '10001',
    phone: '5550001111',
  },
  OrderItem: [
    {
      price: 50,
      quantity: 2,
      size: 'M',
      product: {
        title: 'Test Shirt',
        slug: 'test-shirt',
        productImages: [{ url: 'shirt.jpg', id: 1 }],
      },
    },
  ],
};

describe('Order page', () => {
  beforeEach(() => {
    mockGetOrderById.mockResolvedValue({ ok: true, order: testOrder });
  });

  it('renders the order heading from params', async () => {
    const page = await OrderPage({
      params: Promise.resolve({ id: 'order-abc-123' }),
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /order #123/i }),
    ).toBeDefined();
  });

  it('renders the products in the order', async () => {
    const page = await OrderPage({
      params: Promise.resolve({ id: 'order-abc-123' }),
    });

    render(page);

    expect(screen.getAllByRole('img')).toHaveLength(testOrder.OrderItem.length);
    expect(screen.getByText('Test Shirt')).toBeDefined();
    expect(screen.getByText('$50.00 x 2')).toBeDefined();
  });

  it('renders the shipping address and order summary', async () => {
    const page = await OrderPage({
      params: Promise.resolve({ id: 'order-abc-123' }),
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 2, name: /address shipping/i }),
    ).toBeDefined();
    expect(screen.getByText(/jane/i)).toBeDefined();
    expect(
      screen.getByRole('heading', { level: 2, name: /order summary/i }),
    ).toBeDefined();
    expect(screen.getByText('2 items')).toBeDefined();
  });
});
