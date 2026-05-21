'use server';

import { auth } from '@/src/auth.config';
import { User } from '@/src/interfaces';
import { apiFetch } from '@/src/lib/api';

export const getPaginatedUsers = async () => {
  const session = await auth();
  if (session?.user.role !== 'admin') return { ok: false, message: 'Unauthorized' };

  try {
    const users = await apiFetch<User[]>('/users', {}, session.accessToken);
    return { ok: true, users };
  } catch (error) {
    console.log(error);
    return { ok: false, message: '' };
  }
};
