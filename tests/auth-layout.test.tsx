import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/src/auth.config', () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import AuthLayout from '@/src/app/auth/layout';

describe('Auth layout', () => {
  it('renders its children', async () => {
    const layout = await AuthLayout({ children: <div>Auth content</div> });
    render(layout);

    expect(screen.getByText('Auth content')).toBeDefined();
  });
});
