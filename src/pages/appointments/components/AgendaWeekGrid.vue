<template>
  <div class="week-view-container">
    <q-card flat class="schedule-grid-card">
      <!-- Cabeçalho dos 7 Dias da Semana -->
      <div class="week-header-row">
        <div class="week-time-gutter" />
        <div
          v-for="day in weekDays"
          :key="day.dateStr"
          class="week-day-col-header"
          :class="{ 'is-today': day.isToday }"
        >
          <div class="text-caption text-weight-medium font-caption-tight">{{ day.dayName }}</div>
          <div class="text-subtitle1 text-weight-bold font-mono-day">{{ day.dayNumber }}</div>
        </div>
      </div>

      <!-- Corpo da Grade Semanal -->
      <div class="week-body">
        <div v-for="hour in hoursRange" :key="hour" class="week-time-row">
          <div class="week-time-label">{{ hour }}:00</div>
          <div
            v-for="day in weekDays"
            :key="day.dateStr"
            class="week-day-slot"
            @click="$emit('slotClick', { dateStr: day.dateStr, hour })"
          >
            <div
              v-for="app in getAppointmentsForDayAndHour(day.dateStr, hour)"
              :key="app.id"
              class="appointment-mini-card-wrapper"
              @click.stop="$emit('appointmentClick', app)"
            >
              <AppointmentCard :appointment="app" mini />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import type { AppointmentResponse } from 'src/types/appointment';
import type { WeekDayItem } from '../composables/useAgendaNavigation';
import AppointmentCard from './AppointmentCard.vue';

interface Props {
  hoursRange: number[];
  weekDays: WeekDayItem[];
  getAppointmentsForDayAndHour: (dateStr: string, hour: number) => AppointmentResponse[];
}

defineProps<Props>();

defineEmits<{
  (e: 'slotClick', payload: { dateStr: string; hour: number }): void;
  (e: 'appointmentClick', appointment: AppointmentResponse): void;
}>();
</script>

<style scoped lang="scss">
.week-view-container {
  overflow-x: auto;
}

.schedule-grid-card {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e4e4e7;
  min-width: 760px;
}

body.body--dark .schedule-grid-card {
  background-color: #121214;
  border-color: #27272a;
}

.week-header-row {
  display: flex;
  border-bottom: 2px solid #e4e4e7;
  background-color: #fafafa;
}

body.body--dark .week-header-row {
  border-bottom-color: #27272a;
  background-color: #18181b;
}

.week-time-gutter {
  width: 65px;
  min-width: 65px;
}

.week-day-col-header {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  border-left: 1px solid #e4e4e7;

  &.is-today {
    background-color: rgba(225, 29, 72, 0.05);
    color: #09090b;
    font-weight: bold;
    border-top: 3px solid #e11d48;
  }
}

body.body--dark .week-day-col-header {
  border-left-color: #27272a;

  &.is-today {
    background-color: rgba(225, 29, 72, 0.1);
    color: #f4f4f5;
  }
}

.font-caption-tight {
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.font-mono-day {
  font-variant-numeric: tabular-nums;
}

.week-body {
  display: flex;
  flex-direction: column;
}

.week-time-row {
  display: flex;
  min-height: 80px;
  border-bottom: 1px solid #f4f4f5;

  &:last-child {
    border-bottom: none;
  }
}

body.body--dark .week-time-row {
  border-bottom-color: #18181b;
}

.week-time-label {
  width: 65px;
  min-width: 65px;
  padding: 8px 4px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #71717a;
  border-right: 1px solid #e4e4e7;
  background-color: #fafafa;
}

body.body--dark .week-time-label {
  color: #a1a1aa;
  border-right-color: #27272a;
  background-color: #18181b;
}

.week-day-slot {
  flex: 1;
  border-left: 1px solid #f4f4f5;
  padding: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(9, 9, 11, 0.02);
  }
}

body.body--dark .week-day-slot {
  border-left-color: #18181b;

  &:hover {
    background-color: rgba(244, 244, 245, 0.02);
  }
}

.appointment-mini-card-wrapper {
  width: 100%;
}
</style>
