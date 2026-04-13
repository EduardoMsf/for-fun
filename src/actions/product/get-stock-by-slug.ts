'use server';
import { prisma } from '@/src/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

export const getStockBySlug = async (slug: string): Promise<number> => {
  noStore();
  try {
    const stock = await prisma.product.findFirst({
      select: {
        inStock: true,
      },
      where: {
        slug,
      },
    });

    return stock?.inStock ?? 0;
  } catch (error) {
    console.log(error);
    throw new Error(`Error al obtener stock por slug`);
  }
};
