import apiClient from './api';
import type { ServiceRequest, ServiceResponse } from 'src/types/service';
import type { PageResponse } from 'src/types/api';

export const serviceService = {
  async list(params?: { active?: boolean | undefined; page?: number | undefined; size?: number | undefined }): Promise<PageResponse<ServiceResponse>> {
    const { data } = await apiClient.get<PageResponse<ServiceResponse>>('/api/v1/services', {
      params: {
        active: params?.active,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return data;
  },

  async getById(id: string): Promise<ServiceResponse> {
    const { data } = await apiClient.get<ServiceResponse>(`/api/v1/services/${id}`);
    return data;
  },

  async create(payload: ServiceRequest): Promise<ServiceResponse> {
    const { data } = await apiClient.post<ServiceResponse>('/api/v1/services', payload);
    return data;
  },

  async update(id: string, payload: ServiceRequest): Promise<ServiceResponse> {
    const { data } = await apiClient.put<ServiceResponse>(`/api/v1/services/${id}`, payload);
    return data;
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/services/${id}`);
  },

  async activate(id: string): Promise<ServiceResponse> {
    const { data } = await apiClient.patch<ServiceResponse>(`/api/v1/services/${id}/activate`);
    return data;
  },
};

export default serviceService;
