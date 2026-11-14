<template>
  <div class="column flex-center q-pa-xl text-center empty-state">
    <div class="empty-icon-wrap q-mb-md">
      <Inbox :size="32" class="text-grey-6" />
    </div>
    <div class="text-subtitle1 text-weight-bold editorial-title text-grey-9">
      {{ title }}
    </div>
    <div class="text-caption text-grey-6 q-mt-xs" style="max-width: 340px">
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

<style scoped lang="scss">
.empty-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: #f4f4f5;
  border: 1px solid #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: center;
}

body.body--dark .empty-icon-wrap {
  background-color: #18181b;
  border-color: #27272a;
}
</style>
