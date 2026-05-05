'use server';

import { apiFetch } from '@/src/lib/api';

export const getCategories = async () => {
  try {
    return await apiFetch<{ id: string; name: string }[]>('/categories');
  } catch (error) {
    console.log(error);
    return [];
  }
};
