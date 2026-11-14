<template>
  <q-page class="q-pa-lg">
    <!-- Topbar -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Catálogo de Serviços</h1>
        <p class="text-caption text-grey-7 q-mb-none">
          Tabela de procedimentos, tempos de execução e preços
        </p>
      </div>

      <div class="row items-center q-gutter-sm">
        <q-btn-toggle
          v-model="activeFilter"
          no-caps
          unelevated
          rounded
          dense
          color="grey-3"
          text-color="grey-8"
          toggle-color="primary"
          toggle-text-color="white"
          :options="[
            { label: 'Todos', value: null },
            { label: 'Ativos', value: true },
            { label: 'Inativos', value: false },
          ]"
          @update:model-value="handleFilterChange"
        />

        <q-btn unelevated color="primary" no-caps class="q-px-md" @click="openCreateDialog">
          <Plus :size="18" class="q-mr-xs" />
          Novo Serviço
        </q-btn>
      </div>
    </div>

    <!-- Tabela de Serviços -->
    <q-card flat class="table-card">
      <q-table
        :rows="services"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <!-- Preço Formatado -->
        <template #body-cell-price="props">
          <q-td :props="props" class="text-weight-bold text-primary">
            {{ formatCurrency(props.row.price) }}
          </q-td>
        </template>

        <!-- Duração Formatada -->
        <template #body-cell-durationMinutes="props">
          <q-td :props="props">
            <q-chip dense size="sm" icon="schedule" color="grey-3" text-color="grey-9">
              {{ formatMinutes(props.row.durationMinutes) }}
            </q-chip>
          </q-td>
        </template>

        <!-- Comissão Específica -->
        <template #body-cell-customCommissionRate="props">
          <q-td :props="props" class="text-center">
            <span
              v-if="
                props.row.customCommissionRate !== null &&
                props.row.customCommissionRate !== undefined
              "
              class="text-weight-medium text-secondary"
            >
              {{ formatPercent(props.row.customCommissionRate) }}
            </span>
            <span v-else class="text-grey-5 text-caption">Padrão do Profissional</span>
          </q-td>
        </template>

        <!-- Status Badge -->
        <template #body-cell-active="props">
          <q-td :props="props">
            <AppStatusBadge :status="props.row.active" />
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
              @click="openEditDialog(props.row)"
            >
              <Edit2 :size="16" />
              <q-tooltip>Editar Serviço</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              size="sm"
              :color="props.row.active ? 'negative' : 'positive'"
              @click="confirmToggleActive(props.row)"
            >
              <Scissors v-if="props.row.active" :size="16" />
              <Scissors v-else :size="16" class="text-grey-5" />
              <q-tooltip>{{
                props.row.active ? 'Desativar Serviço' : 'Reativar Serviço'
              }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- Estado Vazio -->
        <template #no-data>
          <AppEmptyState
            title="Nenhum serviço cadastrado"
            description="Cadastre procedimentos para disponibilizar horários na agenda."
          >
            <template #action>
              <q-btn
                unelevated
                color="primary"
                no-caps
                label="Novo Serviço"
                @click="openCreateDialog"
              />
            </template>
          </AppEmptyState>
        </template>
      </q-table>
    </q-card>

    <!-- Modal de Cadastro / Edição -->
    <AppFormDialog
      v-model="dialogVisible"
      :title="isEditing ? 'Editar Serviço' : 'Cadastrar Novo Serviço'"
      :subtitle="
        isEditing ? 'Atualize as condições do procedimento' : 'Preencha os dados do serviço'
      "
      :loading="saving"
      @submit="handleSave"
    >
      <div class="q-gutter-y-md">
        <q-input
          v-model="form.name"
          label="Nome do Procedimento / Serviço *"
          outlined
          dense
          hint="Ex: Corte Masculino, Mechas, Escova Modeladora"
          :rules="[(val) => !!val?.trim() || 'O nome é obrigatório']"
        />

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model.number="form.price"
              label="Preço (R$) *"
              type="number"
              step="0.01"
              prefix="R$"
              outlined
              dense
              :rules="[
                (val) =>
                  (val !== null && val !== undefined && val !== '') || 'O preço é obrigatório',
                (val) => val >= 0 || 'O valor não pode ser negativo',
              ]"
            />
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model.number="form.durationMinutes"
              label="Duração em Minutos *"
              type="number"
              step="15"
              suffix="min"
              outlined
              dense
              hint="Ex: 30, 45, 60, 90"
              :rules="[
                (val) => !!val || 'A duração é obrigatória',
                (val) => val > 0 || 'A duração deve ser maior que 0',
              ]"
            />
          </div>
        </div>

        <q-input
          v-model.number="form.customCommissionRate"
          label="Taxa de Comissão Customizada (%)"
          type="number"
          suffix="%"
          outlined
          dense
          hint="Opcional. Deixe em branco para usar a comissão padrão de cada profissional."
        />
      </div>
    </AppFormDialog>

    <!-- Modal de Confirmação de Desativação / Ativação -->
    <AppConfirmDialog
      v-model="confirmDialogVisible"
      :title="selectedService?.active ? 'Desativar Serviço?' : 'Ativar Serviço?'"
      :message="
        selectedService?.active
          ? `Tem certeza que deseja desativar o serviço ${selectedService?.name}? Ele não estará disponível para novos agendamentos.`
          : `Deseja reativar o serviço ${selectedService?.name}?`
      "
      :color="selectedService?.active ? 'negative' : 'positive'"
      :confirm-label="selectedService?.active ? 'Desativar' : 'Ativar'"
      :loading="toggling"
      @confirm="executeToggleActive"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { QTableProps } from 'quasar';
import serviceService from 'src/services/serviceService';
import type { ServiceResponse, ServiceRequest } from 'src/types/service';
import { useFormatters } from 'src/composables/useFormatters';
import { useFeedback } from 'src/composables/useFeedback';
import { usePaginationTable } from 'src/composables/usePaginationTable';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
import AppEmptyState from 'src/components/common/AppEmptyState.vue';
import AppFormDialog from 'src/components/dialogs/AppFormDialog.vue';
import AppConfirmDialog from 'src/components/dialogs/AppConfirmDialog.vue';
import { Plus, Edit2, Scissors } from 'lucide-vue-next';

const { formatCurrency, formatMinutes, formatPercent } = useFormatters();
const { notifySuccess, handleApiError } = useFeedback();

const saving = ref(false);
const toggling = ref(false);

const activeFilter = ref<boolean | null>(null);
const selectedService = ref<ServiceResponse | null>(null);

const dialogVisible = ref(false);
const isEditing = ref(false);
const confirmDialogVisible = ref(false);

const {
  items: services,
  loading,
  pagination,
  onRequest,
  reload,
} = usePaginationTable<ServiceResponse>({
  fetchFn: (params) =>
    serviceService.list({
      page: params.page,
      size: params.size,
      active: activeFilter.value !== null ? activeFilter.value : undefined,
    }),
  errorMessage: 'Falha ao carregar catálogo de serviços.',
});

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Serviço', field: 'name', align: 'left', sortable: true },
  { name: 'price', label: 'Preço', field: 'price', align: 'left', sortable: true },
  { name: 'durationMinutes', label: 'Tempo Estimado', field: 'durationMinutes', align: 'center' },
  {
    name: 'customCommissionRate',
    label: 'Comissão Customizada',
    field: 'customCommissionRate',
    align: 'center',
  },
  { name: 'active', label: 'Status', field: 'active', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
];

const form = reactive<{
  name: string;
  price: number;
  durationMinutes: number;
  customCommissionRate?: number | null;
}>({
  name: '',
  price: 0,
  durationMinutes: 45,
  customCommissionRate: null,
});

function handleFilterChange() {
  pagination.value.page = 1;
  void reload();
}

function openCreateDialog() {
  isEditing.value = false;
  selectedService.value = null;
  form.name = '';
  form.price = 50;
  form.durationMinutes = 45;
  form.customCommissionRate = null;
  dialogVisible.value = true;
}

function openEditDialog(srv: ServiceResponse) {
  isEditing.value = true;
  selectedService.value = srv;
  form.name = srv.name;
  form.price = srv.price;
  form.durationMinutes = srv.durationMinutes;
  form.customCommissionRate = srv.customCommissionRate ?? null;
  dialogVisible.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    const payload: ServiceRequest = {
      name: form.name.trim(),
      price: Number(form.price),
      durationMinutes: Number(form.durationMinutes),
      customCommissionRate:
        form.customCommissionRate !== null &&
        form.customCommissionRate !== undefined &&
        form.customCommissionRate !== ('' as unknown)
          ? Number(form.customCommissionRate)
          : null,
    };

    if (isEditing.value && selectedService.value) {
      await serviceService.update(selectedService.value.id, payload);
      notifySuccess('Serviço atualizado com sucesso!');
    } else {
      await serviceService.create(payload);
      notifySuccess('Serviço cadastrado com sucesso!');
    }

    dialogVisible.value = false;
    await reload();
  } catch (err) {
    handleApiError(err, 'Falha ao salvar dados do serviço.');
  } finally {
    saving.value = false;
  }
}

function confirmToggleActive(srv: ServiceResponse) {
  selectedService.value = srv;
  confirmDialogVisible.value = true;
}

async function executeToggleActive() {
  if (!selectedService.value) return;
  toggling.value = true;
  try {
    if (selectedService.value.active) {
      await serviceService.deactivate(selectedService.value.id);
      notifySuccess('Serviço desativado com sucesso.');
    } else {
      await serviceService.activate(selectedService.value.id);
      notifySuccess('Serviço reativado com sucesso.');
    }
    confirmDialogVisible.value = false;
    await reload();
  } catch (err) {
    handleApiError(err, 'Erro ao alterar status do serviço.');
  } finally {
    toggling.value = false;
  }
}
</script>
