import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockGetOrderByUser = vi.fn();

vi.mock('@/src/actions', () => ({
  getOrderByUser: (...args: unknown[]) => mockGetOrderByUser(...args),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import OrdersPage from '@/src/app/(shop)/orders/page';

const testOrders = [
  {
    id: 'uuid-0000-0000-0000-1236',
    isPaid: true,
    OrderAddress: { firstName: 'Mark', lastName: 'Doe' },
  },
  {
    id: 'uuid-0000-0000-0000-1237',
    isPaid: false,
    OrderAddress: { firstName: 'Mark', lastName: 'Smith' },
  },
];

describe('Orders page', () => {
  beforeEach(() => {
    mockGetOrderByUser.mockResolvedValue({ ok: true, orders: testOrders });
  });

  it('renders the orders heading and table headers', async () => {
    const page = await OrdersPage();
    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /orders/i }),
    ).toBeDefined();
    expect(screen.getByText('#ID')).toBeDefined();
    expect(screen.getByText(/nombre completo/i)).toBeDefined();
    expect(screen.getByText(/estado/i)).toBeDefined();
    expect(screen.getByText(/opciones/i)).toBeDefined();
  });

  it('renders both order rows and their detail links', async () => {
    const page = await OrdersPage();
    render(page);

    expect(screen.getAllByText(/mark/i)).toHaveLength(2);
    expect(screen.getByText(/^Pagada$/i)).toBeDefined();
    expect(screen.getByText(/^No Pagada$/i)).toBeDefined();

    const orderLinks = screen.getAllByRole('link', { name: /ver orden/i });
    expect(orderLinks).toHaveLength(2);
    expect(orderLinks[0].getAttribute('href')).toContain('1236');
    expect(orderLinks[1].getAttribute('href')).toContain('1237');
  });
});
