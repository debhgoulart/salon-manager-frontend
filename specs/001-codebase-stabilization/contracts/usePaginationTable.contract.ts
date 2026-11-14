import type { Ref } from 'vue';
import type { PageResponse } from 'src/types/api';

/**
 * Parâmetros de paginação e ordenação esperados pelo Quasar QTable
 */
export interface QTablePagination {
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
  sortBy?: string | null;
  descending?: boolean;
}

/**
 * Parâmetros do evento @request disparado pela QTable
 */
export interface QTableRequestProps {
  pagination: QTablePagination;
}

/**
 * Opções de inicialização do composable usePaginationTable
 */
export interface UsePaginationTableOptions<T, F = Record<string, unknown>> {
  /**
   * Função assíncrona que consome o service e retorna a resposta paginada do Spring Boot
   */
  fetchFn: (params: {
    page: number;
    size: number;
    query?: string;
    filters?: F;
  }) => Promise<PageResponse<T>>;
  /**
   * Quantidade padrão de itens por página (default: 10)
   */
  initialRowsPerPage?: number;
  /**
   * Filtros adicionais específicos do domínio (ex: active: boolean)
   */
  initialFilters?: F;
  /**
   * Mensagem padrão exibida em caso de falha de carregamento
   */
  errorMessage?: string;
  /**
   * Se true, executa a primeira carga automaticamente no onMounted (default: true)
   */
  immediate?: boolean;
}

/**
 * Retorno público do composable usePaginationTable
 */
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
