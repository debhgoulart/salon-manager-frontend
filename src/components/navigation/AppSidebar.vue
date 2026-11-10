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
        </div>
        <div v-if="!themeStore.miniState" class="q-ml-sm brand-title">
          <div class="text-subtitle1 text-weight-bold text-primary">Salon Manager</div>
          <div class="text-caption text-grey-6 text-weight-regular">Gestão Inteligente</div>
        </div>
      </div>

      <q-btn
        v-if="!themeStore.miniState"
        flat
        dense
        round
        size="sm"
        class="gt-sm text-grey-6"
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
              <component :is="item.icon" :size="20" />
            </q-item-section>

            <q-item-section class="text-weight-medium">
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
  { title: 'Clientes', path: '/clientes', icon: Users, roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_RECEPTIONIST'] },
  { title: 'Funcionários', path: '/funcionarios', icon: UserCheck, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
  { title: 'Serviços', path: '/servicos', icon: Scissors, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
  { title: 'Financeiro', path: '/financeiro', icon: DollarSign, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
  { title: 'Comissões', path: '/comissoes', icon: Award, roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_PROFESSIONAL'] },
  { title: 'Fechamento Mensal', path: '/fechamento', icon: FileSpreadsheet, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
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
  background: #FFFFFF;
}

body.body--dark .app-sidebar {
  background: #15171C;
}

.brand-mini-logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7B3F61 0%, #C59B6D 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
}

.brand-title {
  line-height: 1.1;
}

.menu-item {
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #495057;

  &:hover {
    background: rgba(123, 63, 97, 0.05);
    color: #7B3F61;
  }
}

body.body--dark .menu-item {
  color: #ADB5BD;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #F1F3F5;
  }
}

.active-menu-item {
  background: linear-gradient(90deg, rgba(123, 63, 97, 0.12) 0%, rgba(197, 155, 109, 0.08) 100%) !important;
  color: #7B3F61 !important;
  font-weight: 600;
  border-left: 3px solid #7B3F61;
}

body.body--dark .active-menu-item {
  background: rgba(123, 63, 97, 0.25) !important;
  color: #C59B6D !important;
  border-left-color: #C59B6D;
}

.item-icon-section {
  min-width: 40px;
}
</style>
