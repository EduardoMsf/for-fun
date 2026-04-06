export const revalidate = 604800;
import { getProductBySlug } from '@/src/actions';
import {
  ProductMobileSlideshow,
  ProductSlideshow,
  QuantitySelector,
  SizeSelector,
} from '@/src/components';
import { StockLabel } from '@/src/components/product/stock-label/StockLabel';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: `${product?.title} | Tienda`,
    description: product?.description,
    openGraph: {
      title: `${product?.title} | Tienda`,
      description: product?.description,
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: Readonly<Props>) {
  const { slug } = await params;

  // const product = initialData.products.find((product) => product.slug === slug);
  const product = await getProductBySlug(slug);
  console.log(product);

  if (!product) {
    notFound();
  }
  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      {/* Image Section */}
      <div className="col-span-1 md:col-span-2">
        {/* Desktop /> */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />
      </div>

      <div className="col-span-1 px-5">
        <Suspense fallback={<StockLabelSkeleton />}>
          <StockLabel slug={slug} />
        </Suspense>
        <h1 className="antialiased font-bold text-xl">{product.title}</h1>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>

        <SizeSelector
          selectedSize={product.sizes[0]}
          availableSizes={product.sizes}
        />

        <QuantitySelector quantity={2} />

        <button className="btn-primary my-5">Add to Cart</button>
        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}

const StockLabelSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-7 w-full rounded mb-2" />
);
