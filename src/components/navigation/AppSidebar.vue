<template>
  <q-drawer
    v-model="themeStore.leftDrawerOpen"
    show-if-above
    :mini="themeStore.miniState"
    :width="260"
    :breakpoint="1024"
    bordered
    class="app-sidebar"
  >
    <!-- Brand / Top Logo -->
    <div class="sidebar-brand q-pa-md flex items-center justify-between">
      <div class="flex items-center no-wrap cursor-pointer" @click="$router.push('/')">
        <div class="brand-mini-logo flex flex-center">
          <span>SM</span>
          <span class="mini-brand-dot" />
        </div>
        <div v-if="!themeStore.miniState" class="q-ml-sm brand-title">
          <div class="text-subtitle2 text-weight-bold editorial-title">SALON MANAGER</div>
          <div class="text-caption text-grey-6 font-caption-tight">ESTHÉTIQUE &bull; FASHION</div>
        </div>
      </div>

      <q-btn
        v-if="!themeStore.miniState"
        flat
        dense
        round
        size="sm"
        class="gt-sm text-grey-6"
        aria-label="Recolher Menu"
        @click="themeStore.toggleMiniState"
      >
        <ChevronLeft :size="18" />
      </q-btn>
    </div>

    <q-separator />

    <!-- Navegação / Módulos -->
    <q-scroll-area class="fit q-py-sm">
      <q-list padding class="menu-list">
        <template v-for="item in visibleMenuItems" :key="item.path">
          <q-item
            clickable
            v-ripple
            :to="item.path"
            exact
            active-class="active-menu-item"
            class="menu-item q-mx-sm q-my-xs"
          >
            <q-item-section avatar class="item-icon-section">
              <component :is="item.icon" :size="18" />
            </q-item-section>

            <q-item-section class="text-caption text-weight-medium">
              {{ item.title }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useThemeStore } from 'src/stores/theme';
import type { Role } from 'src/types/auth';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Scissors,
  DollarSign,
  Award,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
} from 'lucide-vue-next';

interface MenuItem {
  title: string;
  path: string;
  icon: unknown;
  roles?: Role[];
}

const authStore = useAuthStore();
const themeStore = useThemeStore();

const menuItems: MenuItem[] = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Agenda', path: '/agenda', icon: Calendar },
  {
    title: 'Clientes',
    path: '/clientes',
    icon: Users,
    roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_RECEPTIONIST'],
  },
  {
    title: 'Funcionários',
    path: '/funcionarios',
    icon: UserCheck,
    roles: ['ROLE_ADMIN', 'ROLE_MANAGER'],
  },
  { title: 'Serviços', path: '/servicos', icon: Scissors, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
  {
    title: 'Financeiro',
    path: '/financeiro',
    icon: DollarSign,
    roles: ['ROLE_ADMIN', 'ROLE_MANAGER'],
  },
  {
    title: 'Comissões',
    path: '/comissoes',
    icon: Award,
    roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_PROFESSIONAL'],
  },
  {
    title: 'Fechamento Mensal',
    path: '/fechamento',
    icon: FileSpreadsheet,
    roles: ['ROLE_ADMIN', 'ROLE_MANAGER'],
  },
  { title: 'Configurações', path: '/configuracoes', icon: Settings },
];

const visibleMenuItems = computed(() => {
  return menuItems.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return authStore.hasRole(item.roles);
  });
});
</script>

<style scoped lang="scss">
.app-sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e4e4e7;
}

body.body--dark .app-sidebar {
  background-color: #09090b;
  border-right: 1px solid #27272a;
}

.brand-mini-logo {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #09090b;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border: 1px solid #27272a;
}

body.body--dark .brand-mini-logo {
  background-color: #f4f4f5;
  color: #09090b;
  border: 1px solid #e4e4e7;
}

.mini-brand-dot {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #e11d48;
}

.brand-title {
  line-height: 1.15;
}

.font-caption-tight {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.menu-item {
  border-radius: 8px;
  transition: all 0.15s ease;
  color: #71717a;
  min-height: 40px;

  &:hover {
    background-color: #f4f4f5;
    color: #09090b;
  }
}

body.body--dark .menu-item {
  color: #a1a1aa;

  &:hover {
    background-color: #18181b;
    color: #f4f4f5;
  }
}

.active-menu-item {
  background-color: #09090b !important;
  color: #ffffff !important;
  font-weight: 600;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #e11d48;
  }
}

body.body--dark .active-menu-item {
  background-color: #f4f4f5 !important;
  color: #09090b !important;
}

.item-icon-section {
  min-width: 36px;
}
</style>
