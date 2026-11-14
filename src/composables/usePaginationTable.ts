import { ref, onMounted, type Ref } from 'vue';
import type { PageResponse } from 'src/types/api';
import { useFeedback } from './useFeedback';

export interface QTablePagination {
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
  sortBy?: string | null;
  descending?: boolean;
}

export interface QTableRequestProps {
  pagination: QTablePagination;
}

export interface UsePaginationTableOptions<T, F = Record<string, unknown>> {
  fetchFn: (params: {
    page: number;
    size: number;
    query?: string | undefined;
    filters?: F;
  }) => Promise<PageResponse<T>>;
  initialRowsPerPage?: number;
  initialFilters?: F;
  errorMessage?: string;
  immediate?: boolean;
}

export interface UsePaginationTableReturn<T, F = Record<string, unknown>> {
  items: Ref<T[]>;
  loading: Ref<boolean>;
  pagination: Ref<QTablePagination>;
  searchQuery: Ref<string>;
  filters: Ref<F>;
  onRequest: (props: QTableRequestProps) => Promise<void>;
  handleSearch: (query: string) => Promise<void>;
  reload: () => Promise<void>;
  setFilter: <K extends keyof F>(key: K, value: F[K]) => Promise<void>;
}

export function usePaginationTable<T, F extends Record<string, unknown> = Record<string, unknown>>(
  options: UsePaginationTableOptions<T, F>,
): UsePaginationTableReturn<T, F> {
  const {
    fetchFn,
    initialRowsPerPage = 10,
    initialFilters = {} as F,
    errorMessage = 'Falha ao carregar registros.',
    immediate = true,
  } = options;

  const { handleApiError } = useFeedback();

  const items = ref<T[]>([]) as Ref<T[]>;
  const loading = ref<boolean>(false);
  const searchQuery = ref<string>('');
  const filters = ref<F>({ ...initialFilters }) as Ref<F>;

  const pagination = ref<QTablePagination>({
    page: 1,
    rowsPerPage: initialRowsPerPage,
    rowsNumber: 0,
    sortBy: null,
    descending: false,
  });

  async function loadData(page: number, size: number) {
    loading.value = true;
    try {
      // Mapeia página 1-based do Quasar para 0-based do Spring Data
      const pageIndex = Math.max(0, page - 1);
      const queryParam = searchQuery.value?.trim() || undefined;
      const res = await fetchFn({
        page: pageIndex,
        size,
        ...(queryParam ? { query: queryParam } : {}),
        filters: filters.value,
      });

      items.value = res.content || [];
      pagination.value.page = res.number + 1;
      pagination.value.rowsPerPage = res.size;
      pagination.value.rowsNumber = res.totalElements;
    } catch (err) {
      handleApiError(err, errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function onRequest(props: QTableRequestProps) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    pagination.value.sortBy = sortBy ?? null;
    pagination.value.descending = descending ?? false;
    await loadData(page, rowsPerPage);
  }

  async function handleSearch(query: string) {
    searchQuery.value = query;
    pagination.value.page = 1;
    await loadData(1, pagination.value.rowsPerPage);
  }

  async function reload() {
    await loadData(pagination.value.page, pagination.value.rowsPerPage);
  }

  async function setFilter<K extends keyof F>(key: K, value: F[K]) {
    filters.value[key] = value;
    pagination.value.page = 1;
    await loadData(1, pagination.value.rowsPerPage);
  }

  if (immediate) {
    onMounted(() => {
      void loadData(pagination.value.page, pagination.value.rowsPerPage);
    });
  }

  return {
    items,
    loading,
    pagination,
    searchQuery,
    filters,
    onRequest,
    handleSearch,
    reload,
    setFilter,
  };
}
