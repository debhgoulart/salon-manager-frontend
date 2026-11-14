<template>
  <q-page class="q-pa-lg">
    <!-- Topbar -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Funcionários</h1>
        <p class="text-caption text-grey-7 q-mb-none">
          Profissionais, taxas contratuais de comissão e status
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
          Novo Profissional
        </q-btn>
      </div>
    </div>

    <!-- Tabela de Funcionários -->
    <q-card flat class="table-card">
      <q-table
        :rows="employees"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <!-- Telefone Formatado -->
        <template #body-cell-phone="props">
          <q-td :props="props">
            {{ formatPhone(props.row.phone) }}
          </q-td>
        </template>

        <!-- CPF Formatado -->
        <template #body-cell-cpf="props">
          <q-td :props="props">
            {{ formatCpf(props.row.cpf) }}
          </q-td>
        </template>

        <!-- Taxa de Comissão -->
        <template #body-cell-defaultCommissionRate="props">
          <q-td :props="props" class="text-weight-bold text-primary">
            {{ formatPercent(props.row.defaultCommissionRate) }}
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
              <q-tooltip>Editar Dados</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              size="sm"
              :color="props.row.active ? 'negative' : 'positive'"
              @click="confirmToggleActive(props.row)"
            >
              <UserX v-if="props.row.active" :size="16" />
              <UserCheck v-else :size="16" />
              <q-tooltip>{{
                props.row.active ? 'Desativar Profissional' : 'Reativar Profissional'
              }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- Estado Vazio -->
        <template #no-data>
          <AppEmptyState
            title="Nenhum colaborador encontrado"
            description="Cadastre profissionais para vincular a agendamentos e comissões."
          >
            <template #action>
              <q-btn
                unelevated
                color="primary"
                no-caps
                label="Novo Profissional"
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
      :title="isEditing ? 'Editar Profissional' : 'Cadastrar Novo Profissional'"
      :subtitle="
        isEditing ? 'Atualize as informações contratuais' : 'Preencha os dados do colaborador'
      "
      :loading="saving"
      @submit="handleSave"
    >
      <div class="q-gutter-y-md">
        <q-input
          v-model="form.name"
          label="Nome Completo *"
          outlined
          dense
          :rules="[(val) => !!val?.trim() || 'O nome é obrigatório']"
        />

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.email"
              label="E-mail *"
              type="email"
              outlined
              dense
              :rules="[
                (val) => !!val || 'O e-mail é obrigatório',
                (val) => /.+@.+\..+/.test(val) || 'Formato de e-mail inválido',
              ]"
            />
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.phone"
              label="Telefone / WhatsApp *"
              outlined
              dense
              mask="(##) #####-####"
              :rules="[(val) => !!val?.trim() || 'O telefone é obrigatório']"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.cpf"
              label="CPF *"
              outlined
              dense
              mask="###.###.###-##"
              :rules="[(val) => !!val?.trim() || 'O CPF é obrigatório']"
            />
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model.number="form.defaultCommissionRate"
              label="Comissão Padrão (%) *"
              type="number"
              outlined
              dense
              suffix="%"
              hint="Ex: 40% de repasse"
              :rules="[
                (val) =>
                  (val !== null && val !== undefined && val !== '') || 'A comissão é obrigatória',
                (val) => (val >= 0 && val <= 100) || 'Taxa deve estar entre 0% e 100%',
              ]"
            />
          </div>
        </div>
      </div>
    </AppFormDialog>

    <!-- Modal de Confirmação de Desativação / Ativação -->
    <AppConfirmDialog
      v-model="confirmDialogVisible"
      :title="selectedEmployee?.active ? 'Desativar Profissional?' : 'Ativar Profissional?'"
      :message="
        selectedEmployee?.active
          ? `Tem certeza que deseja desativar o profissional ${selectedEmployee?.name}? Ele não aparecerá para novos agendamentos.`
          : `Deseja reativar o profissional ${selectedEmployee?.name}?`
      "
      :color="selectedEmployee?.active ? 'negative' : 'positive'"
      :confirm-label="selectedEmployee?.active ? 'Desativar' : 'Ativar'"
      :loading="toggling"
      @confirm="executeToggleActive"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { QTableProps } from 'quasar';
import employeeService from 'src/services/employeeService';
import type { EmployeeResponse, EmployeeRequest } from 'src/types/employee';
import { useFormatters } from 'src/composables/useFormatters';
import { useFeedback } from 'src/composables/useFeedback';
import { usePaginationTable } from 'src/composables/usePaginationTable';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
import AppEmptyState from 'src/components/common/AppEmptyState.vue';
import AppFormDialog from 'src/components/dialogs/AppFormDialog.vue';
import AppConfirmDialog from 'src/components/dialogs/AppConfirmDialog.vue';
import { Plus, Edit2, UserX, UserCheck } from 'lucide-vue-next';

const { formatPhone, formatCpf, formatPercent } = useFormatters();
const { notifySuccess, handleApiError } = useFeedback();

const saving = ref(false);
const toggling = ref(false);

const activeFilter = ref<boolean | null>(null);
const selectedEmployee = ref<EmployeeResponse | null>(null);

const dialogVisible = ref(false);
const isEditing = ref(false);
const confirmDialogVisible = ref(false);

const {
  items: employees,
  loading,
  pagination,
  onRequest,
  reload,
} = usePaginationTable<EmployeeResponse>({
  fetchFn: (params) =>
    employeeService.list({
      page: params.page,
      size: params.size,
      active: activeFilter.value !== null ? activeFilter.value : undefined,
    }),
  errorMessage: 'Falha ao carregar lista de profissionais.',
});

function handleFilterChange() {
  pagination.value.page = 1;
  void reload();
}

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Profissional', field: 'name', align: 'left', sortable: true },
  { name: 'phone', label: 'Telefone', field: 'phone', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  {
    name: 'defaultCommissionRate',
    label: 'Comissão Padrão',
    field: 'defaultCommissionRate',
    align: 'center',
  },
  { name: 'active', label: 'Status', field: 'active', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
];

const form = reactive<EmployeeRequest>({
  name: '',
  email: '',
  phone: '',
  cpf: '',
  defaultCommissionRate: 40,
});

function openCreateDialog() {
  isEditing.value = false;
  selectedEmployee.value = null;
  form.name = '';
  form.email = '';
  form.phone = '';
  form.cpf = '';
  form.defaultCommissionRate = 40;
  dialogVisible.value = true;
}

function openEditDialog(emp: EmployeeResponse) {
  isEditing.value = true;
  selectedEmployee.value = emp;
  form.name = emp.name;
  form.email = emp.email;
  form.phone = emp.phone;
  form.cpf = emp.cpf;
  form.defaultCommissionRate = emp.defaultCommissionRate;
  dialogVisible.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    const payload: EmployeeRequest = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.replace(/\D/g, ''),
      cpf: form.cpf.replace(/\D/g, ''),
      defaultCommissionRate: Number(form.defaultCommissionRate),
    };

    if (isEditing.value && selectedEmployee.value) {
      await employeeService.update(selectedEmployee.value.id, payload);
      notifySuccess('Profissional atualizado com sucesso!');
    } else {
      await employeeService.create(payload);
      notifySuccess('Profissional cadastrado com sucesso!');
    }

    dialogVisible.value = false;
    await reload();
  } catch (err) {
    handleApiError(err, 'Falha ao salvar dados do profissional.');
  } finally {
    saving.value = false;
  }
}

function confirmToggleActive(emp: EmployeeResponse) {
  selectedEmployee.value = emp;
  confirmDialogVisible.value = true;
}

async function executeToggleActive() {
  if (!selectedEmployee.value) return;
  toggling.value = true;
  try {
    if (selectedEmployee.value.active) {
      await employeeService.deactivate(selectedEmployee.value.id);
      notifySuccess('Profissional desativado com sucesso.');
    } else {
      await employeeService.activate(selectedEmployee.value.id);
      notifySuccess('Profissional reativado com sucesso.');
    }
    confirmDialogVisible.value = false;
    await reload();
  } catch (err) {
    handleApiError(err, 'Erro ao alterar status do colaborador.');
  } finally {
    toggling.value = false;
  }
}
</script>
