import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: null })),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

import ShopLayout from '@/src/app/(shop)/layout';

describe('Shop layout', () => {
  it('renders its children', () => {
    render(
      <ShopLayout>
        <div>Shop content</div>
      </ShopLayout>,
    );

    expect(screen.getByText('Shop content')).toBeDefined();
  });
});
