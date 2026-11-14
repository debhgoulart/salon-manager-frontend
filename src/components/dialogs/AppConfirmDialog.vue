<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="confirm-card" style="min-width: 380px; max-width: 460px">
      <q-card-section class="row items-center q-pb-none">
        <div class="confirm-icon-wrap q-mr-md" :class="`icon-tone-${color}`">
          <component :is="icon || AlertCircle" :size="20" />
        </div>
        <div>
          <div class="text-subtitle1 text-weight-bold editorial-title">{{ title }}</div>
          <div class="text-caption text-grey-6">{{ subtitle }}</div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-md text-body2 text-grey-8">
        {{ message }}
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md q-pt-none q-gutter-x-sm">
        <q-btn
          flat
          :label="cancelLabel"
          no-caps
          color="grey-7"
          class="confirm-action-btn"
          v-close-popup
          :disable="loading"
        />
        <q-btn
          unelevated
          :label="confirmLabel"
          no-caps
          :color="color"
          class="confirm-action-btn"
          :loading="loading"
          @click="$emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    subtitle?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    color?: string;
    icon?: unknown;
    loading?: boolean;
  }>(),
  {
    subtitle: '',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    color: 'negative',
    loading: false,
  },
);

defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'confirm'): void;
}>();
</script>

<style scoped lang="scss">
.confirm-card {
  border-radius: 12px;
  border: 1px solid #e4e4e7;
}

body.body--dark .confirm-card {
  border-color: #27272a;
}

.confirm-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-tone-negative {
  background-color: rgba(225, 29, 72, 0.1);
  color: #e11d48;
}

.icon-tone-primary {
  background-color: rgba(9, 9, 11, 0.08);
  color: #09090b;
}

body.body--dark .icon-tone-primary {
  background-color: rgba(244, 244, 245, 0.12);
  color: #f4f4f5;
}

.confirm-action-btn {
  min-height: 44px;
  padding: 0 18px;
  font-weight: 600;
}
</style>
