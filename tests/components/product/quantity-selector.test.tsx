import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { QuantitySelector } from '@/src/components';

describe('QuantitySelector', () => {
  it('renders the initial quantity', () => {
    render(<QuantitySelector quantity={2} />);

    expect(screen.getByText('2')).toBeDefined();
  });

  it('increments and decrements the quantity', () => {
    const { container } = render(<QuantitySelector quantity={2} />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[1]);
    expect(screen.getByText('3')).toBeDefined();

    fireEvent.click(buttons[0]);
    expect(screen.getByText('2')).toBeDefined();
  });

  it('does not go below one', () => {
    const { container } = render(<QuantitySelector quantity={1} />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[0]);

    expect(screen.getByText('1')).toBeDefined();
  });
});
