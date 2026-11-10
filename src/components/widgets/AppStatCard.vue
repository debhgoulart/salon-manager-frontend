<template>
  <q-card class="app-stat-card q-pa-md">
    <div v-if="loading" class="q-gutter-y-xs">
      <q-skeleton type="text" width="40%" height="20px" />
      <q-skeleton type="text" width="70%" height="32px" />
      <q-skeleton type="text" width="50%" height="16px" />
    </div>

    <div v-else class="row items-center justify-between no-wrap">
      <div>
        <div class="text-caption text-weight-medium text-grey-7">{{ label }}</div>
        <div class="text-h5 text-weight-bold q-my-xs text-currency" :class="valueClass">
          {{ value }}
        </div>
        <div v-if="subtitle" class="text-caption text-grey-6">{{ subtitle }}</div>
      </div>

      <div class="icon-wrap" :style="{ backgroundColor: iconBgColor, color: iconColor }">
        <component :is="icon" :size="24" />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    subtitle?: string;
    icon: unknown;
    color?: string; // hex or quasar color
    loading?: boolean;
    valueClass?: string;
  }>(),
  {
    subtitle: '',
    color: '#7B3F61',
    loading: false,
    valueClass: '',
  }
);

const iconColor = computed(() => props.color);
const iconBgColor = computed(() => {
  if (props.color.startsWith('#')) {
    return `${props.color}15`; // 15% opacity hex
  }
  return 'rgba(123, 63, 97, 0.1)';
});
</script>

<style scoped lang="scss">
.app-stat-card {
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
