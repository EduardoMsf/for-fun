import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import GenderErrorPage from '@/src/app/(shop)/gender/error';
import GenderNotFoundPage from '@/src/app/(shop)/gender/not-found';
import ProductNotFoundPage from '@/src/app/(shop)/product/not-found';
import EmptyPage from '@/src/app/(shop)/empty/page';
import ProductsPage from '@/src/app/(shop)/products/page';

describe('Gender error page', () => {
  it('renders the 404 content', () => {
    render(<GenderErrorPage />);
    expect(screen.getByText('404')).toBeDefined();
  });
});

describe('Gender not-found page', () => {
  it('renders the 404 content', () => {
    render(<GenderNotFoundPage />);
    expect(screen.getByText('404')).toBeDefined();
  });
});

describe('Product not-found page', () => {
  it('renders the 404 content', () => {
    render(<ProductNotFoundPage />);
    expect(screen.getByText('404')).toBeDefined();
  });
});

describe('Empty page', () => {
  it('renders the empty cart heading and back link', () => {
    render(<EmptyPage />);
    expect(screen.getByRole('heading', { name: /your cart is empty/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /regresar/i })).toBeDefined();
  });
});

describe('Products page', () => {
  it('renders the hello products heading', () => {
    render(<ProductsPage />);
    expect(screen.getByRole('heading', { name: /hello products page/i })).toBeDefined();
  });
});
