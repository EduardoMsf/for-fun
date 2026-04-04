import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Footer } from '@/src/components';

describe('Footer', () => {
  it('renders the main footer sections and links', () => {
    render(<Footer />);

    expect(screen.getByText('Product')).toBeDefined();
    expect(screen.getByText('Resources')).toBeDefined();
    expect(screen.getByText('Legal')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe(
      '/',
    );
    expect(
      screen
        .getAllByRole('link')
        .some((link) => link.getAttribute('href') === 'https://dribbble.com/prebuiltui'),
    ).toBe(true);
  });

  it('renders the copyright text', () => {
    render(<Footer />);

    expect(screen.getByText(/2025 Takis Samaniego/i)).toBeDefined();
  });
});
