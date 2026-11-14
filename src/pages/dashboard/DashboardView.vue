<template>
  <q-page class="q-pa-lg">
    <!-- Topbar & Filtro de Período -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-weight-bold editorial-title q-my-none">Visão Executiva</h1>
        <p class="text-caption text-grey-7 q-mb-none">
          Métricas de rentabilidade, produtividade e atendimentos
        </p>
      </div>

      <div class="row items-center q-gutter-x-sm">
        <q-input
          v-model="startDate"
          label="Início"
          outlined
          dense
          mask="####-##-##"
          class="date-input"
          @update:model-value="loadDashboardData"
        >
          <template #prepend><Calendar :size="16" class="text-grey-6" /></template>
        </q-input>

        <span class="text-grey-6 text-caption">até</span>

        <q-input
          v-model="endDate"
          label="Fim"
          outlined
          dense
          mask="####-##-##"
          class="date-input"
          @update:model-value="loadDashboardData"
        >
          <template #prepend><Calendar :size="16" class="text-grey-6" /></template>
        </q-input>

        <q-btn flat dense no-caps color="primary" label="Mês Atual" @click="setThisMonth" />
      </div>
    </div>

    <!-- 4 Cards de Indicadores Principais (KPIs) -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <AppStatCard
          label="Faturamento Total"
          :value="formatCurrency(overview.totalRevenue)"
          subtitle="Receitas apuradas"
          :icon="TrendingUp"
          color="#09090B"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <AppStatCard
          label="Despesas Operacionais"
          :value="formatCurrency(overview.totalExpenses)"
          subtitle="Saídas e compras"
          :icon="TrendingDown"
          color="#E11D48"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <AppStatCard
          label="Comissões Previstas"
          :value="formatCurrency(overview.totalCommissions)"
          subtitle="Repasse aos colaboradores"
          :icon="Award"
          color="#71717A"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <AppStatCard
          label="Lucro Líquido"
          :value="formatCurrency(overview.netProfit)"
          subtitle="Resultado operacional"
          :icon="DollarSign"
          :color="overview.netProfit >= 0 ? '#09090B' : '#E11D48'"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Contadores Rápidos de Volume -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6 col-md-3">
        <q-card flat class="q-pa-sm counter-card flex items-center">
          <q-avatar size="36px" class="q-mr-sm count-avatar count-avatar-done">
            <CheckCircle2 :size="18" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold leading-none text-currency">
              {{ overview.completedAppointmentsCount }}
            </div>
            <div class="text-caption text-grey-6">Atendimentos Concluídos</div>
          </div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat class="q-pa-sm counter-card flex items-center">
          <q-avatar size="36px" class="q-mr-sm count-avatar count-avatar-cancel">
            <XCircle :size="18" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold leading-none text-currency">
              {{ overview.canceledAppointmentsCount }}
            </div>
            <div class="text-caption text-grey-6">Cancelamentos</div>
          </div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat class="q-pa-sm counter-card flex items-center">
          <q-avatar size="36px" class="q-mr-sm count-avatar count-avatar-client">
            <Users :size="18" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold leading-none text-currency">
              {{ overview.activeClientsCount }}
            </div>
            <div class="text-caption text-grey-6">Clientes em Atividade</div>
          </div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat class="q-pa-sm counter-card flex items-center">
          <q-avatar size="36px" class="q-mr-sm count-avatar count-avatar-team">
            <UserCheck :size="18" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold leading-none text-currency">
              {{ overview.activeEmployeesCount }}
            </div>
            <div class="text-caption text-grey-6">Profissionais Ativos</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Seção de Gráficos -->
    <DashboardChartsSection :overview="overview" :top-services="topServices" />

    <!-- Seção de Tabelas Rápidas -->
    <DashboardTablesSection
      :top-employees="topEmployees"
      :upcoming-appointments="upcomingAppointments"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import dashboardService from 'src/services/dashboardService';
import type {
  DashboardOverviewResponse,
  TopServiceResponse,
  TopEmployeeResponse,
  UpcomingAppointmentResponse,
} from 'src/types/dashboard';
import { useFormatters } from 'src/composables/useFormatters';
import AppStatCard from 'src/components/widgets/AppStatCard.vue';
import DashboardChartsSection from './components/DashboardChartsSection.vue';
import DashboardTablesSection from './components/DashboardTablesSection.vue';
import {
  TrendingUp,
  TrendingDown,
  Award,
  DollarSign,
  CheckCircle2,
  XCircle,
  Users,
  UserCheck,
  Calendar,
} from 'lucide-vue-next';

const { formatCurrency } = useFormatters();

const loading = ref(false);
const startDate = ref(getFirstDayOfMonth());
const endDate = ref(getLastDayOfMonth());

const overview = reactive<DashboardOverviewResponse>({
  totalRevenue: 0,
  totalExpenses: 0,
  totalCommissions: 0,
  netProfit: 0,
  completedAppointmentsCount: 0,
  canceledAppointmentsCount: 0,
  activeClientsCount: 0,
  activeEmployeesCount: 0,
});

const topServices = ref<TopServiceResponse[]>([]);
const topEmployees = ref<TopEmployeeResponse[]>([]);
const upcomingAppointments = ref<UpcomingAppointmentResponse[]>([]);

function getFirstDayOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function getLastDayOfMonth(): string {
  const d = new Date();
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`;
}

function setThisMonth() {
  startDate.value = getFirstDayOfMonth();
  endDate.value = getLastDayOfMonth();
  void loadDashboardData();
}

async function loadDashboardData() {
  loading.value = true;
  const startIso = startDate.value ? `${startDate.value}T00:00:00Z` : undefined;
  const endIso = endDate.value ? `${endDate.value}T23:59:59Z` : undefined;

  try {
    const [ovRes, srvRes, empRes, upRes] = await Promise.all([
      dashboardService.getOverview(startIso, endIso),
      dashboardService.getTopServices(startIso, endIso, 5),
      dashboardService.getTopEmployees(startIso, endIso, 5),
      dashboardService.getUpcomingAppointments(5),
    ]);

    Object.assign(overview, ovRes);
    topServices.value = srvRes;
    topEmployees.value = empRes;
    upcomingAppointments.value = upRes;
  } catch {
    // Silencia caso o backend esteja sem registros no momento
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDashboardData();
});
</script>

<style scoped lang="scss">
.date-input {
  width: 140px;
}

.counter-card {
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
}

body.body--dark .counter-card {
  background-color: #121214;
  border-color: #27272a;
}

.leading-none {
  line-height: 1;
}

.count-avatar {
  border-radius: 8px;
}

.count-avatar-done {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.count-avatar-cancel {
  background-color: rgba(225, 29, 72, 0.1);
  color: #e11d48;
}

.count-avatar-client {
  background-color: rgba(9, 9, 11, 0.08);
  color: #09090b;
}

body.body--dark .count-avatar-client {
  background-color: rgba(244, 244, 245, 0.1);
  color: #f4f4f5;
}

.count-avatar-team {
  background-color: rgba(113, 113, 122, 0.1);
  color: #71717a;
}
</style>
