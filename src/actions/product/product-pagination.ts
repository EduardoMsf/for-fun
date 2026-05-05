'use server';

import type { Product } from '@/src/interfaces';
import { apiFetch } from '@/src/lib/api';

type Gender = 'men' | 'women' | 'kid' | 'unisex';

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

  const params = new URLSearchParams({ page: String(page), take: String(take) });
  if (gender) params.set('gender', gender);

  try {
    return await apiFetch<{ currentPage: number; totalPages: number; products: Product[] }>(
      `/products?${params}`,
    );
  } catch {
    throw new Error('Products are not available');
  }
};
