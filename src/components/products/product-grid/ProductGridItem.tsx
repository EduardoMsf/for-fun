'use client';
import { Product } from '@/src/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  const handleImageChange = (showSecondaryImage: boolean) => {
    setDisplayImage(
      showSecondaryImage
        ? product.images[1] || product.images[0]
        : product.images[0],
    );
  };

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`}>
        <Image
          className="w-full object-cover rounded"
          src={`/products/${displayImage}`}
          alt={product.title}
          width={500}
          height={500}
          onMouseEnter={() => handleImageChange(true)}
          onMouseLeave={() => handleImageChange(false)}
        />
      </Link>
      <div className="p-4 flex flex-col">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm text-gray-600 mb-2 hover:text-blue-700 transition-colors"
        >
          {product.title}
        </Link>
        <span className="font-bold">${product.price.toFixed(2)}</span>
      </div>
    </div>
  );
};
