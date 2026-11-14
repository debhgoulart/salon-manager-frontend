import { ref, type Ref } from 'vue';
import appointmentService from 'src/services/appointmentService';
import type {
  AppointmentResponse,
  AppointmentCreateRequest,
  AppointmentStatus,
} from 'src/types/appointment';
import { useFeedback } from 'src/composables/useFeedback';
import { formatDateToIso } from './useAgendaNavigation';

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

export function useAppointmentState(): UseAppointmentStateReturn {
  const appointments = ref<AppointmentResponse[]>([]);
  const loading = ref<boolean>(false);
  const loadError = ref<boolean>(false);
  const selectedEmployeeId = ref<string | null>(null);

  const { notifySuccess, handleApiError } = useFeedback();

  async function loadAppointments(date?: string, employeeId?: string | null): Promise<void> {
    loading.value = true;
    loadError.value = false;
    try {
      const activeEmployeeId = employeeId !== undefined ? employeeId : selectedEmployeeId.value;
      const list = await appointmentService.list({
        date: date || undefined,
        employeeId: activeEmployeeId || undefined,
      });
      appointments.value = list;
    } catch (err) {
      loadError.value = true;
      handleApiError(err, 'Falha ao carregar horários da agenda.');
    } finally {
      loading.value = false;
    }
  }

  function getAppointmentsForHour(hour: number): AppointmentResponse[] {
    return appointments.value.filter((app) => {
      try {
        const appDate = new Date(app.startTime);
        return appDate.getHours() === hour;
      } catch {
        return false;
      }
    });
  }

  function getAppointmentsForDayAndHour(dateStr: string, hour: number): AppointmentResponse[] {
    return appointments.value.filter((app) => {
      try {
        const d = new Date(app.startTime);
        return formatDateToIso(d) === dateStr && d.getHours() === hour;
      } catch {
        return false;
      }
    });
  }

  async function changeAppointmentStatus(
    id: string,
    newStatus: AppointmentStatus,
  ): Promise<boolean> {
    try {
      const updated = await appointmentService.updateStatus(id, { status: newStatus });
      const idx = appointments.value.findIndex((a) => a.id === id);
      if (idx !== -1) {
        appointments.value[idx] = updated;
      }
      notifySuccess(`Status do agendamento alterado para ${newStatus}.`);
      return true;
    } catch (err) {
      handleApiError(err, 'Falha ao alterar status do atendimento.');
      return false;
    }
  }

  async function createAppointment(
    payload: AppointmentCreateRequest,
  ): Promise<AppointmentResponse | null> {
    try {
      const created = await appointmentService.create(payload);
      appointments.value.push(created);
      notifySuccess('Agendamento realizado com sucesso!');
      return created;
    } catch (err) {
      handleApiError(err, 'Falha ao realizar agendamento. Pode haver choque de horários.');
      return null;
    }
  }

  return {
    appointments,
    loading,
    loadError,
    selectedEmployeeId,
    loadAppointments,
    getAppointmentsForHour,
    getAppointmentsForDayAndHour,
    changeAppointmentStatus,
    createAppointment,
  };
}
