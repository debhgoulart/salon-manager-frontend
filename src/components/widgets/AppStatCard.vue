<template>
  <q-card class="app-stat-card q-pa-md">
    <div v-if="loading" class="q-gutter-y-xs">
      <q-skeleton type="text" width="40%" height="16px" />
      <q-skeleton type="text" width="70%" height="32px" />
      <q-skeleton type="text" width="50%" height="14px" />
    </div>

    <div v-else class="row items-center justify-between no-wrap">
      <div>
        <div class="stat-label text-grey-7">{{ label }}</div>
        <div class="stat-value text-currency q-my-xs" :class="valueClass">
          {{ value }}
        </div>
        <div v-if="subtitle" class="text-caption text-grey-6">{{ subtitle }}</div>
      </div>

      <div class="icon-wrap" :style="{ backgroundColor: iconBgColor, color: iconColor }">
        <component :is="icon" :size="20" />
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
    color: '#09090B',
    loading: false,
    valueClass: '',
  },
);

const iconColor = computed(() => props.color);
const iconBgColor = computed(() => {
  if (props.color.startsWith('#')) {
    return `${props.color}14`; // 8% opacity hex
  }
  return 'rgba(9, 9, 11, 0.06)';
});
</script>

<style scoped lang="scss">
.app-stat-card {
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid #e4e4e7;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: #d4d4d8;
  }
}

body.body--dark .app-stat-card {
  border: 1px solid #27272a;

  &:hover {
    border-color: #3f3f46;
  }
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
