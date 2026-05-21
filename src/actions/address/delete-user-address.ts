'use server';

import { apiFetch } from '@/src/lib/api';
import { auth } from '@/src/auth.config';

export const deleteUserAddress = async (userId: string) => {
  const session = await auth();
  try {
    await apiFetch(`/user-addresses/user/${userId}`, { method: 'DELETE' }, session?.accessToken);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Something went wrong' };
  }
};
