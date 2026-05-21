'use server';

import { apiFetch } from '@/src/lib/api';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const { user } = await apiFetch<{ user: { id: string; name: string; email: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ name, email, password }) },
    );
    return { ok: true, user };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo crear el usuario' };
  }
};
