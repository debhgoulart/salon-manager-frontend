<template>
  <q-header elevated class="app-header">
    <q-toolbar class="q-px-md">
      <!-- Toggle Drawer -->
      <q-btn
        flat
        dense
        round
        class="q-mr-sm"
        @click="themeStore.toggleDrawer"
        aria-label="Menu Lateral"
      >
        <Menu :size="20" />
      </q-btn>

      <!-- Título Dinâmico / Branding -->
      <q-toolbar-title class="text-subtitle1 text-weight-medium"> Salon Manager </q-toolbar-title>

      <q-space />

      <!-- Alternador de Modo Escuro / Claro -->
      <q-btn
        flat
        round
        dense
        class="q-mr-sm"
        @click="themeStore.toggleDark"
        :aria-label="themeStore.isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'"
      >
        <Sun v-if="themeStore.isDark" :size="20" class="text-warning" />
        <Moon v-else :size="20" class="text-grey-8" />
        <q-tooltip>{{ themeStore.isDark ? 'Modo Claro' : 'Modo Escuro' }}</q-tooltip>
      </q-btn>

      <!-- Perfil do Usuário & Dropdown -->
      <q-btn flat no-caps class="q-px-sm profile-btn">
        <q-avatar size="32px" class="bg-primary text-white text-weight-bold text-caption">
          {{ userInitials }}
        </q-avatar>
        <div class="q-ml-sm text-left gt-xs">
          <div class="text-caption text-weight-bold leading-tight">
            {{ authStore.user?.name || 'Usuário' }}
          </div>
          <div class="text-caption text-grey-6 text-weight-regular leading-tight">
            {{ roleLabel }}
          </div>
        </div>

        <!-- Menu Dropdown -->
        <q-menu auto-close class="profile-menu">
          <q-list style="min-width: 200px">
            <q-item clickable to="/configuracoes">
              <q-item-section avatar>
                <Settings :size="18" />
              </q-item-section>
              <q-item-section>Configurações</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="handleLogout" class="text-negative">
              <q-item-section avatar>
                <LogOut :size="18" />
              </q-item-section>
              <q-item-section>Sair do Sistema</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useThemeStore } from 'src/stores/theme';
import { Menu, Sun, Moon, Settings, LogOut } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const userInitials = computed(() => {
  const name = authStore.user?.name || 'A';
  return name.slice(0, 2).toUpperCase();
});

const roleLabel = computed(() => {
  switch (authStore.user?.role) {
    case 'ROLE_ADMIN':
      return 'Administrador';
    case 'ROLE_MANAGER':
      return 'Gerente';
    case 'ROLE_RECEPTIONIST':
      return 'Recepcionista';
    case 'ROLE_PROFESSIONAL':
      return 'Profissional';
    default:
      return 'Operador';
  }
});

async function handleLogout() {
  authStore.logout();
  await router.push('/login');
}
</script>

<style scoped lang="scss">
.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: #212529;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

body.body--dark .app-header {
  background: rgba(21, 23, 28, 0.95);
  color: #f1f3f5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.leading-tight {
  line-height: 1.2;
}
</style>
