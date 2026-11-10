# Esclarecimentos Técnicos e de UX — Salon Manager Frontend
**Documento:** `/speckit.clarify`  
**Versão:** 1.0.0  
**Data:** 2026-11-09  
**Status:** Aprovado pelo Usuário  
**Repositório:** `salon-manager-frontend`  
**Backend Vinculado:** `salon-manager-backend`

---

## Decisões Ratificadas

| Item | Decisão Aprovada | Justificativa Técnica / Benefício |
|---|---|---|
| **1. Módulo Agenda** | **Grade nativa 100% Quasar** | Construção utilizando `QScrollArea`, `QCard`, `QBadge`, `QMenu`, `QTooltip` e CSS Grid/Flexbox. Zero overhead de bibliotecas terceiras pesadas, alinhamento perfeito com a paleta Vinho/Champagne e controle absoluto sobre renderização e transições de status. |
| **2. Conjunto de Ícones** | **Lucide Icons (`lucide-vue-next`)** | Traços finos (stroke 1.5 - 2px), visual contemporâneo padrão SaaS boutique/estética, consistente em modo claro e escuro. |
| **3. Persistência de Tokens JWT** | **`localStorage` para `accessToken` e `refreshToken`** | Permite sincronização transparente entre múltiplas abas da aplicação e renovação silenciosa de 2h até o limite de 7 dias via interceptor HTTP. |
| **4. Conexão com API e Mocks** | **Backend Real por padrão + Mocks opcionais** | `.env` apontando para `http://localhost:8080` com suporte opcional a chave `VITE_USE_MOCK=false` para testes isolados. |

---

## Conclusão da Etapa Clarify
Todas as ambiguidades foram sanadas e alinhadas. O projeto está apto para a etapa **`/speckit.plan`**.
