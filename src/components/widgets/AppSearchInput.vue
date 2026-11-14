<template>
  <q-input
    v-model="internalValue"
    outlined
    dense
    :placeholder="placeholder"
    class="app-search-input"
    clearable
    @update:model-value="handleInput"
  >
    <template #prepend>
      <Search :size="18" class="text-grey-6" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Search } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    debounce?: number;
  }>(),
  {
    modelValue: '',
    placeholder: 'Buscar...',
    debounce: 350,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}>();

const internalValue = ref(props.modelValue);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;
  },
);

function handleInput(val: string | number | null) {
  const str = String(val || '');
  emit('update:modelValue', str);

  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    emit('search', str);
  }, props.debounce);
}
</script>

<style scoped>
.app-search-input {
  min-width: 240px;
}
</style>
