import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AuthLayout from '@/src/app/auth/layout';

describe('Auth layout', () => {
  it('renders its children', () => {
    render(
      <AuthLayout>
        <div>Auth content</div>
      </AuthLayout>,
    );

    expect(screen.getByText('Auth content')).toBeDefined();
  });
});
