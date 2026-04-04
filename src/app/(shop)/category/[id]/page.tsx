import type { Metadata } from 'next';
import { ProductGrid, Title } from '@/src/components';
import { initialData } from '@/src/seed/seed';
import { Category } from '@/src/interfaces';

const products = initialData.products;

const categoryLabels = {
  men: 'Hombres',
  women: 'Mujeres',
  kid: 'Niños',
  unisex: 'Unisex',
} as const;

interface Props {
  params: Promise<{
    id: Category;
  }>;
}

function getCategoryLabel(id: string) {
  return categoryLabels[id as keyof typeof categoryLabels] ?? id;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const categoryLabel = getCategoryLabel(id);
  const totalProducts = products.filter(
    (product) => product.gender === id,
  ).length;

  return {
    title: `${categoryLabel} | Tienda`,
    description: `Explora ${totalProducts} productos de la categoria ${categoryLabel.toLowerCase()} disponibles en la tienda.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const categoryLabel = getCategoryLabel(id);

  const productByCategory = products.filter((product) => product.gender === id);

  return (
    <div className="flex flex-col flex-1 justify-center font-sans ">
      <Title
        title="Tienda"
        subtitle={`Todos los productos de ${categoryLabel}`}
        className="mt-2"
      />
      <ProductGrid products={productByCategory} />
    </div>
  );
}
