# Implementation Plan: Reconfiguração Editorial Fashion do Design System

**Branch**: `003-editorial-design-system` | **Date**: 2026-11-14 | **Spec**: [specs/003-editorial-design-system/spec.md](file:///home/debhg/Projetos/salon-manager-frontend/specs/003-editorial-design-system/spec.md)

**Input**: Feature specification from `/specs/003-editorial-design-system/spec.md`

## Summary

Implementação da identidade visual **Editorial High-Contrast & Fashion** no Salon Manager. O objetivo é transformar a interface em um ambiente contemporâneo, inspirado em publicações de moda e softwares de alta precisão (Linear/Raycast), utilizando contraste preto e branco de alto impacto, acento vibrante Carmim Fashion (`#E11D48`), tipografia _Plus Jakarta Sans_ com tracking ajustado e bordas estruturais de 1px em substituição a sombras difusas. O redesign abrangerá formalmente o `DESIGN.md`, tokens SCSS globais, layouts de navegação, tela de login, componentes compartilhados de base e refinamento das telas centrais (Dashboard e Agenda).

## Technical Context

**Language/Version**: TypeScript 5.9 + Vue 3.5 (Composition API com `<script setup lang="ts">`)  
**Primary Dependencies**: Quasar Framework 2.35, Pinia 3.0, Lucide Vue Next, Vite 6  
**Storage**: LocalStorage (preferência de tema escuro/claro e token de sessão)  
**Testing**: Vitest 3.0 + @vue/test-utils  
**Target Platform**: Navegadores modernos (Desktop, Tablet e Mobile responsivo)  
**Project Type**: Web Application SPA (Single Page Application)  
**Performance Goals**: First Contentful Paint < 1.2s, 60fps em transições e scroll de grade, sem layout shifts  
**Constraints**: Alvos de toque $\ge 44 \times 44\text{px}$, Contraste WCAG AA $\ge 4.5:1$ (texto padrão) e $\ge 3:1$ (texto grande), arquivos $\le 300$ linhas (Constitution Princípio I), 4 estados de interface obrigatórios (Princípio III), biblioteca de ícones exclusiva `lucide-vue-next`  
**Scale/Scope**: ~15 arquivos-chave atualizados ou refatorados (CSS, Layouts, Componentes base, Views centrais)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

1. **Princípio I (Modularidade & Limite de 300 Linhas)**:
   - PASS. Nenhum componente ou arquivo CSS ultrapassará 300 linhas de código. Subcomponentes continuarão desacoplados.
2. **Princípio II (Single Source of Truth para Ícones)**:
   - PASS. Apenas `lucide-vue-next` será utilizado para novos ou ajustados ícones. Nenhuma dependência externa adicionada.
3. **Princípio III (Quatro Estados de Interface & Acessibilidade)**:
   - PASS. Componentes base (`AppEmptyState`, `AppErrorState`, `AppStatCard`, etc.) manterão suporte explícito e cópia autoral humanizada, com conformidade WCAG AA.
4. **Princípio IV (Clean Architecture no Frontend)**:
   - PASS. Separação rigorosa entre apresentação, stores de estado e camadas de serviço/api.
5. **Princípio V (Validação Contínua & Quality Gates)**:
   - PASS. Todas as alterações serão validadas com `typecheck`, `lint:check`, `test` e `build` com código 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-editorial-design-system/
├── checklists/
│   └── requirements.md  # Checklist de conformidade e completude
├── spec.md              # Especificação de requisitos e user stories
├── research.md          # Pesquisa arquitetural e decisões de paleta/tipografia
├── data-model.md        # Modelagem de entidades de tokens e contratos de variante
├── quickstart.md        # Roteiro de validação do design system
├── plan.md              # Este plano de implementação
└── tasks.md             # Tarefas de implementação geradas pelo /speckit-tasks
```

### Source Code Impacted

```text
src/
├── css/
│   ├── app.scss                   # Regras globais, tipografia editorial e classes utilitárias
│   └── quasar.variables.scss      # Tokens oficiais Quasar ($primary: #09090B, $secondary: #E11D48)
├── layouts/
│   ├── AuthLayout.vue             # Moldura editorial para telas de autenticação
│   └── MainLayout.vue             # Layout principal com bordas precisas e fundo nobre
├── components/
│   ├── navigation/
│   │   ├── AppHeader.vue          # Barra superior com linha divisória e alternador de tema
│   │   └── AppSidebar.vue         # Barra lateral esbelta com destaque fashion
│   ├── widgets/
│   │   └── AppStatCard.vue        # Cartão de métrica com tabular-nums e acabamento de luxo
│   ├── common/
│   │   ├── AppStatusBadge.vue     # Badges com formato de etiqueta editorial
│   │   ├── AppEmptyState.vue      # Estado vazio com ícones minimalistas e cópia autoral
│   │   └── AppErrorState.vue      # Estado de erro com contraste nítido e retry
│   └── dialogs/
│       ├── AppFormDialog.vue      # Diálogo com borda 12px e botões de toque mínimo 44px
│       └── AppConfirmDialog.vue   # Modal de confirmação refinado
└── pages/
    ├── auth/
    │   └── LoginView.vue          # Tela de login com estética editorial de passarela
    ├── dashboard/
    │   └── DashboardView.vue      # Painel de controle com estética preto/branco/carmim
    └── appointments/
        └── AgendaView.vue         # Grade de agenda com contraste e legibilidade refinados
```

## Complexity Tracking

> **Nenhuma violação aos princípios da Constituição**. Todas as regras de design, modularidade e quality gates foram estritamente preservadas.
