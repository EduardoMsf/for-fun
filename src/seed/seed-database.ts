import 'dotenv/config';

import { prisma } from '../lib/prisma';
import { initialData } from './seed';

type SeedableSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

const validSizes = new Set<SeedableSize>(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']);

async function main() {
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const { categories, products } = initialData;
  const uniqueCategories = categories.map((name) => ({ name }));

  await prisma.category.createMany({
    data: uniqueCategories,
  });

  const categoriesDB = await prisma.category.findMany();
  const categoriesMap = categoriesDB.reduce(
    (map, category) => {
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
