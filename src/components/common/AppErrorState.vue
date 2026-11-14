<template>
  <div class="column flex-center q-pa-xl text-center">
    <div class="error-icon-wrap q-mb-md">
      <AlertTriangle :size="36" class="text-negative" />
    </div>
    <div class="text-subtitle1 text-weight-bold text-negative">{{ title }}</div>
    <div class="text-caption text-grey-6 q-mt-xs" style="max-width: 340px">
      {{ description }}
    </div>
    <q-btn
      v-if="showRetry"
      unelevated
      color="primary"
      class="q-mt-md"
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
      'Não foi possível se comunicar com o servidor. Verifique a conexão e tente novamente.',
    showRetry: true,
  },
);

defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<style scoped>
.error-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(231, 111, 81, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
