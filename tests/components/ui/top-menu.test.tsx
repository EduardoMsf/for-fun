import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TopMenu } from '@/src/components';
import { useUIStore } from '@/src/store';

describe('TopMenu', () => {
  it('renders navigation links', () => {
    render(<TopMenu />);

    expect(screen.getByRole('link', { name: /teslo/i }).getAttribute('href')).toBe(
      '/',
    );
    expect(screen.getByRole('link', { name: 'Men' }).getAttribute('href')).toBe(
      '/category/men',
    );
    expect(screen.getByRole('link', { name: 'Women' }).getAttribute('href')).toBe(
      '/category/women',
    );
    expect(screen.getByRole('link', { name: 'Kid' }).getAttribute('href')).toBe(
      '/category/kid',
    );
  });

  it('opens the side menu when the menu button is clicked', () => {
    render(<TopMenu />);

    fireEvent.click(screen.getByRole('button', { name: /men/i }));

    expect(useUIStore.getState().isSideMenuOpen).toBe(true);
  });
});
