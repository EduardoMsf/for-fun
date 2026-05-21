'use server';

import { Address } from '@/src/interfaces';
import { apiFetch } from '@/src/lib/api';
import { auth } from '@/src/auth.config';

export const setUserAddres = async (address: Address, userId: string) => {
  const session = await auth();
  try {
    const newAddress = await apiFetch(
      `/user-addresses/user/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          address2: address.address2,
          postalCode: address.postalCode,
          phone: address.phone,
          city: address.city,
          countryId: address.country,
        }),
      },
      session?.accessToken,
    );
    return { ok: true, address: newAddress };
  } catch (error) {
    console.log(error);
    return { ok: false, messsage: 'Something went wrong' };
  }
};
