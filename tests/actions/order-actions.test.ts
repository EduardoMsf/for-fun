import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiFetch = vi.fn();
const mockAuth = vi.fn();

vi.mock('@/src/lib/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

vi.mock('@/src/auth.config', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}));

import { placeORder } from '@/src/actions/order/place-order';
import { getOrderById } from '@/src/actions/order/get-order-by-id';
import { getOrderByUser } from '@/src/actions/order/get-order-by-user';
import { getPaginatedOrders } from '@/src/actions/order/get-paginated-orders';
import type { Address } from '@/src/interfaces';

const adminSession = { user: { id: 'u1', role: 'admin' }, accessToken: 'tok' };
const userSession = { user: { id: 'u2', role: 'user' }, accessToken: 'utok' };

const address: Address = {
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main St',
  postalCode: '10001',
  city: 'New York',
  country: 'US',
  phone: '5550001111',
};

describe('placeORder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns unauthorized when no session user id', async () => {
    mockAuth.mockResolvedValue({ user: {} });

    const result = await placeORder([], address);

    expect(result).toEqual({ ok: false, message: 'User not authenticated' });
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it('returns { ok: true, order } on success', async () => {
    mockAuth.mockResolvedValue(userSession);
    mockApiFetch.mockResolvedValue({ order: { id: 'ord-1' } });

    const result = await placeORder(
      [{ productId: 'p1', quantity: 2, size: 'M' }],
      address,
    );

    expect(result).toEqual({ ok: true, order: { id: 'ord-1' } });
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/orders/place',
      expect.objectContaining({ method: 'POST' }),
      'utok',
    );
  });

  it('maps address.country to countryId in the request body', async () => {
    mockAuth.mockResolvedValue(userSession);
    mockApiFetch.mockResolvedValue({ order: { id: 'o1' } });

    await placeORder([], address);

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.address.countryId).toBe('US');
    expect(body.address).not.toHaveProperty('country');
  });

  it('returns { ok: false, message } on API error', async () => {
    mockAuth.mockResolvedValue(userSession);
    mockApiFetch.mockRejectedValue(new Error('Insufficient stock'));

    const result = await placeORder([], address);

    expect(result).toEqual({ ok: false, message: 'Insufficient stock' });
  });
});

describe('getOrderById', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns unauthorized when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const result = await getOrderById('ord-1');

    expect(result).toEqual({ ok: false, message: 'Unauthorized' });
  });

  it('returns order for admin regardless of userId', async () => {
    mockAuth.mockResolvedValue(adminSession);
    const order = { id: 'ord-1', userId: 'u-other', isPaid: false };
    mockApiFetch.mockResolvedValue(order);

    const result = await getOrderById('ord-1');

    expect(result).toEqual({ ok: true, order });
  });

  it('returns order when user owns it', async () => {
    mockAuth.mockResolvedValue(userSession);
    const order = { id: 'ord-1', userId: 'u2', isPaid: false };
    mockApiFetch.mockResolvedValue(order);

    const result = await getOrderById('ord-1');

    expect(result).toEqual({ ok: true, order });
  });

  it('returns not found when user does not own the order', async () => {
    mockAuth.mockResolvedValue(userSession);
    mockApiFetch.mockResolvedValue({ id: 'ord-1', userId: 'u-other', isPaid: false });

    const result = await getOrderById('ord-1');

    expect(result).toEqual({ ok: false, message: 'ord-1 not found for this user' });
  });

  it('returns { ok: false } on API error', async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockApiFetch.mockRejectedValue(new Error('db error'));

    const result = await getOrderById('ord-1');

    expect(result).toEqual({ ok: false, message: 'Error fetching order details' });
  });
});

describe('getOrderByUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns unauthorized when no session', async () => {
    mockAuth.mockResolvedValue(null);

    const result = await getOrderByUser();

    expect(result).toEqual({ ok: false, message: 'Unauthorized' });
  });

  it('returns { ok: true, orders } on success', async () => {
    mockAuth.mockResolvedValue(userSession);
    const orders = [{ id: 'o1', isPaid: true, OrderAddress: null }];
    mockApiFetch.mockResolvedValue(orders);

    const result = await getOrderByUser();

    expect(result).toEqual({ ok: true, orders });
    expect(mockApiFetch).toHaveBeenCalledWith(
      `/orders/user/${userSession.user.id}`,
      {},
      'utok',
    );
  });

  it('returns { ok: false } on error', async () => {
    mockAuth.mockResolvedValue(userSession);
    mockApiFetch.mockRejectedValue(new Error('fail'));

    const result = await getOrderByUser();

    expect(result).toEqual({ ok: false, message: 'Error fetching orders' });
  });
});

describe('getPaginatedOrders', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns unauthorized for non-admin users', async () => {
    mockAuth.mockResolvedValue(userSession);

    const result = await getPaginatedOrders();

    expect(result).toEqual({ ok: false, message: 'Unauthorized' });
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it('returns { ok: true, orders } for admin', async () => {
    mockAuth.mockResolvedValue(adminSession);
    const orders = [{ id: 'o1', isPaid: false, OrderAddress: null }];
    mockApiFetch.mockResolvedValue(orders);

    const result = await getPaginatedOrders();

    expect(result).toEqual({ ok: true, orders });
    expect(mockApiFetch).toHaveBeenCalledWith('/orders', {}, 'tok');
  });

  it('returns { ok: false } on API error', async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockApiFetch.mockRejectedValue(new Error('db fail'));

    const result = await getPaginatedOrders();

    expect(result).toEqual({ ok: false, message: 'Error fetching orders' });
  });
});
