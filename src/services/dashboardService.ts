import apiClient from './api';
import type {
  DashboardOverviewResponse,
  TopServiceResponse,
  TopEmployeeResponse,
  UpcomingAppointmentResponse,
} from 'src/types/dashboard';

export const dashboardService = {
  async getOverview(startDate?: string, endDate?: string): Promise<DashboardOverviewResponse> {
    const { data } = await apiClient.get<DashboardOverviewResponse>('/api/v1/dashboard/overview', {
      params: { startDate, endDate },
    });
    return data;
  },

  async getTopServices(
    startDate?: string,
    endDate?: string,
    limit = 5,
  ): Promise<TopServiceResponse[]> {
    const { data } = await apiClient.get<TopServiceResponse[]>('/api/v1/dashboard/top-services', {
      params: { startDate, endDate, limit },
    });
    return data;
  },

  async getTopEmployees(
    startDate?: string,
    endDate?: string,
    limit = 5,
  ): Promise<TopEmployeeResponse[]> {
    const { data } = await apiClient.get<TopEmployeeResponse[]>('/api/v1/dashboard/top-employees', {
      params: { startDate, endDate, limit },
    });
    return data;
  },

  async getUpcomingAppointments(limit = 5): Promise<UpcomingAppointmentResponse[]> {
    const { data } = await apiClient.get<UpcomingAppointmentResponse[]>(
      '/api/v1/dashboard/upcoming-appointments',
      {
        params: { limit },
      },
    );
    return data;
  },
};

export default dashboardService;
