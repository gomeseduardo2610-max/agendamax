'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ToastManager from '@/components/ui/ToastManager';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/lib/useToast';
import { useAgendaStore } from '@/lib/store';
import {
  Calendar,
  Users,
  UserCheck,
  DollarSign,
  Clock,
  ArrowUpRight,
  Sparkles,
  Scissors,
  TrendingUp,
  XCircle,
  CheckCircle2,
  Bell,
  Activity,
  Plus,
  RefreshCw,
  Eye,
  AlertCircle,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  kpis: {
    todayAppointmentsCount: number;
    weekAppointmentsCount: number;
    nextAppointment: {
      id: string;
      clientName: string;
      serviceName: string;
      staffName: string;
      time: string;
      date: string;
    } | null;
    clientsCount: number;
    staffCount: number;
    servicesCount: number;
    monthRevenue: number;
    monthNetProfit: number;
    todayRevenue: number;
    cancellationsCount: number;
    completedAppointmentsCount: number;
    freeSlotsToday: number;
  };
  todayAppointments: Array<{
    id: string;
    clientId: string;
    clientName: string;
    clientPhone?: string;
    serviceId: string;
    serviceName: string;
    staffId: string;
    staffName: string;
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    price: number;
    notes?: string;
  }>;
  staffMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    workStart?: string;
    workEnd?: string;
  }>;
  chartData: Array<{
    date: string;
    label: string;
    revenue: number;
    appointments: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
  }>;
}

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cancelAppointment, completeAppointment } = useAgendaStore();
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        addToast({ title: 'Erro de Carregamento', description: 'Erro ao carregar os dados em tempo real.', type: 'error' });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAppointmentModal = (apt: any) => {
    setSelectedAppointment(apt);
    setIsModalOpen(true);
  };

  const handleCancelApt = (id: string) => {
    cancelAppointment(id);
    addToast({ title: 'Agendamento Cancelado', description: 'O agendamento foi cancelado com sucesso.', type: 'info' });
    setIsModalOpen(false);
    fetchDashboardData();
  };

  const handleCompleteApt = (id: string) => {
    completeAppointment(id);
    addToast({ title: 'Atendimento Concluído!', description: 'Agendamento concluído e receita registrada com sucesso.', type: 'success' });
    setIsModalOpen(false);
    fetchDashboardData();
  };

  const kpis = stats?.kpis || {
    todayAppointmentsCount: 0,
    weekAppointmentsCount: 0,
    nextAppointment: null,
    clientsCount: 0,
    staffCount: 0,
    servicesCount: 0,
    monthRevenue: 0,
    monthNetProfit: 0,
    todayRevenue: 0,
    cancellationsCount: 0,
    completedAppointmentsCount: 0,
    freeSlotsToday: 0,
  };

  const hasChartData = stats?.chartData?.some((d) => d.revenue > 0 || d.appointments > 0);
  const maxRevenue = Math.max(...(stats?.chartData?.map((d) => d.revenue) || [1]), 1);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <ToastManager />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Top Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 p-6 md:p-8 text-white shadow-lg shadow-brand-500/20">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Painel Dinâmico em Tempo Real
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Painel de Controle AgendaMax
                </h1>
                <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-xl font-medium">
                  Acompanhamento exclusivo de dados reais do banco de dados da sua empresa.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
                  title="Atualizar Dados"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Atualizar</span>
                </button>

                <Link
                  href="/agenda"
                  className="px-5 py-2.5 bg-white text-brand-700 hover:bg-slate-50 rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 inline-block"
                >
                  Abrir Agenda Completa
                </Link>
              </div>
            </div>
          </div>

          {/* KPI STAT CARDS (11 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Agendamentos Hoje */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Agendamentos Hoje</span>
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{kpis.todayAppointmentsCount}</span>
                <span className="text-xs font-semibold text-slate-500 ml-2">para hoje</span>
              </div>
            </div>

            {/* 2. Agendamentos da Semana */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Agendamentos da Semana</span>
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{kpis.weekAppointmentsCount}</span>
                <span className="text-xs font-semibold text-slate-500 ml-2">nesta semana</span>
              </div>
            </div>

            {/* 3. Próximo Atendimento */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Próximo Atendimento</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2">
                {kpis.nextAppointment ? (
                  <div>
                    <span className="text-sm font-black text-slate-900 block truncate">
                      {kpis.nextAppointment.time} - {kpis.nextAppointment.clientName}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 block truncate">
                      {kpis.nextAppointment.serviceName}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 block">Nenhum agendamento futuro</span>
                )}
              </div>
            </div>

            {/* 4. Horários Livres */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Horários Livres Hoje</span>
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                {kpis.staffCount > 0 ? (
                  <>
                    <span className="text-2xl font-black text-slate-900">{kpis.freeSlotsToday}</span>
                    <span className="text-xs font-semibold text-slate-500 ml-2">vagas livres</span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 block">Sem funcionários cadastrados</span>
                )}
              </div>
            </div>

            {/* 5. Clientes Cadastrados */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Clientes Cadastrados</span>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                {kpis.clientsCount > 0 ? (
                  <span className="text-2xl font-black text-slate-900">{kpis.clientsCount}</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 block">Nenhum cliente cadastrado</span>
                )}
              </div>
            </div>

            {/* 6. Funcionários Ativos */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Funcionários Ativos</span>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                {kpis.staffCount > 0 ? (
                  <span className="text-2xl font-black text-slate-900">{kpis.staffCount}</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 block">Nenhum funcionário cadastrado</span>
                )}
              </div>
            </div>

            {/* 7. Serviços Cadastrados */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Serviços Cadastrados</span>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Scissors className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                {kpis.servicesCount > 0 ? (
                  <span className="text-2xl font-black text-slate-900">{kpis.servicesCount}</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 block">Cadastre seu primeiro serviço</span>
                )}
              </div>
            </div>

            {/* 8. Receita do Mês */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Receita do Mês</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                {kpis.monthRevenue > 0 ? (
                  <span className="text-2xl font-black text-emerald-600">
                    R$ {kpis.monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 block">Ainda não há movimentações financeiras</span>
                )}
              </div>
            </div>

            {/* 9. Receita de Hoje */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Receita de Hoje</span>
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">
                  R$ {kpis.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* 10. Agendamentos Concluídos */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Concluídos</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{kpis.completedAppointmentsCount}</span>
                <span className="text-xs font-semibold text-slate-500 ml-2">atendimentos</span>
              </div>
            </div>

            {/* 11. Cancelamentos */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Cancelamentos</span>
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{kpis.cancellationsCount}</span>
                <span className="text-xs font-semibold text-slate-500 ml-2">registrados</span>
              </div>
            </div>
          </div>

          {/* MAIN DASHBOARD SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Chart & Today's Schedule) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dynamic Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-600" />
                    Desempenho Financeiro (Últimos 7 Dias)
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Dados Reais</span>
                </div>

                {!hasChartData ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                    <TrendingUp className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-600">
                      Ainda não há movimentações financeiras no período.
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                      Conclua agendamentos ou lance movimentações financeiras para visualizar o gráfico de desempenho.
                    </p>
                  </div>
                ) : (
                  <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
                    {stats?.chartData?.map((item) => {
                      const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                      return (
                        <div key={item.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            R$ {item.revenue}
                          </span>
                          <div
                            style={{ height: `${Math.max(8, heightPercent)}%` }}
                            className="w-full bg-gradient-to-t from-brand-600 to-indigo-500 rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-sm"
                          />
                          <span className="text-[10px] font-semibold text-slate-400 truncate max-w-full">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Agenda do dia */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    Agenda do Dia
                  </h3>
                  <Link
                    href="/agenda"
                    className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <span>Abrir agenda</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {!stats?.todayAppointments || stats.todayAppointments.length === 0 ? (
                  <div className="text-center py-10 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">Nenhum agendamento para hoje.</p>
                    <Link
                      href="/agenda"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agendar Agora</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.todayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => handleOpenAppointmentModal(apt)}
                        className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-center min-w-[65px]">
                            <span className="text-xs font-black text-brand-600 block">{apt.startTime}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{apt.endTime}</span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{apt.clientName}</h4>
                            <p className="text-[11px] text-slate-500">
                              {apt.serviceName} • <span className="font-semibold">{apt.staffName}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-800 hidden sm:inline">
                            R$ {apt.price.toFixed(2)}
                          </span>
                          <Badge status={apt.status} />
                          <Eye className="w-4 h-4 text-slate-400 hover:text-brand-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Activities & Notifications) */}
            <div className="space-y-6">
              {/* Notificações Reais */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  Notificações do Sistema
                </h3>

                {!stats?.notifications || stats.notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
                    Sua caixa de notificações está limpa.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats.notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                      >
                        <span className="font-bold text-slate-900 block">{notif.title}</span>
                        <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Atividades Recentes Reais */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-600" />
                  Atividades Recentes
                </h3>

                {!stats?.recentActivities || stats.recentActivities.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                    Nenhuma atividade recente registrada.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentActivities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                      >
                        <div className="p-2 rounded-lg bg-white border border-slate-200 text-brand-600 mt-0.5">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900">{act.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* APPOINTMENT DETAILS MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes do Agendamento"
        subtitle="Informações completas e gerenciamento"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Horário:</span>
                <span className="text-xs font-extrabold text-brand-600">
                  {selectedAppointment.startTime} - {selectedAppointment.endTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Cliente:</span>
                <span className="text-xs font-bold text-slate-900">{selectedAppointment.clientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Serviço:</span>
                <span className="text-xs font-bold text-slate-900">{selectedAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Profissional:</span>
                <span className="text-xs font-bold text-slate-900">{selectedAppointment.staffName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Valor:</span>
                <span className="text-xs font-black text-emerald-600">
                  R$ {selectedAppointment.price?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Status Atual:</span>
                <Badge status={selectedAppointment.status} />
              </div>
            </div>

            {selectedAppointment.status !== 'CANCELLED' && selectedAppointment.status !== 'COMPLETED' && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleCompleteApt(selectedAppointment.id)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluir Atendimento</span>
                </button>
                <button
                  onClick={() => handleCancelApt(selectedAppointment.id)}
                  className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
