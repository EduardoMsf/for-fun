import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Title } from '@/src/components';

describe('Title', () => {
  it('renders the title and subtitle', () => {
    render(<Title title="Catalog" subtitle="Latest products" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Catalog' }),
    ).toBeDefined();
    expect(screen.getByText('Latest products')).toBeDefined();
  });

  it('omits the subtitle when it is not provided', () => {
    render(<Title title="Catalog" />);

    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
  });
});
