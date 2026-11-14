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
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.time-grid {
  display: flex;
  flex-direction: column;
}

.time-row {
  display: flex;
  min-height: 80px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.time-label {
  width: 70px;
  min-width: 70px;
  padding: 12px 8px;
  text-align: right;
  font-size: 0.8rem;
  font-weight: 600;
  color: #757575;
  border-right: 1px solid #f0f0f0;
  background-color: #fafafa;
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
    background-color: #fbfbfb;
  }
}

.appointment-card-wrapper {
  width: 100%;
}
</style>
