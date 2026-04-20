'use server';

import { Gender } from '@/src/generated/prisma/enums';
import { prisma } from '@/src/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions = {}) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  try {
    const where = {
      gender,
    };

    const products = await prisma.product.findMany({
      take,
      skip: (page - 1) * take,
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
            id: true,
          },
        },
      },
      where,
    });

    const totalCount = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalCount / take);
    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => {
        const { productImages, size, ...rest } = product;

        return {
          ...rest,
          images: productImages.map((image) => ({
            url: image.url,
            id: image.id,
          })),
          sizes: size,
        };
      }),
    };
  } catch (error) {
    throw new Error('Products are not available');
  }
};
