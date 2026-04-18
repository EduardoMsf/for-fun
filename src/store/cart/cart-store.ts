import { CartProduct } from '@/src/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  cart: CartProduct[];
  totalItems: number;
  getTotalItems: () => number;

  addProductCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  getSummaryInformation: () => {
    totalItems: number;
    subTotal: number;
    taxes: number;
    total: number;
  };

  clearCart: () => void;
}

const getTotalItems = (cart: CartProduct[]) =>
  cart.reduce((total, item) => total + item.quantity, 0);
const TAX_RATE = 0.15;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      totalItems: 0,
      getTotalItems: () => {
        const { totalItems } = get();

        return totalItems;
      },
      getSummaryInformation: () => {
        const { cart, totalItems } = get();
        const subTotal = cart.reduce(
          (subTotal, product) => subTotal + product.price * product.quantity,
          0,
        );
        const taxes = subTotal * TAX_RATE;
        const total = subTotal + taxes;

        return {
          totalItems,
          subTotal,
          taxes,
          total,
        };
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        set((state) => {
          const updatedCart = state.cart.map((item) => {
            if (item.id === product.id && item.size === product.size) {
              return { ...item, quantity };
            }

            return item;
          });

          return {
            cart: updatedCart,
            totalItems: getTotalItems(updatedCart),
          };
        });
      },
      addProductCart: (product: CartProduct) => {
        set((state) => {
          const productInCart = state.cart.some(
            (item) => item.id === product.id && item.size === product.size,
          );

          const updatedCart = !productInCart
            ? [...state.cart, product]
            : state.cart.map((item) => {
                if (item.id === product.id && item.size === product.size) {
                  return {
                    ...item,
                    quantity: item.quantity + product.quantity,
                  };
                }

                return item;
              });

          return {
            cart: updatedCart,
            totalItems: getTotalItems(updatedCart),
          };
        });
      },
      removeProduct: (product: CartProduct) => {
        set((state) => {
          const updatedCart = state.cart.filter(
            (item) => !(item.id === product.id && item.size === product.size),
          );

          return {
            cart: updatedCart,
            totalItems: getTotalItems(updatedCart),
          };
        });
      },
      clearCart: () => {
        set(() => ({
          cart: [],
          totalItems: 0,
        }));
      },
    }),
    {
      name: 'shopping-cart',
      partialize: (state) => ({
        cart: state.cart,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.totalItems = getTotalItems(state.cart);
      },
    },
  ),
);
