import { Title } from '@/src/components';
import { OrderItemCard } from '@/src/components/product/order-item-card/OrderItemCard';
import { initialData } from '@/src/seed/seed';
import Link from 'next/link';

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];
export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title="Confirm Order" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Elements</span>
            <Link href="/cart" className="underline mb-5">
              Edit cart
            </Link>

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
              <p className="mb-5">
                <span className="text-xs">
                  By placing your order, you agree to the Terms of Service and
                  Privacy Policy.
                </span>
              </p>
              <Link
                href="/orders/abc"
                className="flex btn-primary justify-center"
              >
                Place Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
