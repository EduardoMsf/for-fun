'use client';
import { Product } from '@/src/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  product: Product;
  priority?: boolean;
}

export const ProductGridItem = ({ product, priority = false }: Props) => {
  // const [displayImage, setDisplayImage] = useState(product.images[0]);

  // const handleImageChange = (showSecondaryImage: boolean) => {
  //   setDisplayImage(
  //     showSecondaryImage
  //       ? product.images[1] || product.images[0]
  //       : product.images[0],
  //   );
  // };

  // 1. Mantenemos el estado para el hover, pero NO lo usamos para el src inicial del render
  const [hoverImage, setHoverImage] = useState<string | null>(null);

  // 2. Determinamos la imagen a mostrar basándonos en si hay hover o no
  // Si no hay hover, usamos directamente la primera imagen del array (evita delay de hidratación)
  const currentImage = hoverImage || product.images[0]?.url;

  const getImageUrl = (image: string) => {
    // Si la imagen ya es una URL completa (Cloudinary), la devolvemos tal cual
    if (image.startsWith('http')) {
      return image;
    }
    // Si no, asumimos que es una imagen local en la carpeta /products/
    return `/products/${image}`;
  };

  return (
    <div className={`rounded-md overflow-hidden ${priority ? '' : 'fade-in'}`}>
      <Link href={`/product/${product.slug}`}>
        <Image
          priority={priority}
          fetchPriority={priority ? 'high' : 'auto'}
          className="w-full object-cover rounded"
          src={
            currentImage ? getImageUrl(currentImage) : '/imgs/placeholder.jpg'
          }
          alt={product.title}
          width={500}
          height={500}
          onMouseEnter={() =>
            setHoverImage(product.images[1]?.url || product.images[0]?.url)
          }
          onMouseLeave={() => setHoverImage(null)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
