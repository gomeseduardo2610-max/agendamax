'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ToastManager from '@/components/ui/ToastManager';
import Badge from '@/components/ui/Badge';
import { useAgendaStore } from '@/lib/store';
import {
  Calendar,
  Users,
  UserCheck,
  DollarSign,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { appointments, clients, staff, services, transactions } = useAgendaStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const completedToday = todayAppointments.filter((a) => a.status === 'COMPLETED').length;

  const totalDailySlots = (staff.length || 3) * 8;
  const freeSlotsToday = Math.max(0, totalDailySlots - todayAppointments.length);

  const totalRevenue = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <ToastManager />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 p-6 md:p-8 text-white shadow-lg shadow-brand-500/20">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Visão Geral em Tempo Real
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Painel de Controle AgendaMax
                </h1>
                <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-xl font-medium">
                  Acompanhe agendamentos de hoje, vagas livres, equipe e balanço financeiro.
                </p>
              </div>

              <div>
                <Link
                  href="/agenda"
                  className="px-5 py-2.5 bg-white text-brand-700 hover:bg-slate-50 rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 inline-block"
                >
                  Abrir Agenda Completa
                </Link>
              </div>
            </div>
          </div>

          {/* KPI Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Agendamentos Hoje</span>
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{todayAppointments.length}</span>
                <span className="text-xs font-semibold text-slate-500 ml-2">({completedToday} concluídos)</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Horários Livres Hoje</span>
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{freeSlotsToday}</span>
                <span className="text-xs font-semibold text-slate-500 ml-2">vagas livres</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Clientes &amp; Equipe</span>
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-4">
                <div>
                  <span className="text-2xl font-black text-slate-900">{clients.length}</span>
                  <span className="text-[11px] font-semibold text-slate-500 block">Clientes</span>
                </div>
                <div className="h-7 w-px bg-slate-200" />
                <div>
                  <span className="text-2xl font-black text-slate-900">{staff.length}</span>
                  <span className="text-[11px] font-semibold text-slate-500 block">Profissionais</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Lucro Líquido</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-emerald-600">
                  R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    Próximos Atendimentos de Hoje
                  </h3>
                  <Link href="/agenda" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                    <span>Agenda completa</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {todayAppointments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">Nenhum agendamento registrado hoje.</p>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments.map((apt) => {
                      const client = clients.find((c) => c.id === apt.clientId);
                      const stf = staff.find((s) => s.id === apt.staffId);
                      const srv = services.find((s) => s.id === apt.serviceId);

                      return (
                        <div
                          key={apt.id}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                        >
                          <div>
                            <span className="text-xs font-bold text-brand-600 block">{apt.startTime}</span>
                            <h4 className="text-xs font-bold text-slate-900">{client?.name}</h4>
                            <p className="text-[11px] text-slate-500">{srv?.name} • {stf?.name}</p>
                          </div>
                          <Badge status={apt.status} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-600" />
                  Equipe &amp; Agendas
                </h3>
                <div className="space-y-3">
                  {staff.map((stf) => (
                    <div key={stf.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={stf.avatar} alt={stf.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{stf.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{stf.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
