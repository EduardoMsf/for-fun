import { cleanup } from '@testing-library/react';
import type {
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
  PropsWithChildren,
} from 'react';
import { createElement, useEffect, useRef } from 'react';
import { afterEach, vi } from 'vitest';

import { useUIStore } from '@/src/store';

vi.mock('next/font/google', () => {
  const createFont = () => ({
    className: 'mocked-font',
    style: { fontFamily: 'mocked-font' },
    variable: '--mocked-font',
  });

  return {
    Geist: createFont,
    Geist_Mono: createFont,
    Inter: createFont,
    Montserrat_Alternates: createFont,
  };
});

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: PropsWithChildren<
    AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
  >) => createElement('a', { href, ...props }, children),
}));

vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) =>
    createElement('img', { ...props, alt: props.alt ?? '' }),
}));

vi.mock('swiper/modules', () => ({
  Autoplay: 'Autoplay',
  FreeMode: 'FreeMode',
  Navigation: 'Navigation',
  Pagination: 'Pagination',
  Thumbs: 'Thumbs',
}));

vi.mock('swiper/react', () => ({
  Swiper: ({
    children,
    className,
    onSwiper,
    ...props
  }: PropsWithChildren<{
    className?: string;
    onSwiper?: (swiper: { destroyed: boolean }) => void;
  }>) => {
    const swiperRef = useRef({ destroyed: false });

    useEffect(() => {
      onSwiper?.(swiperRef.current);
    }, [onSwiper]);

    return createElement(
      'div',
      { ...props, className, 'data-testid': className ?? 'swiper' },
      children,
    );
  },
  SwiperSlide: ({ children }: PropsWithChildren) =>
    createElement('div', { 'data-testid': 'swiper-slide' }, children),
}));

afterEach(() => {
  useUIStore.setState({ isSideMenuOpen: false });
  cleanup();
});
