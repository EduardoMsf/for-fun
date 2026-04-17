'use client';

import { Product } from '@/src/interfaces/product.interfaces';
import Image from 'next/image';

interface Props {
  product: Readonly<Product>;
  quantity: number;
}

export const OrderItemCard = ({ product, quantity }: Readonly<Props>) => {
  const subtotal = (product.price * quantity).toFixed(2);

  return (
    <div className="flex mb-5">
      <Image
        src={`/products/${product.images[0]}`}
        alt={product.title}
        width={100}
        height={100}
        className="mr-5 rounded object-cover"
        style={{ width: '100px', height: '100px' }}
      />

      <div>
        <p className="text-sm md:text-base">{product.title}</p>
        <p className="text-gray-600">
          ${product.price.toFixed(2)} x {quantity}
        </p>
        <p className="font-bold">${subtotal}</p>

        {/* <button className="underline mt-1 text-sm cursor-pointer hover:text-blue-600 transition-colors">
          Remove
        </button> */}
      </div>
    </div>
  );
};
