import { describe, it, expect } from 'vitest';
import {
  useAgendaNavigation,
  formatDateToIso,
} from 'src/pages/appointments/composables/useAgendaNavigation';

describe('useAgendaNavigation', () => {
  it('inicializa com o modo dia e a data informada', () => {
    const fixedDate = new Date(2026, 10, 15); // 15 de Novembro de 2026
    const { viewMode, selectedDateStr, hoursRange } = useAgendaNavigation(fixedDate);

    expect(viewMode.value).toBe('day');
    expect(selectedDateStr.value).toBe('2026-11-15');
    expect(hoursRange).toEqual([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('avança e retrocede 1 dia no modo dia', () => {
    const base = new Date(2026, 10, 15);
    const nav = useAgendaNavigation(base);

    nav.navigateDate(1);
    expect(nav.selectedDateStr.value).toBe('2026-11-16');

    nav.navigateDate(-2);
    expect(nav.selectedDateStr.value).toBe('2026-11-14');
  });

  it('avança 7 dias quando o modo for semanal', () => {
    const base = new Date(2026, 10, 15);
    const nav = useAgendaNavigation(base);

    nav.viewMode.value = 'week';
    nav.navigateDate(1);
    expect(nav.selectedDateStr.value).toBe('2026-11-22');

    nav.navigateDate(-1);
    expect(nav.selectedDateStr.value).toBe('2026-11-15');
  });

  it('retorna para hoje através de goToToday', () => {
    const base = new Date(2020, 0, 1);
    const nav = useAgendaNavigation(base);

    nav.goToToday();
    const todayIso = formatDateToIso(new Date());
    expect(nav.selectedDateStr.value).toBe(todayIso);
  });

  it('permite definir data diretamente via setDate', () => {
    const nav = useAgendaNavigation();
    nav.setDate('2026-12-31');
    expect(nav.selectedDateStr.value).toBe('2026-12-31');
  });

  it('calcula os 7 dias da semana com cabeçalhos apropriados', () => {
    const wednesday = new Date(2026, 10, 18); // Quarta-feira, 18 Nov 2026
    const nav = useAgendaNavigation(wednesday);

    expect(nav.weekDays.value).toHaveLength(7);
    // Segunda-feira deve ser 16 Nov
    expect(nav.weekDays.value[0]?.dateStr).toBe('2026-11-16');
    // Domingo deve ser 22 Nov
    expect(nav.weekDays.value[6]?.dateStr).toBe('2026-11-22');
  });
});
