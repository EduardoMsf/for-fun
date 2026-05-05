import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiFetch = vi.fn();
const mockAuth = vi.fn();

vi.mock('@/src/lib/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

vi.mock('@/src/auth.config', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}));

import { getUserAddress } from '@/src/actions/address/get-user-address';
import { setUserAddres } from '@/src/actions/address/set-user-address';
import { deleteUserAddress } from '@/src/actions/address/delete-user-address';
import type { Address } from '@/src/interfaces';

const session = { user: { id: 'u1' }, accessToken: 'tok' };

const sampleAddress: Address = {
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main St',
  postalCode: '10001',
  city: 'New York',
  country: 'US',
  phone: '5550001111',
};

describe('getUserAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(session);
  });

  it('returns null when API returns null', async () => {
    mockApiFetch.mockResolvedValue(null);

    const result = await getUserAddress('u1');

    expect(result).toBeNull();
  });

  it('maps countryId to country key', async () => {
    mockApiFetch.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      countryId: 'US',
      address: '123 Main St',
    });

    const result = await getUserAddress('u1');

    expect(result).toMatchObject({ country: 'US' });
    expect(result).not.toHaveProperty('countryId');
  });

  it('preserves optional address2 when present', async () => {
    mockApiFetch.mockResolvedValue({
      firstName: 'Jane',
      countryId: 'MX',
      address2: 'Apt 2B',
    });

    const result = await getUserAddress('u1');

    expect(result?.address2).toBe('Apt 2B');
  });

  it('returns undefined for address2 when not in response', async () => {
    mockApiFetch.mockResolvedValue({ firstName: 'Jane', countryId: 'MX' });

    const result = await getUserAddress('u1');

    expect(result?.address2).toBeUndefined();
  });

  it('returns null on API error', async () => {
    mockApiFetch.mockRejectedValue(new Error('not found'));

    const result = await getUserAddress('u1');

    expect(result).toBeNull();
  });
});

describe('setUserAddres', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(session);
  });

  it('returns { ok: true, address } on success', async () => {
    mockApiFetch.mockResolvedValue({ id: 'a1', ...sampleAddress });

    const result = await setUserAddres(sampleAddress, 'u1');

    expect(result.ok).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/user-addresses/user/u1',
      expect.objectContaining({ method: 'PUT' }),
      'tok',
    );
  });

  it('sends countryId in body (mapped from address.country)', async () => {
    mockApiFetch.mockResolvedValue({});

    await setUserAddres(sampleAddress, 'u1');

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.countryId).toBe('US');
    expect(body).not.toHaveProperty('country');
  });

  it('returns { ok: false } on error', async () => {
    mockApiFetch.mockRejectedValue(new Error('fail'));

    const result = await setUserAddres(sampleAddress, 'u1');

    expect(result.ok).toBe(false);
  });
});

describe('deleteUserAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(session);
  });

  it('returns { ok: true } on success', async () => {
    mockApiFetch.mockResolvedValue(undefined);

    const result = await deleteUserAddress('u1');

    expect(result).toEqual({ ok: true });
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/user-addresses/user/u1',
      { method: 'DELETE' },
      'tok',
    );
  });

  it('returns { ok: false } on error', async () => {
    mockApiFetch.mockRejectedValue(new Error('fail'));

    const result = await deleteUserAddress('u1');

    expect(result).toEqual({ ok: false, message: 'Something went wrong' });
  });
});
