export const revalidate = 60;
import type { Metadata } from 'next';
import { Pagination, ProductGrid, Title } from '@/src/components';
import type { Category, Product } from '@/src/interfaces';
import { initialData } from '@/src/seed/seed';
import { getPaginatedProductsWithImages } from '@/src/actions';
import { redirect } from 'next/navigation';

const categoryLabels = {
  men: 'Hombres',
  women: 'Mujeres',
  kid: 'Niños',
  unisex: 'Unisex',
} as const;

interface Props {
  params: Promise<{
    gender: Category;
  }>;
  searchParams: Promise<{
    page?: string;
    take?: string;
  }>;
}

function getCategoryLabel(gender: string) {
  return categoryLabels[gender as keyof typeof categoryLabels] ?? gender;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender } = await params;
  const categoryLabel = getCategoryLabel(gender);

  return {
    title: `${categoryLabel} | Tienda`,
    description: `Explora productos de la categoría ${categoryLabel.toLowerCase()}.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: Readonly<Props>) {
  const { gender } = await params;
  const categoryLabel = getCategoryLabel(gender);

  const { page: pageParam, take: takeParam } = await searchParams;
  const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const take = takeParam ? Number.parseInt(takeParam, 10) : 12;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page, take, gender });

  const productByCategory = products.filter(
    (product) => product.gender === gender,
  );

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  return (
    <div className="flex flex-col flex-1 justify-center font-sans ">
      <Title
        title="Tienda"
        subtitle={`Todos los productos de ${categoryLabel}`}
        className="mt-2"
      />
      <ProductGrid products={productByCategory} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
