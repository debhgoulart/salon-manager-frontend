<template>
  <div class="row q-col-gutter-lg">
    <!-- Ranking de Profissionais -->
    <div class="col-12 col-md-6">
      <q-card flat class="table-card fit">
        <div class="q-pa-md border-bottom row items-center justify-between">
          <span class="text-subtitle2 text-weight-bold editorial-title">
            Profissionais com Maior Faturamento
          </span>
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            color="primary"
            to="/funcionarios"
            label="Ver Equipe"
          />
        </div>

        <div v-if="topEmployees.length === 0" class="q-pa-md text-center text-grey-6 text-caption">
          Nenhum atendimento faturado no período selecionado.
        </div>

        <q-list v-else separator>
          <q-item v-for="(emp, idx) in topEmployees" :key="emp.employeeId" class="q-py-sm">
            <q-item-section avatar>
              <q-avatar
                size="28px"
                :class="idx === 0 ? 'rank-lead-badge' : 'rank-sub-badge'"
                class="text-weight-bold text-caption"
              >
                {{ idx + 1 }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <div class="text-weight-bold text-body2">{{ emp.employeeName }}</div>
              <div class="text-caption text-grey-6">
                {{ emp.executionCount }} serviços realizados
              </div>
            </q-item-section>

            <q-item-section side class="text-right">
              <div class="text-weight-bold text-primary text-currency">
                {{ formatCurrency(emp.totalBilled) }}
              </div>
              <div class="text-caption text-grey-6 text-currency">
                Comissão: {{ formatCurrency(emp.totalCommission) }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <!-- Próximos Atendimentos -->
    <div class="col-12 col-md-6">
      <q-card flat class="table-card fit">
        <div class="q-pa-md border-bottom row items-center justify-between">
          <span class="text-subtitle2 text-weight-bold editorial-title">
            Próximos Horários da Agenda
          </span>
          <q-btn flat dense no-caps size="sm" color="primary" to="/agenda" label="Abrir Agenda" />
        </div>

        <div
          v-if="upcomingAppointments.length === 0"
          class="q-pa-md text-center text-grey-6 text-caption"
        >
          Não há atendimentos pendentes agendados para os próximos horários.
        </div>

        <q-list v-else separator>
          <q-item v-for="app in upcomingAppointments" :key="app.appointmentId" class="q-py-sm">
            <q-item-section>
              <div class="row items-center q-gutter-x-sm">
                <span class="text-weight-bold text-body2">{{ app.clientName }}</span>
                <AppStatusBadge :status="app.status" />
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                {{ app.serviceName }} &bull;
                <span class="text-weight-medium">{{ app.employeeName }}</span>
              </div>
            </q-item-section>

            <q-item-section side class="text-right">
              <div class="text-weight-bold text-primary font-mono-time">
                {{ formatDateTime(app.startTime) }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TopEmployeeResponse, UpcomingAppointmentResponse } from 'src/types/dashboard';
import { useFormatters } from 'src/composables/useFormatters';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';

defineProps<{
  topEmployees: TopEmployeeResponse[];
  upcomingAppointments: UpcomingAppointmentResponse[];
}>();

const { formatCurrency, formatDateTime } = useFormatters();
</script>

<style scoped lang="scss">
.table-card {
  border-radius: 12px;
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
}

body.body--dark .table-card {
  background-color: #121214;
  border-color: #27272a;
}

.border-bottom {
  border-bottom: 1px solid #e4e4e7;
}

body.body--dark .border-bottom {
  border-bottom-color: #27272a;
}

.rank-lead-badge {
  background-color: #09090b;
  color: #ffffff;
}

body.body--dark .rank-lead-badge {
  background-color: #f4f4f5;
  color: #09090b;
}

.rank-sub-badge {
  background-color: #f4f4f5;
  color: #71717a;
}

body.body--dark .rank-sub-badge {
  background-color: #27272a;
  color: #a1a1aa;
}

.font-mono-time {
  font-variant-numeric: tabular-nums;
  font-size: 0.82rem;
}
</style>
