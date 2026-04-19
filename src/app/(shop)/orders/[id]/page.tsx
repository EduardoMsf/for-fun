import { getOrderById } from '@/src/actions';
import { OrderStatus, PayPalButton, Title } from '@/src/components';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currencyFormatted } from '../../../../utils/currencyFormatted';

interface Props {
  params: Promise<{
    id: string;
  }>;
}
export default async function OrderPage({ params }: Readonly<Props>) {
  const { id } = await params;
  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect('/');
  }
  const address = order?.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title={`Order #${id.split('-').at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order!.isPaid} />
            {order!.OrderItem.map((product) => (
              <div
                className="flex mb-5"
                key={product.product.slug + product.size}
              >
                <Image
                  src={`/products/${product.product.productImages[0].url}`}
                  alt={product.product.title}
                  width={100}
                  height={100}
                  className="mr-5 rounded object-cover"
                  style={{ width: '100px', height: '100px' }}
                />

                <div>
                  <p className="text-sm md:text-base">
                    {product.product.title}
                  </p>
                  <p className="text-gray-600">
                    ${product.price.toFixed(2)} x {product.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal:{' '}
                    {currencyFormatted(product.price * product.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Address shipping</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address?.firstName} {address?.lastName}
              </p>
              <p>{address?.address}</p>
              <p>{address?.address2}</p>
              <p>
                {address?.city}, {address?.countryId} {address?.postalCode}
              </p>
              <p>{address?.phone}</p>
            </div>
            <div className="w-full h-px bg-gray-200 mb-10" />
            <h2 className="text-2xl mb-2">Order Summary</h2>
            <div className="grid grid-cols-2">
              <span>Total items:</span>
              <span>{order?.itemsInOrder} items</span>
              <span>Subtotal:</span>
              <span>{currencyFormatted(order!.subTotal)}</span>
              <span>Taxes:</span>
              <span>{currencyFormatted(order!.tax)}</span>
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl">
                {currencyFormatted(order!.total)}
              </span>
            </div>
            <div className=" mt-5 mb-2 w-full">
              {order!.isPaid ? (
                <OrderStatus isPaid={order!.isPaid} />
              ) : (
                <PayPalButton amount={order!.total} orderId={order!.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
