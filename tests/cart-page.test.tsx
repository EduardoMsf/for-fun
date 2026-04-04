import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CartPage from '@/src/app/(shop)/cart/page';
import { initialData } from '@/src/seed/seed';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Cart page', () => {
  it('renders the cart heading and navigation links', () => {
    render(<CartPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /cart/i }),
    ).toBeDefined();
    expect(screen.getByText(/add more items/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /keep shopping/i }).getAttribute('href')).toBe(
      '/checkout',
    );
    expect(
      screen
        .getByRole('link', { name: /proceed to checkout/i })
        .getAttribute('href'),
    ).toBe('/checkout');
  });

  it('renders the cart products with quantity selectors and remove buttons', () => {
    const { container } = render(<CartPage />);

    const productsInCart = [
      initialData.products[0],
      initialData.products[1],
      initialData.products[2],
      initialData.products[3],
    ];

    expect(screen.getAllByRole('img')).toHaveLength(productsInCart.length);

    for (const product of productsInCart) {
      expect(screen.getByText(product.title)).toBeDefined();
      expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeDefined();
    }

    expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(
      productsInCart.length,
    );
    expect(container.querySelectorAll('button').length).toBeGreaterThanOrEqual(
      productsInCart.length * 3,
    );
    expect(screen.getAllByText('1')).toHaveLength(productsInCart.length);
  });

  it('lets the first quantity selector update its value and renders the order summary', () => {
    const { container } = render(<CartPage />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[1]);

    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole('heading', { level: 2, name: /order summary/i }),
    ).toBeDefined();
    expect(screen.getByText('3 items')).toBeDefined();
    expect(screen.getByText('$100')).toBeDefined();
    expect(screen.getAllByText('$15')).toHaveLength(2);
  });
});
