import 'dotenv/config';

import { prisma } from '../lib/prisma.js';
import { initialData } from './seed.js';
import { countries } from './seed-countries.js';

type SeedableSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

const validSizes = new Set<SeedableSize>(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']);

async function main() {
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.country.deleteMany();

  const { categories, products, users } = initialData;

  await prisma.user.createMany({
    data: users,
  });
  const uniqueCategories = categories.map((name) => ({ name }));

  await prisma.category.createMany({
    data: uniqueCategories,
  });
  await prisma.country.createMany({
    data: countries,
  });

  const categoriesDB = await prisma.category.findMany();
  const categoriesMap = categoriesDB.reduce(
    (map: Record<string, string>, category: { id: string; name: string }) => {
      map[category.name] = category.id;
      return map;
    },
    {} as Record<string, string>,
  );

  for (const product of products) {
    const { type, images, sizes, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        size: sizes.filter((size): size is SeedableSize =>
          validSizes.has(size as SeedableSize),
        ),
        categoryId: categoriesMap[product.type],
      },
    });

    const imageData = images.map((url) => ({
      url,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imageData,
    });
  }

  console.log(`Seed executed successfully`);
}
(() => {
  main();
})();
