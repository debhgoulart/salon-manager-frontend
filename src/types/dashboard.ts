import type { AppointmentStatus } from './appointment';

export interface DashboardOverviewResponse {
  totalRevenue: number;
  totalExpenses: number;
  totalCommissions: number;
  netProfit: number;
  completedAppointmentsCount: number;
  canceledAppointmentsCount: number;
  activeClientsCount: number;
  activeEmployeesCount: number;
}

export interface TopServiceResponse {
  serviceId: string;
  serviceName: string;
  executionCount: number;
  totalRevenue: number;
}

export interface TopEmployeeResponse {
  employeeId: string;
  employeeName: string;
  executionCount: number;
  totalBilled: number;
  totalCommission: number;
}

export interface UpcomingAppointmentResponse {
  appointmentId: string;
  clientName: string;
  employeeName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}
