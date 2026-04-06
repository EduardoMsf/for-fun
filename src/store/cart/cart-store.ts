import { CartProduct } from '@/src/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  cart: CartProduct[];

  addProductCart: (product: CartProduct) => void;
  //   updateProductQuantity
  //   removeProduct
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: [],
  addProductCart: (product: CartProduct) => {
    const { cart } = get();
    const productInCart = cart.some(
      (item) => item.id === product.id && item.size === product.size,
    );

    if (!productInCart) {
      set({
        cart: [...cart, product],
      });
    }
    const updatedCartProducts = cart.map((item) => {
      if (item.id === product.id && item.size === product.size) {
        return {
          ...item,
          quantity: item.quantity + product.quantity,
        };
      }

      return item;
    });

    set({
      cart: updatedCartProducts,
    });
  },
}));
