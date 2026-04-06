'use server';

import type { Product } from '@/src/interfaces';
import { prisma } from '@/src/lib/prisma';

export const getProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        productImages: {
          select: {
            url: true,
          },
        },
      },
      where: {
        slug: slug,
      },
    });

    if (!product) {
      return null;
    }

    const { productImages, size, ...rest } = product;

    return {
      ...rest,
      images: productImages.map((image) => image.url),
      sizes: size,
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Error al obtener producto por slug`);
  }
};
