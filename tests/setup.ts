import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('next/font/google', () => {
  const createFont = () => ({
    className: 'mocked-font',
    style: { fontFamily: 'mocked-font' },
    variable: '--mocked-font',
  });

  return {
    Geist: createFont,
    Geist_Mono: createFont,
    Inter: createFont,
    Montserrat_Alternates: createFont,
  };
});

afterEach(() => {
  cleanup();
});
