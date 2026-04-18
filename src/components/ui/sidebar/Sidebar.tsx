'use client';
import { logout } from '@/src/actions';
import { useUIStore } from '@/src/store';
import clsx from 'clsx';
import Link from 'next/link';
import {
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';

import { useSession } from 'next-auth/react';

//  bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_10%,#bfdbfe_20%,#93c5fd_30%,#60a5fa_40%,#3b82f6_50%,#2563eb_60%,#1d4ed8_70%,#1e40af_80%,#1e3a8a_90%,#172554_100%)]'

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeSideMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === 'admin';

  console.log({ session });
  return (
    <div>
      {isSideMenuOpen && (
        <div className=" fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}
      {isSideMenuOpen && (
        <div
          onClick={closeSideMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      <nav
        className={clsx(
          'fixed p-5 right-0 top-0 w-125 h-screen z-20 shadow-2xl transform transition-all duration-300 text-slate-50 bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_10%,#bfdbfe_20%,#93c5fd_30%,#60a5fa_40%,#3b82f6_50%,#2563eb_60%,#1d4ed8_70%,#1e40af_80%,#1e3a8a_90%,#172554_100%)] [&_a:hover_span]:bg-[linear-gradient(135deg,#f5d0fe_0%,#d946ef_35%,#a855f7_70%,#6d28d9_100%)] [&_a:hover_span]:bg-clip-text [&_a:hover_span]:text-transparent',
          {
            'translate-x-full': !isSideMenuOpen,
          },
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_38%,rgba(10,37,99,0.16)_100%)]" />
          <div className="animate-blob absolute -top-12 -left-10 h-64 w-64 rounded-full bg-sky-200/45 blur-3xl mix-blend-screen" />
          <div className="animate-blob animation-delay-2000 absolute top-8 right-0 h-72 w-72 rounded-full bg-blue-400/35 blur-3xl mix-blend-screen" />
          <div className="animate-blob animation-delay-4000 absolute bottom-28 -left-14 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl mix-blend-screen" />
          <div className="animate-blob animation-delay-6000 absolute -bottom-14 right-6 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl mix-blend-screen" />
          <div className="absolute inset-y-0 left-0 w-px bg-white/20" />
        </div>

        <button
          type="button"
          aria-label="Cerrar menú"
          className="absolute top-5 right-5 z-50 cursor-pointer rounded-md p-2 
             transition-all duration-200 
             hover:scale-110 hover:bg-white/10
             active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          onClick={closeSideMenu}
        >
          <svg
            className="h-8 w-8 sm:h-10 sm:w-10" // Tamaño responsivo con clases
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="sidebar-close-gradient"
                x1="8"
                y1="8"
                x2="42"
                y2="42"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#f5d0fe" />
                <stop offset="0.35" stopColor="#d946ef" />
                <stop offset="0.7" stopColor="#a855f7" />
                <stop offset="1" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
            <path
              d="M15 15L35 35M35 15L15 35"
              stroke="url(#sidebar-close-gradient)"
              strokeWidth="5" // Un poco más grueso para que destaque el gradiente
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className=" relative mt-14">
          <IoSearchOutline
            size={20}
            className="absolute top-2 left-2 text-slate-700"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded pl-10 py-1 pr-10 border border-white/30 text-xl bg-white/85 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-sky-200 focus:bg-white"
          />
        </div>

        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={closeSideMenu}
              className="flex items-center mt-10 p-2 rounded transition-all hover:bg-white/15"
            >
              <IoPersonOutline size={25} />
              <span className="text-lg ml-3">Profile</span>
            </Link>
            <Link
              href="/orders"
              onClick={closeSideMenu}
              className="flex items-center mt-10 p-2 rounded transition-all hover:bg-white/15"
            >
              <IoTicketOutline size={25} />
              <span className="text-lg ml-3">Orders</span>
            </Link>

            <Link
              href="/"
              onClick={() => logout()}
              className="flex items-center mt-10 p-2 rounded transition-all hover:bg-white/15"
            >
              <IoLogOutOutline size={25} />
              <span className="text-lg ml-3">Logout</span>
            </Link>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            onClick={closeSideMenu}
            className="flex items-center mt-10 p-2 rounded transition-all hover:bg-white/15"
          >
            <IoLogInOutline size={25} />
            <span className="text-lg ml-3">Login</span>
          </Link>
        )}

        <div className="w-full h-px bg-white/30 my-10" />
        {isAdmin && (
          <>
            <Link
              href="/"
              className="flex items-center mt-10 p-2 rounded transition-all hover:bg-white/15"
            >
              <IoShirtOutline size={25} />
              <span className="text-lg ml-3">Products</span>
            </Link>
            <Link
              href="/"
              className="flex items-center mt-10 p-2 rounded transition-all hover:bg-white/15"
            >
              <IoTicketOutline size={25} />
              <span className="text-lg ml-3">Orders</span>
            </Link>
            <Link
              href="/"
              className="flex items-center mt-10 p-2 rounded transition-all hover:bg-white/15"
            >
              <IoPeopleOutline size={25} />
              <span className="text-lg ml-3">Clients</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
