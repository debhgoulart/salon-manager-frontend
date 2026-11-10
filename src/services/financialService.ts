import apiClient from './api';
import type {
  FinancialTransactionRequest,
  FinancialTransactionResponse,
  FinancialSummaryResponse,
  TransactionType,
  TransactionStatus,
} from 'src/types/financial';
import type { PageResponse } from 'src/types/api';

export const financialService = {
  async listTransactions(params?: {
    type?: TransactionType | undefined;
    status?: TransactionStatus | undefined;
    category?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    page?: number | undefined;
    size?: number | undefined;
  }): Promise<PageResponse<FinancialTransactionResponse>> {
    const { data } = await apiClient.get<PageResponse<FinancialTransactionResponse>>('/api/v1/financial/transactions', {
      params: {
        type: params?.type,
        status: params?.status,
        category: params?.category,
        startDate: params?.startDate,
        endDate: params?.endDate,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return data;
  },

  async createTransaction(payload: FinancialTransactionRequest): Promise<FinancialTransactionResponse> {
    const { data } = await apiClient.post<FinancialTransactionResponse>('/api/v1/financial/transactions', payload);
    return data;
  },

  async getSummary(startDate: string, endDate: string): Promise<FinancialSummaryResponse> {
    const { data } = await apiClient.get<FinancialSummaryResponse>('/api/v1/financial/summary', {
      params: { startDate, endDate },
    });
    return data;
  },
};

export default financialService;
