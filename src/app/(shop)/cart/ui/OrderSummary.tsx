'use client';

import { useCartStore } from '@/src/store';
import { currencyFormatted } from '@/src/utils';
import { useEffect, useState } from 'react';

export const OrderSummary = () => {
  const totalItems = useCartStore((state) => state.totalItems);
  const subTotal = useCartStore((state) =>
    state.cart.reduce(
      (subTotal, product) => subTotal + product.price * product.quantity,
      0,
    ),
  );
  const taxes = subTotal * 0.15;
  const total = subTotal + taxes;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-2">
      <span>Total items:</span>
      <span>{totalItems} items</span>
      <span>Subtotal:</span>
      <span>{currencyFormatted(subTotal)}</span>
      <span>Taxes:</span>
      <span>{currencyFormatted(taxes)}</span>
      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl">{currencyFormatted(total)}</span>
    </div>
  );
};
