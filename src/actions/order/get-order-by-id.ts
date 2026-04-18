'use server';

import { auth } from '@/src/auth.config';
import { prisma } from '@/src/lib/prisma';

export const getOrderById = async (orderId: string) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: 'Unauthorized',
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,
                productImages: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error(`${orderId} not found`);

    if (session.user.role === 'user') {
      if (order.userId !== session.user.id) {
        throw new Error(`${orderId} not found for this user`);
      }
    }

    return { order, ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error fetching order details',
    };
  }
};
