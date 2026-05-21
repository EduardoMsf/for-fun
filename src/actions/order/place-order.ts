'use server';

import { auth } from '@/src/auth.config';
import { Address, Size } from '@/src/interfaces';
import { apiFetch } from '@/src/lib/api';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeORder = async (
  productIds: ProductToOrder[],
  address: Address,
) => {
  const session = await auth();
  if (!session?.user.id) return { ok: false, message: 'User not authenticated' };

  try {
    const { order } = await apiFetch<{ order: { id: string } }>(
      '/orders/place',
      {
        method: 'POST',
        body: JSON.stringify({
          items: productIds,
          address: {
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            address2: address.address2,
            postalCode: address.postalCode,
            city: address.city,
            phone: address.phone,
            countryId: address.country,
          },
        }),
      },
      session.accessToken,
    );
    return { ok: true, order };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
};
