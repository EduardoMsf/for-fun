import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoginPage from '@/src/app/auth/login/page';

describe('Login page', () => {
  it('renders the login heading', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /sign in/i,
      }),
    ).toBeDefined();

    expect(screen.getByRole('button', { name: /login/i })).toBeDefined();
    expect(
      screen.getByRole('link', { name: /create a new account/i }),
    ).toBeDefined();
    expect(
      screen
        .getByRole('link', { name: /create a new account/i })
        .getAttribute('href'),
    ).toBe('/auth/new-account');
  });
});
