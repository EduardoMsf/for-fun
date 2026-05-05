'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { apiFetch } from '@/src/lib/api';

export const getStockBySlug = async (slug: string): Promise<number> => {
  noStore();
  try {
    const { inStock } = await apiFetch<{ inStock: number }>(`/products/slug/${slug}/stock`);
    return inStock;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
