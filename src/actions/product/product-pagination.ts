'use server';

import { prisma } from '@/src/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
}: PaginationOptions = {}) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  try {
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
    });

    const totalCount = await prisma.product.count({});
    const totalPages = Math.ceil(totalCount / 12);
    console.log('pages:', totalPages);
    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => {
        const { productImages, size, ...rest } = product;

        return {
          ...rest,
          images: productImages.map((image) => image.url),
          sizes: size,
        };
      }),
    };
  } catch (error) {
    throw new Error('Products are not available');
  }
};
