import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockApiFetch = vi.fn();

vi.mock('next-auth', () => ({
  AuthError: class AuthError extends Error {
    type: string;
    constructor(type: string) {
      super(type);
      this.type = type;
    }
  },
}));

vi.mock('@/src/auth.config', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  auth: vi.fn(),
}));

vi.mock('@/src/lib/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

import { AuthError } from 'next-auth';
import { authenticate, login } from '@/src/actions/auth/login';
import { logout } from '@/src/actions/auth/logout';
import { registerUser } from '@/src/actions/auth/register';

describe('authenticate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns "Success" when signIn resolves', async () => {
    mockSignIn.mockResolvedValue(undefined);
    const fd = new FormData();
    fd.append('email', 'test@test.com');
    fd.append('password', '123456');

    const result = await authenticate(undefined, fd);

    expect(result).toBe('Success');
  });

  it('returns "Invalid credentials." for CredentialsSignin error', async () => {
    mockSignIn.mockRejectedValue(new AuthError('CredentialsSignin'));
    const fd = new FormData();

    const result = await authenticate(undefined, fd);

    expect(result).toBe('Invalid credentials.');
  });

  it('returns "Something went wrong." for other AuthError types', async () => {
    mockSignIn.mockRejectedValue(new AuthError('OAuthSignin'));
    const fd = new FormData();

    const result = await authenticate(undefined, fd);

    expect(result).toBe('Something went wrong.');
  });

  it('re-throws non-AuthError errors', async () => {
    mockSignIn.mockRejectedValue(new Error('unexpected'));
    const fd = new FormData();

    await expect(authenticate(undefined, fd)).rejects.toThrow('unexpected');
  });
});

describe('login', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns { ok: true } when signIn resolves', async () => {
    mockSignIn.mockResolvedValue(undefined);

    const result = await login('user@test.com', 'pass123');

    expect(result).toEqual({ ok: true });
  });

  it('returns { ok: false } when signIn throws', async () => {
    mockSignIn.mockRejectedValue(new Error('fail'));

    const result = await login('user@test.com', 'pass123');

    expect(result).toEqual({ ok: false, message: 'Cannot signIn' });
  });
});

describe('logout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls signOut', async () => {
    mockSignOut.mockResolvedValue(undefined);

    await logout();

    expect(mockSignOut).toHaveBeenCalledOnce();
  });
});

describe('registerUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns { ok: true, user } on success', async () => {
    const user = { id: 'u1', name: 'John', email: 'john@test.com' };
    mockApiFetch.mockResolvedValue({ user });

    const result = await registerUser('John', 'john@test.com', 'pass123');

    expect(result).toEqual({ ok: true, user });
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/auth/register',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns { ok: false } when apiFetch throws', async () => {
    mockApiFetch.mockRejectedValue(new Error('Email already in use'));

    const result = await registerUser('John', 'dup@test.com', 'pass123');

    expect(result).toEqual({ ok: false, message: 'No se pudo crear el usuario' });
  });
});
