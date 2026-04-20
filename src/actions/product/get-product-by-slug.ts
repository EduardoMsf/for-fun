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
            id: true,
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
      images: productImages.map(({ url, id }) => ({ url, id })),
      sizes: size,
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Error al obtener producto por slug`);
  }
};
