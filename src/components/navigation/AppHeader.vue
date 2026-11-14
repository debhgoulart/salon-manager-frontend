<template>
  <q-header class="app-header">
    <q-toolbar class="q-px-md toolbar-height">
      <!-- Toggle Drawer -->
      <q-btn
        flat
        dense
        round
        class="q-mr-sm text-grey-8 header-icon-btn"
        @click="themeStore.toggleDrawer"
        aria-label="Menu Lateral"
      >
        <Menu :size="18" />
      </q-btn>

      <!-- Título Dinâmico / Branding -->
      <q-toolbar-title class="text-subtitle1 text-weight-bold editorial-title">
        SALON MANAGER
      </q-toolbar-title>

      <q-space />

      <!-- Alternador de Modo Escuro / Claro -->
      <q-btn
        flat
        round
        dense
        class="q-mr-sm header-icon-btn"
        @click="themeStore.toggleDark"
        :aria-label="themeStore.isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'"
      >
        <Sun v-if="themeStore.isDark" :size="18" class="text-grey-4" />
        <Moon v-else :size="18" class="text-grey-8" />
        <q-tooltip>{{ themeStore.isDark ? 'Modo Claro' : 'Modo Escuro' }}</q-tooltip>
      </q-btn>

      <!-- Perfil do Usuário & Dropdown -->
      <q-btn flat no-caps class="q-px-sm profile-btn">
        <q-avatar size="32px" class="profile-avatar text-weight-bold text-caption">
          {{ userInitials }}
        </q-avatar>
        <div class="q-ml-sm text-left gt-xs">
          <div class="text-caption text-weight-bold leading-tight">
            {{ authStore.user?.name || 'Operador' }}
          </div>
          <div class="text-caption text-grey-6 text-weight-regular leading-tight">
            {{ roleLabel }}
          </div>
        </div>

        <!-- Menu Dropdown -->
        <q-menu auto-close class="profile-menu">
          <q-list style="min-width: 200px" class="q-py-xs">
            <q-item clickable to="/configuracoes">
              <q-item-section avatar>
                <Settings :size="16" />
              </q-item-section>
              <q-item-section class="text-caption text-weight-medium">Configurações</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="handleLogout" class="text-negative">
              <q-item-section avatar>
                <LogOut :size="16" />
              </q-item-section>
              <q-item-section class="text-caption text-weight-bold">Sair do Sistema</q-item-section>
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
  background-color: #ffffff;
  color: #09090b;
  border-bottom: 1px solid #e4e4e7;
}

body.body--dark .app-header {
  background-color: #09090b;
  color: #f4f4f5;
  border-bottom: 1px solid #27272a;
}

.toolbar-height {
  min-height: 54px;
}

.profile-avatar {
  background-color: #09090b;
  color: #ffffff;
  border: 1px solid #27272a;
}

body.body--dark .profile-avatar {
  background-color: #f4f4f5;
  color: #09090b;
  border: 1px solid #e4e4e7;
}

.leading-tight {
  line-height: 1.2;
}

.header-icon-btn {
  width: 36px;
  height: 36px;
}
</style>
