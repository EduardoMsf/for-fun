import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiFetch = vi.fn();
const mockAuth = vi.fn();
const mockRevalidatePath = vi.fn();
const mockCloudinaryDestroy = vi.fn();
const mockCloudinaryUpload = vi.fn();

vi.mock('@/src/lib/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

vi.mock('@/src/auth.config', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}));

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
  unstable_noStore: vi.fn(),
}));

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      destroy: (...args: unknown[]) => mockCloudinaryDestroy(...args),
      upload: (...args: unknown[]) => mockCloudinaryUpload(...args),
    },
  },
}));

import { getProductBySlug } from '@/src/actions/product/get-product-by-slug';
import { getStockBySlug } from '@/src/actions/product/get-stock-by-slug';
import { getCategories } from '@/src/actions/product/get-categories';
import { createUpdateProduct } from '@/src/actions/product/create-update-product';
import { deleteProductImage } from '@/src/actions/product/delete-product-image';

const adminSession = { user: { id: 'u1', role: 'admin' }, accessToken: 'tok' };
const VALID_UUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

describe('getProductBySlug', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the product on success', async () => {
    const product = { id: 'p1', title: 'Shirt', slug: 'shirt' };
    mockApiFetch.mockResolvedValue(product);

    const result = await getProductBySlug('shirt');

    expect(result).toEqual(product);
    expect(mockApiFetch).toHaveBeenCalledWith('/products/slug/shirt');
  });

  it('returns null when apiFetch throws', async () => {
    mockApiFetch.mockRejectedValue(new Error('not found'));

    const result = await getProductBySlug('missing');

    expect(result).toBeNull();
  });
});

describe('getStockBySlug', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns inStock number on success', async () => {
    mockApiFetch.mockResolvedValue({ inStock: 42 });

    const result = await getStockBySlug('shirt');

    expect(result).toBe(42);
  });

  it('returns 0 on error', async () => {
    mockApiFetch.mockRejectedValue(new Error('fail'));

    const result = await getStockBySlug('shirt');

    expect(result).toBe(0);
  });
});

describe('getCategories', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns categories array on success', async () => {
    const cats = [{ id: 'c1', name: 'shirts' }];
    mockApiFetch.mockResolvedValue(cats);

    const result = await getCategories();

    expect(result).toEqual(cats);
  });

  it('returns empty array on error', async () => {
    mockApiFetch.mockRejectedValue(new Error('fail'));

    const result = await getCategories();

    expect(result).toEqual([]);
  });
});

describe('createUpdateProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(adminSession);
  });

  const buildFormData = (overrides: Record<string, string> = {}) => {
    const fd = new FormData();
    fd.append('title', overrides.title ?? 'Test Shirt');
    fd.append('slug', overrides.slug ?? 'test-shirt');
    fd.append('description', overrides.description ?? 'A great shirt');
    fd.append('price', overrides.price ?? '49.99');
    fd.append('inStock', overrides.inStock ?? '10');
    fd.append('categoryId', overrides.categoryId ?? 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
    fd.append('sizes', overrides.sizes ?? 'S,M,L');
    fd.append('tags', overrides.tags ?? 'cotton,summer');
    fd.append('gender', overrides.gender ?? 'men');
    if (overrides.id) fd.append('id', overrides.id);
    return fd;
  };

  it('returns { ok: false } when Zod validation fails', async () => {
    const fd = new FormData();
    fd.append('title', 'Ti'); // too short

    const result = await createUpdateProduct(fd);

    expect(result).toEqual({ ok: false });
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it('POSTs to /products when no id is provided', async () => {
    mockApiFetch.mockResolvedValue({ id: 'new-id', slug: 'test-shirt' });

    const result = await createUpdateProduct(buildFormData());

    expect(mockApiFetch).toHaveBeenCalledWith(
      '/products',
      expect.objectContaining({ method: 'POST' }),
      'tok',
    );
    expect(result).toEqual({ ok: true, product: { id: 'new-id', slug: 'test-shirt' } });
  });

  it('PATCHes /products/:id when id is provided', async () => {
    mockApiFetch.mockResolvedValue({ id: VALID_UUID, slug: 'test-shirt' });
    const fd = buildFormData({ id: VALID_UUID });

    const result = await createUpdateProduct(fd);

    expect(mockApiFetch).toHaveBeenCalledWith(
      `/products/${VALID_UUID}`,
      expect.objectContaining({ method: 'PATCH' }),
      'tok',
    );
    expect(result).toEqual({ ok: true, product: { id: VALID_UUID, slug: 'test-shirt' } });
  });

  it('normalizes slug to lowercase with hyphens', async () => {
    mockApiFetch.mockResolvedValue({ id: 'id1', slug: 'my-test-shirt' });
    const fd = buildFormData({ slug: 'My Test Shirt' });

    await createUpdateProduct(fd);

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.slug).toBe('my-test-shirt');
  });

  it('uploads images and registers them via API', async () => {
    mockApiFetch.mockResolvedValue({ id: 'pid', slug: 'test-shirt' });
    mockCloudinaryUpload.mockResolvedValue({ secure_url: 'https://cdn.example.com/img.jpg' });

    const fd = buildFormData();
    const file = new File(['data'], 'photo.png', { type: 'image/png' });
    // jsdom File doesn't implement arrayBuffer — define it directly
    Object.defineProperty(file, 'arrayBuffer', {
      value: vi.fn().mockResolvedValue(new ArrayBuffer(4)),
      configurable: true,
    });
    fd.append('images', file);

    await createUpdateProduct(fd);

    const imageCall = mockApiFetch.mock.calls.find((c) => c[0] === '/product-images');
    expect(imageCall).toBeDefined();
    expect(JSON.parse(imageCall[1].body).url).toBe('https://cdn.example.com/img.jpg');
  });

  it('revalidates paths after saving', async () => {
    mockApiFetch.mockResolvedValue({ id: 'pid', slug: 'test-shirt' });

    await createUpdateProduct(buildFormData());

    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/products');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/products/test-shirt');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/products/test-shirt');
  });

  it('returns { ok: false, message } when apiFetch throws', async () => {
    mockApiFetch.mockRejectedValue(new Error('DB error'));

    const result = await createUpdateProduct(buildFormData());

    expect(result).toEqual({
      ok: false,
      message: 'Check the server logs for more details',
    });
  });
});

describe('deleteProductImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(adminSession);
  });

  it('returns error when URL is not http', async () => {
    const result = await deleteProductImage(1, 'local-image.jpg');

    expect(result).toEqual({ ok: false, message: 'Cannot delete image from file system' });
    expect(mockCloudinaryDestroy).not.toHaveBeenCalled();
  });

  it('destroys from Cloudinary and deletes from API for http URLs', async () => {
    mockCloudinaryDestroy.mockResolvedValue({ result: 'ok' });
    mockApiFetch.mockResolvedValue({ product: { slug: 'my-shirt' } });

    await deleteProductImage(7, 'https://res.cloudinary.com/demo/image/upload/sample.jpg');

    expect(mockCloudinaryDestroy).toHaveBeenCalledWith('sample');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/product-images/7',
      { method: 'DELETE' },
      'tok',
    );
  });

  it('revalidates slug paths when deleted product has a slug', async () => {
    mockCloudinaryDestroy.mockResolvedValue({ result: 'ok' });
    mockApiFetch.mockResolvedValue({ product: { slug: 'my-shirt' } });

    await deleteProductImage(7, 'https://cdn.example.com/my-shirt.jpg');

    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/products');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/product/my-shirt');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/product/my-shirt');
  });

  it('returns { ok: false } when an error occurs', async () => {
    mockCloudinaryDestroy.mockRejectedValue(new Error('cloudinary down'));

    const result = await deleteProductImage(7, 'https://cdn.example.com/img.jpg');

    expect(result).toEqual({ ok: false, message: 'Failed to delete product image' });
  });
});
