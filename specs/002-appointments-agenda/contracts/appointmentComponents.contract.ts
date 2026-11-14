import type { AppointmentResponse, AppointmentStatus } from 'src/types/appointment';

/**
 * Contrato de Props e Emits do componente AgendaHeader
 */
export interface AgendaHeaderProps {
  viewMode: 'day' | 'week';
  selectedEmployeeId: string | null;
  employeeOptions: Array<{ label: string; value: string | null }>;
}

export interface AgendaHeaderEmits {
  (e: 'update:viewMode', value: 'day' | 'week'): void;
  (e: 'update:selectedEmployeeId', value: string | null): void;
  (e: 'create'): void;
}

/**
 * Contrato de Props e Emits do componente AgendaDateNav
 */
export interface AgendaDateNavProps {
  selectedDateStr: string;
  currentDateDisplay: string;
}

export interface AgendaDateNavEmits {
  (e: 'navigate', delta: number): void;
  (e: 'selectDate', date: string): void;
  (e: 'today'): void;
}

/**
 * Contrato de Props e Emits da Grade Diária (AgendaDayGrid)
 */
export interface AgendaDayGridProps {
  hoursRange: number[];
  getAppointmentsForHour: (hour: number) => AppointmentResponse[];
}

export interface AgendaDayGridEmits {
  (e: 'slotClick', hour: number): void;
  (e: 'appointmentClick', appointment: AppointmentResponse): void;
}

/**
 * Contrato de Props e Emits da Grade Semanal (AgendaWeekGrid)
 */
export interface WeekDayItem {
  dateStr: string;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
}

export interface AgendaWeekGridProps {
  hoursRange: number[];
  weekDays: WeekDayItem[];
  getAppointmentsForDayAndHour: (dateStr: string, hour: number) => AppointmentResponse[];
}

export interface AgendaWeekGridEmits {
  (e: 'slotClick', payload: { dateStr: string; hour: number }): void;
  (e: 'appointmentClick', appointment: AppointmentResponse): void;
}

/**
 * Contrato de Props do Card de Agendamento (AppointmentCard)
 */
export interface AppointmentCardProps {
  appointment: AppointmentResponse;
  mini?: boolean;
}

/**
 * Contrato do Diálogo de Ação e Transição de Status (AppointmentActionDialog)
 */
export interface AppointmentActionDialogProps {
  modelValue: boolean;
  appointment: AppointmentResponse | null;
  loading?: boolean;
}

export interface AppointmentActionDialogEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'changeStatus', status: AppointmentStatus): void;
}

/**
 * Contrato do Diálogo de Criação de Agendamento (AppointmentCreateDialog)
 */
export interface AppointmentCreateDialogProps {
  modelValue: boolean;
  initialDate?: string;
  initialTime?: string;
  saving?: boolean;
}

export interface AppointmentCreateDialogEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created'): void;
}
