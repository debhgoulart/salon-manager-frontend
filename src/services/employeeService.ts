import apiClient from './api';
import type { EmployeeRequest, EmployeeResponse } from 'src/types/employee';
import type { PageResponse } from 'src/types/api';

export const employeeService = {
  async list(params?: { active?: boolean | undefined; page?: number | undefined; size?: number | undefined }): Promise<PageResponse<EmployeeResponse>> {
    const { data } = await apiClient.get<PageResponse<EmployeeResponse>>('/api/v1/employees', {
      params: {
        active: params?.active,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return data;
  },

  async getById(id: string): Promise<EmployeeResponse> {
    const { data } = await apiClient.get<EmployeeResponse>(`/api/v1/employees/${id}`);
    return data;
  },

  async create(payload: EmployeeRequest): Promise<EmployeeResponse> {
    const { data } = await apiClient.post<EmployeeResponse>('/api/v1/employees', payload);
    return data;
  },

  async update(id: string, payload: EmployeeRequest): Promise<EmployeeResponse> {
    const { data } = await apiClient.put<EmployeeResponse>(`/api/v1/employees/${id}`, payload);
    return data;
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/employees/${id}`);
  },

  async activate(id: string): Promise<EmployeeResponse> {
    const { data } = await apiClient.patch<EmployeeResponse>(`/api/v1/employees/${id}/activate`);
    return data;
  },
};

export default employeeService;
