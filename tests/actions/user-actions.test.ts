import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiFetch = vi.fn();
const mockAuth = vi.fn();
const mockRevalidatePath = vi.fn();

vi.mock('@/src/lib/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

vi.mock('@/src/auth.config', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}));

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}));

import { getPaginatedUsers } from '@/src/actions/users/get-paginated-users';
import { changeUserRole } from '@/src/actions/users/change-user-role';

const adminSession = { user: { id: 'u1', role: 'admin' }, accessToken: 'tok' };
const userSession = { user: { id: 'u2', role: 'user' }, accessToken: 'utok' };

describe('getPaginatedUsers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns unauthorized for non-admin', async () => {
    mockAuth.mockResolvedValue(userSession);

    const result = await getPaginatedUsers();

    expect(result).toEqual({ ok: false, message: 'Unauthorized' });
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it('returns { ok: true, users } for admin', async () => {
    mockAuth.mockResolvedValue(adminSession);
    const users = [{ id: 'u1', name: 'Admin', email: 'a@a.com', role: 'admin' }];
    mockApiFetch.mockResolvedValue(users);

    const result = await getPaginatedUsers();

    expect(result).toEqual({ ok: true, users });
    expect(mockApiFetch).toHaveBeenCalledWith('/users', {}, 'tok');
  });

  it('returns { ok: false } on API error', async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockApiFetch.mockRejectedValue(new Error('db fail'));

    const result = await getPaginatedUsers();

    expect(result).toEqual({ ok: false, message: '' });
  });
});

describe('changeUserRole', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns unauthorized for non-admin', async () => {
    mockAuth.mockResolvedValue(userSession);

    const result = await changeUserRole('u2', 'admin');

    expect(result).toEqual({ ok: false, message: 'Unauthorized' });
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it('sets role to "admin" when passed "admin"', async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockApiFetch.mockResolvedValue(undefined);

    await changeUserRole('u2', 'admin');

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.role).toBe('admin');
  });

  it('normalizes any non-admin role to "user"', async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockApiFetch.mockResolvedValue(undefined);

    await changeUserRole('u2', 'superadmin');

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.role).toBe('user');
  });

  it('revalidates /admin/users on success', async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockApiFetch.mockResolvedValue(undefined);

    await changeUserRole('u2', 'user');

    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/users');
  });

  it('returns { ok: true } on success', async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockApiFetch.mockResolvedValue(undefined);

    const result = await changeUserRole('u2', 'user');

    expect(result).toEqual({ ok: true });
  });

  it('returns { ok: false } on API error', async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockApiFetch.mockRejectedValue(new Error('fail'));

    const result = await changeUserRole('u2', 'admin');

    expect(result).toEqual({ ok: false, message: 'Cannot update the user role' });
  });
});
