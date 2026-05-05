import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockGetPaginatedProducts = vi.fn();
const mockGetPaginatedOrders = vi.fn();
const mockGetPaginatedUsers = vi.fn();

vi.mock('@/src/actions', () => ({
  getPaginatedProductsWithImages: (...args: unknown[]) =>
    mockGetPaginatedProducts(...args),
  getPaginatedOrders: (...args: unknown[]) => mockGetPaginatedOrders(...args),
  getPaginatedUsers: (...args: unknown[]) => mockGetPaginatedUsers(...args),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  usePathname: vi.fn(() => '/admin/products'),
  useSearchParams: () => new URLSearchParams(),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

import AdminPage from '@/src/app/(shop)/admin/page';
import ProductsAdminPage from '@/src/app/(shop)/admin/products/page';
import OrdersAdminPage from '@/src/app/(shop)/admin/orders/page';
import UsersAdminPage from '@/src/app/(shop)/admin/users/page';

const testProducts = [
  {
    id: 'p1',
    title: 'Test Shirt',
    slug: 'test-shirt',
    price: 49.99,
    gender: 'men',
    inStock: 5,
    sizes: ['S', 'M'],
    images: [{ url: 'shirt.jpg', id: 1 }],
  },
];

const testOrders = [
  {
    id: 'uuid-0000-1111',
    isPaid: true,
    OrderAddress: { firstName: 'Alice', lastName: 'Smith' },
  },
  {
    id: 'uuid-0000-2222',
    isPaid: false,
    OrderAddress: { firstName: 'Bob', lastName: 'Jones' },
  },
];

const testUsers = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@test.com', role: 'admin', emailVerified: null },
  { id: 'u2', name: 'Bob Jones', email: 'bob@test.com', role: 'user', emailVerified: null },
];

describe('Admin page', () => {
  it('renders the hello admin heading', () => {
    render(<AdminPage />);
    expect(screen.getByRole('heading', { name: /hello admin/i })).toBeDefined();
  });
});

describe('Admin products page', () => {
  beforeEach(() => {
    mockGetPaginatedProducts.mockResolvedValue({
      products: testProducts,
      currentPage: 1,
      totalPages: 1,
    });
  });

  it('renders the products maintenance heading', async () => {
    const page = await ProductsAdminPage({
      searchParams: Promise.resolve({}),
    });
    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /products maintenance/i }),
    ).toBeDefined();
    expect(
      screen.getByRole('link', { name: /new product/i }),
    ).toBeDefined();
  });

  it('renders the products table with column headers', async () => {
    const page = await ProductsAdminPage({
      searchParams: Promise.resolve({}),
    });
    render(page);

    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Price')).toBeDefined();
    expect(screen.getByText('Gender')).toBeDefined();
    expect(screen.getByText('Stock')).toBeDefined();
  });

  it('renders product rows from the mocked data', async () => {
    const page = await ProductsAdminPage({
      searchParams: Promise.resolve({}),
    });
    render(page);

    expect(screen.getByText('Test Shirt')).toBeDefined();
    expect(screen.getByText('men')).toBeDefined();
  });
});

describe('Admin orders page', () => {
  beforeEach(() => {
    mockGetPaginatedOrders.mockResolvedValue({ ok: true, orders: testOrders });
  });

  it('renders the all orders heading', async () => {
    const page = await OrdersAdminPage();
    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /all orders/i }),
    ).toBeDefined();
  });

  it('renders paid and unpaid order rows', async () => {
    const page = await OrdersAdminPage();
    render(page);

    expect(screen.getByText(/^Pagada$/i)).toBeDefined();
    expect(screen.getByText(/^No Pagada$/i)).toBeDefined();
    expect(screen.getAllByRole('link', { name: /ver orden/i })).toHaveLength(2);
  });
});

describe('Admin users page', () => {
  beforeEach(() => {
    mockGetPaginatedUsers.mockResolvedValue({ ok: true, users: testUsers });
  });

  it('renders the dashboard heading', async () => {
    const page = await UsersAdminPage();
    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: /client/i }),
    ).toBeDefined();
  });
});
