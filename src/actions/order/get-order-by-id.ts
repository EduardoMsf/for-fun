'use server';

import { auth } from '@/src/auth.config';
import { apiFetch } from '@/src/lib/api';

interface OrderDetail {
  id: string;
  isPaid: boolean;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  userId: string;
  transactionId?: string | null;
  OrderAddress: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string | null;
    city: string;
    countryId: string;
    postalCode: string;
    phone: string;
  } | null;
  OrderItem: Array<{
    price: number;
    quantity: number;
    size: string;
    product: {
      title: string;
      slug: string;
      productImages: Array<{ url: string }>;
    };
  }>;
}

export const getOrderById = async (orderId: string) => {
  const session = await auth();
  if (!session) return { ok: false, message: 'Unauthorized' };

  try {
    const order = await apiFetch<OrderDetail>(
      `/orders/${orderId}`,
      {},
      session.accessToken,
    );

    if (session.user.role === 'user' && order.userId !== session.user.id) {
      return { ok: false, message: `${orderId} not found for this user` };
    }

    return { ok: true, order };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Error fetching order details' };
  }
};
