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

import { paypalCheckPayment } from '@/src/actions/payment/paypal-check-payment';
import { setTransactionId } from '@/src/actions/payment/set-transaction-id';

const session = { user: { id: 'u1' }, accessToken: 'tok' };

describe('paypalCheckPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(session);
  });

  it('returns { ok: true } and revalidates /orders on success', async () => {
    mockApiFetch.mockResolvedValue({ ok: true });

    const result = await paypalCheckPayment('TXN-001');

    expect(result).toEqual({ ok: true });
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/payments/paypal/verify',
      expect.objectContaining({ method: 'POST' }),
      'tok',
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith('/orders');
  });

  it('sends the transactionId in the request body', async () => {
    mockApiFetch.mockResolvedValue({});

    await paypalCheckPayment('TXN-ABC');

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.transactionId).toBe('TXN-ABC');
  });

  it('returns { ok: false, message } on error', async () => {
    mockApiFetch.mockRejectedValue(new Error('PayPal error'));

    const result = await paypalCheckPayment('TXN-BAD');

    expect(result).toEqual({ ok: false, message: 'PayPal error' });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});

describe('setTransactionId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(session);
  });

  it('returns { ok: true } on success', async () => {
    mockApiFetch.mockResolvedValue(undefined);

    const result = await setTransactionId('ord-1', 'TXN-001');

    expect(result).toEqual({ ok: true });
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/orders/ord-1/transaction',
      expect.objectContaining({ method: 'PATCH' }),
      'tok',
    );
  });

  it('sends orderId and transactionId in the request body', async () => {
    mockApiFetch.mockResolvedValue(undefined);

    await setTransactionId('ord-2', 'TXN-999');

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.transactionId).toBe('TXN-999');
  });

  it('returns { ok: false } on error', async () => {
    mockApiFetch.mockRejectedValue(new Error('fail'));

    const result = await setTransactionId('ord-1', 'TXN-BAD');

    expect(result).toEqual({
      ok: false,
      message: 'No se pudo actualizar el id de la transacción',
    });
  });
});
