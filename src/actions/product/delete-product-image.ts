'use server';

import { prisma } from '@/src/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      message: 'Cannot delete image from file system',
    };
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';
  console.log(imageName);
  try {
    await cloudinary.uploader.destroy(imageName);
    const deleteResult = await prisma.productImage.delete({
      where: { id: imageId },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${deleteResult.product.slug}`);
    revalidatePath(`/product/${deleteResult.product.slug}`);
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Failed to delete product image',
    };
  }
};
