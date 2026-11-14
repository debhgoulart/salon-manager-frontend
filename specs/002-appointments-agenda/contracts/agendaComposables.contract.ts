import type { Ref, ComputedRef } from 'vue';
import type {
  AppointmentResponse,
  AppointmentCreateRequest,
  AppointmentStatus,
  TimeSlot,
} from 'src/types/appointment';
import type { WeekDayItem } from './appointmentComponents.contract';

/**
 * Contrato do Composable de Navegação de Datas e Modos da Agenda
 */
export interface UseAgendaNavigationReturn {
  viewMode: Ref<'day' | 'week'>;
  selectedDateStr: Ref<string>;
  datePopup: Ref<boolean>;
  currentDateDisplay: ComputedRef<string>;
  weekDays: ComputedRef<WeekDayItem[]>;
  hoursRange: number[];
  navigateDate: (delta: number) => void;
  goToToday: () => void;
  setDate: (dateStr: string) => void;
}

/**
 * Contrato do Composable de Consulta Reativa de Slots Disponíveis
 */
export interface UseAppointmentSlotsReturn {
  slots: Ref<TimeSlot[]>;
  loadingSlots: Ref<boolean>;
  availableSlotOptions: ComputedRef<Array<{ label: string; value: string; disable?: boolean }>>;
  fetchAvailableSlots: (params: {
    employeeId: string;
    date: string;
    serviceId: string;
  }) => Promise<void>;
  resetSlots: () => void;
}

/**
 * Contrato do Composable de Gerenciamento de Estado dos Agendamentos
 */
export interface UseAppointmentStateReturn {
  appointments: Ref<AppointmentResponse[]>;
  loading: Ref<boolean>;
  loadError: Ref<boolean>;
  selectedEmployeeId: Ref<string | null>;
  loadAppointments: (date?: string, employeeId?: string | null) => Promise<void>;
  getAppointmentsForHour: (hour: number) => AppointmentResponse[];
  getAppointmentsForDayAndHour: (dateStr: string, hour: number) => AppointmentResponse[];
  changeAppointmentStatus: (id: string, newStatus: AppointmentStatus) => Promise<boolean>;
  createAppointment: (payload: AppointmentCreateRequest) => Promise<AppointmentResponse | null>;
}
