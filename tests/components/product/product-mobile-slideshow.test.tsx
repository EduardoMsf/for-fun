import '@/src/components/product/slideshow/mobileslideshow.css';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProductMobileSlideshow } from '@/src/components';

describe('ProductMobileSlideshow', () => {
  it('renders one mobile slide per image', () => {
    render(
      <ProductMobileSlideshow
        images={['one.jpg', 'two.jpg', 'three.jpg']}
        title="Sneakers"
      />,
    );

    expect(screen.getByTestId('mySwiper2')).toBeDefined();
    expect(screen.getAllByAltText('Sneakers')).toHaveLength(3);
    expect(screen.getAllByTestId('swiper-slide')).toHaveLength(3);
  });

  it('applies the optional wrapper className', () => {
    const { container } = render(
      <ProductMobileSlideshow
        images={['one.jpg']}
        title="Sneakers"
        className="mobile-wrapper"
      />,
    );

    expect(container.firstChild).not.toBeNull();
    expect((container.firstChild as HTMLElement).className).toContain(
      'mobile-wrapper',
    );
  });
});
