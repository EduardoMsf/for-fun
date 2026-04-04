import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProductGridItem } from '@/src/components';
import type { Product } from '@/src/interfaces';

const baseProduct: Product = {
  description: 'Warm hoodie',
  images: ['front.jpg', 'back.jpg'],
  inStock: 5,
  price: 49.99,
  sizes: ['S', 'M', 'L'],
  slug: 'warm-hoodie',
  tags: ['hoodie'],
  title: 'Warm Hoodie',
  type: 'hoodies',
  gender: 'unisex',
};

describe('ProductGridItem', () => {
  // it('renders the product details with the primary image', () => {
  //   render(<ProductGridItem product={baseProduct} />);

  //   expect(screen.getAllByRole('link', { name: /warm hoodie/i })).toHaveLength(2);
  //   expect(
  //     screen.getAllByRole('link', { name: /warm hoodie/i })[0].getAttribute('href'),
  //   ).toBe('/product/warm-hoodie');
  //   expect(
  //     screen.getAllByRole('link', { name: /warm hoodie/i })[1].getAttribute('href'),
  //   );
  //   ).toBe('/product/warm-hoodie');
  //   expect(screen.getByText('$49.99')).toBeDefined();
  //   expect(screen.getByAltText('Warm Hoodie').getAttribute('src')).toBe(
  //     '/products/front.jpg',
  //   );
  // });

  it('switches to the secondary image on hover and restores the primary image', () => {
    render(<ProductGridItem product={baseProduct} />);

    const image = screen.getByAltText('Warm Hoodie');

    fireEvent.mouseEnter(image);
    expect(image.getAttribute('src')).toBe('/products/back.jpg');

    fireEvent.mouseLeave(image);
    expect(image.getAttribute('src')).toBe('/products/front.jpg');
  });

  it('keeps the primary image when there is no secondary image', () => {
    render(
      <ProductGridItem product={{ ...baseProduct, images: ['front.jpg'] }} />,
    );

    const image = screen.getByAltText('Warm Hoodie');

    fireEvent.mouseEnter(image);

    expect(image.getAttribute('src')).toBe('/products/front.jpg');
  });
});
