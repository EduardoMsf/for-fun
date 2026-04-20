'use server';

import { prisma } from '@/src/lib/prisma';

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({});

    return categories;
  } catch (error) {
    console.log(error);
    return [];
  }
};
