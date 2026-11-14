<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card :style="{ minWidth: width, maxWidth: '95vw' }">
      <!-- Cabeçalho -->
      <q-card-section class="row items-center justify-between border-bottom q-py-md">
        <div>
          <div class="text-subtitle1 text-weight-bold">{{ title }}</div>
          <div v-if="subtitle" class="text-caption text-grey-6">{{ subtitle }}</div>
        </div>
        <q-btn flat round dense icon="close" v-close-popup :disable="loading" />
      </q-card-section>

      <!-- Corpo / Formulário -->
      <q-form @submit.prevent="$emit('submit')">
        <q-card-section class="q-pa-md">
          <slot />
        </q-card-section>

        <!-- Ações do Rodapé -->
        <q-card-actions align="right" class="q-pa-md border-top">
          <q-btn
            flat
            :label="cancelLabel"
            no-caps
            color="grey-7"
            v-close-popup
            :disable="loading"
          />
          <q-btn
            unelevated
            type="submit"
            :label="submitLabel"
            no-caps
            color="primary"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
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

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

body.body--dark .border-bottom {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}
body.body--dark .border-top {
  border-top-color: rgba(255, 255, 255, 0.08);
}
</style>
