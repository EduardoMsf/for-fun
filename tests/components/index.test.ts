import { describe, expect, it } from 'vitest';

import * as components from '@/src/components';

describe('components barrel', () => {
  it('exports the public components', () => {
    expect(components.Footer).toBeDefined();
    expect(components.NotFound).toBeDefined();
    expect(components.ProductGrid).toBeDefined();
    expect(components.ProductGridItem).toBeDefined();
    expect(components.ProductMobileSlideshow).toBeDefined();
    expect(components.ProductSlideshow).toBeDefined();
    expect(components.QuantitySelector).toBeDefined();
    expect(components.Sidebar).toBeDefined();
    expect(components.SizeSelector).toBeDefined();
    expect(components.Title).toBeDefined();
    expect(components.TopMenu).toBeDefined();
  });
});
