<template>
  <AppFormDialog
    :model-value="modelValue"
    :title="isBlocking ? 'Bloquear Horário na Agenda' : 'Novo Agendamento'"
    :subtitle="
      isBlocking
        ? 'Defina o profissional, intervalo e motivo do bloqueio'
        : 'Selecione o cliente, serviço, profissional e horário'
    "
    width="560px"
    :loading="saving"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleSubmit"
  >
    <div class="q-gutter-y-md">
      <!-- Alternador Tipo: Atendimento vs Bloqueio (US4) -->
      <div class="row justify-end q-mb-xs">
        <q-btn-toggle
          v-model="isBlocking"
          dense
          no-caps
          unelevated
          rounded
          size="sm"
          color="grey-3"
          text-color="grey-8"
          toggle-color="secondary"
          toggle-text-color="white"
          :options="[
            { label: 'Atendimento', value: false },
            { label: 'Bloquear Horário', value: true },
          ]"
          @update:model-value="onTypeToggle"
        />
      </div>

      <!-- Cliente (Oculto em modo de bloqueio) -->
      <q-select
        v-if="!isBlocking"
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
        @update:model-value="onDependencyChange"
      >
        <template #prepend><UserCheck :size="18" class="text-grey-6" /></template>
      </q-select>

      <!-- Serviço / Procedimento -->
      <q-select
        v-model="form.serviceId"
        :label="isBlocking ? 'Categoria do Bloqueio *' : 'Serviço / Procedimento *'"
        :options="serviceOptions"
        option-label="label"
        option-value="value"
        emit-value
        map-options
        outlined
        dense
        :rules="[(val) => !!val || 'Selecione um procedimento']"
        @update:model-value="onDependencyChange"
      >
        <template #prepend><Scissors :size="18" class="text-grey-6" /></template>
      </q-select>

      <!-- Data e Horário -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-input
            v-model="form.date"
            label="Data *"
            outlined
            dense
            mask="####-##-##"
            :rules="[(val) => !!val || 'Informe a data']"
            @update:model-value="onDependencyChange"
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

      <!-- Observações / Motivo -->
      <q-input
        v-model="form.notes"
        :label="isBlocking ? 'Motivo do Bloqueio *' : 'Observações / Recomendações'"
        :placeholder="isBlocking ? 'Ex: Intervalo de Almoço, Consulta Médica, Folga' : ''"
        type="textarea"
        rows="2"
        outlined
        dense
        :rules="isBlocking ? [(val) => !!val?.trim() || 'Informe o motivo do bloqueio'] : []"
      />
    </div>
  </AppFormDialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import type { AppointmentCreateRequest } from 'src/types/appointment';
import appointmentService from 'src/services/appointmentService';
import { useAppointmentSlots } from '../composables/useAppointmentSlots';
import { useAppointmentDependencies } from '../composables/useAppointmentDependencies';
import { useFormatters } from 'src/composables/useFormatters';
import { useFeedback } from 'src/composables/useFeedback';
import AppFormDialog from 'src/components/dialogs/AppFormDialog.vue';
import { User, UserCheck, Scissors, Calendar, Clock } from 'lucide-vue-next';

interface Props {
  modelValue: boolean;
  initialDate?: string;
  initialTime?: string;
  defaultEmployeeId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  initialDate: '',
  initialTime: '09:00',
  defaultEmployeeId: null,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created'): void;
}>();

const { toUtcIsoString } = useFormatters();
const { notifySuccess, handleApiError } = useFeedback();
const { loadingSlots, availableSlotOptions, fetchAvailableSlots, resetSlots } =
  useAppointmentSlots();
const {
  employees,
  clients,
  services,
  employeeFormOptions,
  serviceOptions,
  clientOptions,
  loadDependencies,
  filterClients,
} = useAppointmentDependencies();

const saving = ref(false);
const isBlocking = ref(false);

const form = reactive({
  clientId: '',
  employeeId: '',
  serviceId: '',
  date: '',
  time: '09:00',
  notes: '',
});

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      isBlocking.value = false;
      form.clientId = '';
      form.employeeId = props.defaultEmployeeId || employees.value[0]?.id || '';
      form.serviceId = services.value[0]?.id || '';
      form.date = props.initialDate || '';
      form.time = props.initialTime || '09:00';
      form.notes = '';
      resetSlots();
      void onDependencyChange();
    }
  },
);

async function onDependencyChange() {
  if (form.employeeId && form.serviceId && form.date) {
    await fetchAvailableSlots({
      employeeId: form.employeeId,
      date: form.date,
      serviceId: form.serviceId,
    });
  }
}

function onTypeToggle(blocking: boolean) {
  if (blocking) {
    if (clients.value.length > 0 && clients.value[0]) {
      form.clientId = clients.value[0].id;
    }
    if (!form.notes.startsWith('BLOQUEIO:')) {
      form.notes = 'BLOQUEIO: Intervalo de Atendimento';
    }
  } else {
    form.clientId = '';
    form.notes = '';
  }
}

async function handleSubmit() {
  saving.value = true;
  try {
    const isoStartTime = toUtcIsoString(form.date, form.time);
    const finalNotes = isBlocking.value
      ? form.notes.startsWith('BLOQUEIO:')
        ? form.notes
        : `BLOQUEIO: ${form.notes}`
      : form.notes?.trim() || undefined;

    const payload: AppointmentCreateRequest = {
      clientId: form.clientId,
      employeeId: form.employeeId,
      serviceId: form.serviceId,
      startTime: isoStartTime,
      notes: finalNotes,
    };

    await appointmentService.create(payload);
    notifySuccess(
      isBlocking.value ? 'Horário bloqueado com sucesso!' : 'Agendamento criado com sucesso!',
    );
    emit('update:modelValue', false);
    emit('created');
  } catch (err) {
    handleApiError(err, 'Falha ao realizar agendamento. Pode haver choque de horários.');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void loadDependencies();
});
</script>
