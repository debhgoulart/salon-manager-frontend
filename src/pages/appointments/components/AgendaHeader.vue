<template>
  <div class="row items-center justify-between q-mb-md agenda-header-container">
    <div>
      <h1 class="text-h5 text-weight-bold editorial-title q-my-none">Agenda de Atendimentos</h1>
      <p class="text-caption text-grey-7 q-mb-none">
        Visualização diária/semanal e controle de horários
      </p>
    </div>

    <div class="row items-center q-gutter-sm">
      <!-- Alternador Dia / Semana -->
      <q-btn-toggle
        :model-value="viewMode"
        no-caps
        unelevated
        dense
        color="grey-3"
        text-color="grey-8"
        toggle-color="primary"
        toggle-text-color="white"
        class="view-mode-toggle"
        :options="[
          { label: 'Dia', value: 'day' },
          { label: 'Semana', value: 'week' },
        ]"
        @update:model-value="onViewModeChange"
      />

      <!-- Filtro por Funcionário -->
      <q-select
        :model-value="selectedEmployeeId"
        :options="employeeOptions"
        option-label="label"
        option-value="value"
        emit-value
        map-options
        outlined
        dense
        options-dense
        class="employee-select"
        @update:model-value="onEmployeeChange"
      />

      <!-- Botão Novo Agendamento -->
      <q-btn
        unelevated
        color="primary"
        no-caps
        class="q-px-md new-appointment-btn"
        @click="$emit('create')"
      >
        <Plus :size="18" class="q-mr-xs" />
        Novo Agendamento
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

interface Props {
  viewMode: 'day' | 'week';
  selectedEmployeeId: string | null;
  employeeOptions: Array<{ label: string; value: string | null }>;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:viewMode', value: 'day' | 'week'): void;
  (e: 'update:selectedEmployeeId', value: string | null): void;
  (e: 'create'): void;
}>();

function onViewModeChange(val: 'day' | 'week') {
  emit('update:viewMode', val);
}

function onEmployeeChange(val: string | null) {
  emit('update:selectedEmployeeId', val);
}
</script>

<style scoped lang="scss">
.employee-select {
  min-width: 200px;
}

.view-mode-toggle {
  border-radius: 8px;
  border: 1px solid #e4e4e7;
}

body.body--dark .view-mode-toggle {
  border-color: #27272a;
}

.new-appointment-btn {
  min-height: 40px;
  font-weight: 600;
}
</style>
