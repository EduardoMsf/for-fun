import { render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Home from '@/src/app/(shop)/page';

vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

describe('Home page', () => {
  it('renders the shop heading', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /tienda/i,
      }),
    ).toBeDefined();

    expect(screen.getByText(/todos los productos/i)).toBeDefined();
  });
});
