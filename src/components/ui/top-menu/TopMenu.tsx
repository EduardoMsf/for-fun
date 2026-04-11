'use client';
import { titleFont } from '@/src/config/font';
import { useCartStore, useUIStore } from '@/src/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';

export const TopMenu = () => {
  const [loaded, setLoaded] = useState(false);
  const totalItemsInCart = useCartStore((state) => state.totalItems);
  const openSideMenu = useUIStore((state) => state.openSideMenu);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      <div className="hidden sm:block">
        <Link
          href="/gender/men"
          className="m-2 p-2 rounded-md transition-all text-sm font-medium hover:bg-gray-100"
        >
          Men
        </Link>
        <Link
          href="/gender/women"
          className="m-2 p-2 rounded-md transition-all text-sm font-medium hover:bg-gray-100"
        >
          Women
        </Link>
        <Link
          href="/gender/kid"
          className="m-2 p-2 rounded-md transition-all text-sm font-medium hover:bg-gray-100"
        >
          Kid
        </Link>
      </div>

      <div className="flex items-center">
        <Link
          href="/search"
          className="m-2 p-2 rounded-md transition-all text-sm font-medium hover:bg-gray-100"
        >
          <IoSearchOutline className="w-5 h-5" />
        </Link>
        <Link
          href={totalItemsInCart === 0 ? '/empty' : '/cart'}
          className="m-2 p-2 rounded-md transition-all text-sm font-medium hover:bg-gray-100"
        >
          <div className="relative">
            <span className="absolute text-sm px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
              {loaded ? totalItemsInCart : 0}
            </span>
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
