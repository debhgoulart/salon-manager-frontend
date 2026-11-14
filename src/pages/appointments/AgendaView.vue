<template>
  <q-page class="q-pa-lg">
    <!-- Topbar & Controles da Agenda -->
    <AgendaHeader
      :view-mode="viewMode"
      :selected-employee-id="selectedEmployeeId"
      :employee-options="employeeOptions"
      @update:view-mode="viewMode = $event"
      @update:selected-employee-id="handleEmployeeFilterChange"
      @create="openCreateDialog()"
    />

    <!-- Navegação de Data e Legenda -->
    <AgendaDateNav
      :selected-date-str="selectedDateStr"
      :current-date-display="currentDateDisplay"
      @navigate="navigateDate"
      @select-date="handleDateSelect"
      @today="goToToday"
    />

    <!-- Estado 1: Carregamento (Loading State) -->
    <div v-if="loading" class="q-pa-xl text-center">
      <q-spinner-tail color="primary" size="48px" />
      <div class="text-caption text-grey-6 q-mt-md">Carregando horários da agenda...</div>
    </div>

    <!-- Estado 2: Erro (Error State) -->
    <div v-else-if="loadError" class="q-pa-md">
      <AppErrorState
        title="Falha ao carregar horários da agenda"
        message="Não foi possível sincronizar os agendamentos com o servidor. Verifique sua conexão e tente novamente."
        action-label="Tentar Novamente"
        @retry="loadAppointments(selectedDateStr, selectedEmployeeId)"
      />
    </div>

    <!-- Estado 3: Lista Vazia (Empty State) -->
    <div v-else-if="appointments.length === 0" class="q-pa-md">
      <AppEmptyState
        title="Nenhum agendamento para esta data"
        description="Não há horários marcados para o filtro selecionado. Clique abaixo para cadastrar um novo atendimento."
      >
        <template #action>
          <q-btn
            unelevated
            color="primary"
            no-caps
            label="Novo Agendamento"
            @click="openCreateDialog()"
          />
        </template>
      </AppEmptyState>
    </div>

    <!-- Estado 4: Sucesso (Visualização Diária ou Semanal) -->
    <template v-else>
      <!-- Grade Diária -->
      <AgendaDayGrid
        v-if="viewMode === 'day'"
        :hours-range="hoursRange"
        :get-appointments-for-hour="getAppointmentsForHour"
        @slot-click="handleDaySlotClick"
        @appointment-click="handleAppointmentClick"
      />

      <!-- Grade Semanal -->
      <AgendaWeekGrid
        v-else
        :hours-range="hoursRange"
        :week-days="weekDays"
        :get-appointments-for-day-and-hour="getAppointmentsForDayAndHour"
        @slot-click="handleWeekSlotClick"
        @appointment-click="handleAppointmentClick"
      />
    </template>

    <!-- Modal de Criação / Bloqueio de Agendamento -->
    <AppointmentCreateDialog
      v-model="createDialogVisible"
      :initial-date="dialogInitialDate"
      :initial-time="dialogInitialTime"
      :default-employee-id="selectedEmployeeId"
      @created="loadAppointments(selectedDateStr, selectedEmployeeId)"
    />

    <!-- Modal de Ação e Transição de Status -->
    <AppointmentActionDialog
      v-model="actionDialogVisible"
      :appointment="selectedAppointment"
      :loading="updatingStatus"
      @change-status="handleStatusChange"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { AppointmentResponse, AppointmentStatus } from 'src/types/appointment';
import type { EmployeeResponse } from 'src/types/employee';
import employeeService from 'src/services/employeeService';
import { useAgendaNavigation } from './composables/useAgendaNavigation';
import { useAppointmentState } from './composables/useAppointmentState';
import AgendaHeader from './components/AgendaHeader.vue';
import AgendaDateNav from './components/AgendaDateNav.vue';
import AgendaDayGrid from './components/AgendaDayGrid.vue';
import AgendaWeekGrid from './components/AgendaWeekGrid.vue';
import AppointmentCreateDialog from './components/AppointmentCreateDialog.vue';
import AppointmentActionDialog from './components/AppointmentActionDialog.vue';
import AppEmptyState from 'src/components/common/AppEmptyState.vue';
import AppErrorState from 'src/components/common/AppErrorState.vue';

const {
  viewMode,
  selectedDateStr,
  currentDateDisplay,
  weekDays,
  hoursRange,
  navigateDate: navDate,
  goToToday: navToday,
  setDate,
} = useAgendaNavigation();

const {
  appointments,
  loading,
  loadError,
  selectedEmployeeId,
  loadAppointments,
  getAppointmentsForHour,
  getAppointmentsForDayAndHour,
  changeAppointmentStatus,
} = useAppointmentState();

const employees = ref<EmployeeResponse[]>([]);
const selectedAppointment = ref<AppointmentResponse | null>(null);
const createDialogVisible = ref(false);
const actionDialogVisible = ref(false);
const updatingStatus = ref(false);

const dialogInitialDate = ref('');
const dialogInitialTime = ref('09:00');

const employeeOptions = computed(() => {
  const list = employees.value.map((e) => ({ label: e.name, value: e.id }));
  return [{ label: 'Todos os Profissionais', value: null }, ...list];
});

watch(selectedDateStr, (newDate) => {
  void loadAppointments(newDate, selectedEmployeeId.value);
});

function handleEmployeeFilterChange(employeeId: string | null) {
  selectedEmployeeId.value = employeeId;
  void loadAppointments(selectedDateStr.value, employeeId);
}

function navigateDate(delta: number) {
  navDate(delta);
}

function handleDateSelect(date: string) {
  setDate(date);
}

function goToToday() {
  navToday();
}

function openCreateDialog(defaultDate?: string, defaultTime?: string) {
  dialogInitialDate.value = defaultDate || selectedDateStr.value;
  dialogInitialTime.value = defaultTime || '09:00';
  createDialogVisible.value = true;
}

function handleDaySlotClick(hour: number) {
  openCreateDialog(selectedDateStr.value, `${hour.toString().padStart(2, '0')}:00`);
}

function handleWeekSlotClick(payload: { dateStr: string; hour: number }) {
  openCreateDialog(payload.dateStr, `${payload.hour.toString().padStart(2, '0')}:00`);
}

function handleAppointmentClick(app: AppointmentResponse) {
  selectedAppointment.value = app;
  actionDialogVisible.value = true;
}

async function handleStatusChange(newStatus: AppointmentStatus) {
  if (!selectedAppointment.value) return;
  updatingStatus.value = true;
  try {
    const success = await changeAppointmentStatus(selectedAppointment.value.id, newStatus);
    if (success) {
      actionDialogVisible.value = false;
      await loadAppointments(selectedDateStr.value, selectedEmployeeId.value);
    }
  } finally {
    updatingStatus.value = false;
  }
}

async function loadEmployees() {
  try {
    const res = await employeeService.list({ page: 0, size: 50, active: true });
    employees.value = res.content;
  } catch {
    // Resiliente caso backend esteja sem dados
  }
}

onMounted(async () => {
  await Promise.all([
    loadEmployees(),
    loadAppointments(selectedDateStr.value, selectedEmployeeId.value),
  ]);
});
</script>
