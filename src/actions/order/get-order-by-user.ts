'use server';

import { auth } from '@/src/auth.config';
import { prisma } from '@/src/lib/prisma';

export const getOrderByUser = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Unauthorized',
    };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      orders,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'Error fetching orders',
    };
  }
};
