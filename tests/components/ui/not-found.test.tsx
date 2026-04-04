import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NotFound } from '@/src/components';

describe('NotFound', () => {
  it('renders the 404 state and home link', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { level: 2, name: '404' }),
    ).toBeDefined();
    expect(screen.getByRole('link', { name: /inicio/i }).getAttribute('href')).toBe(
      '/',
    );
    expect(screen.getByAltText('404').getAttribute('src')).toBe(
      '/imgs/starman_750x750.png',
    );
  });
});
