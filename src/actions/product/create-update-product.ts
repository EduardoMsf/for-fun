'use server';

import { auth } from '@/src/auth.config';
import { apiFetch } from '@/src/lib/api';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(',')),
  tags: z.string(),
  gender: z.enum(['men', 'women', 'kid', 'unisex']),
});

export const createUpdateProduct = async (formData: FormData) => {
  const session = await auth();
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    console.log(productParsed.error);
    return { ok: false };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replaceAll(' ', '-').trim();

  const { id, sizes, categoryId, ...productData } = product;
  const tagsArray = productData.tags.split(',').map((tag) => tag.trim().toLowerCase());

  try {
    const payload = {
      ...productData,
      tags: tagsArray,
      size: sizes,
      categoryId,
    };

    let savedProduct: { id: string; slug: string };

    if (id) {
      savedProduct = await apiFetch<{ id: string; slug: string }>(
        `/products/${id}`,
        { method: 'PATCH', body: JSON.stringify(payload) },
        session?.accessToken,
      );
    } else {
      savedProduct = await apiFetch<{ id: string; slug: string }>(
        '/products',
        { method: 'POST', body: JSON.stringify(payload) },
        session?.accessToken,
      );
    }

    // Upload images to Cloudinary then register in API
    const imageFiles = formData.getAll('images') as File[];
    if (imageFiles.length > 0) {
      const urls = await uploadImages(imageFiles);
      if (!urls) throw new Error('Error uploading images');

      await Promise.all(
        urls.filter(Boolean).map((url) =>
          apiFetch(
            '/product-images',
            { method: 'POST', body: JSON.stringify({ url, productId: savedProduct.id }) },
            session?.accessToken,
          ),
        ),
      );
    }

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${savedProduct.slug}`);
    revalidatePath(`/products/${savedProduct.slug}`);

    return { ok: true, product: savedProduct };
  } catch (error) {
    console.error('Error creating/updating product:', error);
    return { ok: false, message: 'Check the server logs for more details' };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((r) => r.secure_url);
      } catch (error) {
        console.log(error);
        return null;
      }
    });
    return Promise.all(uploadPromises);
  } catch (error) {
    console.log(error);
    return null;
  }
};
