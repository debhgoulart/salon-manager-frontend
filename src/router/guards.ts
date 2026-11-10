import type { Router } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import type { Role } from 'src/types/auth';

export function setupNavigationGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isPublic = to.meta.public === true;
    const requiresAuth = to.meta.requiresAuth === true || !isPublic;

    // Se a rota for pública (ex: /login) e o usuário já estiver logado, redireciona para a home
    if (isPublic && authStore.isAuthenticated) {
      return next({ path: '/' });
    }

    // Se a rota exige autenticação e não há token, redireciona para /login
    if (requiresAuth && !authStore.isAuthenticated) {
      return next({
        path: '/login',
        query: to.fullPath !== '/' ? { redirect: to.fullPath } : {},
      });
    }

    // Validação de papéis (RBAC)
    const requiredRoles = to.meta.roles as Role[] | undefined;
    if (requiredRoles && requiredRoles.length > 0) {
      if (!authStore.hasRole(requiredRoles)) {
        // Usuário logado mas sem permissão
        return next({ path: '/' });
      }
    }

    return next();
  });
}
