# Feature Specification: Codebase Stabilization & Quality Baseline

**Feature Branch**: `001-codebase-stabilization`

**Created**: 2026-11-14

**Status**: Draft

**Input**: User description: "faça essas next actions para mim"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Validação Confiável de Qualidade e Formatação de Código (Priority: P1)

Como desenvolvedor ou operador do pipeline de integração contínua (CI), quero executar um comando de checagem de estilo e formatação que reporte apenas os arquivos em desconformidade e retorne status de sucesso quando o código estiver padronizado, sem poluir a saída do terminal com o conteúdo dos arquivos.

**Why this priority**: A integridade das verificações pré-commit e dos gates de qualidade definidos na Constitution depende de ferramentas de inspeção silenciosas, rápidas e determinísticas.

**Independent Test**: Pode ser testado executando o comando de validação de qualidade no terminal: com código formatado, ele deve finalizar com código de saída 0 em poucos segundos e sem despejar o texto dos arquivos na saída padrão.

**Acceptance Scenarios**:

1. **Given** todo o código-fonte formatado de acordo com as regras do projeto, **When** o comando de verificação de formatação for executado, **Then** o processo deve concluir com código 0 e sem emitir o conteúdo integral dos arquivos no terminal.
2. **Given** um arquivo contendo espaçamento incorreto ou desalinhamento com o guia de estilo, **When** o comando de verificação for disparado, **Then** a ferramenta deve identificar explicitamente o arquivo divergente e retornar código de erro indicativo de violação.

---

### User Story 2 - Blindagem de Segurança no Acesso e Autenticação (Priority: P1)

Como operador de recepção ou administrador do salão de beleza, quero acessar a tela de login com os campos de e-mail e senha completamente vazios, para que terceiros ou colaboradores não autorizados que utilizem o mesmo computador não acessem indevidamente a conta de um usuário privilegiado por pré-preenchimento acidental.

**Why this priority**: Evita brechas operacionais de segurança e vazamento de credenciais administrativas em terminais compartilhados na recepção do salão.

**Independent Test**: Carregar a página `/login` em uma nova janela ou sessão limpa e confirmar que nenhum dado sensível de login está pré-carregado nos campos de entrada.

**Acceptance Scenarios**:

1. **Given** a tela de login carregada inicialmente pelo operador, **When** o formulário for renderizado, **Then** os campos de e-mail e senha devem iniciar vazios, com indicação visual acessível de preenchimento obrigatório.
2. **Given** campos de login vazios, **When** o operador tentar submeter o formulário sem preenchê-los, **Then** o sistema deve bloquear o envio e exibir mensagens de validação solicitando e-mail e senha.

---

### User Story 3 - Integridade de Fuso Horário nos Agendamentos da Agenda (Priority: P1)

Como recepcionista do salão, quero agendar atendimentos para clientes informando a data e a hora do salão, garantindo que o horário selecionado (por exemplo, 14:00) seja registrado e exibido exatamente às 14:00, sem que uma conversão incorreta para fuso horário universal (UTC) desloque o horário do compromisso para 3 horas antes ou depois.

**Why this priority**: Erros de fuso horário causam perda de clientes, choque de horários na agenda dos profissionais e prejuízo direto ao salão.

**Independent Test**: Criar um agendamento para as 15:30 no fuso horário do salão e verificar se o horário gravado e recarregado na grade de horários permanece inalterado às 15:30.

**Acceptance Scenarios**:

1. **Given** o formulário de novo agendamento com a data de hoje e o horário das 14:00 selecionados, **When** o operador confirmar o agendamento, **Then** a informação de data e hora deve ser transmitida preservando o horário local informado, sem sufixo UTC forçado (`Z`) que desloque o compromisso.
2. **Given** a grade diária ou semanal da agenda, **When** os horários forem renderizados na tela, **Then** os atendimentos devem aparecer alocados exatamente na faixa horária escolhida no agendamento.

---

### User Story 4 - Suíte de Testes Automatizados para Funções Críticas de Interface (Priority: P2)

Como engenheiro de software mantenedor do sistema, quero dispor de uma suíte de testes automatizados integrada ao fluxo de desenvolvimento, para validar de forma contínua que funções críticas (formatação de moeda brasileira, máscaras de documentos, restrições de papéis de acesso em rotas) continuem funcionando após qualquer refatoração.

**Why this priority**: Garante conformidade com o Princípio V da Constitution (Gates de Testabilidade) e previne regressões em cálculos e visualizações operacionais.

**Independent Test**: Executar o comando de testes automatizados no repositório e verificar a execução de testes cobrindo formatadores e guardas de rota com 100% de aprovação.

**Acceptance Scenarios**:

1. **Given** a suíte de testes configurada no projeto, **When** o comando de testes for executado, **Then** todos os testes unitários de formatadores (`useFormatters`) e lógica de controle de rotas devem executar e passar com sucesso.
2. **Given** uma alteração inadvertida na máscara de CPF ou formatação de moeda que introduza um erro de formatação, **When** a suíte for executada, **Then** os testes automatizados devem falhar imediatamente, apontando a divergência com precisão.

---

### User Story 5 - Unificação e Consistência de Ícones da Interface (Priority: P2)

Como designer de interface e desenvolvedor frontend, quero que a aplicação utilize unicamente a biblioteca oficial de ícones minimalistas (`lucide-vue-next`), eliminando dependências duplicadas no pacote de desenvolvimento, para assegurar uniformidade visual em botões, cartões e cabeçalhos.

**Why this priority**: Reduz o tamanho do pacote do projeto, acelera o tempo de compilação e impede conflitos ou misturas visuais inconsistentes.

**Independent Test**: Inspecionar os manifestos de dependência e componentes visuais para assegurar que apenas uma biblioteca de ícones está instalada e ativa.

**Acceptance Scenarios**:

1. **Given** os arquivos de configuração do projeto, **When** verificadas as dependências de ícones, **Then** deve haver apenas uma dependência de ícones Lucide no projeto.
2. **Given** qualquer componente visual que utilize ícones, **When** renderizado em tela, **Then** o ícone deve carregar sem erros e manter coerência de traço e tamanho com o padrão SaaS Boutique.

---

### User Story 6 - Padronização de Tabelas de Listagem com Composable Compartilhado (Priority: P3)

Como desenvolvedor frontend, quero dispor de uma abstração reutilizável para gerenciar o estado e o ciclo de vida de tabelas com paginação no servidor, para que as telas de Clientes, Colaboradores e Serviços compartilhem o mesmo comportamento de busca, mudança de página e tratamento de erros sem duplicação de dezenas de linhas de código em cada tela.

**Why this priority**: Reduz expressivamente o volume de código duplicado no projeto e padroniza a experiência do usuário em todas as listagens operacionais do sistema.

**Independent Test**: Acessar as telas de listagem de clientes, colaboradores e serviços e validar que paginação, alteração de quantidade de itens por página e busca debounced operam de forma idêntica e sem falhas.

**Acceptance Scenarios**:

1. **Given** uma tela de listagem integrada à abstração de paginação compartilhada, **When** o usuário navegar para a próxima página ou alterar o tamanho da página, **Then** a requisição à API é disparada com os parâmetros correspondentes e a tabela é atualizada de forma suave.
2. **Given** a tabela em estado de carregamento de novos dados, **When** os dados estão em trânsito, **Then** o estado de carregamento visual é exibido sobre a tabela e ocultado assim que a resposta for concluída.

---

### Edge Cases

- **Falha de rede ou timeout durante a validação ou carregamento de listagens:** O sistema deve exibir o estado de erro (`AppErrorState`) com opção de repetição, sem travar o estado reativo da tela.
- **Transição de fuso horário ou agendamentos em horários limites (início ou fim do dia):** A data do agendamento deve ser preservada rigorosamente na data selecionada pelo usuário, sem avançar ou recuar um dia devido a conversões de offset de fuso.
- **Listagens que retornam vazias:** A tabela deve exibir o componente de estado vazio (`AppEmptyState`) informando adequadamente o usuário e oferecendo ação primária de inclusão ou limpeza de filtros.
- **Tentativa de login com campos em branco ou caracteres inválidos:** As regras de validação nos campos de entrada devem alertar o usuário imediatamente antes de efetuar qualquer chamada à rede.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O projeto MUST possuir script de checagem de estilo e formatação que valide os arquivos sem emitir o conteúdo textual completo no terminal quando executado em modo de inspeção.
- **FR-002**: O formulário de login MUST ser inicializado com os campos de e-mail e senha completamente vazios, exigindo preenchimento pelo usuário.
- **FR-003**: A criação de agendamentos na Agenda MUST enviar data e hora preservando o fuso horário local de operação do salão, sem inserção indevida de sufixos UTC que modifiquem o horário no backend.
- **FR-004**: O projeto MUST incorporar uma infraestrutura de testes automatizados configurada para execução de testes unitários e de componentes de forma ágil e isolada.
- **FR-005**: A suíte de testes MUST cobrir as funções de formatação de valores monetários, datas, documentos e as regras de controle de acesso de rotas (RBAC).
- **FR-006**: O projeto MUST consolidar o ecossistema de ícones em uma única dependência oficial de ícones minimalistas (`lucide-vue-next`), removendo pacotes redundantes de ícones do manifesto.
- **FR-007**: As operações repetitivas de paginação, busca e ordenação de tabelas de listagem MUST ser estruturadas em um composable reutilizável que gerencie os eventos de consulta à API.

### Key Entities _(include if feature involves data)_

- **Sessão do Operador**: Representa o usuário atualmente autenticado, contendo identificador, nome, e-mail e perfil de acesso (`role`) para controle de permissões.
- **Agendamento**: Representa um horário reservado no salão, contendo identificadores do cliente, profissional e serviço, data/hora local de início e término, e status do atendimento.
- **Consulta Paginada (Pageable)**: Estrutura padrão de consulta que encapsula índice da página solicitada, quantidade de registros por página, termo de busca textual e critérios de ordenação.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% dos agendamentos criados pelo operador são exibidos na grade de horários exatamente no mesmo horário em que foram cadastrados, com 0 distorção de fuso horário.
- **SC-002**: A tela de login inicia com 0 credenciais sensíveis expostas ou pré-carregadas por padrão em código-fonte.
- **SC-003**: O comando de validação de formatação e lint executa em menos de 10 segundos em ambiente local padrão e emite saída limpa com código de saída determinístico.
- **SC-004**: A suíte de testes unitários atinge 100% de taxa de aprovação para os testes de formatadores, guards de rota e regras de interface mapeadas.
- **SC-005**: Redução de pelo menos 150 linhas de código duplicado de paginação e controle de tabelas nas telas de listagem através da adoção do composable compartilhado.

## Assumptions

- O backend Java Spring Boot já recebe e persiste datas e horários de agendamentos compatíveis com o fuso horário local do salão.
- As permissões por perfil (`ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_RECEPTIONIST`, `ROLE_PROFESSIONAL`) continuam sendo os valores contratuais vigentes.
- O Quasar Framework e seus componentes nativos (`QTable`, `QInput`, `QSelect`, `QDialog`) continuam sendo a base visual das interfaces do sistema.
- A ferramenta de testes automatizados padrão para projetos baseados em Vite e Vue 3 é o Vitest, proporcionando execução rápida e compatibilidade nativa com TypeScript.
