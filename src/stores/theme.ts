import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Dark, LocalStorage } from 'quasar';

const THEME_KEY = 'salon_theme_dark';

export const useThemeStore = defineStore('theme', () => {
  const savedDark = LocalStorage.getItem<boolean>(THEME_KEY);
  const isDark = ref<boolean>(savedDark !== null ? savedDark : false);
  const leftDrawerOpen = ref<boolean>(true);
  const miniState = ref<boolean>(false);

  // Sincroniza estado inicial com Quasar
  Dark.set(isDark.value);

  function toggleDark() {
    isDark.value = !isDark.value;
    Dark.set(isDark.value);
    LocalStorage.set(THEME_KEY, isDark.value);
  }

  function toggleDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }

  function toggleMiniState() {
    miniState.value = !miniState.value;
  }

  return {
    isDark,
    leftDrawerOpen,
    miniState,
    toggleDark,
    toggleDrawer,
    toggleMiniState,
  };
});
