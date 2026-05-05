import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockAuth = vi.fn();
const mockRedirect = vi.fn().mockImplementation(() => { throw new Error('NEXT_REDIRECT'); });

vi.mock('@/src/auth.config', () => ({ auth: (...args: unknown[]) => mockAuth(...args) }));
vi.mock('next/navigation', () => ({ redirect: (...args: unknown[]) => mockRedirect(...args) }));

import ProfilePage from '@/src/app/(shop)/profile/page';

describe('Profile page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    await expect(ProfilePage()).rejects.toThrow('NEXT_REDIRECT');
    expect(mockRedirect).toHaveBeenCalledWith('/');
  });

  it('renders the user name and role when authenticated', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'u1', name: 'Jane Doe', role: 'admin' },
    });

    const page = await ProfilePage();
    render(page as React.ReactElement);

    expect(screen.getByText('Jane Doe')).toBeDefined();
    expect(screen.getByText('admin')).toBeDefined();
  });
});
