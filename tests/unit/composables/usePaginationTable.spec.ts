import { describe, it, expect, vi } from 'vitest';

vi.mock('src/composables/useFeedback', () => ({
  useFeedback: () => ({
    handleApiError: vi.fn(),
    notifyError: vi.fn(),
    notifySuccess: vi.fn(),
  }),
}));

import { usePaginationTable } from 'src/composables/usePaginationTable';
import type { PageResponse } from 'src/types/api';

describe('usePaginationTable Composable', () => {
  interface MockItem {
    id: string;
    name: string;
  }

  const mockResponse: PageResponse<MockItem> = {
    content: [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ],
    pageable: { pageNumber: 0, pageSize: 10, offset: 0 },
    totalElements: 20,
    totalPages: 2,
    size: 10,
    number: 0,
    first: true,
    last: false,
    empty: false,
  };

  it('initializes with default pagination and empty items without immediate auto-load', async () => {
    const fetchFn = vi.fn().mockResolvedValue(mockResponse);

    const { items, loading, pagination } = usePaginationTable<MockItem>({
      fetchFn,
      initialRowsPerPage: 10,
      immediate: false,
    });

    expect(items.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(pagination.value.page).toBe(1);
    expect(pagination.value.rowsPerPage).toBe(10);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('onRequest converts 1-based Quasar page to 0-based Spring Data page', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ...mockResponse,
      number: 1, // Página 2 no Spring
    });

    const { items, pagination, onRequest } = usePaginationTable<MockItem>({
      fetchFn,
      immediate: false,
    });

    await onRequest({
      pagination: {
        page: 2,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: true,
      },
    });

    expect(fetchFn).toHaveBeenCalledWith({
      page: 1, // 0-based
      size: 10,
      query: undefined,
      filters: {},
    });

    expect(items.value).toHaveLength(2);
    expect(pagination.value.page).toBe(2);
    expect(pagination.value.rowsNumber).toBe(20);
    expect(pagination.value.sortBy).toBe('name');
    expect(pagination.value.descending).toBe(true);
  });

  it('handleSearch resets page to 1 and passes query parameter', async () => {
    const fetchFn = vi.fn().mockResolvedValue(mockResponse);

    const { pagination, searchQuery, handleSearch } = usePaginationTable<MockItem>({
      fetchFn,
      immediate: false,
    });

    pagination.value.page = 4;
    await handleSearch('João');

    expect(searchQuery.value).toBe('João');
    expect(pagination.value.page).toBe(1);
    expect(fetchFn).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      query: 'João',
      filters: {},
    });
  });

  it('setFilter updates domain-specific filters and reloads from page 1', async () => {
    const fetchFn = vi.fn().mockResolvedValue(mockResponse);

    const { filters, setFilter } = usePaginationTable<MockItem, { active: boolean }>({
      fetchFn,
      initialFilters: { active: true },
      immediate: false,
    });

    await setFilter('active', false);

    expect(filters.value.active).toBe(false);
    expect(fetchFn).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      query: undefined,
      filters: { active: false },
    });
  });
});
