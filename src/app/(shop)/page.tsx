export const revalidate = 60;

import { getPaginatedProductsWithImages } from '@/src/actions';
import { Title, ProductGrid, Pagination } from '@/src/components';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    page?: string;
    take?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const { page: pageParam, take: takeParam } = await searchParams;
  const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const take = takeParam ? Number.parseInt(takeParam, 10) : 12;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page, take });

  if (products.length === 0) {
    redirect('/');
  }

  return (
    <div className="flex flex-col flex-1 justify-center font-sans ">
      <Title title="Tienda" subtitle="Todos los productos" className="mt-2" />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </div>
  );
}
