import { Title } from '@/src/components';
import { initialData } from '@/src/seed/seed';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = initialData.products.find((product) => product.slug === slug);

  if (!product) {
    notFound();
  }
  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      {/* Image Section */}
      <div className="col-span-1 md:col-span-2">
        <Image
          src={`/products/${product.images[0]}`}
          alt={product.title}
          width={500}
          height={500}
        />
      </div>

      <div className="col-span-1 px-5">
        <h1 className="antialiased font-bold text-xl">{product.title}</h1>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>

        <button className="btn-primary my-5">Add to Cart</button>
        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
