<template>
  <q-page class="q-pa-lg">
    <!-- Topbar & Controles da Agenda -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Agenda de Atendimentos</h1>
        <p class="text-caption text-grey-7 q-mb-none">
          Visualização diária/semanal e controle de horários
        </p>
      </div>

      <div class="row items-center q-gutter-sm">
        <!-- Alternador Dia / Semana -->
        <q-btn-toggle
          v-model="viewMode"
          no-caps
          unelevated
          rounded
          dense
          color="grey-3"
          text-color="grey-8"
          toggle-color="primary"
          toggle-text-color="white"
          :options="[
            { label: 'Dia', value: 'day' },
            { label: 'Semana', value: 'week' },
          ]"
        />

        <!-- Filtro por Funcionário -->
        <q-select
          v-model="selectedEmployeeId"
          :options="employeeOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          options-dense
          class="employee-select"
          @update:model-value="loadAppointments"
        />

        <!-- Botão Novo Agendamento -->
        <q-btn unelevated color="primary" no-caps class="q-px-md" @click="openCreateDialog()">
          <Plus :size="18" class="q-mr-xs" />
          Novo Agendamento
        </q-btn>
      </div>
    </div>

    <!-- Navegação de Data -->
    <q-card flat class="q-pa-sm q-mb-md date-nav-card">
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-x-sm">
          <q-btn flat round dense size="sm" @click="navigateDate(-1)">
            <ChevronLeft :size="18" />
          </q-btn>

          <q-btn
            flat
            no-caps
            dense
            class="text-weight-bold text-subtitle1 q-px-sm"
            @click="datePopup = true"
          >
            <Calendar :size="16" class="q-mr-xs text-primary" />
            {{ currentDateDisplay }}
            <q-popup-proxy v-model="datePopup" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="selectedDateStr"
                mask="YYYY-MM-DD"
                @update:model-value="
                  datePopup = false;
                  loadAppointments();
                "
              />
            </q-popup-proxy>
          </q-btn>

          <q-btn flat round dense size="sm" @click="navigateDate(1)">
            <ChevronRight :size="18" />
          </q-btn>

          <q-btn flat dense no-caps size="sm" color="primary" class="q-ml-sm" @click="goToToday">
            Hoje
          </q-btn>
        </div>

        <!-- Legenda rápida de status -->
        <div class="row items-center q-gutter-x-sm gt-xs text-caption">
          <span class="flex items-center"
            ><span class="legend-dot bg-info q-mr-xs"></span>Agendado</span
          >
          <span class="flex items-center"
            ><span class="legend-dot bg-primary q-mr-xs"></span>Confirmado</span
          >
          <span class="flex items-center"
            ><span class="legend-dot bg-warning q-mr-xs"></span>Em Atendimento</span
          >
          <span class="flex items-center"
            ><span class="legend-dot bg-positive q-mr-xs"></span>Concluído</span
          >
          <span class="flex items-center"
            ><span class="legend-dot bg-negative q-mr-xs"></span>Cancelado</span
          >
        </div>
      </div>
    </q-card>

    <!-- Estado de Carregamento -->
    <div v-if="loading" class="q-pa-xl text-center">
      <q-spinner-tail color="primary" size="48px" />
      <div class="text-caption text-grey-6 q-mt-md">Carregando horários da agenda...</div>
    </div>

    <!-- Visualização DIÁRIA -->
    <div v-else-if="viewMode === 'day'" class="day-view-container">
      <q-card flat class="schedule-grid-card">
        <div class="time-grid">
          <div v-for="hour in hoursRange" :key="hour" class="time-row">
            <div class="time-label">{{ hour }}:00</div>
            <div
              class="time-slot-area"
              @click="openCreateDialog(undefined, `${hour.toString().padStart(2, '0')}:00`)"
            >
              <!-- Cards de agendamento que caem nessa hora -->
              <div
                v-for="app in getAppointmentsForHour(hour)"
                :key="app.id"
                class="appointment-card"
                :class="`status-${app.status.toLowerCase()}`"
                @click.stop="openActionMenu(app)"
              >
                <div class="row items-center justify-between no-wrap">
                  <div class="text-weight-bold text-body2 ellipsis">{{ app.clientName }}</div>
                  <AppStatusBadge :status="app.status" />
                </div>
                <div class="text-caption text-grey-8 ellipsis">
                  {{ app.serviceName }} •
                  <span class="text-weight-medium">{{ app.employeeName }}</span>
                </div>
                <div class="row items-center justify-between text-caption text-grey-7 q-mt-xs">
                  <span>{{ formatTimeRange(app.startTime, app.endTime) }}</span>
                  <span class="text-weight-bold text-primary">{{ formatCurrency(app.price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Visualização SEMANAL -->
    <div v-else class="week-view-container">
      <q-card flat class="schedule-grid-card">
        <div class="week-header-row">
          <div class="week-time-gutter"></div>
          <div
            v-for="day in weekDays"
            :key="day.dateStr"
            class="week-day-col-header"
            :class="{ 'is-today': day.isToday }"
          >
            <div class="text-caption text-weight-medium">{{ day.dayName }}</div>
            <div class="text-subtitle1 text-weight-bold">{{ day.dayNumber }}</div>
          </div>
        </div>

        <div class="week-body">
          <div v-for="hour in hoursRange" :key="hour" class="week-time-row">
            <div class="week-time-label">{{ hour }}:00</div>
            <div
              v-for="day in weekDays"
              :key="day.dateStr"
              class="week-day-slot"
              @click="openCreateDialog(day.dateStr, `${hour.toString().padStart(2, '0')}:00`)"
            >
              <div
                v-for="app in getAppointmentsForDayAndHour(day.dateStr, hour)"
                :key="app.id"
                class="appointment-mini-card"
                :class="`status-${app.status.toLowerCase()}`"
                @click.stop="openActionMenu(app)"
              >
                <div class="text-weight-bold text-caption ellipsis">{{ app.clientName }}</div>
                <div class="text-caption ellipsis text-grey-8">{{ app.serviceName }}</div>
                <div class="text-caption text-weight-bold text-primary">
                  {{ formatTimeRange(app.startTime, app.endTime) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Modal de Criação de Agendamento -->
    <AppFormDialog
      v-model="createDialogVisible"
      title="Novo Agendamento"
      subtitle="Selecione o cliente, serviço, profissional e horário"
      width="560px"
      :loading="saving"
      @submit="handleCreateAppointment"
    >
      <div class="q-gutter-y-md">
        <!-- Cliente -->
        <q-select
          v-model="form.clientId"
          label="Cliente *"
          :options="clientOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          use-input
          input-debounce="300"
          :rules="[(val) => !!val || 'Selecione um cliente']"
          @filter="filterClients"
        >
          <template #prepend><User :size="18" class="text-grey-6" /></template>
        </q-select>

        <!-- Profissional -->
        <q-select
          v-model="form.employeeId"
          label="Profissional / Colaborador *"
          :options="employeeFormOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          :rules="[(val) => !!val || 'Selecione um profissional']"
          @update:model-value="fetchAvailableSlots"
        >
          <template #prepend><UserCheck :size="18" class="text-grey-6" /></template>
        </q-select>

        <!-- Serviço -->
        <q-select
          v-model="form.serviceId"
          label="Serviço / Procedimento *"
          :options="serviceOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          :rules="[(val) => !!val || 'Selecione um serviço']"
          @update:model-value="fetchAvailableSlots"
        >
          <template #prepend><Scissors :size="18" class="text-grey-6" /></template>
        </q-select>

        <!-- Data do Atendimento -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.date"
              label="Data *"
              outlined
              dense
              mask="####-##-##"
              :rules="[(val) => !!val || 'Informe a data']"
              @update:model-value="fetchAvailableSlots"
            >
              <template #prepend><Calendar :size="18" class="text-grey-6" /></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-select
              v-model="form.time"
              label="Horário de Início *"
              :options="availableSlotOptions"
              emit-value
              map-options
              outlined
              dense
              :loading="loadingSlots"
              :rules="[(val) => !!val || 'Selecione o horário']"
              hint="Slots livres retornados pelo backend"
            >
              <template #prepend><Clock :size="18" class="text-grey-6" /></template>
            </q-select>
          </div>
        </div>

        <!-- Observações -->
        <q-input
          v-model="form.notes"
          label="Observações / Recomendações"
          type="textarea"
          rows="2"
          outlined
          dense
        />
      </div>
    </AppFormDialog>

    <!-- Menu / Modal de Ações sobre o Agendamento -->
    <q-dialog v-model="actionDialogVisible">
      <q-card style="min-width: 400px; max-width: 500px">
        <q-card-section class="row items-center justify-between border-bottom q-py-md">
          <div>
            <div class="text-subtitle1 text-weight-bold">
              {{ selectedAppointment?.serviceName }}
            </div>
            <div class="text-caption text-grey-6">{{ selectedAppointment?.clientName }}</div>
          </div>
          <AppStatusBadge :status="selectedAppointment?.status" />
        </q-card-section>

        <q-card-section class="q-py-md">
          <div class="text-body2 text-grey-8 q-mb-sm">
            Profissional:
            <span class="text-weight-bold">{{ selectedAppointment?.employeeName }}</span>
          </div>
          <div class="text-body2 text-grey-8 q-mb-sm">
            Horário:
            <span class="text-weight-bold">{{
              formatTimeRange(selectedAppointment?.startTime, selectedAppointment?.endTime)
            }}</span>
          </div>
          <div class="text-body2 text-grey-8 q-mb-md">
            Valor do Serviço:
            <span class="text-weight-bold text-primary">{{
              formatCurrency(selectedAppointment?.price)
            }}</span>
          </div>
          <div
            v-if="selectedAppointment?.notes"
            class="text-caption text-grey-6 bg-grey-2 q-pa-sm rounded-borders"
          >
            Observações: {{ selectedAppointment.notes }}
          </div>
        </q-card-section>

        <!-- Ações de Transição de Estado -->
        <q-card-actions align="right" class="q-pa-md border-top q-gutter-x-sm">
          <q-btn flat label="Fechar" no-caps v-close-popup />

          <!-- Ação: Confirmar -->
          <q-btn
            v-if="selectedAppointment?.status === 'AGENDADO'"
            unelevated
            color="primary"
            no-caps
            label="Confirmar Horário"
            :loading="updatingStatus"
            @click="changeAppointmentStatus('CONFIRMADO')"
          />

          <!-- Ação: Iniciar Atendimento -->
          <q-btn
            v-if="selectedAppointment?.status === 'CONFIRMADO'"
            unelevated
            color="warning"
            text-color="dark"
            no-caps
            label="Iniciar Atendimento"
            :loading="updatingStatus"
            @click="changeAppointmentStatus('EM_ATENDIMENTO')"
          />

          <!-- Ação: Concluir -->
          <q-btn
            v-if="selectedAppointment?.status === 'EM_ATENDIMENTO'"
            unelevated
            color="positive"
            no-caps
            label="Concluir Atendimento"
            :loading="updatingStatus"
            @click="changeAppointmentStatus('CONCLUIDO')"
          />

          <!-- Ação: Cancelar / Não compareceu -->
          <q-btn-dropdown
            v-if="['AGENDADO', 'CONFIRMADO'].includes(selectedAppointment?.status || '')"
            flat
            no-caps
            color="negative"
            label="Mais Opções"
          >
            <q-list dense>
              <q-item clickable v-close-popup @click="changeAppointmentStatus('CANCELADO')">
                <q-item-section class="text-negative">Cancelar Agendamento</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="changeAppointmentStatus('NAO_COMPARECEU')">
                <q-item-section class="text-deep-purple">Marcar Não Compareceu</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import appointmentService from 'src/services/appointmentService';
import employeeService from 'src/services/employeeService';
import clientService from 'src/services/clientService';
import serviceService from 'src/services/serviceService';
import type {
  AppointmentResponse,
  AppointmentStatus,
  AppointmentCreateRequest,
  TimeSlot,
} from 'src/types/appointment';
import type { EmployeeResponse } from 'src/types/employee';
import type { ClientResponse } from 'src/types/client';
import type { ServiceResponse } from 'src/types/service';
import { useFormatters } from 'src/composables/useFormatters';
import { useFeedback } from 'src/composables/useFeedback';
import AppStatusBadge from 'src/components/common/AppStatusBadge.vue';
import AppFormDialog from 'src/components/dialogs/AppFormDialog.vue';
import {
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  UserCheck,
  Scissors,
  Clock,
} from 'lucide-vue-next';

const { formatCurrency, toUtcIsoString } = useFormatters();
const { notifySuccess, handleApiError } = useFeedback();

const loading = ref(false);
const saving = ref(false);
const updatingStatus = ref(false);
const loadingSlots = ref(false);
const datePopup = ref(false);

const viewMode = ref<'day' | 'week'>('day');
const selectedDate = ref(new Date());
const selectedDateStr = ref(formatDateToIso(new Date()));
const selectedEmployeeId = ref<string>('');

const appointments = ref<AppointmentResponse[]>([]);
const employees = ref<EmployeeResponse[]>([]);
const clients = ref<ClientResponse[]>([]);
const services = ref<ServiceResponse[]>([]);
const availableSlots = ref<TimeSlot[]>([]);

const selectedAppointment = ref<AppointmentResponse | null>(null);
const createDialogVisible = ref(false);
const actionDialogVisible = ref(false);

const hoursRange = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const form = reactive({
  clientId: '',
  employeeId: '',
  serviceId: '',
  date: formatDateToIso(new Date()),
  time: '',
  notes: '',
});

function formatDateToIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const currentDateDisplay = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return selectedDate.value.toLocaleDateString('pt-BR', options);
});

const employeeOptions = computed(() => {
  const list = employees.value.map((e) => ({ label: e.name, value: e.id }));
  return [{ label: 'Todos os Profissionais', value: '' }, ...list];
});

const employeeFormOptions = computed(() => {
  return employees.value.filter((e) => e.active).map((e) => ({ label: e.name, value: e.id }));
});

const serviceOptions = computed(() => {
  return services.value
    .filter((s) => s.active)
    .map((s) => ({
      label: `${s.name} — ${formatCurrency(s.price)} (${s.durationMinutes} min)`,
      value: s.id,
    }));
});

const clientOptions = ref<Array<{ label: string; value: string }>>([]);

const availableSlotOptions = computed(() => {
  if (availableSlots.value.length === 0) {
    // Se ainda não buscou ou não há slots, gera slots básicos de hora em hora
    return hoursRange.map((h) => ({
      label: `${h.toString().padStart(2, '0')}:00`,
      value: `${h.toString().padStart(2, '0')}:00`,
    }));
  }
  return availableSlots.value.map((slot) => ({
    label: `${slot.startTime} - ${slot.endTime} ${slot.available ? '(Disponível)' : '(Ocupado)'}`,
    value: slot.startTime,
    disable: !slot.available,
  }));
});

const weekDays = computed(() => {
  const curr = new Date(selectedDate.value);
  const firstDay = curr.getDate() - curr.getDay() + 1; // Segunda-feira
  const days = [];
  const todayStr = formatDateToIso(new Date());

  for (let i = 0; i < 6; i++) {
    const nextDate = new Date(curr.setDate(firstDay + i));
    const dStr = formatDateToIso(nextDate);
    days.push({
      dateStr: dStr,
      dayNumber: nextDate.getDate(),
      dayName: nextDate.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
      isToday: dStr === todayStr,
    });
  }
  return days;
});

async function loadAppointments() {
  loading.value = true;
  try {
    const list = await appointmentService.list({
      date: selectedDateStr.value,
      employeeId: selectedEmployeeId.value || undefined,
    });
    appointments.value = list;
  } catch (err) {
    handleApiError(err, 'Falha ao carregar agendamentos.');
  } finally {
    loading.value = false;
  }
}

async function loadDependencies() {
  try {
    const [empRes, servRes, cliRes] = await Promise.all([
      employeeService.list({ page: 0, size: 50, active: true }),
      serviceService.list({ page: 0, size: 50, active: true }),
      clientService.list({ page: 0, size: 50 }),
    ]);
    employees.value = empRes.content;
    services.value = servRes.content;
    clients.value = cliRes.content;
    clientOptions.value = cliRes.content.map((c) => ({
      label: `${c.name} (${c.phone})`,
      value: c.id,
    }));
  } catch {
    // Silencia erros de dependência caso o backend esteja sem seed
  }
}

function filterClients(val: string, update: (cb: () => void) => void) {
  if (!val) {
    update(() => {
      clientOptions.value = clients.value.map((c) => ({
        label: `${c.name} (${c.phone})`,
        value: c.id,
      }));
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    clientOptions.value = clients.value
      .filter((c) => c.name.toLowerCase().includes(needle) || c.phone.includes(needle))
      .map((c) => ({ label: `${c.name} (${c.phone})`, value: c.id }));
  });
}

async function fetchAvailableSlots() {
  if (!form.employeeId || !form.serviceId || !form.date) return;
  loadingSlots.value = true;
  try {
    const slots = await appointmentService.getAvailableSlots(
      form.employeeId,
      form.date,
      form.serviceId,
    );
    availableSlots.value = slots;
  } catch {
    availableSlots.value = [];
  } finally {
    loadingSlots.value = false;
  }
}

function navigateDate(offset: number) {
  const d = new Date(selectedDate.value);
  if (viewMode.value === 'day') {
    d.setDate(d.getDate() + offset);
  } else {
    d.setDate(d.getDate() + offset * 7);
  }
  selectedDate.value = d;
  selectedDateStr.value = formatDateToIso(d);
  void loadAppointments();
}

function goToToday() {
  selectedDate.value = new Date();
  selectedDateStr.value = formatDateToIso(new Date());
  void loadAppointments();
}

function getAppointmentsForHour(hour: number): AppointmentResponse[] {
  return appointments.value.filter((app) => {
    try {
      const appDate = new Date(app.startTime);
      return appDate.getHours() === hour;
    } catch {
      return false;
    }
  });
}

function getAppointmentsForDayAndHour(dateStr: string, hour: number): AppointmentResponse[] {
  return appointments.value.filter((app) => {
    try {
      const d = new Date(app.startTime);
      return formatDateToIso(d) === dateStr && d.getHours() === hour;
    } catch {
      return false;
    }
  });
}

function formatTimeRange(startIso?: string, endIso?: string): string {
  if (!startIso) return '-';
  try {
    const s = new Date(startIso);
    const sStr = `${s.getHours().toString().padStart(2, '0')}:${s.getMinutes().toString().padStart(2, '0')}`;
    if (!endIso) return sStr;
    const e = new Date(endIso);
    const eStr = `${e.getHours().toString().padStart(2, '0')}:${e.getMinutes().toString().padStart(2, '0')}`;
    return `${sStr} - ${eStr}`;
  } catch {
    return startIso;
  }
}

function openCreateDialog(defaultDate?: string, defaultTime?: string) {
  form.clientId = '';
  form.employeeId = selectedEmployeeId.value || (employees.value[0]?.id ?? '');
  form.serviceId = services.value[0]?.id ?? '';
  form.date = defaultDate || selectedDateStr.value;
  form.time = defaultTime || '09:00';
  form.notes = '';
  availableSlots.value = [];
  createDialogVisible.value = true;
  void fetchAvailableSlots();
}

async function handleCreateAppointment() {
  saving.value = true;
  try {
    const isoStartTime = toUtcIsoString(form.date, form.time);
    const payload: AppointmentCreateRequest = {
      clientId: form.clientId,
      employeeId: form.employeeId,
      serviceId: form.serviceId,
      startTime: isoStartTime,
      notes: form.notes?.trim() || undefined,
    };

    await appointmentService.create(payload);
    notifySuccess('Agendamento criado com sucesso!');
    createDialogVisible.value = false;
    await loadAppointments();
  } catch (err) {
    handleApiError(err, 'Falha ao realizar agendamento. Pode haver choque de horários.');
  } finally {
    saving.value = false;
  }
}

function openActionMenu(app: AppointmentResponse) {
  selectedAppointment.value = app;
  actionDialogVisible.value = true;
}

async function changeAppointmentStatus(newStatus: AppointmentStatus) {
  if (!selectedAppointment.value) return;
  updatingStatus.value = true;
  try {
    await appointmentService.updateStatus(selectedAppointment.value.id, {
      status: newStatus,
    });
    notifySuccess(`Status alterado para ${newStatus}!`);
    actionDialogVisible.value = false;
    await loadAppointments();
  } catch (err) {
    handleApiError(err, 'Erro ao atualizar status do agendamento.');
  } finally {
    updatingStatus.value = false;
  }
}

onMounted(() => {
  void loadDependencies();
  void loadAppointments();
});
</script>

<style scoped lang="scss">
.employee-select {
  min-width: 200px;
}

.date-nav-card {
  border-radius: 10px;
  background: #ffffff;
}

body.body--dark .date-nav-card {
  background: #15171c;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.schedule-grid-card {
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
}

body.body--dark .schedule-grid-card {
  background: #15171c;
}

.time-row {
  display: flex;
  min-height: 80px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:hover .time-slot-area {
    background: rgba(123, 63, 97, 0.02);
  }
}

body.body--dark .time-row {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.time-label {
  width: 70px;
  padding: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.01);
}

body.body--dark .time-label {
  border-right-color: rgba(255, 255, 255, 0.05);
  color: #adb5bd;
}

.time-slot-area {
  flex: 1;
  padding: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  cursor: pointer;
}

.appointment-card {
  width: calc(50% - 4px);
  min-width: 240px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #ffffff;
  border-left: 4px solid #7b3f61;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }

  &.status-agendado {
    border-left-color: #457b9d;
  }
  &.status-confirmado {
    border-left-color: #7b3f61;
  }
  &.status-em_atendimento {
    border-left-color: #e9c46a;
  }
  &.status-concluido {
    border-left-color: #2a9d8f;
  }
  &.status-cancelado {
    border-left-color: #e76f51;
    opacity: 0.7;
  }
  &.status-nao_compareceu {
    border-left-color: #673ab7;
  }
}

body.body--dark .appointment-card {
  background: #1e2129;
}

.week-header-row {
  display: flex;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.02);
}

body.body--dark .week-header-row {
  background: rgba(255, 255, 255, 0.02);
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.week-time-gutter {
  width: 60px;
}

.week-day-col-header {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  border-left: 1px solid rgba(0, 0, 0, 0.05);

  &.is-today {
    background: rgba(123, 63, 97, 0.08);
    color: #7b3f61;
  }
}

.week-time-row {
  display: flex;
  min-height: 70px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.week-time-label {
  width: 60px;
  padding: 8px;
  font-size: 0.75rem;
  color: #6c757d;
  text-align: center;
}

.week-day-slot {
  flex: 1;
  border-left: 1px solid rgba(0, 0, 0, 0.05);
  padding: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    background: rgba(123, 63, 97, 0.02);
  }
}

.appointment-mini-card {
  padding: 4px 6px;
  border-radius: 6px;
  background: #ffffff;
  border-left: 3px solid #7b3f61;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  font-size: 0.75rem;
}

body.body--dark .appointment-mini-card {
  background: #1e2129;
}
</style>
