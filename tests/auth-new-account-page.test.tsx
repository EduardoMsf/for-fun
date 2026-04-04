import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NewAccountPage from '@/src/app/auth/new-account/page';

describe('New account page', () => {
  it('renders the new account heading', () => {
    render(<NewAccountPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /create account/i,
      }),
    ).toBeDefined();

    expect(
      screen.getByRole('button', { name: /create account/i }),
    ).toBeDefined();
    expect(
      screen.getByRole('link', { name: /have an account\? sign in/i }),
    ).toBeDefined();
    expect(
      screen
        .getByRole('link', { name: /have an account\? sign in/i })
        .getAttribute('href'),
    ).toBe('/auth/login');
  });
});
