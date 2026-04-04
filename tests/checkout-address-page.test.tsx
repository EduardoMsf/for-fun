import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CheckoutAddressPage from '@/src/app/(shop)/checkout/address/page';

describe('Checkout address page', () => {
  it('renders the title and subtitle', () => {
    render(<CheckoutAddressPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /direcci/i }),
    ).toBeDefined();
    expect(screen.getByText(/direcci.*de entrega/i)).toBeDefined();
  });

  // it('renders all address fields and country options', () => {
  //   const { container } = render(<CheckoutAddressPage />);

  //   expect(screen.getByText(/nombres/i)).toBeDefined();
  //   expect(screen.getByText(/apellidos/i)).toBeDefined();
  //   expect(screen.getAllByText(/direcci/i).length).toBeGreaterThanOrEqual(2);
  //   expect(screen.getByText(/ciudad/i)).toBeDefined();
  //   expect(container.textContent).toContain('CÃ³digo postal');
  //   expect(container.textContent).toContain('PaÃ­s');
  //   expect(container.textContent).toContain('TelÃ©fono');

  //   expect(container.querySelectorAll('input')).toHaveLength(7);

  //   const select = screen.getByRole('combobox');
  //   expect(select).toBeDefined();
  //   const options = screen.getAllByRole('option');
  //   expect(options).toHaveLength(7);
  //   expect(options.map((option) => option.textContent)).toEqual([
  //     '[ Seleccione ]',
  //     'MÃ©xico',
  //     'Estados Unidos',
  //     'CanadÃ¡',
  //     'EspaÃ±a',
  //     'Francia',
  //     'Alemania',
  //   ]);
  // });

  it('renders the next step link to checkout summary', () => {
    render(<CheckoutAddressPage />);

    expect(
      screen.getByRole('link', { name: /siguiente/i }).getAttribute('href'),
    ).toBe('/checkout');
  });
});
