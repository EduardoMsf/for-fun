import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: vi.fn(() => ({ data: null })),
}));

vi.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  usePayPalScriptReducer: () => [{ isPending: false }],
  PayPalButtons: () => null,
}));

import { Provider } from '@/src/components/provider/Provider';

describe('Provider', () => {
  it('renders its children', () => {
    render(
      <Provider>
        <span>child content</span>
      </Provider>,
    );

    expect(screen.getByText('child content')).toBeDefined();
  });
});
