import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuantitySelector } from '@/src/components';

describe('QuantitySelector', () => {
  it('renders the initial quantity', () => {
    render(<QuantitySelector quantity={2} onQuantityChanged={vi.fn()} />);

    expect(screen.getByText('2')).toBeDefined();
  });

  it('calls onQuantityChanged with incremented and decremented values', () => {
    const onChange = vi.fn();
    const { container } = render(<QuantitySelector quantity={2} onQuantityChanged={onChange} />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[1]);
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.click(buttons[0]);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('does not call onQuantityChanged below one', () => {
    const onChange = vi.fn();
    const { container } = render(<QuantitySelector quantity={1} onQuantityChanged={onChange} />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[0]);

    expect(onChange).not.toHaveBeenCalled();
  });
});
