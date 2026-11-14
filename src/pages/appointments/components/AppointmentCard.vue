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

      <div class="text-caption text-grey-7 ellipsis q-mt-xs">
        {{ appointment.serviceName }} &bull;
        <span class="text-weight-medium">{{ appointment.employeeName }}</span>
      </div>

      <div class="row items-center justify-between text-caption text-grey-6 q-mt-xs">
        <span class="font-mono-time">{{ formattedTimeRange }}</span>
        <span v-if="!isBlocked" class="text-weight-bold text-primary text-currency">
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
      <div class="text-caption ellipsis text-grey-7">{{ appointment.serviceName }}</div>
      <div class="text-caption text-weight-bold text-primary font-mono-time">
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
  background-color: #ffffff;
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid #e4e4e7;
  border-left: 3px solid #71717a;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 44px;

  &:hover {
    transform: translateY(-1px);
    border-color: #d4d4d8;
  }

  &.status-agendado {
    border-left-color: #71717a;
  }
  &.status-confirmado {
    border-left-color: #09090b;
  }
  &.status-em_atendimento {
    border-left-color: #f59e0b;
  }
  &.status-concluido {
    border-left-color: #10b981;
  }
  &.status-cancelado {
    border-left-color: #e11d48;
    opacity: 0.75;
  }
  &.status-nao_compareceu {
    border-left-color: #6b7280;
    opacity: 0.8;
  }

  &.is-blocked {
    background: repeating-linear-gradient(45deg, #f4f4f5, #f4f4f5 10px, #e4e4e7 10px, #e4e4e7 20px);
    border-left-color: #27272a;
  }
}

body.body--dark .appointment-card {
  background-color: #121214;
  border-color: #27272a;

  &.status-confirmado {
    border-left-color: #f4f4f5;
  }

  &.is-blocked {
    background: repeating-linear-gradient(45deg, #18181b, #18181b 10px, #27272a 10px, #27272a 20px);
    border-left-color: #71717a;
  }
}

.appointment-mini-card {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 4px 8px;
  border: 1px solid #e4e4e7;
  border-left: 3px solid #71717a;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 4px;

  &:hover {
    transform: translateY(-1px);
    border-color: #d4d4d8;
  }

  &.status-agendado {
    border-left-color: #71717a;
  }
  &.status-confirmado {
    border-left-color: #09090b;
  }
  &.status-em_atendimento {
    border-left-color: #f59e0b;
  }
  &.status-concluido {
    border-left-color: #10b981;
  }
  &.status-cancelado {
    border-left-color: #e11d48;
    opacity: 0.75;
  }
  &.status-nao_compareceu {
    border-left-color: #6b7280;
    opacity: 0.8;
  }

  &.is-blocked {
    background: repeating-linear-gradient(45deg, #f4f4f5, #f4f4f5 10px, #e4e4e7 10px, #e4e4e7 20px);
    border-left-color: #27272a;
  }
}

body.body--dark .appointment-mini-card {
  background-color: #121214;
  border-color: #27272a;

  &.status-confirmado {
    border-left-color: #f4f4f5;
  }

  &.is-blocked {
    background: repeating-linear-gradient(45deg, #18181b, #18181b 10px, #27272a 10px, #27272a 20px);
    border-left-color: #71717a;
  }
}

.font-mono-time {
  font-variant-numeric: tabular-nums;
}
</style>
