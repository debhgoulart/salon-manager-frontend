import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('src/layouts/AuthLayout.vue'),
    meta: { public: true },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('src/pages/auth/LoginView.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('src/pages/dashboard/DashboardView.vue'),
      },
      {
        path: 'agenda',
        name: 'agenda',
        component: () => import('src/pages/appointments/AgendaView.vue'),
      },
      {
        path: 'clientes',
        name: 'clients',
        component: () => import('src/pages/clients/ClientsListView.vue'),
        meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_RECEPTIONIST'] },
      },
      {
        path: 'funcionarios',
        name: 'employees',
        component: () => import('src/pages/employees/EmployeesListView.vue'),
        meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
      },
      {
        path: 'servicos',
        name: 'services',
        component: () => import('src/pages/services/ServicesListView.vue'),
        meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
      },
      {
        path: 'financeiro',
        name: 'financial',
        component: () => import('src/pages/financial/FinancialTransactionsView.vue'),
        meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
      },
      {
        path: 'comissoes',
        name: 'commissions',
        component: () => import('src/pages/commissions/CommissionsView.vue'),
        meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_PROFESSIONAL'] },
      },
      {
        path: 'fechamento',
        name: 'closings',
        component: () => import('src/pages/closings/MonthlyClosingView.vue'),
        meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
      },
      {
        path: 'configuracoes',
        name: 'settings',
        component: () => import('src/pages/settings/SettingsView.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
