import React from 'react';
import { AgendaStats as AgendaStatsType } from '@/lib/agenda-utils';
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  XCircle,
  DollarSign,
  UserCheck,
  CalendarRange,
} from 'lucide-react';

interface AgendaStatsProps {
  stats: AgendaStatsType;
}

export const AgendaStats: React.FC<AgendaStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
      {/* Total Hoje */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Agendados Hoje</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{stats.todayTotal}</h4>
          <span className="text-[11px] text-slate-500 font-medium">{stats.upcomingCount} a atender</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* Receita Hoje */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Receita Hoje</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">
            R$ {stats.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Mês: R$ {stats.monthRevenue.toLocaleString('pt-BR')}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Taxa de Comparecimento */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Taxa Presença</p>
          <h4 className="text-2xl font-black text-violet-600 mt-1">{stats.attendanceRate}%</h4>
          <span className="text-[11px] text-slate-500 font-medium">{stats.todayCompleted} concluídos</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
          <UserCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Concluídos vs Cancelados */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Status do Dia</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-extrabold text-blue-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {stats.todayCompleted}
            </span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-base font-extrabold text-rose-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {stats.todayCancelled}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Concluído / Cancelado</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Total Semana & Mês */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs col-span-2 md:col-span-4 lg:col-span-1">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Volume Período</p>
          <h4 className="text-sm font-bold text-slate-800 mt-1">
            Semana: <span className="text-brand-600 font-extrabold">{stats.weekTotal}</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            Total Mês: <span className="text-slate-900 font-semibold">{stats.monthTotal} agend.</span>
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
          <CalendarRange className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
