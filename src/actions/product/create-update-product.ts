'use server';

import { Gender } from '@/src/generated/prisma/enums';
import { prisma } from '@/src/lib/prisma';
import { Product, Size } from '@prisma/client';
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
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);
  if (!productParsed.success) {
    console.log(productParsed.error);
    return {
      ok: false,
    };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replaceAll(' ', '-').trim();

  const { id, sizes, categoryId, ...productData } = product;
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      const tagsArray = productData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase());
      if (id) {
        product = await tx.product.update({
          where: { id: id },
          data: {
            ...productData,
            category: {
              connect: { id: categoryId },
            },
            size: {
              set: sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
        console.log(product);
      } else {
        product = await tx.product.create({
          data: {
            ...productData,
            tags: productData.tags.split(',').map((tag) => tag.trim()),

            category: {
              connect: { id: categoryId },
            },
            size: {
              set: sizes as Size[],
            },
          },
        });
      }

      if (formData.getAll('images')) {
        console.log(formData.getAll('images'));
        const images = await uploadImages(formData.getAll('images') as File[]);
        if (!images) {
          throw new Error('Error uploading images');
        }
        await tx.productImage.createMany({
          data: images.map((image) => ({
            url: image!,
            productId: product.id,
          })),
        });
      }

      return { product };
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);
    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (error) {
    console.error('Error creating/updating product:', error);
    return {
      ok: false,
      message: 'Check the server logs for more details',
    };
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
