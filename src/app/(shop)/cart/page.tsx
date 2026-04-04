import { QuantitySelector, Title } from '@/src/components';
import { initialData } from '@/src/seed/seed';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
  initialData.products[3],
];
export default function CartPage() {
  // redirect('/empty');
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title="Cart" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Add more items</span>
            <Link href="/checkout" className="underline mb-5">
              Keep shopping
            </Link>

            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="mr-5 rounded"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <p>{product.title}</p>
                  <p>${product.price.toFixed(2)}</p>
                  <QuantitySelector quantity={1} />
                  <button className="underline mt-3 cursor-pointer">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
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
              <Link
                href="/checkout"
                className="flex btn-primary justify-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
