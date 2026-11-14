<template>
  <div class="column flex-center q-pa-xl text-center empty-state">
    <div class="empty-icon-wrap q-mb-md">
      <Inbox :size="40" class="text-grey-5" />
    </div>
    <div class="text-subtitle1 text-weight-bold text-grey-8">{{ title }}</div>
    <div class="text-caption text-grey-6 q-mt-xs" style="max-width: 320px">
      {{ description }}
    </div>
    <div v-if="$slots.action" class="q-mt-md">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {
    title: 'Nenhum registro encontrado',
    description: 'Não há itens correspondentes aos filtros aplicados.',
  },
);
</script>

<style scoped>
.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
}

body.body--dark .empty-icon-wrap {
  background: rgba(255, 255, 255, 0.05);
}
</style>
