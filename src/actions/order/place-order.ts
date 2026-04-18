'use server';

import { auth } from '@/src/auth.config';
import { Address, Size } from '@/src/interfaces';
import { prisma } from '@/src/lib/prisma';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

const prismaSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

type PrismaSize = (typeof prismaSizes)[number];

const isPrismaSize = (size: Size): size is PrismaSize =>
  prismaSizes.includes(size as PrismaSize);

export const placeORder = async (
  productIds: ProductToOrder[],
  address: Address,
) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: 'User not authenticated',
    };
  }
  console.log('Product IDs:', productIds);
  console.log('Address:', address);
  console.log('User ID:', userId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds.map((p) => p.productId) },
    },
  });
  console.log('products', products);

  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);
  console.log('items', itemsInOrder);

  const { subtotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      const subTotal = product.price * productQuantity;
      totals.subtotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;
      return totals;
    },
    { subtotal: 0, tax: 0, total: 0 },
  );

  console.log('subtotal', subtotal);
  console.log('tax', tax);
  console.log('total', total);

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Actualizar stock de productos
      const updatedProdutsPromises = products.map((product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((count, p) => count + p.quantity, 0);
        if (productQuantity === 0) {
          throw new Error(`Product with ID ${product.id} not found in order`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProdutsPromises);

      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`Product ${product.title} is out of stock`);
        }
      });

      //Crear la orden
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subtotal,
          tax: tax,
          total: total,
          isPaid: false,

          OrderItem: {
            createMany: {
              data: productIds.map((product) => {
                if (!isPrismaSize(product.size)) {
                  throw new Error(
                    `Size ${product.size} is not supported by Prisma`,
                  );
                }

                return {
                  quantity: product.quantity,
                  size: product.size,
                  productId: product.productId,
                  price:
                    products.find((p) => p.id === product.productId)?.price ??
                    0,
                };
              }),
            },
          },
        },
      });

      // crear la direccion de la orden

      const {
        id: _id,
        country,
        userId: _userId,
        ...rest
      } = address as Address & {
        id?: string;
        userId?: string;
      };
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...rest,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        order: order,
        orderAddress: orderAddress,
        updatedProducts: updatedProducts,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error) {
    return {
      ok: false,
      message: (error as Error).message,
    };
  }
};
