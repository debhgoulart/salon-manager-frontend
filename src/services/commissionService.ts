import apiClient from './api';
import type { CommissionResponse, CommissionSummaryResponse, CommissionStatus } from 'src/types/commission';
import type { PageResponse } from 'src/types/api';

export const commissionService = {
  async list(params?: {
    employeeId?: string | undefined;
    status?: CommissionStatus | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    page?: number | undefined;
    size?: number | undefined;
  }): Promise<PageResponse<CommissionResponse>> {
    const { data } = await apiClient.get<PageResponse<CommissionResponse>>('/api/v1/commissions', {
      params: {
        employeeId: params?.employeeId,
        status: params?.status,
        startDate: params?.startDate,
        endDate: params?.endDate,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return data;
  },

  async getSummary(startDate?: string, endDate?: string): Promise<CommissionSummaryResponse> {
    const { data } = await apiClient.get<CommissionSummaryResponse>('/api/v1/commissions/summary', {
      params: { startDate, endDate },
    });
    return data;
  },
};

export default commissionService;
