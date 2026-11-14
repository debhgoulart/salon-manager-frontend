import apiClient from './api';
import type { ClientRequest, ClientResponse } from 'src/types/client';
import type { AppointmentResponse } from 'src/types/appointment';
import type { PageResponse } from 'src/types/api';

export const clientService = {
  async list(params?: {
    query?: string | undefined;
    page?: number | undefined;
    size?: number | undefined;
  }): Promise<PageResponse<ClientResponse>> {
    const { data } = await apiClient.get<PageResponse<ClientResponse>>('/api/v1/clients', {
      params: {
        query: params?.query || undefined,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return data;
  },

  async getById(id: string): Promise<ClientResponse> {
    const { data } = await apiClient.get<ClientResponse>(`/api/v1/clients/${id}`);
    return data;
  },

  async create(payload: ClientRequest): Promise<ClientResponse> {
    const { data } = await apiClient.post<ClientResponse>('/api/v1/clients', payload);
    return data;
  },

  async update(id: string, payload: ClientRequest): Promise<ClientResponse> {
    const { data } = await apiClient.put<ClientResponse>(`/api/v1/clients/${id}`, payload);
    return data;
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/clients/${id}`);
  },

  async activate(id: string): Promise<ClientResponse> {
    const { data } = await apiClient.patch<ClientResponse>(`/api/v1/clients/${id}/activate`);
    return data;
  },

  async getAppointments(
    clientId: string,
    page = 0,
    size = 10,
  ): Promise<PageResponse<AppointmentResponse>> {
    const { data } = await apiClient.get<PageResponse<AppointmentResponse>>(
      `/api/v1/clients/${clientId}/appointments`,
      {
        params: { page, size },
      },
    );
    return data;
  },
};

export default clientService;
