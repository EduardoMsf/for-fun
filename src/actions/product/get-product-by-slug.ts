'use server';

import type { Product } from '@/src/interfaces';
import { apiFetch } from '@/src/lib/api';

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    return await apiFetch<Product>(`/products/slug/${slug}`);
  } catch (error) {
    console.log(error);
    return null;
  }
};
