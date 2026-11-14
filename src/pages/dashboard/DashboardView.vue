<template>
  <q-page class="q-pa-lg">
    <!-- Topbar & Filtro de Período -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Visão Executiva</h1>
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

        <span class="text-grey-6">até</span>

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
          color="#2A9D8F"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <AppStatCard
          label="Despesas Operacionais"
          :value="formatCurrency(overview.totalExpenses)"
          subtitle="Saídas e compras"
          :icon="TrendingDown"
          color="#E76F51"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <AppStatCard
          label="Comissões Previstas"
          :value="formatCurrency(overview.totalCommissions)"
          subtitle="Repasse aos colaboradores"
          :icon="Award"
          color="#E9C46A"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <AppStatCard
          label="Lucro Líquido"
          :value="formatCurrency(overview.netProfit)"
          subtitle="Resultado operacional"
          :icon="DollarSign"
          :color="overview.netProfit >= 0 ? '#7B3F61' : '#E76F51'"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Contadores Rápidos de Volume -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6 col-md-3">
        <q-card flat class="q-pa-sm counter-card flex items-center">
          <q-avatar size="36px" color="teal-1" text-color="teal-8" class="q-mr-sm">
            <CheckCircle2 :size="18" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold leading-none">
              {{ overview.completedAppointmentsCount }}
            </div>
            <div class="text-caption text-grey-6">Atendimentos Concluídos</div>
          </div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat class="q-pa-sm counter-card flex items-center">
          <q-avatar size="36px" color="red-1" text-color="red-8" class="q-mr-sm">
            <XCircle :size="18" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold leading-none">
              {{ overview.canceledAppointmentsCount }}
            </div>
            <div class="text-caption text-grey-6">Cancelamentos</div>
          </div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat class="q-pa-sm counter-card flex items-center">
          <q-avatar size="36px" color="blue-1" text-color="blue-8" class="q-mr-sm">
            <Users :size="18" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold leading-none">
              {{ overview.activeClientsCount }}
            </div>
            <div class="text-caption text-grey-6">Clientes em Atividade</div>
          </div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat class="q-pa-sm counter-card flex items-center">
          <q-avatar size="36px" color="purple-1" text-color="purple-8" class="q-mr-sm">
            <UserCheck :size="18" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold leading-none">
              {{ overview.activeEmployeesCount }}
            </div>
            <div class="text-caption text-grey-6">Profissionais Ativos</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Gráficos ApexCharts -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- Gráfico 1: Tendência Financeira (Receitas vs Despesas) -->
      <div class="col-12 col-md-7">
        <q-card flat class="q-pa-md chart-card fit">
          <div class="text-subtitle1 text-weight-bold q-mb-xs">Comparativo Financeiro</div>
          <div class="text-caption text-grey-6 q-mb-md">
            Receitas apuradas vs. Despesas e Comissões
          </div>
          <VueApexCharts
            type="bar"
            height="260"
            :options="financialChartOptions"
            :series="financialChartSeries"
          />
        </q-card>
      </div>

      <!-- Gráfico 2: Top Serviços por Faturamento -->
      <div class="col-12 col-md-5">
        <q-card flat class="q-pa-md chart-card fit">
          <div class="text-subtitle1 text-weight-bold q-mb-xs">Serviços Mais Lucrativos</div>
          <div class="text-caption text-grey-6 q-mb-md">Faturamento gerado por procedimento</div>
          <div v-if="topServices.length === 0" class="q-pa-lg text-center text-grey-5">
            Nenhum serviço registrado no período
          </div>
          <VueApexCharts
            v-else
            type="donut"
            height="260"
            :options="servicesChartOptions"
            :series="servicesChartSeries"
          />
        </q-card>
      </div>
    </div>

    <!-- Tabelas de Acompanhamento Rápido -->
    <div class="row q-col-gutter-lg">
      <!-- Ranking de Profissionais -->
      <div class="col-12 col-md-6">
        <q-card flat class="table-card fit">
          <div class="q-pa-md border-bottom row items-center justify-between">
            <span class="text-subtitle2 text-weight-bold">Profissionais com Maior Faturamento</span>
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

          <div
            v-if="topEmployees.length === 0"
            class="q-pa-md text-center text-grey-6 text-caption"
          >
            Nenhum atendimento faturado no período selecionado.
          </div>

          <q-list v-else separator>
            <q-item v-for="(emp, idx) in topEmployees" :key="emp.employeeId" class="q-py-sm">
              <q-item-section avatar>
                <q-avatar
                  size="28px"
                  :color="idx === 0 ? 'secondary' : 'grey-3'"
                  :text-color="idx === 0 ? 'white' : 'grey-8'"
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
                <div class="text-weight-bold text-primary">
                  {{ formatCurrency(emp.totalBilled) }}
                </div>
                <div class="text-caption text-grey-6">
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
            <span class="text-subtitle2 text-weight-bold">Próximos Horários da Agenda</span>
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
                  {{ app.serviceName }} •
                  <span class="text-weight-medium">{{ app.employeeName }}</span>
                </div>
              </q-item-section>

              <q-item-section side class="text-right">
                <div class="text-weight-bold text-primary">{{ formatDateTime(app.startTime) }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import dashboardService from 'src/services/dashboardService';
import type {
  DashboardOverviewResponse,
  TopServiceResponse,
  TopEmployeeResponse,
  UpcomingAppointmentResponse,
} from 'src/types/dashboard';
import { useFormatters } from 'src/composables/useFormatters';
import AppStatCard from 'src/components/widgets/AppStatCard.vue';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
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

const { formatCurrency, formatDateTime } = useFormatters();

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

// Configuração do Gráfico Comparativo
const financialChartSeries = computed(() => [
  {
    name: 'Total (R$)',
    data: [
      overview.totalRevenue,
      overview.totalExpenses,
      overview.totalCommissions,
      overview.netProfit,
    ],
  },
]);

const financialChartOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#2A9D8F', '#E76F51', '#E9C46A', '#7B3F61'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 6,
      columnWidth: '45%',
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Faturamento', 'Despesas', 'Comissões', 'Lucro Líquido'],
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `R$ ${val.toFixed(0)}`,
    },
  },
  legend: { show: false },
};

// Configuração do Gráfico de Serviços Mais Rentáveis
const servicesChartSeries = computed(() => {
  return topServices.value.map((s) => s.totalRevenue);
});

const servicesChartOptions = computed(() => ({
  chart: { fontFamily: 'inherit' },
  labels: topServices.value.map((s) => s.serviceName),
  colors: ['#7B3F61', '#C59B6D', '#2A9D8F', '#457B9D', '#9E7B9B'],
  legend: { position: 'bottom' as const },
  dataLabels: { enabled: false },
  tooltip: {
    y: {
      formatter: (val: number) => `R$ ${val.toFixed(2)}`,
    },
  },
}));

onMounted(() => {
  void loadDashboardData();
});
</script>

<style scoped>
.date-input {
  width: 135px;
}
.counter-card {
  border-radius: 10px;
  background: #ffffff;
}
body.body--dark .counter-card {
  background: #15171c;
}
.chart-card {
  border-radius: 12px;
  background: #ffffff;
}
body.body--dark .chart-card {
  background: #15171c;
}
.leading-none {
  line-height: 1;
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
body.body--dark .border-bottom {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}
</style>
