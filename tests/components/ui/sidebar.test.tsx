import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseSession = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: (...args: unknown[]) => mockUseSession(...args),
}));

import { Sidebar } from '@/src/components';
import { useUIStore } from '@/src/store';

beforeEach(() => {
  mockUseSession.mockReturnValue({ data: null });
  useUIStore.setState({ isSideMenuOpen: false });
});

describe('Sidebar', () => {
  it('starts hidden when the store is closed', () => {
    render(<Sidebar />);

    expect(screen.getByRole('navigation').className).toContain('translate-x-full');
  });

  it('renders the menu content with login link when unauthenticated', () => {
    useUIStore.setState({ isSideMenuOpen: true });

    render(<Sidebar />);

    expect(screen.getByPlaceholderText('Search')).toBeDefined();
    expect(screen.getByRole('link', { name: /login/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeDefined();
  });

  it('renders profile link when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'u1', role: 'user' } },
    });
    useUIStore.setState({ isSideMenuOpen: true });

    render(<Sidebar />);

    expect(screen.getByRole('link', { name: /profile/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeDefined();
  });

  it('closes the menu from the close button', () => {
    useUIStore.setState({ isSideMenuOpen: true });

    render(<Sidebar />);

    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));

    expect(useUIStore.getState().isSideMenuOpen).toBe(false);
  });
});
