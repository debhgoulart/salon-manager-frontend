import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppointmentSlots } from 'src/pages/appointments/composables/useAppointmentSlots';
import appointmentService from 'src/services/appointmentService';

vi.mock('src/services/appointmentService', () => ({
  default: {
    getAvailableSlots: vi.fn(),
  },
}));

describe('useAppointmentSlots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna opções padrão a cada 30 minutos quando nenhum slot foi buscado', () => {
    const { availableSlotOptions, slots } = useAppointmentSlots();
    expect(slots.value).toEqual([]);
    expect(availableSlotOptions.value.length).toBeGreaterThan(10);
    expect(availableSlotOptions.value[0]?.value).toBe('08:00');
  });

  it('busca slots disponíveis e mapeia opções desabilitando slots ocupados', async () => {
    const mockSlots = [
      { startTime: '10:00', endTime: '10:45', available: true },
      { startTime: '11:00', endTime: '11:45', available: false },
    ];
    vi.mocked(appointmentService.getAvailableSlots).mockResolvedValueOnce(mockSlots);

    const { slots, availableSlotOptions, fetchAvailableSlots, loadingSlots } =
      useAppointmentSlots();

    expect(loadingSlots.value).toBe(false);
    await fetchAvailableSlots({
      employeeId: 'emp-1',
      date: '2026-11-15',
      serviceId: 'srv-1',
    });

    expect(appointmentService.getAvailableSlots).toHaveBeenCalledWith(
      'emp-1',
      '2026-11-15',
      'srv-1',
    );
    expect(slots.value).toEqual(mockSlots);
    expect(availableSlotOptions.value).toHaveLength(2);
    expect(availableSlotOptions.value[0]?.disable).toBe(false);
    expect(availableSlotOptions.value[1]?.disable).toBe(true);
  });

  it('limpa slots quando chamado resetSlots', async () => {
    const { slots, resetSlots } = useAppointmentSlots();
    slots.value = [{ startTime: '14:00', endTime: '15:00', available: true }];

    resetSlots();
    expect(slots.value).toEqual([]);
  });
});
