# ANTIGRAVITY.md — Fonte Oficial de Conhecimento do AgendaMax

> [!IMPORTANT]
> **REGRAS PARA AGENTES DE IA / DESENVOLVEDORES:**
> 1. Sempre leia este arquivo (`ANTIGRAVITY.md`) antes de iniciar qualquer tarefa no projeto.
> 2. Sempre atualize este arquivo ao finalizar qualquer alteração relevante.
> 3. Nunca deixe informações desatualizadas. O arquivo deve refletir exatamente o estado real do código e da arquitetura.
> 4. Não remova informações importantes sem substituí-las por versões atualizadas.
> 5. Mantenha as seções de **Changelog** e **Próxima tarefa recomendada** sempre atualizadas.

---

## 1. Visão Geral

* **Nome do projeto:** AgendaMax
* **Objetivo:** Sistema SaaS completo de agendamento, gestão de clientes, funcionários, serviços, financeiro e relatórios, projetado para salões de beleza, barbearias, clínicas de estética e prestadores de serviços em geral.
* **Descrição do Sistema:** O AgendaMax oferece uma solução moderna e responsiva para gestão empresarial. Possui suporte multi-tenant (empresas isoladas), autenticação baseada em JWT com cookies HTTP-only, agendamento de serviços em visão de lista e calendário, relatórios estatísticos e gestão financeira (entradas/saídas).
* **Público-alvo:** Proprietários de estabelecimentos, administradores, recepcionistas e profissionais de serviços.
* **Principais Funcionalidades:**
  - **Landing Page / Public Front:** Apresentação comercial do sistema com recursos, planos e CTA de cadastro.
  - **Autenticação & Multi-tenancy:** Login, cadastro de empresa/admin, recuperação de senha, sessão JWT segura em cookies HTTP-only (`agendamax_token`).
  - **Dashboard:** Métricas resumidas (faturamento, agendamentos do dia, novos clientes, taxa de ocupação), gráficos estatísticos e próximos agendamentos.
  - **Agenda / Calendário (Evoluída):** Visualização por Dia, Semana e Mês, linha de tempo atual, suporte a duplicação, reagendamento rápido, bloqueio de horários, fila de espera, exportação CSV/Excel, impressão e atalhos de teclado.
  - **Gestão de Clientes & Perfil Integrado:** CRUD de clientes com drawer de histórico completo na agenda, visitas e total gasto.
  - **Gestão de Funcionários:** Cadastro de membros da equipe com horários de expediente (`workStart`, `workEnd`), cargos e contatos.
  - **Gestão de Serviços:** Cadastro de serviços com categoria, preço e duração em minutos.
  - **Módulo Financeiro:** Controle de fluxo de caixa (receitas e despesas), gráficos de receitas vs despesas e geração automática de receitas ao concluir agendamentos.
  - **Relatórios:** Dashboards analíticos de desempenho financeiro, atendimentos por profissional e serviços mais vendidos.
  - **Configurações:** Edição de dados da empresa (nome, slug, telefone, e-mail, logo).
  - **Integração WhatsApp:** Disparo de lembretes e confirmações formatadas para WhatsApp Web/API.

---

## 2. Arquitetura

### Tecnologias e Frameworks
* **Core / Framework Web:** Next.js 14 (App Router, Server & Client Components) com React 18 e TypeScript.
* **Estilização:** Tailwind CSS 3, PostCSS, Autoprefixer, Lucide React (ícones), `clsx` e `tailwind-merge`.
* **Animações:** Framer Motion (`framer-motion`).
* **Gerenciamento de Estado:** Zustand (`zustand`) com sincronização de API e fallback de estado reativo local via `src/lib/store.ts`.
* **Banco de Dados:** PostgreSQL.
* **ORM:** Prisma ORM 5 (`@prisma/client`, `prisma`).
* **Autenticação & Segurança:** `jose` (JWT assinado), `bcryptjs` (hash de senhas), Cookies HTTP-only via Middleware do Next.js.
* **Manipulação de Datas:** `date-fns` v3.

### Estrutura de Pastas
```
agendamax/
├── prisma/
│   └── schema.prisma          # Schema do banco PostgreSQL (Empresa, Usuário, Cliente, Staff, Serviço, Agendamento, Transação)
├── src/
│   ├── middleware.ts          # Middleware do Next.js protegendo rotas privadas e verificando JWT em cookies
│   ├── app/
│   │   ├── layout.tsx         # Root layout (ToastProvider, meta tags)
│   │   ├── page.tsx           # Landing Page principal do AgendaMax
│   │   ├── globals.css        # Estilos globais e componentes de utilidade Tailwind
│   │   ├── login/             # Página de login
│   │   ├── cadastrar/         # Página de cadastro de empresa/usuário admin
│   │   ├── recuperar-senha/   # Página de recuperação de senha
│   │   ├── dashboard/         # Dashboard principal com estatísticas e gráficos
│   │   ├── agenda/            # Módulo de Agenda Refatorado
│   │   │   ├── page.tsx       # Shell da página principal (~290 linhas)
│   │   │   └── _components/   # Componentes modulares (AgendaHeader, AgendaStats, AgendaFilters, AgendaDayView, AgendaWeekView, AgendaMonthView, Modais, Drawers)
│   │   ├── clientes/          # Cadastro e listagem de clientes
│   │   ├── funcionarios/      # Gestão da equipe e expedientes
│   │   ├── servicos/          # Catálogo de serviços, durações e preços
│   │   ├── financeiro/        # Fluxo de caixa (entradas e saídas)
│   │   ├── relatorios/        # Visão analítica e métricas de desempenho
│   │   └── configuracoes/     # Configurações da empresa
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # Cabeçalho com perfil, seletores e modais
│   │   │   └── Sidebar.tsx    # Menu lateral de navegação e atalhos rápidos
│   │   └── ui/
│   │       ├── Badge.tsx      # Componente de tag/status colorido
│   │       ├── Modal.tsx      # Componente genérico de modal
│   │       └── ToastManager.tsx # Sistema de notificações Toast
│   └── lib/
│       ├── agenda-utils.ts    # Cálculos purificados de estatísticas e filtros da agenda
│       ├── export-utils.ts    # Exportador CSV/Excel e janela de impressão
│       ├── auth.ts            # Funções auxiliares JWT
│       ├── mock-data.ts       # Dados mock para demonstração / fallback offline
│       ├── prisma.ts          # Instância do PrismaClient
│       ├── store.ts           # Estado global Zustand (sync API + fallback mock)
│       ├── types.ts           # Interfaces TypeScript do domínio
│       ├── useToast.ts        # Hook global de mensagens Toast
│       └── whatsapp.ts        # Gerador de links de confirmação e lembretes para WhatsApp
```

---

## 3. Changelog de Alterações Recentes

### Audit & Refactoring do Módulo `/agenda` (Concluído)
- **Refatoração Completa**: Desmembrado arquivo monolítico `page.tsx` de 1.100+ linhas em 14 subcomponentes limpos em `src/app/agenda/_components/`.
- **Novas Funcionalidades**:
  - Dashboard de Métricas da Agenda (Agendados Hoje, Receita Hoje/Mês, Taxa de Presença %, Concluídos/Cancelados).
  - Três modos de visualização: **Dia**, **Semana** e **Mês**.
  - Linha do horário atual em tempo real na grade diária.
  - Drawer de perfil e histórico completo do cliente integrado.
  - Bloqueio de expedientes/horários e fila de espera (waitlist).
  - Exportação de dados para CSV/Excel e suporte a Impressão (`Ctrl+P`).
  - Atalhos de teclado (`Ctrl+N`, `Ctrl+F`, `Ctrl+P`, `Esc`).
  - Confirmação de segurança via modal antes de excluir/cancelar agendamentos.
  - **Zero erros de compilação no TypeScript (`tsc --noEmit`)**.
