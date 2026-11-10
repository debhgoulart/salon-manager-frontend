<template>
  <q-page class="q-pa-lg">
    <!-- Topbar -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Extrato de Comissões</h1>
        <p class="text-caption text-grey-7 q-mb-none">Acompanhamento e apuração de repasses por profissional</p>
      </div>
    </div>

    <!-- Cards de Resumo -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-3">
        <AppStatCard
          label="Total de Comissões"
          :value="formatCurrency(summary.totalCommission)"
          subtitle="Valor global no período"
          :icon="Award"
          color="#7B3F61"
          :loading="loadingSummary"
        />
      </div>

      <div class="col-12 col-sm-3">
        <AppStatCard
          label="Comissões Pendentes"
          :value="formatCurrency(summary.pendingAmount)"
          subtitle="Aguardando fechamento/pagto"
          :icon="Clock"
          color="#E9C46A"
          :loading="loadingSummary"
        />
      </div>

      <div class="col-12 col-sm-3">
        <AppStatCard
          label="Comissões Pagas"
          :value="formatCurrency(summary.paidAmount)"
          subtitle="Repasses já liquidados"
          :icon="CheckCircle2"
          color="#2A9D8F"
          :loading="loadingSummary"
        />
      </div>

      <div class="col-12 col-sm-3">
        <AppStatCard
          label="Atendimentos Comissionados"
          :value="summary.count"
          subtitle="Serviços concluídos no período"
          :icon="Scissors"
          color="#457B9D"
          :loading="loadingSummary"
        />
      </div>
    </div>

    <!-- Barra de Filtros -->
    <q-card flat class="q-pa-md q-mb-md">
      <div class="row items-center justify-between q-col-gutter-sm">
        <!-- Filtro por Profissional -->
        <q-select
          v-model="employeeFilter"
          label="Filtrar por Profissional"
          :options="employeeOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          options-dense
          class="filter-select"
          @update:model-value="handleFilterChange"
        />

        <!-- Filtro por Status -->
        <q-btn-toggle
          v-model="statusFilter"
          no-caps
          unelevated
          rounded
          dense
          color="grey-3"
          text-color="grey-8"
          toggle-color="primary"
          toggle-text-color="white"
          :options="[
            { label: 'Todos', value: undefined },
            { label: 'Pendentes', value: 'PENDING' },
            { label: 'Pagos', value: 'PAID' },
          ]"
          @update:model-value="handleFilterChange"
        />

        <!-- Filtro de Datas -->
        <div class="row items-center q-gutter-x-sm">
          <q-input
            v-model="startDate"
            label="Início"
            outlined
            dense
            mask="####-##-##"
            class="date-input"
            @update:model-value="handleFilterChange"
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
            @update:model-value="handleFilterChange"
          >
            <template #prepend><Calendar :size="16" class="text-grey-6" /></template>
          </q-input>
        </div>
      </div>
    </q-card>

    <!-- Tabela de Comissões -->
    <q-card flat class="table-card">
      <q-table
        :rows="commissions"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <!-- Data -->
        <template #body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatDateTime(props.row.createdAt) }}
          </q-td>
        </template>

        <!-- Valor do Serviço -->
        <template #body-cell-serviceAmount="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.serviceAmount) }}
          </q-td>
        </template>

        <!-- Taxa Aplicada -->
        <template #body-cell-appliedRate="props">
          <q-td :props="props" class="text-center text-weight-medium">
            {{ formatPercent(props.row.appliedRate) }}
          </q-td>
        </template>

        <!-- Valor da Comissão -->
        <template #body-cell-commissionAmount="props">
          <q-td :props="props" class="text-weight-bold text-primary">
            {{ formatCurrency(props.row.commissionAmount) }}
          </q-td>
        </template>

        <!-- Status -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <AppStatusBadge :status="props.row.status" />
          </q-td>
        </template>

        <!-- Estado Vazio -->
        <template #no-data>
          <AppEmptyState
            title="Nenhuma comissão registrada"
            description="Não foram apuradas comissões para o período e profissional selecionados."
          />
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import type { QTableProps } from 'quasar';
import commissionService from 'src/services/commissionService';
import employeeService from 'src/services/employeeService';
import type { CommissionResponse, CommissionSummaryResponse, CommissionStatus } from 'src/types/commission';
import type { EmployeeResponse } from 'src/types/employee';
import { useFormatters } from 'src/composables/useFormatters';
import { useFeedback } from 'src/composables/useFeedback';
import AppStatCard from 'src/components/widgets/AppStatCard.vue';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
import AppEmptyState from 'src/components/common/AppEmptyState.vue';
import { Award, Clock, CheckCircle2, Scissors, Calendar } from 'lucide-vue-next';

const { formatCurrency, formatPercent, formatDateTime } = useFormatters();
const { handleApiError } = useFeedback();

const loading = ref(false);
const loadingSummary = ref(false);

const employeeFilter = ref<string>('');
const statusFilter = ref<CommissionStatus | undefined>(undefined);
const startDate = ref(getFirstDayOfMonth());
const endDate = ref(getLastDayOfMonth());

const commissions = ref<CommissionResponse[]>([]);
const employees = ref<EmployeeResponse[]>([]);

const summary = reactive<CommissionSummaryResponse>({
  totalCommission: 0,
  pendingAmount: 0,
  paidAmount: 0,
  count: 0,
});

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const columns: QTableProps['columns'] = [
  { name: 'createdAt', label: 'Data/Hora', field: 'createdAt', align: 'left', sortable: true },
  { name: 'employeeName', label: 'Profissional', field: 'employeeName', align: 'left', sortable: true },
  { name: 'serviceName', label: 'Serviço Realizado', field: 'serviceName', align: 'left' },
  { name: 'serviceAmount', label: 'Valor do Serviço', field: 'serviceAmount', align: 'right' },
  { name: 'appliedRate', label: 'Taxa Aplicada', field: 'appliedRate', align: 'center' },
  { name: 'commissionAmount', label: 'Comissão', field: 'commissionAmount', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
];

const employeeOptions = computed(() => {
  const list = employees.value.map((e) => ({ label: e.name, value: e.id }));
  return [{ label: 'Todos os Profissionais', value: '' }, ...list];
});

function getFirstDayOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function getLastDayOfMonth(): string {
  const d = new Date();
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`;
}

async function loadSummary() {
  loadingSummary.value = true;
  try {
    const s = await commissionService.getSummary(
      startDate.value ? `${startDate.value}T00:00:00Z` : undefined,
      endDate.value ? `${endDate.value}T23:59:59Z` : undefined
    );
    summary.totalCommission = s.totalCommission;
    summary.pendingAmount = s.pendingAmount;
    summary.paidAmount = s.paidAmount;
    summary.count = s.count;
  } catch {
    // Silencia caso vazio
  } finally {
    loadingSummary.value = false;
  }
}

async function loadEmployees() {
  try {
    const res = await employeeService.list({ page: 0, size: 50 });
    employees.value = res.content;
  } catch {
    // Silencia caso vazio
  }
}

async function loadCommissions(page = 1, size = 10) {
  loading.value = true;
  try {
    const res = await commissionService.list({
      page: page - 1,
      size,
      employeeId: employeeFilter.value || undefined,
      status: statusFilter.value,
      startDate: startDate.value ? `${startDate.value}T00:00:00Z` : undefined,
      endDate: endDate.value ? `${endDate.value}T23:59:59Z` : undefined,
    });
    commissions.value = res.content;
    pagination.value.page = res.number + 1;
    pagination.value.rowsPerPage = res.size;
    pagination.value.rowsNumber = res.totalElements;
  } catch (err) {
    handleApiError(err, 'Falha ao carregar comissões.');
  } finally {
    loading.value = false;
  }
}

function handleFilterChange() {
  pagination.value.page = 1;
  void loadCommissions(1, pagination.value.rowsPerPage);
  void loadSummary();
}

function onRequest(props: { pagination: { page: number; rowsPerPage: number } }) {
  void loadCommissions(props.pagination.page, props.pagination.rowsPerPage);
}

onMounted(() => {
  void loadEmployees();
  void loadSummary();
  void loadCommissions();
});
</script>

<style scoped>
.filter-select {
  min-width: 220px;
}
.date-input {
  width: 140px;
}
</style>
