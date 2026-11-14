import apiClient from './api';
import type {
  AppointmentResponse,
  AppointmentCreateRequest,
  AppointmentStatusUpdateRequest,
  AppointmentStatus,
  TimeSlot,
} from 'src/types/appointment';

export const appointmentService = {
  async list(params?: {
    employeeId?: string | undefined;
    date?: string | undefined; // YYYY-MM-DD
    status?: AppointmentStatus | undefined;
  }): Promise<AppointmentResponse[]> {
    const { data } = await apiClient.get<AppointmentResponse[]>('/api/v1/appointments', {
      params: {
        employeeId: params?.employeeId || undefined,
        date: params?.date || undefined,
        status: params?.status || undefined,
      },
    });
    return data;
  },

  async getById(id: string): Promise<AppointmentResponse> {
    const { data } = await apiClient.get<AppointmentResponse>(`/api/v1/appointments/${id}`);
    return data;
  },

  async create(payload: AppointmentCreateRequest): Promise<AppointmentResponse> {
    const { data } = await apiClient.post<AppointmentResponse>('/api/v1/appointments', payload);
    return data;
  },

  async updateStatus(
    id: string,
    payload: AppointmentStatusUpdateRequest,
  ): Promise<AppointmentResponse> {
    const { data } = await apiClient.patch<AppointmentResponse>(
      `/api/v1/appointments/${id}/status`,
      payload,
    );
    return data;
  },

  async cancel(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/appointments/${id}`);
  },

  async getAvailableSlots(
    employeeId: string,
    date: string,
    serviceId: string,
  ): Promise<TimeSlot[]> {
    const { data } = await apiClient.get<TimeSlot[]>('/api/v1/appointments/available-slots', {
      params: { employeeId, date, serviceId },
    });
    return data;
  },
};

export default appointmentService;
