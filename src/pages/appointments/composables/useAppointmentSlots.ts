import { ref, computed, type Ref, type ComputedRef } from 'vue';
import appointmentService from 'src/services/appointmentService';
import type { TimeSlot } from 'src/types/appointment';

export interface SlotOption {
  label: string;
  value: string;
  disable?: boolean;
}

export interface UseAppointmentSlotsReturn {
  slots: Ref<TimeSlot[]>;
  loadingSlots: Ref<boolean>;
  availableSlotOptions: ComputedRef<SlotOption[]>;
  fetchAvailableSlots: (params: {
    employeeId: string;
    date: string;
    serviceId: string;
  }) => Promise<void>;
  resetSlots: () => void;
}

export function useAppointmentSlots(): UseAppointmentSlotsReturn {
  const slots = ref<TimeSlot[]>([]);
  const loadingSlots = ref<boolean>(false);

  const availableSlotOptions = computed<SlotOption[]>(() => {
    if (slots.value.length === 0) {
      // Default: slots a cada 30 minutos das 08:00 às 20:00 se ainda não buscou
      const fallback: SlotOption[] = [];
      for (let h = 8; h <= 20; h++) {
        const hStr = h.toString().padStart(2, '0');
        fallback.push({ label: `${hStr}:00`, value: `${hStr}:00` });
        if (h < 20) {
          fallback.push({ label: `${hStr}:30`, value: `${hStr}:30` });
        }
      }
      return fallback;
    }

    return slots.value.map((s) => ({
      label: `${s.startTime} - ${s.endTime} ${s.available ? '(Disponível)' : '(Ocupado)'}`,
      value: s.startTime,
      disable: !s.available,
    }));
  });

  async function fetchAvailableSlots(params: {
    employeeId: string;
    date: string;
    serviceId: string;
  }): Promise<void> {
    if (!params.employeeId || !params.date || !params.serviceId) {
      slots.value = [];
      return;
    }

    loadingSlots.value = true;
    try {
      const res = await appointmentService.getAvailableSlots(
        params.employeeId,
        params.date,
        params.serviceId,
      );
      slots.value = res;
    } catch {
      slots.value = [];
    } finally {
      loadingSlots.value = false;
    }
  }

  function resetSlots() {
    slots.value = [];
    loadingSlots.value = false;
  }

  return {
    slots,
    loadingSlots,
    availableSlotOptions,
    fetchAvailableSlots,
    resetSlots,
  };
}
