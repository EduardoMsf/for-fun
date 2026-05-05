'use server';

import { auth } from '@/src/auth.config';
import { apiFetch } from '@/src/lib/api';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const session = await auth();

  try {
    await apiFetch(
      '/payments/paypal/verify',
      { method: 'POST', body: JSON.stringify({ transactionId: paypalTransactionId }) },
      session?.accessToken,
    );

    revalidatePath('/orders');
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: (error as Error).message };
  }
};
