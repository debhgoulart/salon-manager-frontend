<template>
  <q-page class="q-pa-lg">
    <!-- Topbar -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Fluxo Financeiro</h1>
        <p class="text-caption text-grey-7 q-mb-none">Controle de receitas, despesas operacionais e resultado líquido</p>
      </div>

      <div class="row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          no-caps
          class="q-px-md"
          @click="openCreateDialog"
        >
          <Plus :size="18" class="q-mr-xs" />
          Novo Lançamento
        </q-btn>
      </div>
    </div>

    <!-- Cards de Resumo Financeiro (KPIs) -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <AppStatCard
          label="Total de Receitas"
          :value="formatCurrency(summary.totalRevenue)"
          subtitle="Entradas no período filtrado"
          :icon="TrendingUp"
          color="#2A9D8F"
          :loading="loadingSummary"
        />
      </div>

      <div class="col-12 col-sm-4">
        <AppStatCard
          label="Total de Despesas"
          :value="formatCurrency(summary.totalExpenses)"
          subtitle="Saídas operacionais"
          :icon="TrendingDown"
          color="#E76F51"
          :loading="loadingSummary"
        />
      </div>

      <div class="col-12 col-sm-4">
        <AppStatCard
          label="Resultado Líquido"
          :value="formatCurrency(summary.netIncome)"
          subtitle="Saldo apurado (Receitas - Despesas)"
          :icon="DollarSign"
          :color="summary.netIncome >= 0 ? '#2A9D8F' : '#E76F51'"
          :loading="loadingSummary"
        />
      </div>
    </div>

    <!-- Barra de Filtros -->
    <q-card flat class="q-pa-md q-mb-md">
      <div class="row items-center justify-between q-col-gutter-sm">
        <!-- Filtro por Tipo -->
        <q-btn-toggle
          v-model="typeFilter"
          no-caps
          unelevated
          rounded
          dense
          color="grey-3"
          text-color="grey-8"
          toggle-color="primary"
          toggle-text-color="white"
          :options="[
            { label: 'Todos os Lançamentos', value: undefined },
            { label: 'Receitas (+)', value: 'INCOME' },
            { label: 'Despesas (-)', value: 'EXPENSE' },
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

          <q-btn flat dense no-caps color="primary" label="Mês Atual" @click="setThisMonth" />
        </div>
      </div>
    </q-card>

    <!-- Tabela de Transações -->
    <q-card flat class="table-card">
      <q-table
        :rows="transactions"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <!-- Data -->
        <template #body-cell-transactionDate="props">
          <q-td :props="props">
            {{ formatDate(props.row.transactionDate) }}
          </q-td>
        </template>

        <!-- Tipo -->
        <template #body-cell-type="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.type === 'INCOME' ? 'positive' : 'negative'"
              class="q-px-sm q-py-xs text-weight-medium rounded-badge"
            >
              {{ props.row.type === 'INCOME' ? 'Receita' : 'Despesa' }}
            </q-badge>
          </q-td>
        </template>

        <!-- Valor -->
        <template #body-cell-amount="props">
          <q-td :props="props" class="text-weight-bold" :class="props.row.type === 'INCOME' ? 'text-positive' : 'text-negative'">
            {{ props.row.type === 'INCOME' ? '+' : '-' }} {{ formatCurrency(props.row.amount) }}
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
            title="Nenhum lançamento no período"
            description="Não foram encontrados registros financeiros para os filtros selecionados."
          >
            <template #action>
              <q-btn unelevated color="primary" no-caps label="Novo Lançamento" @click="openCreateDialog" />
            </template>
          </AppEmptyState>
        </template>
      </q-table>
    </q-card>

    <!-- Modal de Novo Lançamento -->
    <AppFormDialog
      v-model="dialogVisible"
      title="Novo Lançamento Financeiro"
      subtitle="Cadastre uma entrada ou despesa no fluxo de caixa"
      :loading="saving"
      @submit="handleSave"
    >
      <div class="q-gutter-y-md">
        <!-- Tipo -->
        <q-btn-toggle
          v-model="form.type"
          spread
          no-caps
          unelevated
          rounded
          dense
          color="grey-3"
          text-color="grey-8"
          :toggle-color="form.type === 'INCOME' ? 'positive' : 'negative'"
          toggle-text-color="white"
          :options="[
            { label: 'Receita (+)', value: 'INCOME' },
            { label: 'Despesa (-)', value: 'EXPENSE' },
          ]"
        />

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.category"
              label="Categoria *"
              outlined
              dense
              hint="Ex: Produtos, Aluguel, Cosméticos, Água/Luz"
              :rules="[(val) => !!val?.trim() || 'A categoria é obrigatória']"
            />
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model.number="form.amount"
              label="Valor (R$) *"
              type="number"
              step="0.01"
              prefix="R$"
              outlined
              dense
              :rules="[
                (val) => !!val || 'O valor é obrigatório',
                (val) => val > 0 || 'O valor deve ser maior que zero',
              ]"
            />
          </div>
        </div>

        <q-input
          v-model="form.description"
          label="Descrição do Lançamento *"
          outlined
          dense
          :rules="[(val) => !!val?.trim() || 'A descrição é obrigatória']"
        />

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-select
              v-model="form.paymentMethod"
              label="Forma de Pagamento *"
              :options="paymentMethodOptions"
              outlined
              dense
              emit-value
              map-options
              :rules="[(val) => !!val || 'Selecione a forma de pagamento']"
            />
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.transactionDate"
              label="Data do Lançamento *"
              outlined
              dense
              mask="####-##-##"
              :rules="[(val) => !!val || 'A data é obrigatória']"
            />
          </div>
        </div>
      </div>
    </AppFormDialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { QTableProps } from 'quasar';
import financialService from 'src/services/financialService';
import type {
  FinancialTransactionResponse,
  FinancialTransactionRequest,
  FinancialSummaryResponse,
  TransactionType,
} from 'src/types/financial';
import { useFormatters } from 'src/composables/useFormatters';
import { useFeedback } from 'src/composables/useFeedback';
import AppStatCard from 'src/components/widgets/AppStatCard.vue';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
import AppEmptyState from 'src/components/common/AppEmptyState.vue';
import AppFormDialog from 'src/components/dialogs/AppFormDialog.vue';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-vue-next';

const { formatCurrency, formatDate } = useFormatters();
const { notifySuccess, handleApiError } = useFeedback();

const loading = ref(false);
const loadingSummary = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);

const typeFilter = ref<TransactionType | undefined>(undefined);
const startDate = ref(getFirstDayOfMonth());
const endDate = ref(getLastDayOfMonth());

const transactions = ref<FinancialTransactionResponse[]>([]);
const summary = reactive<FinancialSummaryResponse>({
  totalRevenue: 0,
  totalExpenses: 0,
  netIncome: 0,
  transactionsCount: 0,
});

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const columns: QTableProps['columns'] = [
  { name: 'transactionDate', label: 'Data', field: 'transactionDate', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'center' },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'paymentMethod', label: 'Forma de Pagto', field: 'paymentMethod', align: 'left' },
  { name: 'amount', label: 'Valor', field: 'amount', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
];

const paymentMethodOptions = [
  { label: 'PIX', value: 'PIX' },
  { label: 'Cartão de Crédito', value: 'CARTAO_CREDITO' },
  { label: 'Cartão de Débito', value: 'CARTAO_DEBITO' },
  { label: 'Dinheiro', value: 'DINHEIRO' },
  { label: 'Transferência Bancária', value: 'TRANSFERENCIA' },
];

const form = reactive<FinancialTransactionRequest>({
  type: 'INCOME',
  category: '',
  description: '',
  amount: 0,
  paymentMethod: 'PIX',
  transactionDate: getTodayDate(),
});

function getTodayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

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
  handleFilterChange();
}

async function loadSummary() {
  loadingSummary.value = true;
  try {
    const s = await financialService.getSummary(
      `${startDate.value}T00:00:00Z`,
      `${endDate.value}T23:59:59Z`
    );
    summary.totalRevenue = s.totalRevenue;
    summary.totalExpenses = s.totalExpenses;
    summary.netIncome = s.netIncome;
    summary.transactionsCount = s.transactionsCount;
  } catch {
    // Falha silenciosa caso não haja lançamentos
  } finally {
    loadingSummary.value = false;
  }
}

async function loadTransactions(page = 1, size = 10) {
  loading.value = true;
  try {
    const res = await financialService.listTransactions({
      page: page - 1,
      size,
      type: typeFilter.value,
      startDate: startDate.value ? `${startDate.value}T00:00:00Z` : undefined,
      endDate: endDate.value ? `${endDate.value}T23:59:59Z` : undefined,
    });
    transactions.value = res.content;
    pagination.value.page = res.number + 1;
    pagination.value.rowsPerPage = res.size;
    pagination.value.rowsNumber = res.totalElements;
  } catch (err) {
    handleApiError(err, 'Falha ao carregar lançamentos financeiros.');
  } finally {
    loading.value = false;
  }
}

function handleFilterChange() {
  pagination.value.page = 1;
  void loadTransactions(1, pagination.value.rowsPerPage);
  void loadSummary();
}

function onRequest(props: { pagination: { page: number; rowsPerPage: number } }) {
  void loadTransactions(props.pagination.page, props.pagination.rowsPerPage);
}

function openCreateDialog() {
  form.type = 'EXPENSE';
  form.category = '';
  form.description = '';
  form.amount = 0;
  form.paymentMethod = 'PIX';
  form.transactionDate = getTodayDate();
  dialogVisible.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    const payload: FinancialTransactionRequest = {
      type: form.type,
      category: form.category.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
      paymentMethod: form.paymentMethod,
      transactionDate: `${form.transactionDate}T12:00:00Z`,
    };

    await financialService.createTransaction(payload);
    notifySuccess('Lançamento registrado com sucesso!');
    dialogVisible.value = false;
    await loadTransactions(pagination.value.page, pagination.value.rowsPerPage);
    await loadSummary();
  } catch (err) {
    handleApiError(err, 'Erro ao criar lançamento. O mês contábil pode estar encerrado.');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void loadSummary();
  void loadTransactions();
});
</script>

<style scoped>
.date-input {
  width: 140px;
}
.rounded-badge {
  border-radius: 6px;
  font-size: 0.75rem;
}
</style>
