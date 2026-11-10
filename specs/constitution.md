# Constitution — Salon Manager Frontend
**Versão:** 1.0.0  
**Data:** 2026-11-09  
**Status:** Proposto para Aprovação  
**Repositório:** `salon-manager-frontend`  
**Backend de Referência:** `/home/debhg/Projetos/salon-manager-backend`

---

## 1. Propósito e Escopo

O **Salon Manager Frontend** é uma aplicação web Single Page Application (SPA) voltada à gestão operacional, financeira e de agendamentos para salões de beleza, clínicas de estética e barbearias.
Este repositório compreende **estritamente a camada de apresentação e experiência do usuário (Frontend)**. Não haverá implementação de regras de negócio contábeis ou persistência de dados localmente como verdade primária.

---

## 2. Princípios Fundamentais (Invariantes Arquiteturais)

1. **Frontend Desacoplado & Fidelidade ao Contrato:**
   - Toda comunicação com o servidor respeita integralmente a API REST v1 documentada em `/home/debhg/Projetos/salon-manager-backend/docs/frontend-integration-contract.md`.
   - Nenhuma rota, payload ou regra contábil é inventada ou recalculada no frontend.

2. **Rigor Financeiro & Imutabilidade de Cálculos:**
   - O frontend nunca calcula comissões definitivas, saldos de fechamento contábil ou validação final de sobreposição de horários; esses dados são sempre providos e validados pela API backend (Spring Boot + PostgreSQL).
   - Valores monetários recebidos como `number` / `BigDecimal` devem ser formatados para apresentação utilizando o padrão brasileiro `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

3. **Adesão ao Ecossistema Quasar Framework v2 + Vue 3:**
   - Priorizar componentes nativos do Quasar (`QTable`, `QDialog`, `QForm`, `QSelect`, `QDate`, `QTime`, etc.).
   - Utilização de plugins nativos do Quasar para feedback (`Notify`, `Dialog`, `Loading`, `LoadingBar`).
   - Evitar bibliotecas terceiras externas redundantes que concorram com recursos que o Quasar já entrega nativamente.

4. **Tipagem Estrita com TypeScript:**
   - 100% do código (componentes, stores, composables, services) com tipagem estrita (`strict: true`).
   - Proibido o uso indiscriminado de `any`. DTOs de entrada e saída espelham os contratos do backend.

5. **Tratamento Resiliente de Erros (RFC 7807):**
   - Respostas `ProblemDetails` com erros de validação (`invalidParams`) devem ser vinculadas diretamente aos campos correspondentes nos formulários do Quasar (`QInput`, `QSelect`).
   - Falhas de rede ou erros 5xx devem apresentar mensagens amigáveis e componentes de fallback (`AppErrorState`, banners informativos e `Notify`).

6. **Gerenciamento de Estado Minimalista & Coeso (Pinia):**
   - Pinia é reservado para estados globais essenciais: autenticação/sessão (`auth`), preferências/tema (`ui`) e dados de cache de curto prazo se necessário.
   - Estados de tela (formulários, paginação de filtros locais, modais abertos) permanecem locais no componente ou composable específico.

7. **Acessibilidade e Usabilidade SaaS Premium:**
   - Suporte a Modo Claro e Modo Escuro com persistência local (`LocalStorage`).
   - Feedback visual imediato em todas as ações assíncronas (indicadores de carregamento, skeletons e botões em estado loading).
   - Diálogo de confirmação obrigatório antes de operações destrutivas ou críticas (desativação, cancelamento de agendamento, fechamento de mês contábil).

---

## 3. Matriz Tecnológica

| Componente | Ferramenta / Biblioteca | Versão / Padrão |
|---|---|---|
| **Linguagem** | TypeScript | 5.x / 6.x (Strict Mode) |
| **Framework Base** | Vue.js | 3.5+ (Composition API + `<script setup>`) |
| **UI Framework** | Quasar Framework | 2.35+ com Quasar CLI + Vite |
| **Gerenciamento de Estado** | Pinia | 2.x |
| **Roteamento** | Vue Router | 4.x / 5.x (History ou Hash Mode) |
| **Comunicação HTTP** | Axios | Instância centralizada com interceptors |
| **Estilização** | SCSS + CSS Variables do Quasar | Design Tokens com suporte Light/Dark |
| **Visualização de Dados** | ApexCharts / Chart.js (ou Quasar native cards) | Compatível com Vue 3 |
| **Testes** | Vitest + Vue Test Utils | Testes de unidade e componentes |

---

## 4. Portões de Qualidade (Quality Gates)

- **Linter & Formatação:** Código deve passar sem erros no `eslint` e `prettier`.
- **Checagem de Tipos:** `vue-tsc --noEmit` deve compilar com 0 erros.
- **Feedback Visual:** Nenhum botão executará ações assíncronas sem estado visual de carregamento (`:loading="loading"`).
- **Tratamento de Sessão:** Rota privada deve redirecionar para `/login` ao identificar token inexistente ou expirado com tentativa de refresh falhada.
- **Auditoria de Branches e Commits:** Commits semânticos no padrão Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`).
