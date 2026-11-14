<template>
  <div class="row q-col-gutter-lg q-mb-lg">
    <!-- Gráfico 1: Tendência Financeira (Receitas vs Despesas) -->
    <div class="col-12 col-md-7">
      <q-card flat class="chart-card fit q-pa-md">
        <div class="text-subtitle1 text-weight-bold editorial-title q-mb-xs">
          Comparativo Financeiro
        </div>
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
      <q-card flat class="chart-card fit q-pa-md">
        <div class="text-subtitle1 text-weight-bold editorial-title q-mb-xs">
          Serviços Mais Lucrativos
        </div>
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import type { DashboardOverviewResponse, TopServiceResponse } from 'src/types/dashboard';

const props = defineProps<{
  overview: DashboardOverviewResponse;
  topServices: TopServiceResponse[];
}>();

const financialChartSeries = computed(() => [
  {
    name: 'Total (R$)',
    data: [
      props.overview.totalRevenue,
      props.overview.totalExpenses,
      props.overview.totalCommissions,
      props.overview.netProfit,
    ],
  },
]);

const financialChartOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#09090B', '#E11D48', '#71717A', '#10B981'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 4,
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

const servicesChartSeries = computed(() => {
  return props.topServices.map((s) => s.totalRevenue);
});

const servicesChartOptions = computed(() => ({
  chart: { fontFamily: 'inherit' },
  labels: props.topServices.map((s) => s.serviceName),
  colors: ['#09090B', '#E11D48', '#71717A', '#10B981', '#27272A'],
  legend: { position: 'bottom' as const },
  dataLabels: { enabled: false },
  tooltip: {
    y: {
      formatter: (val: number) => `R$ ${val.toFixed(2)}`,
    },
  },
}));
</script>

<style scoped lang="scss">
.chart-card {
  border-radius: 12px;
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
}

body.body--dark .chart-card {
  background-color: #121214;
  border-color: #27272a;
}
</style>
