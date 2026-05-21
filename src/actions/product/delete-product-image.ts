'use server';

import { auth } from '@/src/auth.config';
import { apiFetch } from '@/src/lib/api';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return { ok: false, message: 'Cannot delete image from file system' };
  }

  const session = await auth();
  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

  try {
    await cloudinary.uploader.destroy(imageName);

    const deleted = await apiFetch<{ product?: { slug: string } }>(
      `/product-images/${imageId}`,
      { method: 'DELETE' },
      session?.accessToken,
    );

    revalidatePath('/admin/products');
    if (deleted?.product?.slug) {
      revalidatePath(`/admin/product/${deleted.product.slug}`);
      revalidatePath(`/product/${deleted.product.slug}`);
    }
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Failed to delete product image' };
  }
};
