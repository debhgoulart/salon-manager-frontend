<template>
  <q-card flat class="q-pa-sm q-mb-md date-nav-card">
    <div class="row items-center justify-between">
      <div class="row items-center q-gutter-x-sm">
        <q-btn flat round dense size="sm" @click="$emit('navigate', -1)">
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

        <q-btn flat round dense size="sm" @click="$emit('navigate', 1)">
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
          <span class="legend-dot bg-info q-mr-xs"></span>Agendado
        </span>
        <span class="flex items-center">
          <span class="legend-dot bg-primary q-mr-xs"></span>Confirmado
        </span>
        <span class="flex items-center">
          <span class="legend-dot bg-warning q-mr-xs"></span>Em Atendimento
        </span>
        <span class="flex items-center">
          <span class="legend-dot bg-positive q-mr-xs"></span>Concluído
        </span>
        <span class="flex items-center">
          <span class="legend-dot bg-negative q-mr-xs"></span>Cancelado
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
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>
