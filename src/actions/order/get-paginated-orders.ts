'use server';

import { auth } from '@/src/auth.config';
import { apiFetch } from '@/src/lib/api';

interface OrderSummary {
  id: string;
  isPaid: boolean;
  OrderAddress: { firstName: string; lastName: string } | null;
}

export const getPaginatedOrders = async () => {
  const session = await auth();
  if (session?.user.role !== 'admin') return { ok: false, message: 'Unauthorized' };

  try {
    const orders = await apiFetch<OrderSummary[]>('/orders', {}, session.accessToken);
    return { ok: true, orders };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Error fetching orders' };
  }
};
