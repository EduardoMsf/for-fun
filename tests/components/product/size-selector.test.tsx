import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SizeSelector } from '@/src/components';

describe('SizeSelector', () => {
  it('renders the available sizes and highlights the selected one', () => {
    render(
      <SizeSelector selectedSize="M" availableSizes={['S', 'M', 'L']} />,
    );

    expect(screen.getByRole('button', { name: 'S' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'M' }).className).toContain(
      'underline',
    );
    expect(screen.getByRole('button', { name: 'L' })).toBeDefined();
  });

  it('renders no size buttons when sizes are not provided', () => {
    render(<SizeSelector selectedSize="M" />);

    expect(screen.queryByRole('button', { name: 'M' })).toBeNull();
  });
});
