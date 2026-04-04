import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OrdersPage from '@/src/app/(shop)/orders/page';

describe('Orders page', () => {
  it('renders the orders heading and table headers', () => {
    render(<OrdersPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /orders/i }),
    ).toBeDefined();
    expect(screen.getByText('#ID')).toBeDefined();
    expect(screen.getByText(/nombre completo/i)).toBeDefined();
    expect(screen.getByText(/estado/i)).toBeDefined();
    expect(screen.getByText(/opciones/i)).toBeDefined();
  });

  it('renders both order rows and their detail links', () => {
    render(<OrdersPage />);

    expect(screen.getAllByText('Mark')).toHaveLength(2);
    expect(screen.getByText(/^Pagada$/i)).toBeDefined();
    expect(screen.getByText(/^No Pagada$/i)).toBeDefined();

    const orderLinks = screen.getAllByRole('link', { name: /ver orden/i });
    expect(orderLinks).toHaveLength(2);
    expect(orderLinks[0].getAttribute('href')).toBe('/orders/1236');
    expect(orderLinks[1].getAttribute('href')).toBe('/orders/1237');
  });
});
