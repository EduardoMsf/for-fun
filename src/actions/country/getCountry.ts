'use server';

import { apiFetch } from '@/src/lib/api';

export const getCountries = async () => {
  try {
    const countries = await apiFetch<{ id: string; name: string }[]>('/countries?orderBy=name');
    return countries;
  } catch (error) {
    console.log(error);
    return [];
  }
};
