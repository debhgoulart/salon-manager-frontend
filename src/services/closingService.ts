import apiClient from './api';
import type {
  MonthlyClosingResponse,
  MonthlyClosingRequest,
  MonthlyClosingReopenRequest,
  MonthlyClosingStatus,
} from 'src/types/closing';

export const closingService = {
  async list(params?: {
    status?: MonthlyClosingStatus;
    year?: number;
  }): Promise<MonthlyClosingResponse[]> {
    const { data } = await apiClient.get<MonthlyClosingResponse[]>('/api/v1/closings', {
      params: {
        status: params?.status,
        year: params?.year,
      },
    });
    return data;
  },

  async getById(id: string): Promise<MonthlyClosingResponse> {
    const { data } = await apiClient.get<MonthlyClosingResponse>(`/api/v1/closings/${id}`);
    return data;
  },

  async calculate(year: number, month: number): Promise<MonthlyClosingResponse> {
    const { data } = await apiClient.get<MonthlyClosingResponse>('/api/v1/closings/calculate', {
      params: { year, month },
    });
    return data;
  },

  async close(payload: MonthlyClosingRequest): Promise<MonthlyClosingResponse> {
    const { data } = await apiClient.post<MonthlyClosingResponse>('/api/v1/closings/close', payload);
    return data;
  },

  async reopen(id: string, payload: MonthlyClosingReopenRequest): Promise<MonthlyClosingResponse> {
    const { data } = await apiClient.post<MonthlyClosingResponse>(`/api/v1/closings/${id}/reopen`, payload);
    return data;
  },
};

export default closingService;
