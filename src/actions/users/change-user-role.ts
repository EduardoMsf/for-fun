'use server';

import { auth } from '@/src/auth.config';
import { apiFetch } from '@/src/lib/api';
import { revalidatePath } from 'next/cache';

export const changeUserRole = async (userId: string, role: string) => {
  const session = await auth();
  if (session?.user.role !== 'admin') return { ok: false, message: 'Unauthorized' };

  try {
    const newRole = role === 'admin' ? 'admin' : 'user';
    await apiFetch(
      `/users/${userId}`,
      { method: 'PATCH', body: JSON.stringify({ role: newRole }) },
      session.accessToken,
    );
    revalidatePath('/admin/users');
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Cannot update the user role' };
  }
};
