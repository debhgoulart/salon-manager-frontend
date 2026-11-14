<template>
  <div class="column flex-center q-pa-xl text-center">
    <div class="error-icon-wrap q-mb-md">
      <AlertTriangle :size="32" class="text-negative" />
    </div>
    <div class="text-subtitle1 text-weight-bold editorial-title text-negative">
      {{ title }}
    </div>
    <div class="text-caption text-grey-6 q-mt-xs" style="max-width: 360px">
      {{ description }}
    </div>
    <q-btn
      v-if="showRetry"
      unelevated
      color="primary"
      class="q-mt-lg retry-btn"
      no-caps
      label="Tentar Novamente"
      @click="$emit('retry')"
    />
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    showRetry?: boolean;
  }>(),
  {
    title: 'Falha ao carregar dados',
    description:
      'Não foi possível se comunicar com o servidor. Verifique sua conexão e tente novamente.',
    showRetry: true,
  },
);

defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<style scoped lang="scss">
.error-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: rgba(225, 29, 72, 0.08);
  border: 1px solid rgba(225, 29, 72, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.retry-btn {
  min-height: 44px;
  padding: 0 24px;
  font-weight: 600;
}
</style>
