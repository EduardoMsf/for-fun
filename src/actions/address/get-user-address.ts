'use server';

import { apiFetch } from '@/src/lib/api';
import { auth } from '@/src/auth.config';

export const getUserAddress = async (userId: string) => {
  const session = await auth();
  try {
    const address = await apiFetch<Record<string, unknown> | null>(
      `/user-addresses/user/${userId}`,
      {},
      session?.accessToken,
    );
    if (!address) return null;
    const { countryId, address2, ...rest } = address as {
      countryId: string;
      address2?: string;
      [key: string]: unknown;
    };
    return { ...rest, country: countryId, address2: address2 ?? undefined };
  } catch (error) {
    console.log(error);
    return null;
  }
};
