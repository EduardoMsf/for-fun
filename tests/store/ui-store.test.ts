import { beforeEach, describe, expect, it } from 'vitest';
import { useUIStore } from '@/src/store/ui/ui-store';

beforeEach(() => {
  useUIStore.setState({ isSideMenuOpen: false });
});

describe('useUIStore', () => {
  it('starts with sidebar closed', () => {
    expect(useUIStore.getState().isSideMenuOpen).toBe(false);
  });

  it('openSideMenu sets isSideMenuOpen to true', () => {
    useUIStore.getState().openSideMenu();
    expect(useUIStore.getState().isSideMenuOpen).toBe(true);
  });

  it('closeSideMenu sets isSideMenuOpen to false', () => {
    useUIStore.setState({ isSideMenuOpen: true });
    useUIStore.getState().closeSideMenu();
    expect(useUIStore.getState().isSideMenuOpen).toBe(false);
  });

  it('toggleSideMenu opens when closed', () => {
    useUIStore.getState().toggleSideMenu();
    expect(useUIStore.getState().isSideMenuOpen).toBe(true);
  });

  it('toggleSideMenu closes when open', () => {
    useUIStore.setState({ isSideMenuOpen: true });
    useUIStore.getState().toggleSideMenu();
    expect(useUIStore.getState().isSideMenuOpen).toBe(false);
  });

  it('toggling twice returns to the original state', () => {
    useUIStore.getState().toggleSideMenu();
    useUIStore.getState().toggleSideMenu();
    expect(useUIStore.getState().isSideMenuOpen).toBe(false);
  });
});
