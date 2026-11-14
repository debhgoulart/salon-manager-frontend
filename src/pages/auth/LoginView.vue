<template>
  <q-card class="login-card q-pa-lg">
    <!-- Header com Identidade Visual -->
    <div class="text-center q-mb-lg">
      <div class="brand-badge q-mb-sm">
        <span class="brand-initials">SM</span>
      </div>
      <h1 class="text-h5 text-weight-bold q-my-none text-primary">Salon Manager</h1>
      <p class="text-caption text-grey-7 q-mt-xs q-mb-none">
        Gestão integrada, estética e financeira
      </p>
    </div>

    <!-- Alerta de Erro -->
    <q-banner v-if="errorMessage" rounded dense class="bg-negative text-white q-mb-md">
      <template #avatar>
        <q-icon name="error_outline" size="sm" />
      </template>
      {{ errorMessage }}
    </q-banner>

    <!-- Formulário de Login -->
    <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
      <q-input
        v-model="email"
        label="E-mail"
        type="email"
        outlined
        dense
        autocomplete="email"
        :rules="[
          (val) => !!val || 'O e-mail é obrigatório',
          (val) => /.+@.+\..+/.test(val) || 'Formato de e-mail inválido',
        ]"
      >
        <template #prepend>
          <q-icon name="mail_outline" size="xs" />
        </template>
      </q-input>

      <q-input
        v-model="password"
        label="Senha"
        :type="showPassword ? 'text' : 'password'"
        outlined
        dense
        autocomplete="current-password"
        :rules="[(val) => !!val || 'A senha é obrigatória']"
      >
        <template #prepend>
          <q-icon name="lock_outline" size="xs" />
        </template>
        <template #append>
          <q-btn
            flat
            round
            dense
            size="sm"
            :icon="showPassword ? 'visibility_off' : 'visibility'"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <q-btn
        type="submit"
        color="primary"
        class="full-width q-py-sm q-mt-md"
        unelevated
        :loading="loading"
        label="Entrar no Sistema"
      />
    </q-form>

    <!-- Dica para homologação / ambiente local -->
    <div class="q-mt-lg text-center text-caption text-grey-6 border-top q-pt-md">
      Acesso Padrão: <code>admin@salonmanager.com</code>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import type { AxiosError } from 'axios';
import type { ProblemDetails } from 'src/types/api';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

async function handleLogin() {
  loading.value = true;
  errorMessage.value = null;

  try {
    await authStore.login({
      email: email.value.trim(),
      password: password.value,
    });

    $q.notify({
      type: 'positive',
      message: `Bem-vindo de volta, ${authStore.user?.name || 'Administrador'}!`,
      timeout: 2500,
    });

    const redirectPath = (route.query.redirect as string) || '/';
    await router.push(redirectPath);
  } catch (err) {
    const error = err as AxiosError<ProblemDetails>;
    if (error.response?.data?.detail) {
      errorMessage.value = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage.value = 'E-mail ou senha incorretos.';
    } else {
      errorMessage.value =
        'Não foi possível conectar ao servidor. Verifique se o backend está em execução.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.login-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

body.body--dark .login-card {
  background: rgba(21, 23, 28, 0.98);
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #7b3f61 0%, #c59b6d 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(123, 63, 97, 0.25);
}

.border-top {
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

body.body--dark .border-top {
  border-top-color: rgba(255, 255, 255, 0.1);
}
</style>
