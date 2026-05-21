import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockAuth = vi.fn();
const mockGetCountries = vi.fn();
const mockGetUserAddress = vi.fn();

vi.mock('@/src/auth.config', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}));

vi.mock('@/src/actions', () => ({
  getCountries: (...args: unknown[]) => mockGetCountries(...args),
  getUserAddress: (...args: unknown[]) => mockGetUserAddress(...args),
}));

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: { user: { id: 'u1' } } })),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  redirect: vi.fn(),
}));

import CheckoutAddressPage from '@/src/app/(shop)/checkout/address/page';

describe('Checkout address page', () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: 'u1' } });
    mockGetCountries.mockResolvedValue([
      { id: 'US', name: 'United States' },
      { id: 'MX', name: 'Mexico' },
    ]);
    mockGetUserAddress.mockResolvedValue(null);
  });

  it('renders the title and subtitle', async () => {
    const page = await CheckoutAddressPage();
    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /direcci/i }),
    ).toBeDefined();
    expect(screen.getByText(/direcci.*de entrega/i)).toBeDefined();
  });

  it('renders the next step submit button', async () => {
    const page = await CheckoutAddressPage();
    render(page);

    expect(
      screen.getByRole('button', { name: /siguiente/i }),
    ).toBeDefined();
  });
});
