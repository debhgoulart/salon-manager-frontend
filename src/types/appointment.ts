export type AppointmentStatus =
  | 'AGENDADO'
  | 'CONFIRMADO'
  | 'EM_ATENDIMENTO'
  | 'CONCLUIDO'
  | 'CANCELADO'
  | 'NAO_COMPARECEU';

export interface AppointmentCreateRequest {
  employeeId: string;
  clientId: string;
  serviceId: string;
  startTime: string; // ISO 8601 UTC ex: 2026-11-10T14:30:00Z
  notes?: string | undefined;
}

export interface AppointmentStatusUpdateRequest {
  status: AppointmentStatus;
}

export interface AppointmentResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  version: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimeSlot {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  available: boolean;
}
