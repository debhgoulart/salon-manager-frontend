<template>
  <div class="day-view-container">
    <q-card flat class="schedule-grid-card">
      <div class="time-grid">
        <div v-for="hour in hoursRange" :key="hour" class="time-row">
          <div class="time-label">{{ hour }}:00</div>
          <div class="time-slot-area" @click="$emit('slotClick', hour)">
            <!-- Cards de agendamento que caem nessa hora -->
            <div
              v-for="app in getAppointmentsForHour(hour)"
              :key="app.id"
              class="appointment-card-wrapper"
              @click.stop="$emit('appointmentClick', app)"
            >
              <AppointmentCard :appointment="app" />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import type { AppointmentResponse } from 'src/types/appointment';
import AppointmentCard from './AppointmentCard.vue';

interface Props {
  hoursRange: number[];
  getAppointmentsForHour: (hour: number) => AppointmentResponse[];
}

defineProps<Props>();

defineEmits<{
  (e: 'slotClick', hour: number): void;
  (e: 'appointmentClick', appointment: AppointmentResponse): void;
}>();
</script>

<style scoped lang="scss">
.schedule-grid-card {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e4e4e7;
}

body.body--dark .schedule-grid-card {
  background-color: #121214;
  border-color: #27272a;
}

.time-grid {
  display: flex;
  flex-direction: column;
}

.time-row {
  display: flex;
  min-height: 80px;
  border-bottom: 1px solid #f4f4f5;

  &:last-child {
    border-bottom: none;
  }
}

body.body--dark .time-row {
  border-bottom-color: #18181b;
}

.time-label {
  width: 70px;
  min-width: 70px;
  padding: 12px 8px;
  text-align: right;
  font-size: 0.78rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #71717a;
  border-right: 1px solid #f4f4f5;
  background-color: #fafafa;
}

body.body--dark .time-label {
  color: #a1a1aa;
  border-right-color: #18181b;
  background-color: #18181b;
}

.time-slot-area {
  flex: 1;
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(9, 9, 11, 0.02);
  }
}

body.body--dark .time-slot-area:hover {
  background-color: rgba(244, 244, 245, 0.02);
}

.appointment-card-wrapper {
  width: 100%;
}
</style>
