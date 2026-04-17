'use server';

import { prisma } from '@/src/lib/prisma';

export const getCountries = async () => {
  try {
    const countriesDB = await prisma.country.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return countriesDB;
  } catch (error) {
    console.log(error);
    return [];
  }
};
