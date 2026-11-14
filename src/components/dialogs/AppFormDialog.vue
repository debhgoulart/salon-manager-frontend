<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="dialog-card" :style="{ minWidth: width, maxWidth: '95vw' }">
      <!-- Cabeçalho -->
      <q-card-section class="row items-center justify-between border-bottom q-py-md">
        <div>
          <div class="text-subtitle1 text-weight-bold editorial-title">{{ title }}</div>
          <div v-if="subtitle" class="text-caption text-grey-6">{{ subtitle }}</div>
        </div>
        <q-btn
          flat
          round
          dense
          class="dialog-close-btn"
          aria-label="Fechar"
          v-close-popup
          :disable="loading"
        >
          <X :size="18" />
        </q-btn>
      </q-card-section>

      <!-- Corpo / Formulário -->
      <q-form @submit.prevent="$emit('submit')">
        <q-card-section class="q-pa-md">
          <slot />
        </q-card-section>

        <!-- Ações do Rodapé -->
        <q-card-actions align="right" class="q-pa-md border-top q-gutter-x-sm">
          <q-btn
            flat
            :label="cancelLabel"
            no-caps
            color="grey-7"
            class="dialog-action-btn"
            v-close-popup
            :disable="loading"
          />
          <q-btn
            unelevated
            type="submit"
            :label="submitLabel"
            no-caps
            color="primary"
            class="dialog-action-btn"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    subtitle?: string;
    width?: string;
    submitLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
  }>(),
  {
    subtitle: '',
    width: '520px',
    submitLabel: 'Salvar',
    cancelLabel: 'Cancelar',
    loading: false,
  },
);

defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit'): void;
}>();
</script>

<style scoped lang="scss">
.dialog-card {
  border-radius: 12px;
  border: 1px solid #e4e4e7;
}

body.body--dark .dialog-card {
  border-color: #27272a;
}

.border-bottom {
  border-bottom: 1px solid #e4e4e7;
}

.border-top {
  border-top: 1px solid #e4e4e7;
}

body.body--dark .border-bottom {
  border-bottom-color: #27272a;
}

body.body--dark .border-top {
  border-top-color: #27272a;
}

.dialog-close-btn {
  width: 36px;
  height: 36px;
  color: #71717a;
}

.dialog-action-btn {
  min-height: 44px;
  padding: 0 18px;
  font-weight: 600;
}
</style>
