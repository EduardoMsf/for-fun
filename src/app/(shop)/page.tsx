import { Title, ProductGrid } from '@/src/components';
import { initialData } from '@/src/seed/seed';

const products = initialData.products;

export default function Home() {
  return (
    <div className="flex flex-col flex-1 justify-center font-sans ">
      <Title title="Tienda" subtitle="Todos los productos" className="mt-2" />
      <ProductGrid products={products} />
    </div>
  );
}
