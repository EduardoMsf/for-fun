import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiFetch = vi.fn();

vi.mock('@/src/lib/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

import { getCountries } from '@/src/actions/country/getCountry';

describe('getCountries', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns country list on success', async () => {
    const countries = [
      { id: 'US', name: 'United States' },
      { id: 'MX', name: 'Mexico' },
    ];
    mockApiFetch.mockResolvedValue(countries);

    const result = await getCountries();

    expect(result).toEqual(countries);
    expect(mockApiFetch).toHaveBeenCalledWith('/countries?orderBy=name');
  });

  it('returns empty array on error', async () => {
    mockApiFetch.mockRejectedValue(new Error('network error'));

    const result = await getCountries();

    expect(result).toEqual([]);
  });
});
