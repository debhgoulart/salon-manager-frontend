<template>
  <q-page class="q-pa-lg">
    <!-- Topbar -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Configurações do Sistema</h1>
        <p class="text-caption text-grey-7 q-mb-none">
          Preferências visuais, dados da empresa e conectividade da API
        </p>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Coluna Esquerda: Aparência e Perfil -->
      <div class="col-12 col-md-6 q-gutter-y-lg">
        <!-- Card 1: Preferências de Aparência -->
        <q-card flat class="settings-card q-pa-md">
          <div class="row items-center q-mb-sm">
            <Palette :size="20" class="text-primary q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Aparência & Tema</div>
          </div>
          <div class="text-caption text-grey-6 q-mb-md">
            Alterne entre o Modo Claro e o Modo Escuro. A preferência é persistida localmente.
          </div>

          <div class="row items-center justify-between q-pa-sm rounded-borders bg-surface-alt">
            <div class="row items-center">
              <Sun v-if="!themeStore.isDark" :size="22" class="text-warning q-mr-sm" />
              <Moon v-else :size="22" class="text-primary q-mr-sm" />
              <div>
                <div class="text-body2 text-weight-bold">
                  {{ themeStore.isDark ? 'Modo Escuro Ativo' : 'Modo Claro Ativo' }}
                </div>
                <div class="text-caption text-grey-6">
                  {{
                    themeStore.isDark
                      ? 'Superfície escura com tons neutros'
                      : 'Fundo neutro com alta legibilidade'
                  }}
                </div>
              </div>
            </div>

            <q-toggle
              :model-value="themeStore.isDark"
              color="primary"
              @update:model-value="themeStore.toggleDark"
            />
          </div>
        </q-card>

        <!-- Card 2: Perfil do Usuário Autenticado -->
        <q-card flat class="settings-card q-pa-md">
          <div class="row items-center q-mb-sm">
            <User :size="20" class="text-primary q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Perfil do Usuário</div>
          </div>
          <div class="text-caption text-grey-6 q-mb-md">
            Informações da sessão autenticada via token JWT.
          </div>

          <q-list dense separator class="rounded-borders bg-surface-alt">
            <q-item class="q-py-sm">
              <q-item-section>
                <div class="text-caption text-grey-6">Nome do Operador</div>
                <div class="text-body2 text-weight-bold">
                  {{ authStore.user?.name || 'Administrador Padrão' }}
                </div>
              </q-item-section>
            </q-item>

            <q-item class="q-py-sm">
              <q-item-section>
                <div class="text-caption text-grey-6">E-mail Cadastrado</div>
                <div class="text-body2 text-weight-bold">
                  {{ authStore.user?.email || 'admin@salonmanager.com' }}
                </div>
              </q-item-section>
            </q-item>

            <q-item class="q-py-sm">
              <q-item-section>
                <div class="text-caption text-grey-6">Papel de Acesso (RBAC)</div>
                <div class="row items-center q-mt-xs">
                  <q-badge color="primary" class="q-px-sm q-py-xs">
                    {{ authStore.userRole }}
                  </q-badge>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Coluna Direita: Dados do Salão e Status da API -->
      <div class="col-12 col-md-6 q-gutter-y-lg">
        <!-- Card 3: Informações do Salão -->
        <q-card flat class="settings-card q-pa-md">
          <div class="row items-center q-mb-sm">
            <Building2 :size="20" class="text-primary q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Dados do Estabelecimento</div>
          </div>
          <div class="text-caption text-grey-6 q-mb-md">
            Configuração da unidade e dados para emissão de comprovantes.
          </div>

          <div class="q-gutter-y-sm">
            <q-input v-model="salonName" label="Nome Fantasia" outlined dense />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="salonPhone"
                  label="Telefone / WhatsApp"
                  outlined
                  dense
                  mask="(##) #####-####"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="salonHours" label="Horário de Funcionamento" outlined dense />
              </div>
            </div>
            <q-input v-model="salonAddress" label="Endereço Completo" outlined dense />

            <div class="row justify-end q-mt-sm">
              <q-btn
                unelevated
                color="primary"
                no-caps
                label="Salvar Dados"
                @click="saveSalonInfo"
              />
            </div>
          </div>
        </q-card>

        <!-- Card 4: Status do Servidor & API -->
        <q-card flat class="settings-card q-pa-md">
          <div class="row items-center q-mb-sm">
            <Server :size="20" class="text-primary q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Conectividade do Backend</div>
          </div>
          <div class="text-caption text-grey-6 q-mb-md">
            Status da integração com a API Spring Boot.
          </div>

          <div class="q-pa-sm rounded-borders bg-surface-alt">
            <div class="row items-center justify-between q-mb-xs">
              <span class="text-caption text-grey-6">URL Base da API:</span>
              <code class="text-caption text-weight-bold">{{ apiUrl }}</code>
            </div>

            <div class="row items-center justify-between q-mt-sm">
              <span class="text-caption text-grey-6">Healthcheck Actuator:</span>
              <q-badge
                :color="backendStatus === 'UP' ? 'positive' : 'negative'"
                class="q-px-sm q-py-xs"
              >
                {{ backendStatus }}
              </q-badge>
            </div>
          </div>

          <div class="row justify-end q-mt-md">
            <q-btn
              flat
              dense
              no-caps
              size="sm"
              color="primary"
              :loading="checkingHealth"
              label="Verificar Conexão Agora"
              @click="checkBackendHealth"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from 'src/stores/auth';
import { useThemeStore } from 'src/stores/theme';
import { useFeedback } from 'src/composables/useFeedback';
import { Palette, Sun, Moon, User, Building2, Server } from 'lucide-vue-next';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const { notifySuccess } = useFeedback();

const salonName = ref('Salon Manager Boutique');
const salonPhone = ref('(11) 98765-4321');
const salonHours = ref('Seg a Sáb: 08:00 às 20:00');
const salonAddress = ref('Av. Paulista, 1500 - São Paulo, SP');

const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';
const backendStatus = ref<'UP' | 'DOWN' | 'VERIFICANDO'>('VERIFICANDO');
const checkingHealth = ref(false);

async function checkBackendHealth() {
  checkingHealth.value = true;
  backendStatus.value = 'VERIFICANDO';
  try {
    const res = await axios.get<{ status: string }>(`${apiUrl}/actuator/health`, { timeout: 3000 });
    backendStatus.value = res.data.status === 'UP' ? 'UP' : 'DOWN';
  } catch {
    backendStatus.value = 'DOWN';
  } finally {
    checkingHealth.value = false;
  }
}

function saveSalonInfo() {
  notifySuccess('Dados do estabelecimento salvos com sucesso.');
}

onMounted(() => {
  void checkBackendHealth();
});
</script>

<style scoped>
.settings-card {
  border-radius: 12px;
  background: #ffffff;
}
body.body--dark .settings-card {
  background: #15171c;
}

.bg-surface-alt {
  background: rgba(0, 0, 0, 0.03);
}
body.body--dark .bg-surface-alt {
  background: rgba(255, 255, 255, 0.04);
}
</style>
