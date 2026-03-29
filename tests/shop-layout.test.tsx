import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ShopLayout from '@/src/app/(shop)/layout';

describe('Shop layout', () => {
  it('renders its children', () => {
    render(
      <ShopLayout>
        <div>Shop content</div>
      </ShopLayout>,
    );

    expect(screen.getByText('Shop content')).toBeDefined();
  });
});
