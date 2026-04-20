'use client';
import { useCartStore } from '@/src/store';
import { currencyFormatted } from '@/src/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {productsInCart.map((product, index) => (
        <div key={product.slug + index} className="flex mb-5">
          <Image
            src={`/products/${product.image.url}`}
            alt={product.title}
            width={100}
            height={100}
            className="mr-5 rounded"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
            }}
          />
          <div>
            <span>
              <p>
                {product.title} - {product.size} ({product.quantity})
              </p>
            </span>
            <p className="font-bold">
              {currencyFormatted(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
