'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  UserCheck,
  Scissors,
  DollarSign,
  BarChart3,
  ChevronDown,
  Star,
  Play,
  Zap,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'O AgendaMax impede o agendamento duplo de horários?',
      a: 'Sim! Nosso motor inteligente valida a disponibilidade da equipe e da sala em tempo real, impedindo automaticamente que dois clientes agendem o mesmo funcionário no mesmo horário.',
    },
    {
      q: 'Posso cadastrar múltiplos funcionários e serviços?',
      a: 'Com certeza. Você pode definir a jornada de trabalho de cada funcionário (ex: 08:00 às 18:00), atribuir serviços específicos com duração customizada e gerenciar agendas individuais.',
    },
    {
      q: 'Como funciona a gestão financeira integrada?',
      a: 'Cada agendamento concluído pode gerar um lançamento automático de receita. Além disso, você pode lançar despesas operacionais para acompanhar seu lucro líquido em tempo real.',
    },
    {
      q: 'Preciso instalar algum programa no computador?',
      a: 'Não. O AgendaMax é 100% online em nuvem (SaaS). Você e sua equipe podem acessar pelo navegador do computador, tablet ou smartphone com segurança.',
    },
    {
      q: 'Como posso testar o sistema gratuitamente?',
      a: 'Basta criar sua conta sem cartão de crédito. Você terá acesso imediato ao Plano Gratuito com todas as funcionalidades essenciais.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-600 selection:text-white font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="h-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">
            Agenda<span className="text-brand-600">Max</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
          <a href="#recursos" className="hover:text-brand-600 transition-colors">Recursos</a>
          <a href="#beneficios" className="hover:text-brand-600 transition-colors">Benefícios</a>
          <a href="#como-funciona" className="hover:text-brand-600 transition-colors">Como Funciona</a>
          <a href="#depoimentos" className="hover:text-brand-600 transition-colors">Depoimentos</a>
          <a href="#planos" className="hover:text-brand-600 transition-colors">Planos</a>
          <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors"
          >
            Fazer Login
          </Link>
          <Link
            href="/cadastrar"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Criar Conta Grátis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-6 lg:px-12 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 text-brand-600" />
          <span>SaaS de Agendamento Profissional</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Gerencie Agendamentos com{' '}
          <span className="gradient-text">Velocidade, Elegância &amp; Zero Conflitos</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          O **AgendaMax** simplifica a gestão de empresas de serviços. Controle clientes, horários da equipe, catálogo de serviços e financeiro em uma plataforma limpa e intuitiva.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/cadastrar"
            className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-brand-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Experimente Gratuitamente</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-brand-600 fill-brand-600" />
            <span>Ver Demonstração ao Vivo</span>
          </Link>
        </div>

        {/* Trust metrics */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sem necessidade de cartão
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Prevenção automática de conflitos
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Painel financeiro em tempo real
          </span>
        </div>
      </section>

      {/* DASHBOARD MOCKUP PREVIEW */}
      <section className="px-6 lg:px-12 pb-24 max-w-6xl mx-auto">
        <div className="relative rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xl shadow-slate-200/60">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 mb-3 bg-slate-50/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono font-medium">agendamax.app / dashboard</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              ● Online
            </span>
          </div>

          {/* Interactive UI Mockup Illustration */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block">Agendamentos Hoje</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">12 Atendimentos</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">↑ 100% confirmados</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block">Horários Disponíveis</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">8 Vagas Livres</span>
              <span className="text-[10px] text-brand-600 font-bold mt-1 block">Anti-conflito ativo</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block">Clientes Ativos</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">348 Cadastrados</span>
              <span className="text-[10px] text-indigo-600 font-bold mt-1 block">Histórico completo</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block">Faturamento Mensal</span>
              <span className="text-xl font-black text-emerald-600 mt-1 block">R$ 14.850,00</span>
              <span className="text-[10px] text-slate-500 font-bold mt-1 block">Lucro consolidado</span>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="py-20 px-6 lg:px-12 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">Por que escolher o AgendaMax?</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Desenvolvido com foco absoluto em simplicidade, elegância e produtividade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Conflitos de Horário</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nossa validação em tempo real previne sobreposição de atendimento para a mesma equipe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Caixa Financeiro Integrado</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cada atendimento concluído gera o lançamento automático de receita para o seu negócio.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Histórico de Clientes 360°</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consulte contatos, total gasto e histórico de consultas anteriores com apenas um clique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS GRID */}
      <section id="recursos" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">Recursos do Sistema</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Todas as ferramentas necessárias organizadas em um ambiente limpo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <Calendar className="w-6 h-6 text-brand-600" />
            <h4 className="text-sm font-bold text-slate-900">Agenda Inteligente</h4>
            <p className="text-xs text-slate-600">Visualização por Dia, Semana e Mês com criação rápida de horários.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <Users className="w-6 h-6 text-cyan-600" />
            <h4 className="text-sm font-bold text-slate-900">Gestão de Clientes</h4>
            <p className="text-xs text-slate-600">Filtro de busca, contatos, observações e histórico individual.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Quadro de Funcionários</h4>
            <p className="text-xs text-slate-600">Horários de expediente, cargos e agenda individual por profissional.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <Scissors className="w-6 h-6 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">Catálogo de Serviços</h4>
            <p className="text-xs text-slate-600">Preços, duração em minutos e categorias de atendimento.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Caixa &amp; Financeiro</h4>
            <p className="text-xs text-slate-600">Receitas, despesas operacionais e balanço líquido em tempo real.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <BarChart3 className="w-6 h-6 text-rose-600" />
            <h4 className="text-sm font-bold text-slate-900">Relatórios &amp; Exportação</h4>
            <p className="text-xs text-slate-600">Análise de produtividade e exportação de dados em CSV.</p>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-20 px-6 lg:px-12 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">Planos Transparentes</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Escolha o plano ideal para a escala da sua empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* PLANO GRATUITO */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Plano Gratuito
                </span>
                <div>
                  <span className="text-4xl font-black text-slate-900">R$ 0</span>
                  <span className="text-xs text-slate-500 font-semibold"> /mês para sempre</span>
                </div>
                <p className="text-xs text-slate-600">Ideal para profissionais autônomos iniciando seus atendimentos.</p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Até 50 agendamentos/mês
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> 1 Funcionário cadastrado
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Prevenção de conflito de horários
                  </li>
                </ul>
              </div>

              <Link
                href="/cadastrar"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center transition-colors"
              >
                Começar Grátis
              </Link>
            </div>

            {/* PLANO PRO */}
            <div className="p-8 rounded-3xl bg-white border-2 border-brand-600 flex flex-col justify-between space-y-6 relative shadow-lg shadow-brand-500/10">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-brand-600 text-white text-[10px] font-extrabold tracking-wider uppercase">
                Mais Recomendado
              </div>

              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  Plano Pro Max
                </span>
                <div>
                  <span className="text-4xl font-black text-slate-900">R$ 99</span>
                  <span className="text-xs text-slate-500 font-semibold"> /mês</span>
                </div>
                <p className="text-xs text-slate-600">Para clínicas, salões e barbearias em crescimento acelerado.</p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Agendamentos Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Funcionários Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Gestão Financeira Completa
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Exportação de Dados em CSV
                  </li>
                </ul>
              </div>

              <Link
                href="/cadastrar"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold text-center shadow-md transition-all active:scale-95"
              >
                Testar Plano Pro Grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="py-20 px-6 lg:px-12 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">Perguntas Frequentes</h2>
          <p className="text-xs sm:text-sm text-slate-600">Tire suas dúvidas sobre o sistema.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-600 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-6 lg:px-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
              AM
            </div>
            <span className="font-extrabold text-sm text-slate-900">AgendaMax</span>
          </div>
          <p>© 2026 AgendaMax SaaS. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
