import { ref, computed, type Ref, type ComputedRef } from 'vue';

export interface WeekDayItem {
  dateStr: string;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
}

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

export function formatDateToIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useAgendaNavigation(initialDate: Date = new Date()): UseAgendaNavigationReturn {
  const viewMode = ref<'day' | 'week'>('day');
  const selectedDate = ref<Date>(new Date(initialDate));
  const selectedDateStr = ref<string>(formatDateToIso(initialDate));
  const datePopup = ref<boolean>(false);

  const hoursRange = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const currentDateDisplay = computed(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return selectedDate.value.toLocaleDateString('pt-BR', options);
  });

  const weekDays = computed<WeekDayItem[]>(() => {
    const curr = new Date(selectedDate.value);
    // Ajusta para a segunda-feira da semana
    const dayOfWeek = curr.getDay(); // 0 = Domingo, 1 = Segunda, ...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(curr);
    monday.setDate(curr.getDate() + diffToMonday);

    const days: WeekDayItem[] = [];
    const todayStr = formatDateToIso(new Date());

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      const dStr = formatDateToIso(nextDate);
      days.push({
        dateStr: dStr,
        dayNumber: String(nextDate.getDate()).padStart(2, '0'),
        dayName: nextDate
          .toLocaleDateString('pt-BR', { weekday: 'short' })
          .replace('.', '')
          .toUpperCase(),
        isToday: dStr === todayStr,
      });
    }
    return days;
  });

  function navigateDate(delta: number) {
    const d = new Date(selectedDate.value);
    if (viewMode.value === 'day') {
      d.setDate(d.getDate() + delta);
    } else {
      d.setDate(d.getDate() + delta * 7);
    }
    selectedDate.value = d;
    selectedDateStr.value = formatDateToIso(d);
  }

  function goToToday() {
    const today = new Date();
    selectedDate.value = today;
    selectedDateStr.value = formatDateToIso(today);
  }

  function setDate(dateStr: string) {
    if (!dateStr) return;
    const [y, m, d] = dateStr.split('-').map(Number);
    if (y && m && d) {
      const newD = new Date(y, m - 1, d);
      selectedDate.value = newD;
      selectedDateStr.value = dateStr;
    }
  }

  return {
    viewMode,
    selectedDateStr,
    datePopup,
    currentDateDisplay,
    weekDays,
    hoursRange,
    navigateDate,
    goToToday,
    setDate,
  };
}
