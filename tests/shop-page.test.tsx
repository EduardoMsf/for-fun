import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ShopPage from '@/src/app/(shop)/page';

describe('Shop page', () => {
  it('renders the shop heading', () => {
    render(<ShopPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /tienda/i,
      }),
    ).toBeDefined();

    expect(screen.getByText(/todos los productos/i)).toBeDefined();
  });
});
