# Quickstart Guide: Reconfiguração Editorial Fashion do Design System

**Feature**: `003-editorial-design-system`  
**Date**: 2026-11-14  
**Status**: Completed

---

## 1. Visão Geral

Este guia rápido orienta a validação da nova identidade visual **Editorial High-Contrast & Fashion** implementada no Salon Manager. A verificação abrange tokens globais, componentes base, layouts e telas principais (Login, Dashboard, Agenda).

---

## 2. Pré-requisitos & Execução do Ambiente

Certifique-se de que as dependências estejam instaladas e o servidor de desenvolvimento esteja em execução:

```bash
# Verificar qualidade estática prévia
npm run typecheck
npm run lint:check
npm test

# Iniciar servidor local
npm run dev
```

Abra o navegador no endereço local indicado (geralmente `http://localhost:9000` ou `http://localhost:5173`).

---

## 3. Roteiro de Validação Visual & Funcional

### 3.1 Verificação de Tokens e DESIGN.md

1. Abra o arquivo [`DESIGN.md`](file:///home/debhg/Projetos/salon-manager-frontend/DESIGN.md) na raiz do projeto.
2. Verifique se a paleta de cores descreve:
   - Preto Ônix (`#09090B`) e Branco Titânio (`#FFFFFF` / `#F4F4F5`).
   - Acento Fashion Carmim (`#E11D48`).
   - Bordas de 1px (`#E4E4E7` / `#27272A`).
3. Abra as ferramentas de desenvolvedor no navegador (F12) e inspecione as variáveis CSS em `:root`:
   - `--color-primary`, `--color-secondary`, `--color-border-subtle`, `--color-bg-page`.

### 3.2 Verificação da Tela de Autenticação (`/login`)

1. Desconecte-se ou acesse a rota `/login`.
2. Observe o layout da tela:
   - Tipografia de impacto estilo editorial.
   - Campos de e-mail e senha com bordas limpas e foco bem delineado.
   - Botão de submissão com alto contraste (Preto Ônix no Light ou Carmim Fashion).
   - Ausência de gradientes genéricos de IA ou sombras difusas.

### 3.3 Verificação dos Layouts e Navegação (`MainLayout`, `AppHeader`, `AppSidebar`)

1. Autentique-se no sistema (modo mock/dev).
2. Na barra lateral (`AppSidebar`):
   - Itens de navegação com ícones Lucide discretos e tipografia alinhada.
   - Item ativo com destaque nítido e sutil indicador fashion.
   - Borda vertical fina separando o menu do conteúdo.
3. No cabeçalho (`AppHeader`):
   - Alternância de modo escuro/claro com transição suave.
   - Verifique que o contraste permanece alto e legível em ambos os modos (Dark/Light).

### 3.4 Verificação dos Componentes Base

1. Acesse o **Dashboard** (`/dashboard`):
   - `AppStatCard`: Números com `tabular-nums`, peso 700 e alinhamento impecável.
   - `AppStatusBadge`: Badges de agendamento com cantos precisos e cores semânticas nítidas.
2. Abra um diálogo de formulário ou confirmação (`AppFormDialog` / `AppConfirmDialog`):
   - Botões com altura mínima de 44px para toque.
   - Bordas limpas de 12px de raio.
   - Ações primárias e secundárias com hierarquia clara.

### 3.5 Verificação da Agenda (`/agenda`)

1. Acesse a rota `/agenda`.
2. Navegue pelos modos diário e semanal.
3. Observe a régua de horários e os cards de agendamento na grade:
   - Linhas de tempo nítidas de 1px.
   - Cores de status com acento Carmim e contraste WCAG AA.
   - Nenhum overflow horizontal não intencional em resoluções mobile (<768px).

---

## 4. Quality Gates de Fechamento

Para certificar que a entrega cumpre os princípios da Constituição do projeto:

```bash
# 1. Verificação de Tipos TypeScript
npm run typecheck

# 2. Formatação e Linting
npm run lint:check

# 3. Testes Unitários
npm test

# 4. Compilação de Produção
npm run build
```

Todos os 4 comandos devem concluir com código `0` sem erros.
