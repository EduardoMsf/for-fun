import { Title } from '@/src/components';
import { OrderItemCard } from '@/src/components/product/order-item-card/OrderItemCard';
import type { Product } from '@/src/interfaces';
import { initialData } from '@/src/seed/seed';
import clsx from 'clsx';
import { IoCartOutline } from 'react-icons/io5';

const productsInCart: Product[] = initialData.products.slice(0, 3).map((product) => ({
  ...product,
  id: product.slug,
}));

interface Props {
  params: Promise<{
    id: string;
  }>;
}
export default async function OrderPage({ params }: Readonly<Props>) {
  const { id } = await params;
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title={`Order #${id}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                'flex items-center rounded-lg py-2px3 px-3.5 text-xs font-bold text-white mb-5',
                {
                  'bg-red-500': false,
                  'bg-green-700': true,
                },
              )}
            >
              <IoCartOutline size={30} />
              {/* <span>Payment pending</span> */}
              <span>Payment completed</span>
            </div>

            {productsInCart.map((product) => (
              <OrderItemCard
                key={product.slug}
                product={product}
                quantity={3} // Aquí usarías product.quantity
              />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Address shipping</h2>
            <div className="mb-10">
              <p className="text-xl">Eduardo Samaniego</p>
              <p>123 Main Street</p>
              <p>City, State 12345</p>
            </div>
            <div className="w-full h-px bg-gray-200 mb-10" />
            <h2 className="text-2xl mb-2">Order Summary</h2>
            <div className="grid grid-cols-2">
              <span>Total items:</span>
              <span>3 items</span>
              <span>Subtotal:</span>
              <span>$100</span>
              <span>Taxes:</span>
              <span>$15</span>
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl">$15</span>
            </div>
            <div className=" mt-5 mb-2 w-full">
              <div
                className={clsx(
                  'flex items-center rounded-lg py-2px3 px-3.5 text-xs font-bold text-white mb-5',
                  {
                    'bg-red-500': false,
                    'bg-green-700': true,
                  },
                )}
              >
                <IoCartOutline size={30} />
                {/* <span>Payment pending</span> */}
                <span>Payment completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
