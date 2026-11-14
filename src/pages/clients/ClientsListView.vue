<template>
  <q-page class="q-pa-lg">
    <!-- Topbar -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Clientes</h1>
        <p class="text-caption text-grey-7 q-mb-none">
          Cadastro, contatos e histórico de atendimentos
        </p>
      </div>

      <div class="row items-center q-gutter-sm">
        <AppSearchInput
          v-model="searchQuery"
          placeholder="Buscar por nome, telefone ou CPF..."
          @search="handleSearch"
        />
        <q-btn unelevated color="primary" no-caps class="q-px-md" @click="openCreateDialog">
          <Plus :size="18" class="q-mr-xs" />
          Novo Cliente
        </q-btn>
      </div>
    </div>

    <!-- Tabela de Clientes -->
    <q-card flat class="table-card">
      <q-table
        :rows="clients"
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
              color="info"
              class="q-mr-xs"
              @click="openHistoryDialog(props.row)"
            >
              <Calendar :size="16" />
              <q-tooltip>Histórico de Agendamentos</q-tooltip>
            </q-btn>

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
              <q-tooltip>Editar Cliente</q-tooltip>
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
              <q-tooltip>{{ props.row.active ? 'Desativar Cliente' : 'Ativar Cliente' }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- Estado Vazio -->
        <template #no-data>
          <AppEmptyState
            title="Nenhum cliente cadastrado"
            description="Cadastre clientes para gerenciar agendamentos e histórico de serviços."
          >
            <template #action>
              <q-btn
                unelevated
                color="primary"
                no-caps
                label="Novo Cliente"
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
      :title="isEditing ? 'Editar Cliente' : 'Cadastrar Novo Cliente'"
      :subtitle="
        isEditing ? 'Atualize os dados de contato do cliente' : 'Preencha as informações básicas'
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
              v-model="form.phone"
              label="Telefone / WhatsApp *"
              outlined
              dense
              mask="(##) #####-####"
              hint="Ex: (11) 98765-4321"
              :rules="[(val) => !!val?.trim() || 'O telefone é obrigatório']"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.cpf"
              label="CPF"
              outlined
              dense
              mask="###.###.###-##"
              hint="Opcional"
            />
          </div>
        </div>

        <q-input
          v-model="form.email"
          label="E-mail"
          type="email"
          outlined
          dense
          hint="Para envio de notificações e recibos"
        />

        <q-input
          v-model="form.notes"
          label="Observações / Preferências"
          type="textarea"
          rows="2"
          outlined
          dense
          hint="Histórico de alergias, preferências de cortes ou produtos"
        />
      </div>
    </AppFormDialog>

    <!-- Modal de Confirmação de Desativação / Ativação -->
    <AppConfirmDialog
      v-model="confirmDialogVisible"
      :title="selectedClient?.active ? 'Desativar Cliente?' : 'Ativar Cliente?'"
      :message="
        selectedClient?.active
          ? `Tem certeza que deseja desativar o cliente ${selectedClient?.name}? O cliente não poderá agendar novos serviços.`
          : `Deseja reativar o cliente ${selectedClient?.name}?`
      "
      :color="selectedClient?.active ? 'negative' : 'positive'"
      :confirm-label="selectedClient?.active ? 'Desativar' : 'Ativar'"
      :loading="toggling"
      @confirm="executeToggleActive"
    />

    <!-- Diálogo de Histórico de Agendamentos -->
    <q-dialog v-model="historyDialogVisible">
      <q-card style="min-width: 580px; max-width: 90vw">
        <q-card-section class="row items-center justify-between border-bottom q-py-md">
          <div>
            <div class="text-subtitle1 text-weight-bold">Histórico de Atendimentos</div>
            <div class="text-caption text-grey-6">{{ selectedClient?.name }}</div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div v-if="historyLoading" class="q-pa-lg text-center">
            <q-spinner-tail color="primary" size="32px" />
          </div>
          <div v-else-if="clientAppointments.length === 0" class="q-pa-lg">
            <AppEmptyState
              title="Nenhum atendimento anterior"
              description="Este cliente ainda não possui serviços concluídos ou agendados."
            />
          </div>
          <q-list v-else separator>
            <q-item v-for="app in clientAppointments" :key="app.id" class="q-py-md">
              <q-item-section>
                <div class="row items-center q-gutter-x-sm">
                  <span class="text-weight-bold text-body2">{{ app.serviceName }}</span>
                  <AppStatusBadge :status="app.status" />
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Profissional:
                  <span class="text-weight-medium text-grey-8">{{ app.employeeName }}</span>
                </div>
              </q-item-section>

              <q-item-section side class="text-right">
                <div class="text-weight-bold text-primary">{{ formatCurrency(app.price) }}</div>
                <div class="text-caption text-grey-6">{{ formatDateTime(app.startTime) }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { QTableProps } from 'quasar';
import clientService from 'src/services/clientService';
import type { ClientResponse, ClientRequest } from 'src/types/client';
import type { AppointmentResponse } from 'src/types/appointment';
import { useFormatters } from 'src/composables/useFormatters';
import { useFeedback } from 'src/composables/useFeedback';
import { usePaginationTable } from 'src/composables/usePaginationTable';
import AppSearchInput from 'src/components/widgets/AppSearchInput.vue';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
import AppEmptyState from 'src/components/common/AppEmptyState.vue';
import AppFormDialog from 'src/components/dialogs/AppFormDialog.vue';
import AppConfirmDialog from 'src/components/dialogs/AppConfirmDialog.vue';
import { Plus, Edit2, UserX, UserCheck, Calendar } from 'lucide-vue-next';

const { formatPhone, formatCpf, formatCurrency, formatDateTime } = useFormatters();
const { notifySuccess, handleApiError } = useFeedback();

const saving = ref(false);
const toggling = ref(false);
const historyLoading = ref(false);

const selectedClient = ref<ClientResponse | null>(null);
const clientAppointments = ref<AppointmentResponse[]>([]);

const dialogVisible = ref(false);
const isEditing = ref(false);
const confirmDialogVisible = ref(false);
const historyDialogVisible = ref(false);

const {
  items: clients,
  loading,
  pagination,
  searchQuery,
  onRequest,
  handleSearch,
  reload,
} = usePaginationTable<ClientResponse>({
  fetchFn: (params) => clientService.list(params),
  errorMessage: 'Falha ao carregar lista de clientes.',
});

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Nome do Cliente', field: 'name', align: 'left', sortable: true },
  { name: 'phone', label: 'Telefone', field: 'phone', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'active', label: 'Status', field: 'active', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
];

const form = reactive<ClientRequest>({
  name: '',
  phone: '',
  email: '',
  cpf: '',
  notes: '',
});

function openCreateDialog() {
  isEditing.value = false;
  selectedClient.value = null;
  form.name = '';
  form.phone = '';
  form.email = '';
  form.cpf = '';
  form.notes = '';
  dialogVisible.value = true;
}

function openEditDialog(client: ClientResponse) {
  isEditing.value = true;
  selectedClient.value = client;
  form.name = client.name;
  form.phone = client.phone;
  form.email = client.email || '';
  form.cpf = client.cpf || '';
  form.notes = client.notes || '';
  dialogVisible.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    const payload: ClientRequest = {
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, ''),
      email: form.email?.trim() || '',
      cpf: form.cpf ? form.cpf.replace(/\D/g, '') : undefined,
      notes: form.notes?.trim() || undefined,
    };

    if (isEditing.value && selectedClient.value) {
      await clientService.update(selectedClient.value.id, payload);
      notifySuccess('Cliente atualizado com sucesso!');
    } else {
      await clientService.create(payload);
      notifySuccess('Cliente cadastrado com sucesso!');
    }

    dialogVisible.value = false;
    await reload();
  } catch (err) {
    handleApiError(err, 'Falha ao salvar dados do cliente.');
  } finally {
    saving.value = false;
  }
}

function confirmToggleActive(client: ClientResponse) {
  selectedClient.value = client;
  confirmDialogVisible.value = true;
}

async function executeToggleActive() {
  if (!selectedClient.value) return;
  toggling.value = true;
  try {
    if (selectedClient.value.active) {
      await clientService.deactivate(selectedClient.value.id);
      notifySuccess('Cliente desativado com sucesso.');
    } else {
      await clientService.activate(selectedClient.value.id);
      notifySuccess('Cliente reativado com sucesso.');
    }
    confirmDialogVisible.value = false;
    await reload();
  } catch (err) {
    handleApiError(err, 'Erro ao alterar status do cliente.');
  } finally {
    toggling.value = false;
  }
}

async function openHistoryDialog(client: ClientResponse) {
  selectedClient.value = client;
  historyDialogVisible.value = true;
  historyLoading.value = true;
  clientAppointments.value = [];
  try {
    const res = await clientService.getAppointments(client.id);
    clientAppointments.value = res.content;
  } catch (err) {
    handleApiError(err, 'Não foi possível carregar o histórico de atendimentos.');
  } finally {
    historyLoading.value = false;
  }
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
body.body--dark .border-bottom {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}
</style>
