import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { setupNavigationGuards } from 'src/router/guards';
import { useAuthStore } from 'src/stores/auth';
import type { RouteLocationNormalized, NavigationGuardNext, Router } from 'vue-router';

describe('Navigation Guards (RBAC & Auth)', () => {
  let router: {
    beforeEach: (fn: (to: unknown, from: unknown, next: NavigationGuardNext) => void) => void;
  };
  let guardFn: (to: unknown, from: unknown, next: NavigationGuardNext) => void;

  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();

    router = {
      beforeEach: vi.fn((fn) => {
        guardFn = fn;
      }),
    };

    setupNavigationGuards(router as unknown as Router);
  });

  it('redirects unauthenticated users trying to access protected routes to /login', () => {
    const to = {
      path: '/clientes',
      fullPath: '/clientes',
      meta: { requiresAuth: true },
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = vi.fn();

    guardFn(to, from, next);

    expect(next).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: '/clientes' },
    });
  });

  it('allows access to public routes (like /login) when user is not authenticated', () => {
    const to = {
      path: '/login',
      fullPath: '/login',
      meta: { public: true },
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = vi.fn();

    guardFn(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('redirects authenticated users trying to access public routes (like /login) to home (/)', () => {
    const authStore = useAuthStore();
    authStore.accessToken = 'dummy-token';

    const to = {
      path: '/login',
      fullPath: '/login',
      meta: { public: true },
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = vi.fn();

    guardFn(to, from, next);

    expect(next).toHaveBeenCalledWith({ path: '/' });
  });

  it('allows authenticated users with correct role to access protected route', () => {
    const authStore = useAuthStore();
    authStore.accessToken = 'valid-token';
    authStore.user = {
      id: '1',
      name: 'Admin',
      email: 'admin@salonmanager.com',
      role: 'ROLE_ADMIN',
      active: true,
    };

    const to = {
      path: '/funcionarios',
      fullPath: '/funcionarios',
      meta: { requiresAuth: true, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = vi.fn();

    guardFn(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('redirects authenticated users without required role to home (/)', () => {
    const authStore = useAuthStore();
    authStore.accessToken = 'valid-token';
    authStore.user = {
      id: '2',
      name: 'Recepcionista',
      email: 'recepcao@salonmanager.com',
      role: 'ROLE_RECEPTIONIST',
      active: true,
    };

    const to = {
      path: '/fechamento',
      fullPath: '/fechamento',
      meta: { requiresAuth: true, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = vi.fn();

    guardFn(to, from, next);

    expect(next).toHaveBeenCalledWith({ path: '/' });
  });
});
