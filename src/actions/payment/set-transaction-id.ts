'use server';

import { auth } from '@/src/auth.config';
import { apiFetch } from '@/src/lib/api';

export const setTransactionId = async (orderId: string, transactionId: string) => {
  const session = await auth();
  try {
    await apiFetch(
      `/orders/${orderId}/transaction`,
      { method: 'PATCH', body: JSON.stringify({ transactionId }) },
      session?.accessToken,
    );
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo actualizar el id de la transacción' };
  }
};
