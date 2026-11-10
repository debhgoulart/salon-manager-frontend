<template>
  <q-badge
    :color="badgeColor"
    :text-color="badgeTextColor"
    class="q-px-sm q-py-xs text-weight-medium rounded-badge"
  >
    {{ badgeLabel }}
  </q-badge>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status?: string | boolean | null | undefined;
}>();

const badgeColor = computed(() => {
  if (typeof props.status === 'boolean') {
    return props.status ? 'positive' : 'grey-5';
  }

  switch (props.status) {
    case 'AGENDADO':
      return 'info';
    case 'CONFIRMADO':
      return 'primary';
    case 'EM_ATENDIMENTO':
      return 'warning';
    case 'CONCLUIDO':
    case 'PAID':
    case 'COMPLETED':
    case 'CLOSED':
      return 'positive';
    case 'CANCELADO':
    case 'CANCELLED':
      return 'negative';
    case 'NAO_COMPARECEU':
      return 'deep-purple';
    case 'PENDING':
    case 'OPEN':
      return 'amber-8';
    case 'REOPENED':
      return 'orange-9';
    default:
      return 'grey-6';
  }
});

const badgeTextColor = computed(() => {
  if (badgeColor.value === 'warning') return 'dark';
  return 'white';
});

const badgeLabel = computed(() => {
  if (typeof props.status === 'boolean') {
    return props.status ? 'Ativo' : 'Inativo';
  }

  switch (props.status) {
    case 'AGENDADO':
      return 'Agendado';
    case 'CONFIRMADO':
      return 'Confirmado';
    case 'EM_ATENDIMENTO':
      return 'Em Atendimento';
    case 'CONCLUIDO':
      return 'Concluído';
    case 'CANCELADO':
      return 'Cancelado';
    case 'NAO_COMPARECEU':
      return 'Não Compareceu';
    case 'PAID':
      return 'Pago';
    case 'PENDING':
      return 'Pendente';
    case 'COMPLETED':
      return 'Efetivado';
    case 'CANCELLED':
      return 'Cancelado';
    case 'OPEN':
      return 'Aberto';
    case 'CLOSED':
      return 'Fechado';
    case 'REOPENED':
      return 'Reaberto';
    default:
      return props.status || '-';
  }
});
</script>

<style scoped>
.rounded-badge {
  border-radius: 6px;
  font-size: 0.75rem;
}
</style>
