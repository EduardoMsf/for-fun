'use server';

import { Address } from '@/src/interfaces';
import { prisma } from '@/src/lib/prisma';

export const setUserAddres = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddres(address, userId);

    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      messsage: 'Something went wrong',
    };
  }
};

const createOrReplaceAddres = async (address: Address, userId: string) => {
  try {
    const storedAddres = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    const addressToSave = {
      address: address.address,
      address2: address.address2,
      userId: userId,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
      city: address.city,
    };

    if (!storedAddres) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        userId: userId,
      },
      data: addressToSave,
    });

    return updatedAddress;
  } catch (error) {
    console.log(error);
    throw new Error('Cannot set address');
  }
};
