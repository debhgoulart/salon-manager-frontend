<template>
  <div class="week-view-container">
    <q-card flat class="schedule-grid-card">
      <!-- Cabeçalho dos 7 Dias da Semana -->
      <div class="week-header-row">
        <div class="week-time-gutter"></div>
        <div
          v-for="day in weekDays"
          :key="day.dateStr"
          class="week-day-col-header"
          :class="{ 'is-today': day.isToday }"
        >
          <div class="text-caption text-weight-medium">{{ day.dayName }}</div>
          <div class="text-subtitle1 text-weight-bold">{{ day.dayNumber }}</div>
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
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  min-width: 760px;
}

.week-header-row {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  background-color: #fafafa;
}

.week-time-gutter {
  width: 65px;
  min-width: 65px;
}

.week-day-col-header {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  border-left: 1px solid #f0f0f0;

  &.is-today {
    background-color: #f7f2f5;
    color: #7b3f61;
    font-weight: bold;
    border-top: 3px solid #7b3f61;
  }
}

.week-body {
  display: flex;
  flex-direction: column;
}

.week-time-row {
  display: flex;
  min-height: 70px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.week-time-label {
  width: 65px;
  min-width: 65px;
  padding: 8px 4px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 600;
  color: #757575;
  border-right: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.week-day-slot {
  flex: 1;
  border-left: 1px solid #f0f0f0;
  padding: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #fbfbfb;
  }
}

.appointment-mini-card-wrapper {
  width: 100%;
}
</style>
