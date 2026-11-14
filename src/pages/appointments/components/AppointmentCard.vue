<template>
  <div
    class="appointment-card-root"
    :class="[
      mini ? 'appointment-mini-card' : 'appointment-card',
      `status-${appointment.status.toLowerCase()}`,
      { 'is-blocked': isBlocked },
    ]"
    @click="$emit('click', appointment)"
  >
    <!-- Visualização Padrão (Grade Diária) -->
    <template v-if="!mini">
      <div class="row items-center justify-between no-wrap">
        <div class="text-weight-bold text-body2 ellipsis">
          <Lock v-if="isBlocked" :size="14" class="q-mr-xs text-grey-7" />
          {{ appointment.clientName }}
        </div>
        <AppStatusBadge :status="appointment.status" />
      </div>

      <div class="text-caption text-grey-8 ellipsis q-mt-xs">
        {{ appointment.serviceName }} •
        <span class="text-weight-medium">{{ appointment.employeeName }}</span>
      </div>

      <div class="row items-center justify-between text-caption text-grey-7 q-mt-xs">
        <span>{{ formattedTimeRange }}</span>
        <span v-if="!isBlocked" class="text-weight-bold text-primary">
          {{ formatCurrency(appointment.price) }}
        </span>
      </div>
    </template>

    <!-- Visualização Compacta (Grade Semanal) -->
    <template v-else>
      <div class="text-weight-bold text-caption ellipsis">
        <Lock v-if="isBlocked" :size="12" class="q-mr-xs text-grey-7" />
        {{ appointment.clientName }}
      </div>
      <div class="text-caption ellipsis text-grey-8">{{ appointment.serviceName }}</div>
      <div class="text-caption text-weight-bold text-primary">
        {{ formattedTimeRange }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AppointmentResponse } from 'src/types/appointment';
import { useFormatters } from 'src/composables/useFormatters';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
import { Lock } from 'lucide-vue-next';

interface Props {
  appointment: AppointmentResponse;
  mini?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mini: false,
});

defineEmits<{
  (e: 'click', appointment: AppointmentResponse): void;
}>();

const { formatCurrency } = useFormatters();

const isBlocked = computed(() => {
  return (
    props.appointment.notes?.toUpperCase().includes('BLOQUEIO') ||
    props.appointment.serviceName?.toUpperCase().includes('BLOQUEIO')
  );
});

const formattedTimeRange = computed(() => {
  if (!props.appointment.startTime) return '-';
  try {
    const s = new Date(props.appointment.startTime);
    const sStr = `${s.getHours().toString().padStart(2, '0')}:${s.getMinutes().toString().padStart(2, '0')}`;
    if (!props.appointment.endTime) return sStr;
    const e = new Date(props.appointment.endTime);
    const eStr = `${e.getHours().toString().padStart(2, '0')}:${e.getMinutes().toString().padStart(2, '0')}`;
    return `${sStr} - ${eStr}`;
  } catch {
    return props.appointment.startTime;
  }
});
</script>

<style scoped lang="scss">
.appointment-card {
  background: white;
  border-radius: 8px;
  padding: 8px 12px;
  border-left: 4px solid #9e9e9e;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }

  &.status-agendado {
    border-left-color: #2196f3;
  }
  &.status-confirmado {
    border-left-color: #7b3f61;
  }
  &.status-em_atendimento {
    border-left-color: #f57c00;
  }
  &.status-concluido {
    border-left-color: #4caf50;
  }
  &.status-cancelado {
    border-left-color: #f44336;
    opacity: 0.75;
  }
  &.status-nao_compareceu {
    border-left-color: #673ab7;
    opacity: 0.8;
  }

  &.is-blocked {
    background: repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 10px, #ebebeb 10px, #ebebeb 20px);
    border-left-color: #757575;
  }
}

.appointment-mini-card {
  background: white;
  border-radius: 6px;
  padding: 4px 8px;
  border-left: 3px solid #9e9e9e;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.status-agendado {
    border-left-color: #2196f3;
  }
  &.status-confirmado {
    border-left-color: #7b3f61;
  }
  &.status-em_atendimento {
    border-left-color: #f57c00;
  }
  &.status-concluido {
    border-left-color: #4caf50;
  }
  &.status-cancelado {
    border-left-color: #f44336;
    opacity: 0.75;
  }
  &.status-nao_compareceu {
    border-left-color: #673ab7;
    opacity: 0.8;
  }

  &.is-blocked {
    background: repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 10px, #ebebeb 10px, #ebebeb 20px);
    border-left-color: #757575;
  }
}
</style>
