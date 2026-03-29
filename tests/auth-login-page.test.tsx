import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoginPage from '@/src/app/auth/login/page';

describe('Login page', () => {
  it('renders the login heading', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /login/i,
      }),
    ).toBeDefined();
  });
});
