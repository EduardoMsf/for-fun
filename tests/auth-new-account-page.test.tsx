import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NewAccountPage from '@/src/app/auth/new-account/page';

describe('New account page', () => {
  it('renders the new account heading', () => {
    render(<NewAccountPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /new account/i,
      }),
    ).toBeDefined();
  });
});
