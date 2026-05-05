import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/auth/login'),
  redirect: vi.fn(),
}));

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

    expect(screen.getByRole('button', { name: /log in/i })).toBeDefined();
    expect(
      screen.getByRole('link', { name: /create account/i }),
    ).toBeDefined();
    expect(
      screen
        .getByRole('link', { name: /create account/i })
        .getAttribute('href'),
    ).toBe('/auth/new-account');
  });
});
