<template>
  <q-page class="q-pa-lg">
    <!-- Topbar -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Fechamento Contábil Mensal</h1>
        <p class="text-caption text-grey-7 q-mb-none">Consolidação atômica de receitas, despesas e comissões com trava de segurança</p>
      </div>
    </div>

    <!-- Seletor de Competência & Simulação -->
    <q-card flat class="q-pa-md q-mb-lg closing-control-card">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="row items-center q-gutter-x-md">
          <q-select
            v-model="selectedMonth"
            label="Mês de Competência"
            :options="monthOptions"
            emit-value
            map-options
            outlined
            dense
            style="width: 180px"
          />

          <q-select
            v-model="selectedYear"
            label="Ano"
            :options="yearOptions"
            emit-value
            map-options
            outlined
            dense
            style="width: 120px"
          />

          <q-btn
            unelevated
            color="primary"
            no-caps
            class="q-px-md"
            :loading="calculating"
            @click="handleCalculate"
          >
            <Calculator :size="18" class="q-mr-xs" />
            Calcular Prévia
          </q-btn>
        </div>

        <div v-if="previewStatement" class="row items-center q-gutter-x-sm">
          <q-badge
            v-if="previewStatement.status === 'CLOSED'"
            color="positive"
            class="q-pa-sm text-weight-bold"
          >
            <CheckCircle2 :size="16" class="q-mr-xs" /> Mês Já Fechado
          </q-badge>

          <q-btn
            v-if="previewStatement.status !== 'CLOSED'"
            unelevated
            color="negative"
            no-caps
            class="q-px-md"
            @click="openCloseConfirmDialog"
          >
            <Lock :size="18" class="q-mr-xs" />
            Efetivar Fechamento
          </q-btn>
        </div>
      </div>
    </q-card>

    <!-- Demonstrativo Contábil Calculado -->
    <div v-if="previewStatement" class="q-mb-xl">
      <div class="text-subtitle1 text-weight-bold q-mb-md flex items-center">
        <FileSpreadsheet :size="20" class="q-mr-xs text-primary" />
        Demonstrativo Consolidado — {{ getMonthName(previewStatement.month) }} / {{ previewStatement.year }}
      </div>

      <!-- 4 Cards de Totais -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-3">
          <AppStatCard
            label="Receita Bruta"
            :value="formatCurrency(previewStatement.totalRevenue)"
            subtitle="Faturamento total apurado"
            :icon="TrendingUp"
            color="#2A9D8F"
          />
        </div>

        <div class="col-12 col-sm-3">
          <AppStatCard
            label="Despesas Operacionais"
            :value="formatCurrency(previewStatement.totalExpenses)"
            subtitle="Total de custos do mês"
            :icon="TrendingDown"
            color="#E76F51"
          />
        </div>

        <div class="col-12 col-sm-3">
          <AppStatCard
            label="Total de Comissões"
            :value="formatCurrency(previewStatement.totalCommissions)"
            subtitle="Repasses aos profissionais"
            :icon="Award"
            color="#E9C46A"
          />
        </div>

        <div class="col-12 col-sm-3">
          <AppStatCard
            label="Lucro Líquido do Salão"
            :value="formatCurrency(previewStatement.netProfit)"
            subtitle="Resultado após despesas e comissões"
            :icon="DollarSign"
            :color="previewStatement.netProfit >= 0 ? '#7B3F61' : '#E76F51'"
          />
        </div>
      </div>

      <!-- Detalhamento por Colaborador -->
      <q-card flat class="table-card">
        <div class="q-pa-md text-subtitle2 text-weight-bold border-bottom">
          Rateio de Atendimentos & Comissões por Profissional
        </div>
        <q-table
          :rows="previewStatement.items || []"
          :columns="itemColumns"
          row-key="employeeId"
          flat
          hide-pagination
          :pagination="{ rowsPerPage: 0 }"
        >
          <!-- Faturamento Gerado -->
          <template #body-cell-totalServiceValue="props">
            <q-td :props="props" class="text-weight-medium">
              {{ formatCurrency(props.row.totalServiceValue) }}
            </q-td>
          </template>

          <!-- Total Comissão -->
          <template #body-cell-totalCommission="props">
            <q-td :props="props" class="text-weight-bold text-primary">
              {{ formatCurrency(props.row.totalCommission) }}
            </q-td>
          </template>

          <template #no-data>
            <div class="q-pa-md text-center text-grey-6 text-caption">
              Nenhum profissional com atendimentos concluídos nesta competência.
            </div>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Histórico de Fechamentos Anteriores -->
    <div>
      <div class="text-subtitle1 text-weight-bold q-mb-md flex items-center">
        <History :size="20" class="q-mr-xs text-primary" />
        Histórico de Fechamentos Realizados
      </div>

      <q-card flat class="table-card">
        <q-table
          :rows="historicalClosings"
          :columns="historyColumns"
          row-key="id"
          flat
          :loading="loadingHistory"
        >
          <!-- Competência -->
          <template #body-cell-period="props">
            <q-td :props="props" class="text-weight-bold">
              {{ getMonthName(props.row.month) }} / {{ props.row.year }}
            </q-td>
          </template>

          <!-- Faturamento -->
          <template #body-cell-totalRevenue="props">
            <q-td :props="props">
              {{ formatCurrency(props.row.totalRevenue) }}
            </q-td>
          </template>

          <!-- Lucro Líquido -->
          <template #body-cell-netProfit="props">
            <q-td :props="props" class="text-weight-bold" :class="props.row.netProfit >= 0 ? 'text-positive' : 'text-negative'">
              {{ formatCurrency(props.row.netProfit) }}
            </q-td>
          </template>

          <!-- Status -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <AppStatusBadge :status="props.row.status" />
            </q-td>
          </template>

          <!-- Fechado em -->
          <template #body-cell-closedAt="props">
            <q-td :props="props">
              {{ formatDateTime(props.row.closedAt) }}
            </q-td>
          </template>

          <!-- Ações -->
          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn
                flat
                round
                dense
                size="sm"
                color="primary"
                class="q-mr-xs"
                @click="viewHistoricalClosing(props.row)"
              >
                <Eye :size="16" />
                <q-tooltip>Ver Demonstrativo</q-tooltip>
              </q-btn>

              <q-btn
                v-if="props.row.status === 'CLOSED'"
                flat
                round
                dense
                size="sm"
                color="orange-9"
                @click="openReopenDialog(props.row)"
              >
                <Unlock :size="16" />
                <q-tooltip>Reabrir Mês Contábil</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template #no-data>
            <AppEmptyState
              title="Nenhum fechamento registrado"
              description="Efetue fechamentos mensais para registrar o histórico contábil oficial do salão."
            />
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Modal de Confirmação de Fechamento -->
    <AppConfirmDialog
      v-model="closeDialogVisible"
      title="Efetivar Fechamento Contábil?"
      subtitle="Operação atômica oficial"
      message="Ao encerrar o mês contábil, novas receitas e despesas retroativas neste mês serão bloqueadas. As comissões serão consolidadas."
      color="negative"
      confirm-label="Confirmar Fechamento"
      :loading="closingExecution"
      @confirm="executeClose"
    />

    <!-- Modal de Reabertura com Notas de Auditoria -->
    <AppFormDialog
      v-model="reopenDialogVisible"
      title="Reabrir Mês Contábil"
      subtitle="Exige justificativa obrigatória para auditoria"
      submit-label="Reabrir Período"
      :loading="reopeningExecution"
      @submit="executeReopen"
    >
      <div class="q-gutter-y-md">
        <q-banner dense rounded class="bg-orange-1 text-orange-9">
          A reabertura de períodos encerrados será registrada no log de auditoria com a identificação do usuário logado.
        </q-banner>

        <q-input
          v-model="auditNotes"
          label="Justificativa da Reabertura *"
          type="textarea"
          rows="3"
          outlined
          dense
          hint="Informe o motivo pelo qual este mês contábil precisa ser reaberto"
          :rules="[(val) => !!val?.trim() || 'A justificativa é obrigatória']"
        />
      </div>
    </AppFormDialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableProps } from 'quasar';
import closingService from 'src/services/closingService';
import type { MonthlyClosingResponse, MonthlyClosingRequest, MonthlyClosingReopenRequest } from 'src/types/closing';
import { useFormatters } from 'src/composables/useFormatters';
import { useFeedback } from 'src/composables/useFeedback';
import AppStatCard from 'src/components/widgets/AppStatCard.vue';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
import AppEmptyState from 'src/components/common/AppEmptyState.vue';
import AppConfirmDialog from 'src/components/dialogs/AppConfirmDialog.vue';
import AppFormDialog from 'src/components/dialogs/AppFormDialog.vue';
import {
  Calculator,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
  History,
  TrendingUp,
  TrendingDown,
  Award,
  DollarSign,
} from 'lucide-vue-next';

const { formatCurrency, formatDateTime } = useFormatters();
const { notifySuccess, handleApiError } = useFeedback();

const calculating = ref(false);
const closingExecution = ref(false);
const reopeningExecution = ref(false);
const loadingHistory = ref(false);

const now = new Date();
const selectedMonth = ref<number>(now.getMonth() + 1);
const selectedYear = ref<number>(now.getFullYear());

const previewStatement = ref<MonthlyClosingResponse | null>(null);
const historicalClosings = ref<MonthlyClosingResponse[]>([]);

const closeDialogVisible = ref(false);
const reopenDialogVisible = ref(false);
const selectedClosingToReopen = ref<MonthlyClosingResponse | null>(null);
const auditNotes = ref('');

const monthOptions = [
  { label: 'Janeiro', value: 1 },
  { label: 'Fevereiro', value: 2 },
  { label: 'Março', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Maio', value: 5 },
  { label: 'Junho', value: 6 },
  { label: 'Julho', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Setembro', value: 9 },
  { label: 'Outubro', value: 10 },
  { label: 'Novembro', value: 11 },
  { label: 'Dezembro', value: 12 },
];

const yearOptions = [
  { label: '2025', value: 2025 },
  { label: '2026', value: 2026 },
  { label: '2027', value: 2027 },
];

const itemColumns: QTableProps['columns'] = [
  { name: 'employeeName', label: 'Profissional', field: 'employeeName', align: 'left' },
  { name: 'appointmentsCount', label: 'Atendimentos', field: 'appointmentsCount', align: 'center' },
  { name: 'totalServiceValue', label: 'Faturamento Gerado', field: 'totalServiceValue', align: 'right' },
  { name: 'totalCommission', label: 'Comissão Calculada', field: 'totalCommission', align: 'right' },
];

const historyColumns: QTableProps['columns'] = [
  { name: 'period', label: 'Competência', field: 'month', align: 'left', sortable: true },
  { name: 'totalRevenue', label: 'Faturamento', field: 'totalRevenue', align: 'right' },
  { name: 'netProfit', label: 'Lucro Líquido', field: 'netProfit', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'closedAt', label: 'Fechado Em', field: 'closedAt', align: 'left' },
  { name: 'closedBy', label: 'Fechado Por', field: 'closedBy', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
];

function getMonthName(m: number): string {
  const found = monthOptions.find((o) => o.value === m);
  return found ? found.label : String(m);
}

async function handleCalculate() {
  calculating.value = true;
  try {
    const res = await closingService.calculate(selectedYear.value, selectedMonth.value);
    previewStatement.value = res;
    notifySuccess('Cálculos do mês simulados com sucesso.');
  } catch (err) {
    handleApiError(err, 'Falha ao calcular demonstrativo mensal.');
  } finally {
    calculating.value = false;
  }
}

async function loadHistory() {
  loadingHistory.value = true;
  try {
    const list = await closingService.list({ year: selectedYear.value });
    historicalClosings.value = list;
  } catch {
    // Silencia caso vazio
  } finally {
    loadingHistory.value = false;
  }
}

function openCloseConfirmDialog() {
  closeDialogVisible.value = true;
}

async function executeClose() {
  closingExecution.value = true;
  try {
    const payload: MonthlyClosingRequest = {
      year: selectedYear.value,
      month: selectedMonth.value,
    };
    const res = await closingService.close(payload);
    previewStatement.value = res;
    notifySuccess('Fechamento contábil realizado com sucesso!');
    closeDialogVisible.value = false;
    await loadHistory();
  } catch (err) {
    handleApiError(err, 'Erro ao efetivar fechamento contábil.');
  } finally {
    closingExecution.value = false;
  }
}

function viewHistoricalClosing(closing: MonthlyClosingResponse) {
  previewStatement.value = closing;
  selectedMonth.value = closing.month;
  selectedYear.value = closing.year;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openReopenDialog(closing: MonthlyClosingResponse) {
  selectedClosingToReopen.value = closing;
  auditNotes.value = '';
  reopenDialogVisible.value = true;
}

async function executeReopen() {
  if (!selectedClosingToReopen.value) return;
  reopeningExecution.value = true;
  try {
    const payload: MonthlyClosingReopenRequest = {
      auditNotes: auditNotes.value.trim(),
    };
    const res = await closingService.reopen(selectedClosingToReopen.value.id, payload);
    previewStatement.value = res;
    notifySuccess('Mês contábil reaberto com sucesso!');
    reopenDialogVisible.value = false;
    await loadHistory();
  } catch (err) {
    handleApiError(err, 'Erro ao reabrir período contábil.');
  } finally {
    reopeningExecution.value = false;
  }
}

onMounted(() => {
  void handleCalculate();
  void loadHistory();
});
</script>

<style scoped>
.closing-control-card {
  border-radius: 12px;
  background: #FFFFFF;
}
body.body--dark .closing-control-card {
  background: #15171C;
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
body.body--dark .border-bottom {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}
</style>
