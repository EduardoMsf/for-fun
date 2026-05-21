import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from '@/src/store/cart/cart-store';
import type { CartProduct } from '@/src/interfaces';

const makeProduct = (overrides: Partial<CartProduct> = {}): CartProduct => ({
  id: 'p1',
  slug: 'shirt',
  title: 'Test Shirt',
  price: 100,
  quantity: 1,
  size: 'M',
  image: { url: 'img.jpg', id: 1 },
  ...overrides,
});

beforeEach(() => {
  useCartStore.setState({ cart: [], totalItems: 0 });
});

describe('initial state', () => {
  it('starts with an empty cart and 0 total items', () => {
    const { cart, totalItems } = useCartStore.getState();
    expect(cart).toEqual([]);
    expect(totalItems).toBe(0);
  });
});

describe('addProductCart', () => {
  it('adds a new product to the cart', () => {
    const product = makeProduct();
    useCartStore.getState().addProductCart(product);

    const { cart, totalItems } = useCartStore.getState();
    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual(product);
    expect(totalItems).toBe(1);
  });

  it('accumulates quantity when same id+size is added again', () => {
    useCartStore.getState().addProductCart(makeProduct({ quantity: 2 }));
    useCartStore.getState().addProductCart(makeProduct({ quantity: 3 }));

    const { cart, totalItems } = useCartStore.getState();
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(5);
    expect(totalItems).toBe(5);
  });

  it('treats same product with different size as a separate item', () => {
    useCartStore.getState().addProductCart(makeProduct({ size: 'S' }));
    useCartStore.getState().addProductCart(makeProduct({ size: 'L' }));

    expect(useCartStore.getState().cart).toHaveLength(2);
  });

  it('treats products with same size but different id as separate items', () => {
    useCartStore.getState().addProductCart(makeProduct({ id: 'p1' }));
    useCartStore.getState().addProductCart(makeProduct({ id: 'p2' }));

    expect(useCartStore.getState().cart).toHaveLength(2);
  });
});

describe('updateProductQuantity', () => {
  it('updates quantity for matching id+size', () => {
    const product = makeProduct({ quantity: 2 });
    useCartStore.getState().addProductCart(product);
    useCartStore.getState().updateProductQuantity(product, 10);

    const { cart, totalItems } = useCartStore.getState();
    expect(cart[0].quantity).toBe(10);
    expect(totalItems).toBe(10);
  });

  it('does not affect other items', () => {
    useCartStore.getState().addProductCart(makeProduct({ id: 'p1', size: 'S', quantity: 1 }));
    useCartStore.getState().addProductCart(makeProduct({ id: 'p2', size: 'M', quantity: 3 }));

    useCartStore.getState().updateProductQuantity(makeProduct({ id: 'p1', size: 'S' }), 5);

    const { cart } = useCartStore.getState();
    expect(cart.find((i) => i.id === 'p2')!.quantity).toBe(3);
  });
});

describe('removeProduct', () => {
  it('removes the matching product by id+size', () => {
    const p1 = makeProduct({ id: 'p1', size: 'S' });
    const p2 = makeProduct({ id: 'p2', size: 'M' });
    useCartStore.getState().addProductCart(p1);
    useCartStore.getState().addProductCart(p2);

    useCartStore.getState().removeProduct(p1);

    const { cart, totalItems } = useCartStore.getState();
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe('p2');
    expect(totalItems).toBe(1);
  });

  it('does nothing when product not in cart', () => {
    useCartStore.getState().addProductCart(makeProduct({ id: 'p1' }));
    useCartStore.getState().removeProduct(makeProduct({ id: 'p99' }));

    expect(useCartStore.getState().cart).toHaveLength(1);
  });
});

describe('getSummaryInformation', () => {
  it('returns zeros for empty cart', () => {
    const summary = useCartStore.getState().getSummaryInformation();
    expect(summary).toEqual({ totalItems: 0, subTotal: 0, taxes: 0, total: 0 });
  });

  it('calculates subTotal, 15% taxes and total correctly', () => {
    useCartStore.getState().addProductCart(makeProduct({ price: 100, quantity: 2 }));
    useCartStore.getState().addProductCart(makeProduct({ id: 'p2', price: 50, quantity: 1 }));

    const { subTotal, taxes, total, totalItems } =
      useCartStore.getState().getSummaryInformation();

    expect(totalItems).toBe(3);
    expect(subTotal).toBe(250);
    expect(taxes).toBeCloseTo(37.5);
    expect(total).toBeCloseTo(287.5);
  });
});

describe('getTotalItems', () => {
  it('returns 0 for empty cart', () => {
    expect(useCartStore.getState().getTotalItems()).toBe(0);
  });

  it('returns sum of all quantities', () => {
    useCartStore.getState().addProductCart(makeProduct({ quantity: 3 }));
    useCartStore.getState().addProductCart(makeProduct({ id: 'p2', quantity: 2 }));

    expect(useCartStore.getState().getTotalItems()).toBe(5);
  });
});

describe('clearCart', () => {
  it('empties the cart and resets totalItems', () => {
    useCartStore.getState().addProductCart(makeProduct({ quantity: 5 }));
    useCartStore.getState().clearCart();

    const { cart, totalItems } = useCartStore.getState();
    expect(cart).toEqual([]);
    expect(totalItems).toBe(0);
  });
});
