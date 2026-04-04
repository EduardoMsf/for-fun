import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Sidebar } from '@/src/components';
import { useUIStore } from '@/src/store';

describe('Sidebar', () => {
  it('starts hidden when the store is closed', () => {
    render(<Sidebar />);

    expect(screen.getByRole('navigation').className).toContain('translate-x-full');
  });

  it('renders the menu content when the store is open', () => {
    useUIStore.setState({ isSideMenuOpen: true });

    render(<Sidebar />);

    expect(screen.getByPlaceholderText('Search')).toBeDefined();
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
