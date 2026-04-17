'use client';

import { useAddressStore, useCartStore } from '@/src/store';
import { currencyFormatted } from '@/src/utils';
import { useEffect, useState } from 'react';

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);

  const address = useAddressStore((state) => state.address);
  const totalItems = useCartStore((state) => state.totalItems);
  const subTotal = useCartStore((state) =>
    state.cart.reduce(
      (subTotal, product) => subTotal + product.price * product.quantity,
      0,
    ),
  );
  const taxes = subTotal * 0.15;
  const total = subTotal + taxes;
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2 font-bold">Address shipping</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address?.firstName} {address?.lastName}
        </p>
        <p>{address?.address}</p>
        <p>{address?.address2}</p>
        <p>
          {address?.city}, {address?.country} {address?.postalCode}
        </p>
        <p>{address?.phone}</p>
      </div>
      <div className="w-full h-px bg-gray-200 mb-10" />
      <h2 className="text-2xl mb-2">Order Summary</h2>
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
      <div className=" mt-5 mb-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            By placing your order, you agree to the Terms of Service and Privacy
            Policy.
          </span>
        </p>
        <button
          // href="/orders/abc"
          className="flex btn-primary justify-center"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};
