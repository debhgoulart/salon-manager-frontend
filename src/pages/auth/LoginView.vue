<template>
  <q-card class="login-card q-pa-xl">
    <!-- Header com Identidade Visual Editorial -->
    <div class="text-center q-mb-xl">
      <div class="brand-badge q-mb-md">
        <span class="brand-initials">SM</span>
        <span class="brand-dot" />
      </div>
      <h1 class="text-h5 text-weight-bold q-my-none text-primary editorial-title">SALON MANAGER</h1>
      <p class="text-caption text-grey-7 q-mt-xs q-mb-none font-editorial-caption">
        GESTÃO INTEGRADA &bull; ESTÉTICA &bull; ALTA PERFORMANCE
      </p>
    </div>

    <!-- Alerta de Erro -->
    <div v-if="errorMessage" class="error-banner q-pa-md q-mb-lg row items-center no-wrap">
      <AlertCircle :size="18" class="text-negative q-mr-sm shrink-0" />
      <span class="text-caption text-negative">{{ errorMessage }}</span>
    </div>

    <!-- Formulário de Login -->
    <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
      <div>
        <label class="text-caption text-weight-bold text-grey-8 q-mb-xs block">
          E-MAIL CORPORATIVO
        </label>
        <q-input
          v-model="email"
          type="email"
          outlined
          dense
          placeholder="operador@salao.com"
          autocomplete="email"
          :rules="[
            (val) => !!val || 'O e-mail é obrigatório',
            (val) => /.+@.+\..+/.test(val) || 'Formato de e-mail inválido',
          ]"
        >
          <template #prepend>
            <Mail :size="16" class="text-grey-6" />
          </template>
        </q-input>
      </div>

      <div>
        <label class="text-caption text-weight-bold text-grey-8 q-mb-xs block">
          SENHA DE ACESSO
        </label>
        <q-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          outlined
          dense
          placeholder="••••••••"
          autocomplete="current-password"
          :rules="[(val) => !!val || 'A senha é obrigatória']"
        >
          <template #prepend>
            <Lock :size="16" class="text-grey-6" />
          </template>
          <template #append>
            <q-btn
              flat
              round
              dense
              size="sm"
              class="text-grey-6"
              :aria-label="showPassword ? 'Ocultar senha' : 'Ver senha'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="16" />
              <Eye v-else :size="16" />
            </q-btn>
          </template>
        </q-input>
      </div>

      <q-btn
        type="submit"
        color="primary"
        class="full-width login-submit-btn q-mt-lg"
        unelevated
        no-caps
        :loading="loading"
        label="Acessar Plataforma"
      />
    </q-form>

    <!-- Dica para homologação / ambiente local -->
    <div class="q-mt-xl text-center text-caption text-grey-6 border-top q-pt-md">
      Acesso Demonstração: <code>admin@salonmanager.com</code>
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
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next';

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
      message: `Bem-vindo(a), ${authStore.user?.name || 'Administrador'}!`,
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
  border-radius: 12px;
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

body.body--dark .login-card {
  background-color: #121214;
  border: 1px solid #27272a;
  box-shadow: none;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: #09090b;
  color: #ffffff;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: 1px;
  border: 1px solid #27272a;
}

body.body--dark .brand-badge {
  background-color: #f4f4f5;
  color: #09090b;
  border: 1px solid #e4e4e7;
}

.brand-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e11d48; // Carmim Fashion
}

.font-editorial-caption {
  letter-spacing: 0.08em;
  font-size: 0.68rem;
  font-weight: 600;
}

.error-banner {
  border-radius: 8px;
  background-color: rgba(225, 29, 72, 0.08);
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.login-submit-btn {
  height: 44px;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.border-top {
  border-top: 1px solid #e4e4e7;
}

body.body--dark .border-top {
  border-top-color: #27272a;
}
</style>
