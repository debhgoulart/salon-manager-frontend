<template>
  <q-card flat class="q-pa-sm q-mb-md date-nav-card">
    <div class="row items-center justify-between">
      <div class="row items-center q-gutter-x-sm">
        <q-btn
          flat
          round
          dense
          size="sm"
          aria-label="Período Anterior"
          @click="$emit('navigate', -1)"
        >
          <ChevronLeft :size="18" />
          <q-tooltip>Período Anterior</q-tooltip>
        </q-btn>

        <q-btn
          flat
          no-caps
          dense
          class="text-weight-bold text-subtitle1 q-px-sm"
          @click="datePopup = true"
        >
          <Calendar :size="16" class="q-mr-xs text-primary" />
          {{ currentDateDisplay }}
          <q-popup-proxy v-model="datePopup" transition-show="scale" transition-hide="scale">
            <q-date
              :model-value="selectedDateStr"
              mask="YYYY-MM-DD"
              @update:model-value="onDateSelect"
            />
          </q-popup-proxy>
        </q-btn>

        <q-btn
          flat
          round
          dense
          size="sm"
          aria-label="Próximo Período"
          @click="$emit('navigate', 1)"
        >
          <ChevronRight :size="18" />
          <q-tooltip>Próximo Período</q-tooltip>
        </q-btn>

        <q-btn flat dense no-caps size="sm" color="primary" class="q-ml-sm" @click="$emit('today')">
          Hoje
        </q-btn>
      </div>

      <!-- Legenda rápida de status -->
      <div class="row items-center q-gutter-x-sm gt-xs text-caption">
        <span class="flex items-center">
          <span class="legend-dot status-agendado-dot q-mr-xs" />Agendado
        </span>
        <span class="flex items-center">
          <span class="legend-dot status-confirmado-dot q-mr-xs" />Confirmado
        </span>
        <span class="flex items-center">
          <span class="legend-dot status-em-atendimento-dot q-mr-xs" />Em Atendimento
        </span>
        <span class="flex items-center">
          <span class="legend-dot status-concluido-dot q-mr-xs" />Concluído
        </span>
        <span class="flex items-center">
          <span class="legend-dot status-cancelado-dot q-mr-xs" />Cancelado
        </span>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next';

interface Props {
  selectedDateStr: string;
  currentDateDisplay: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'navigate', delta: number): void;
  (e: 'selectDate', date: string): void;
  (e: 'today'): void;
}>();

const datePopup = ref(false);

function onDateSelect(val: string) {
  datePopup.value = false;
  emit('selectDate', val);
}
</script>

<style scoped lang="scss">
.date-nav-card {
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
}

body.body--dark .date-nav-card {
  background-color: #121214;
  border-color: #27272a;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-agendado-dot {
  background-color: #71717a;
}

.status-confirmado-dot {
  background-color: #09090b;
}

body.body--dark .status-confirmado-dot {
  background-color: #f4f4f5;
}

.status-em-atendimento-dot {
  background-color: #f59e0b;
}

.status-concluido-dot {
  background-color: #10b981;
}

.status-cancelado-dot {
  background-color: #e11d48;
}
</style>
