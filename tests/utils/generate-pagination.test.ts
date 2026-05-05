import { describe, expect, it } from 'vitest';
import { generatePagination } from '@/src/utils/generatePaginationNumbers';

describe('generatePagination', () => {
  it('returns full range when totalPages <= 7', () => {
    expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(generatePagination(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('returns start-heavy range when currentPage <= 3', () => {
    expect(generatePagination(1, 10)).toEqual([1, 2, 3, '...', 9, 10]);
    expect(generatePagination(3, 10)).toEqual([1, 2, 3, '...', 9, 10]);
  });

  it('returns end-heavy range when near the last pages', () => {
    expect(generatePagination(8, 10)).toEqual([1, 2, '...', 8, 9, 10]);
    expect(generatePagination(10, 10)).toEqual([1, 2, '...', 8, 9, 10]);
  });

  it('returns middle range when in the middle', () => {
    expect(generatePagination(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
    expect(generatePagination(7, 15)).toEqual([1, '...', 6, 7, 8, '...', 15]);
  });
});
