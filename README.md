# Salon Manager — Frontend Web

> Sistema web moderno, elegante e profissional para gestão administrativa, operacional e financeira de salões de beleza, barbearias e centros estéticos.  
> Desenvolvido com **Vue.js 3**, **Quasar Framework v2**, **TypeScript**, **Vite**, **Pinia**, **Axios** e **ApexCharts**.

---

## 🎨 1. Identidade Visual & Design System

O **Salon Manager** adota o padrão estético **SaaS Boutique Contemporâneo**, distanciando-se de templates administrativos genéricos e priorizando sofisticação, tipografia nítida e hierarquia visual refinada.

### Paleta de Cores
- **Vinho Nobre (`#7B3F61`):** Cor primária institucional, transmitindo elegância, autoridade e estética.
- **Champagne Dourado (`#C59B6D`):** Cor secundária para acentos refinados e destaques nobres.
- **Lavanda Suave (`#9E7B9B`):** Acento para badges e gráficos.
- **Verde Esmeralda (`#2A9D8F`):** Sucesso, receitas e atendimentos concluídos.
- **Coral Intenso (`#E76F51`):** Alerta, cancelamentos e despesas financeiras.
- **Ouro Queimado (`#E9C46A`):** Pendências e atendimentos em andamento.
- **Azul Petróleo (`#457B9D`):** Informativo e agendamentos futuros.

### Suporte Nativo a Temas (Light / Dark)
- Alternância instantânea pela interface via componente `AppHeader` ou na tela de Configurações.
- Preferência gravada e persistida no `LocalStorage` do navegador através da store `useThemeStore`.

---

## 🛠️ 2. Stack Tecnológica

| Componente | Tecnologia | Versão |
|---|---|---|
| **Linguagem** | TypeScript | Strict Mode |
| **Framework Base** | Vue.js | 3.5+ (Composition API + `<script setup>`) |
| **UI Framework** | Quasar Framework | 2.35+ com Quasar CLI + Vite |
| **Gerenciamento de Estado** | Pinia | 2.x |
| **Roteamento** | Vue Router | History Mode (URLs limpas) |
| **Comunicação HTTP** | Axios | Interceptors de Bearer Token & Refresh silencioso |
| **Gráficos Analíticos** | ApexCharts + Vue3-ApexCharts | Gráficos interativos |
| **Ícones** | Lucide Icons (`@lucide/vue`) | Traços finos e minimalistas |
| **Tratamento de Datas** | date-fns | Padrão pt-BR |

---

## 📁 3. Estrutura do Projeto

```text
salon-manager-frontend/
├── specs/                        # Especificações formais Spec Kit (Constitution, Specs, Plan, Tasks, Analysis)
├── public/                       # Assets estáticos
├── src/
│   ├── assets/                   # Imagens e logotipos vetoriais
│   ├── boot/                     # Inicializadores Quasar (axios, pinia)
│   ├── components/               # Design System de Componentes
│   │   ├── common/               # AppStatusBadge, AppEmptyState, AppLoading, AppErrorState
│   │   ├── dialogs/              # AppConfirmDialog, AppFormDialog
│   │   ├── navigation/           # AppHeader, AppSidebar
│   │   └── widgets/              # AppStatCard, AppSearchInput
│   ├── composables/              # useFormatters (moeda, cpf, telefone), useFeedback
│   ├── css/                      # app.scss, quasar.variables.scss
│   ├── layouts/
│   │   ├── MainLayout.vue        # Layout administrativo com Sidebar recolhível e Header
│   │   └── AuthLayout.vue        # Layout focado e minimalista para Login
│   ├── pages/                    # Módulos do Sistema
│   │   ├── auth/LoginView.vue
│   │   ├── dashboard/DashboardView.vue
│   │   ├── appointments/AgendaView.vue
│   │   ├── clients/ClientsListView.vue
│   │   ├── employees/EmployeesListView.vue
│   │   ├── services/ServicesListView.vue
│   │   ├── financial/FinancialTransactionsView.vue
│   │   ├── commissions/CommissionsView.vue
│   │   ├── closings/MonthlyClosingView.vue
│   │   ├── settings/SettingsView.vue
│   │   └── ErrorNotFound.vue
│   ├── router/                   # Configuração de rotas, guards e controle RBAC
│   ├── services/                 # Clientes HTTP (auth, client, employee, service, appointment, etc.)
│   ├── stores/                   # Stores Pinia (auth, theme)
│   └── types/                    # DTOs e contratos TypeScript alinhados 1:1 com o backend
├── quasar.config.ts              # Configurações do Quasar CLI com Vite
├── tsconfig.json                 # Configuração estrita TypeScript
└── .env.example                  # Modelo de variáveis de ambiente
```

---

## 📦 4. Módulos e Funcionalidades

1. **Autenticação (`/login`):** Acesso com JWT, persistência em `localStorage`, renovação transparente com Refresh Token de 7 dias e proteção por Navigation Guards.
2. **Dashboard (`/`):** Painel executivo em tempo real com 4 cards de KPIs (Faturamento, Despesas, Comissões, Lucro Líquido), 4 contadores rápidos, gráficos comparativos ApexCharts e próximos atendimentos.
3. **Agenda (`/agenda`):** Visualização diária e semanal com grade nativa 100% Quasar, consulta de disponibilidade (`available-slots`), criação rápida e transição de estados (`AGENDADO` ➔ `CONFIRMADO` ➔ `EM_ATENDIMENTO` ➔ `CONCLUIDO` / `CANCELADO`).
4. **Clientes (`/clientes`):** Listagem paginada com busca textual debounced por nome, telefone ou CPF, máscaras dinâmicas e histórico de agendamentos.
5. **Funcionários (`/funcionarios`):** Cadastro de profissionais, taxa padrão de comissão, soft-delete e controle de status.
6. **Serviços (`/servicos`):** Catálogo de procedimentos com preço em BRL, tempo de execução estimado e taxa de comissão customizada opcional.
7. **Financeiro (`/financeiro`):** Fluxo de caixa com separação visual de Receitas e Despesas, totalizadores e blindagem contra lançamentos retroativos em meses com fechamento contábil encerrado (`ClosedPeriodException`).
8. **Comissões (`/comissoes`):** Extrato analítico e sintético de repasses devidos aos colaboradores, com filtros por período e status de pagamento (`PENDING`, `PAID`).
9. **Fechamento Mensal (`/fechamento`):** Simulação prévia dos cálculos contábeis do mês (`/calculate`), execução atômica do fechamento oficial com bloqueio do período (`/close`), consulta histórica e reabertura com nota de auditoria obrigatória (`/reopen`).
10. **Configurações (`/configuracoes`):** Preferências visuais de Tema Claro/Escuro, dados da empresa e healthcheck em tempo real do backend Spring Boot (`/actuator/health`).

---

## ⚡ 5. Executando a Aplicação Localmente

### Pré-requisitos
- **Node.js:** Versão `>= 20` (recomendado v22 ou v24)
- **NPM:** Gerenciador de pacotes

### 1. Clonar e Instalar Dependências
```bash
cd salon-manager-frontend
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Conteúdo padrão do `.env`:
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Salon Manager
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
# ou
quasar dev
```

A aplicação iniciará automaticamente no navegador em `http://localhost:9000` (ou porta disponível).

### 4. Compilar para Produção (Build)
```bash
npm run build
```
Os arquivos otimizados e minificados serão gerados no diretório `dist/spa`.

### 5. Checagem de Tipos TypeScript
```bash
npm run typecheck
```

---

## 🔑 6. Credenciais de Acesso (Ambiente de Desenvolvimento)

Para homologação com o backend local (`salon-manager-backend`), utilize as credenciais padrão provisionadas automaticamente na primeira subida do banco:

- **E-mail:** `admin@salonmanager.com`
- **Senha:** `admin@123456`
- **Papel:** `ROLE_ADMIN`
