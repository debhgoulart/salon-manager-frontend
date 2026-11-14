<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 400px; max-width: 500px">
      <q-card-section class="row items-center justify-between border-bottom q-py-md">
        <div>
          <div class="text-subtitle1 text-weight-bold">
            {{ appointment?.serviceName }}
          </div>
          <div class="text-caption text-grey-6">{{ appointment?.clientName }}</div>
        </div>
        <AppStatusBadge v-if="appointment" :status="appointment.status" />
      </q-card-section>

      <q-card-section class="q-py-md">
        <div class="text-body2 text-grey-8 q-mb-sm">
          Profissional:
          <span class="text-weight-bold">{{ appointment?.employeeName }}</span>
        </div>
        <div class="text-body2 text-grey-8 q-mb-sm">
          Horário:
          <span class="text-weight-bold">{{ formattedTimeRange }}</span>
        </div>
        <div class="text-body2 text-grey-8 q-mb-md">
          Valor do Serviço:
          <span class="text-weight-bold text-primary">{{ formattedPrice }}</span>
        </div>
        <div
          v-if="appointment?.notes"
          class="text-caption text-grey-7 bg-grey-2 q-pa-sm rounded-borders"
        >
          Observações: {{ appointment.notes }}
        </div>
      </q-card-section>

      <!-- Ações de Transição de Estado -->
      <q-card-actions align="right" class="q-pa-md border-top q-gutter-x-sm">
        <q-btn flat label="Fechar" no-caps v-close-popup />

        <!-- Ação: Confirmar Horário -->
        <q-btn
          v-if="appointment?.status === 'AGENDADO'"
          unelevated
          color="primary"
          no-caps
          label="Confirmar Horário"
          :loading="loading"
          @click="$emit('changeStatus', 'CONFIRMADO')"
        />

        <!-- Ação: Iniciar Atendimento -->
        <q-btn
          v-if="appointment?.status === 'CONFIRMADO'"
          unelevated
          color="warning"
          text-color="dark"
          no-caps
          label="Iniciar Atendimento"
          :loading="loading"
          @click="$emit('changeStatus', 'EM_ATENDIMENTO')"
        />

        <!-- Ação: Concluir Atendimento -->
        <q-btn
          v-if="appointment?.status === 'EM_ATENDIMENTO'"
          unelevated
          color="positive"
          no-caps
          label="Concluir Atendimento"
          :loading="loading"
          @click="$emit('changeStatus', 'CONCLUIDO')"
        />

        <!-- Ações Secundárias (Cancelar / Não Compareceu) -->
        <q-btn-dropdown
          v-if="['AGENDADO', 'CONFIRMADO'].includes(appointment?.status || '')"
          flat
          no-caps
          color="negative"
          label="Mais Opções"
        >
          <q-list dense>
            <q-item clickable v-close-popup @click="$emit('changeStatus', 'CANCELADO')">
              <q-item-section class="text-negative">Cancelar Agendamento</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="$emit('changeStatus', 'NAO_COMPARECEU')">
              <q-item-section class="text-deep-purple">Marcar Não Compareceu</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AppointmentResponse, AppointmentStatus } from 'src/types/appointment';
import { useFormatters } from 'src/composables/useFormatters';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';

interface Props {
  modelValue: boolean;
  appointment: AppointmentResponse | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'changeStatus', status: AppointmentStatus): void;
}>();

const { formatCurrency } = useFormatters();

const formattedPrice = computed(() => {
  return props.appointment ? formatCurrency(props.appointment.price) : 'R$ 0,00';
});

const formattedTimeRange = computed(() => {
  if (!props.appointment?.startTime) return '-';
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
.border-bottom {
  border-bottom: 1px solid #eeeeee;
}
.border-top {
  border-top: 1px solid #eeeeee;
}
</style>
