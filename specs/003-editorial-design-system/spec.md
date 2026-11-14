# Feature Specification: Reconfiguração Editorial Fashion do Design System

**Feature Branch**: `003-editorial-design-system`

**Created**: 2026-11-14

**Status**: Draft

**Input**: User description: "Reconfiguração do design do projeto para estética Editorial High-Contrast & Fashion (preto e branco de alto impacto, tipografia marcante estilo revista de moda e acento vibrante) com redesign completo de DESIGN.md, tokens globais SCSS, layouts e componentes base"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Reconfiguração de Tokens Globais, Paleta Editorial e DESIGN.md (Priority: P1) 🎯 MVP

Como operador do salão de beleza e usuário do sistema,
quero que a aplicação apresente uma identidade visual inspirada no universo da alta costura e moda editorial (_Editorial High-Contrast & Fashion_),
para que o software transmita sofisticação extrema, modernidade e posicionamento de marca de alto padrão, sem ruído visual.

**Why this priority**: É a fundação estética de todo o sistema. Sem a definição formal dos novos tokens de cor, tipografia e regras de elevação, nenhuma tela pode ser redesenhada de maneira consistente.

**Independent Test**: Inspecionar [`DESIGN.md`](file:///home/debhg/Projetos/salon-manager-frontend/DESIGN.md), [`src/css/quasar.variables.scss`](file:///home/debhg/Projetos/salon-manager-frontend/src/css/quasar.variables.scss) e [`src/css/app.scss`](file:///home/debhg/Projetos/salon-manager-frontend/src/css/app.scss); os tokens de cor devem refletir preto absoluto (`#09090B` / `#0A0A0A`), brancos puros e acento vibrante Carmim Editorial (`#E11D48`), com tipografia refinada e bordas ultraprecisas.

**Acceptance Scenarios**:

1. **Given** que o arquivo `DESIGN.md` é atualizado, **When** qualquer desenvolvedor ou agente o consulta, **Then** as diretrizes de cores, tipografia, bordas, sombras e componentes refletem formalmente a estética _Editorial High-Contrast & Fashion_.
2. **Given** as variáveis SCSS globais em `quasar.variables.scss`, **When** compiladas pela aplicação, **Then** `$primary` passa a representar a cor de impacto do editorial (`#09090B` / Preto Absoluto no Light, `#FFFFFF` no Dark ou Acento Carmim `#E11D48`), com superfícies de alto contraste e bordas limpas de `1px`.
3. **Given** o arquivo `app.scss`, **When** renderizado no navegador, **Then** os cartões, botões e tabelas abandonam sombras pesadas e adotam bordas geométricas finas (`1px solid #E4E4E7` no Light e `#27272A` no Dark), com microinterações discretas e números tabulares (`tabular-nums`).

---

### User Story 2 - Redesign Estrutural da Navegação e Layouts (Priority: P1)

Como usuário autenticado ou visitante na tela de login,
quero interagir com layouts modernos, cabeçalhos refinados e barra lateral minimalista de passarela/moda,
para ter uma experiência de navegação elegante, rápida e livre de distrações em qualquer dispositivo.

**Why this priority**: O layout global (`MainLayout`, `AppHeader`, `AppSidebar`) e a tela de autenticação (`LoginView`, `AuthLayout`) compõem o primeiro impacto visual do usuário e enquadram todas as páginas da aplicação.

**Independent Test**: Acessar `/login` e `/dashboard`; a tela de login deve exibir tipografia editorial de grande presença e campos nítidos; o layout autenticado deve apresentar sidebar minimalista com tipografia precisa e ícones Lucide elegantes.

**Acceptance Scenarios**:

1. **Given** a tela de login (`/login`), **When** carregada, **Then** o formulário exibe uma identidade editorial de alto contraste, com logotipo marcante, tipografia _Plus Jakarta Sans_ com tracking ajustado, inputs com bordas nítidas e botão de submissão com contraste definitivo.
2. **Given** a barra lateral (`AppSidebar.vue`), **When** visualizada no `MainLayout`, **Then** os itens de menu ativos exibem destaque sutil em preto/branco com acento fashion, espaçamento vertical generoso e ícones Lucide limpos.
3. **Given** a barra superior (`AppHeader.vue`), **When** renderizada, **Then** o cabeçalho exibe linha divisória fina, alternador de tema suave e perfil do operador com elegância contemporânea.

---

### User Story 3 - Redesign dos Componentes Compartilhados de Base (Priority: P1)

Como desenvolvedor e operador,
quero que os cartões de estatísticas (`AppStatCard`), badges de status (`AppStatusBadge`), modais (`AppFormDialog`, `AppConfirmDialog`) e estados de tela (`AppEmptyState`, `AppErrorState`) reflitam a nova identidade,
para que toda interação mantenha coerência visual perfeita e sensação de acabamento de alta qualidade.

**Why this priority**: Esses componentes são reutilizados em todas as telas operacionais (clientes, serviços, financeiro, agenda e fechamentos). Padronizá-los unifica o design em todo o software.

**Independent Test**: Abrir qualquer diálogo ou verificar os cards de KPI; os números devem ser monumentais com `tabular-nums`, os badges devem ter fundos translúcidos sutis e os estados de erro/vazio devem conter cópia autoral sem clichês.

**Acceptance Scenarios**:

1. **Given** o componente `AppStatCard.vue`, **When** exibido em qualquer tela, **Then** apresenta número monetário ou quantitativo em destaque tipográfico nítido, sem sombras excessivas, com borda sutil de 1px e ícone discreto.
2. **Given** o componente `AppStatusBadge.vue`, **When** renderizado com qualquer status (`AGENDADO`, `CONFIRMADO`, `CONCLUIDO`, etc.), **Then** exibe acabamento editorial refinado com texto explícito e indicador semântico elegante.
3. **Given** os modais `AppFormDialog.vue` e `AppConfirmDialog.vue`, **When** abertos, **Then** apresentam bordas de 12px, cabeçalho limpo com tipografia semiserifada/geométrica e botões de ação com alvos de toque mínimos de 44px.

---

### User Story 4 - Aplicação Visual nas Telas Centrais (Agenda e Dashboard) (Priority: P2)

Como gerente ou recepcionista do salão,
quero visualizar a Agenda e o Dashboard com a nova estética Editorial Fashion,
para desfrutar de alta legibilidade de horários, gráficos financeiros claros e um ambiente de trabalho digital sofisticado.

**Why this priority**: São as duas telas com maior permanência de uso diário. Aplicar o novo visual consolida a experiência de uso ponta a ponta.

**Independent Test**: Navegar para `/dashboard` e `/agenda`; a grade de horários e os cards de agendamento devem adotar os novos contrastes preto/branco/carmim, mantendo 100% da funcionalidade prévia intacta.

**Acceptance Scenarios**:

1. **Given** a tela de Agenda (`/agenda`), **When** visualizada nos modos diário e semanal, **Then** a grade exibe linhas de tempo precisas, cabeçalhos de dia elegantes e cards de agendamento com bordas semânticas refinadas.
2. **Given** a tela de Dashboard (`/dashboard`), **When** carregada, **Then** os gráficos e rankings apresentam a paleta editorial, com contrastes perfeitos e leitura imediata de métricas.

---

### User Story 5 - Validação de Acessibilidade (WCAG AA), Responsividade e Quality Gates (Priority: P2)

Como usuário e administrador do sistema,
quero que a nova estética passe por auditoria rigorosa de acessibilidade, contraste e responsividade em múltiplos dispositivos,
para assegurar que a beleza editorial não comprometa em nenhum nível a usabilidade e a conformidade técnica.

**Why this priority**: A Constitution (Princípios III e V) proíbe designs inacessíveis ou que quebrem os quality gates de tipagem, testes e compilação.

**Independent Test**: Executar `npm test`, `npm run typecheck`, `npm run lint:check` e `npm run build`; todos devem finalizar com código 0 e a interface deve manter alvos de toque $\ge 44$px.

**Acceptance Scenarios**:

1. **Given** a auditoria de acessibilidade, **When** avaliada pelas diretrizes de `web-design-guidelines`, **Then** todos os textos atendem à relação de contraste mínima de 4.5:1 (WCAG AA) em ambos os temas.
2. **Given** o acesso via celular ou tablet, **When** a interface é redimensionada (< 768px), **Then** os alvos de clique mantêm no mínimo 44px $\times$ 44px e o layout flui sem quebras horizontais indesejadas.
3. **Given** os 4 Quality Gates da Constitution, **When** executados, **Then** todos passam com 100% de sucesso.

---

### Edge Cases

- **Legibilidade em Tema Escuro (Dark Mode)**: Contrastes excessivos entre branco puro e preto absoluto podem cansar a vista em sessões longas. Solução: utilizar superfícies em cinza-escuro de alta precisão (`#121214` / `#18181B`) com texto em off-white (`#F4F4F5`), reservando o branco puro para elementos de foco.
- **Distinção de Status Semânticos**: Na estética preto e branco, cores de status (como Agendado vs Cancelado) não podem se perder. Solução: manter cores semânticas bem dosadas e calibradas com badges com texto explícito e bordas nítidas, sem depender exclusivamente da cor para cognição.
- **Telas Pequenas com Títulos Grandes**: Tipografia editorial costuma ter títulos marcantes. Em telas móveis (< 400px), a escala deve utilizar tamanhos fluidos para evitar quebras deselegantes de palavras.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema MUST redefinir a paleta visual institucional em `DESIGN.md`, `quasar.variables.scss` e `app.scss` para a estética **Editorial High-Contrast & Fashion** (Preto Ônix `#09090B`, Branco Puro `#FFFFFF`, Cinzas Estruturais `#27272A` / `#E4E4E7` e Acento Carmim Editorial `#E11D48`).
- **FR-002**: O sistema MUST manter suporte perfeito e contrastante aos temas Claro (`body--light`) e Escuro (`body--dark`).
- **FR-003**: O sistema MUST redesenhar `AuthLayout.vue` e `LoginView.vue` com tipografia editorial, logotipo marcante e campos minimalistas nítidos.
- **FR-004**: O sistema MUST redesenhar `MainLayout.vue`, `AppHeader.vue` e `AppSidebar.vue` com linhas limpas, bordas de 1px e ícones Lucide unificados.
- **FR-005**: O sistema MUST atualizar os componentes compartilhados de base (`AppStatCard`, `AppStatusBadge`, `AppEmptyState`, `AppErrorState`, `AppFormDialog`, `AppConfirmDialog`).
- **FR-006**: O sistema MUST aplicar a nova estética na Agenda de Atendimentos (`/agenda`) e Dashboard (`/dashboard`), preservando 100% do comportamento funcional existente.
- **FR-007**: O sistema MUST garantir contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande (WCAG AA).
- **FR-008**: O sistema MUST garantir alvos de clique mínimos de 44px $\times$ 44px para telas de toque móveis.
- **FR-009**: O sistema MUST garantir que todos os arquivos modificados mantenham conformidade com o limite de 300 linhas da Constitution (Princípio I).
- **FR-010**: O sistema MUST manter aprovados todos os 4 Quality Gates da Constitution (`npm run typecheck`, `npm run lint:check`, `npm test` e `npm run build`).

### Key Entities

- **DesignTokens**:
  - `primary`: `#09090B` (Light) / `#F4F4F5` (Dark)
  - `secondary`: `#E11D48` (Carmim Editorial / Fashion Accent)
  - `accent`: `#71717A` (Cinza Neutro Médio)
  - `background`: `#FFFFFF` (Light) / `#09090B` (Dark)
  - `surface`: `#FAFAFA` (Light) / `#121214` (Dark)
  - `border`: `#E4E4E7` (Light) / `#27272A` (Dark)
  - `fontFamily`: _Plus Jakarta Sans_

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% dos componentes base e layouts convertidos para a estética Editorial High-Contrast & Fashion.
- **SC-002**: 100% de conformidade com a norma de acessibilidade WCAG AA (contraste $\ge 4.5:1$ em todos os pares de cor de texto/fundo).
- **SC-003**: Zero regressões funcionais nas telas de Login, Dashboard e Agenda.
- **SC-004**: Zero arquivos Vue ultrapassando 300 linhas de código (Princípio I da Constitution).
- **SC-005**: Todos os 4 Quality Gates aprovados com código de saída 0 e sem avisos impeditivos.

## Assumptions

- A tipografia _Plus Jakarta Sans_ continuará como família oficial, ajustando os pesos tipográficos, tracking e entrelinhas para a linguagem editorial de moda.
- As regras de negócio do backend e serviços HTTP existentes permanecem intactas; o escopo é estritamente estético e de experiência de usuário (UI/UX).
- A cor de acento vibrante selecionada é o Carmim Editorial (`#E11D48`), que dialoga com o universo de salão, batom e passarela sem cair no clichê dos gradientes de IA.
