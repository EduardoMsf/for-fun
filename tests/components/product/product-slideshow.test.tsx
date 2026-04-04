import '@/src/components/product/slideshow/slideshow.css';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProductSlideshow } from '@/src/components';

describe('ProductSlideshow', () => {
  it('renders the main and thumbnail swiper instances', () => {
    render(
      <ProductSlideshow
        images={['one.jpg', 'two.jpg']}
        title="Winter Jacket"
        className="slideshow-wrapper"
      />,
    );

    expect(screen.getByTestId('mySwiper2')).toBeDefined();
    expect(screen.getByTestId('mySwiper')).toBeDefined();
    expect(screen.getAllByAltText('Winter Jacket')).toHaveLength(4);
    expect(screen.getAllByTestId('swiper-slide')).toHaveLength(4);
  });

  it('applies the optional wrapper className', () => {
    const { container } = render(
      <ProductSlideshow
        images={['one.jpg']}
        title="Winter Jacket"
        className="slideshow-wrapper"
      />,
    );

    expect(container.firstChild).not.toBeNull();
    expect((container.firstChild as HTMLElement).className).toContain(
      'slideshow-wrapper',
    );
  });
});
