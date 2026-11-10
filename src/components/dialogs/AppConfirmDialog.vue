<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 380px; max-width: 460px">
      <q-card-section class="row items-center q-pb-none">
        <div class="confirm-icon-wrap q-mr-md" :class="`bg-${color}-1 text-${color}`">
          <component :is="icon || AlertCircle" :size="24" />
        </div>
        <div>
          <div class="text-subtitle1 text-weight-bold">{{ title }}</div>
          <div class="text-caption text-grey-6">{{ subtitle }}</div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-md text-body2 text-grey-8">
        {{ message }}
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md q-pt-none">
        <q-btn flat :label="cancelLabel" no-caps color="grey-7" v-close-popup :disable="loading" />
        <q-btn
          unelevated
          :label="confirmLabel"
          no-caps
          :color="color"
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
  }
);

defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'confirm'): void;
}>();
</script>

<style scoped>
.confirm-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
