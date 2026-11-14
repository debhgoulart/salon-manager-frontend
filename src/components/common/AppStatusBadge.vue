<template>
  <span class="editorial-badge" :class="badgeClass">
    <span class="badge-dot" />
    <span class="badge-text">{{ badgeLabel }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status?: string | boolean | null | undefined;
}>();

const badgeClass = computed(() => {
  if (typeof props.status === 'boolean') {
    return props.status ? 'status-positive' : 'status-neutral';
  }

  switch (props.status) {
    case 'CONFIRMADO':
      return 'status-primary';
    case 'AGENDADO':
    case 'OPEN':
      return 'status-neutral';
    case 'EM_ATENDIMENTO':
    case 'PENDING':
    case 'REOPENED':
      return 'status-warning';
    case 'CONCLUIDO':
    case 'PAID':
    case 'COMPLETED':
    case 'CLOSED':
      return 'status-positive';
    case 'CANCELADO':
    case 'CANCELLED':
      return 'status-negative';
    case 'NAO_COMPARECEU':
      return 'status-muted';
    default:
      return 'status-neutral';
  }
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

<style scoped lang="scss">
.editorial-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  line-height: 1.2;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

// Estados Semânticos Editoriais
.status-primary {
  background-color: rgba(9, 9, 11, 0.06);
  color: #09090b;
  border-color: rgba(9, 9, 11, 0.2);

  .badge-dot {
    background-color: #09090b;
  }
}

body.body--dark .status-primary {
  background-color: rgba(244, 244, 245, 0.1);
  color: #f4f4f5;
  border-color: rgba(244, 244, 245, 0.2);

  .badge-dot {
    background-color: #f4f4f5;
  }
}

.status-positive {
  background-color: rgba(16, 185, 129, 0.08);
  color: #059669;
  border-color: rgba(16, 185, 129, 0.25);

  .badge-dot {
    background-color: #10b981;
  }
}

body.body--dark .status-positive {
  background-color: rgba(16, 185, 129, 0.12);
  color: #34d399;
}

.status-negative {
  background-color: rgba(225, 29, 72, 0.08);
  color: #e11d48;
  border-color: rgba(225, 29, 72, 0.25);

  .badge-dot {
    background-color: #e11d48;
  }
}

body.body--dark .status-negative {
  background-color: rgba(225, 29, 72, 0.12);
  color: #fb7185;
}

.status-warning {
  background-color: rgba(245, 158, 11, 0.08);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.25);

  .badge-dot {
    background-color: #f59e0b;
  }
}

body.body--dark .status-warning {
  background-color: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
}

.status-neutral {
  background-color: rgba(113, 113, 122, 0.08);
  color: #52525b;
  border-color: rgba(113, 113, 122, 0.2);

  .badge-dot {
    background-color: #71717a;
  }
}

body.body--dark .status-neutral {
  background-color: rgba(161, 161, 170, 0.1);
  color: #d4d4d8;

  .badge-dot {
    background-color: #a1a1aa;
  }
}

.status-muted {
  background-color: rgba(107, 114, 128, 0.08);
  color: #6b7280;
  border-color: rgba(107, 114, 128, 0.15);

  .badge-dot {
    background-color: #9ca3af;
  }
}
</style>
