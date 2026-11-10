<template>
  <div class="column flex-center q-pa-xl text-center">
    <q-spinner-tail color="primary" size="48px" />
    <div class="text-caption text-grey-6 q-mt-md">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: 'Carregando dados...',
  }
);
</script>
