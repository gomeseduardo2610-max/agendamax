import React from 'react';
import { AgendaStats as AgendaStatsType } from '@/lib/agenda-utils';
import {
  Calendar,
  CheckCircle2,
  Clock,
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-sm backdrop-blur-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Agendados Hoje</p>
          <h4 className="text-xl font-bold text-white mt-1">{stats.todayTotal}</h4>
          <span className="text-[11px] text-slate-500">{stats.upcomingCount} a atender</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* Receita Hoje */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-sm backdrop-blur-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Receita Hoje</p>
          <h4 className="text-xl font-bold text-emerald-400 mt-1">
            R$ {stats.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h4>
          <span className="text-[11px] text-slate-500">Mês: R$ {stats.monthRevenue.toLocaleString('pt-BR')}</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Taxa de Comparecimento */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-sm backdrop-blur-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Taxa Presença</p>
          <h4 className="text-xl font-bold text-violet-400 mt-1">{stats.attendanceRate}%</h4>
          <span className="text-[11px] text-slate-500">{stats.todayCompleted} concluídos</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <UserCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Concluídos vs Cancelados */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-sm backdrop-blur-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Status do Dia</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-blue-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {stats.todayCompleted}
            </span>
            <span className="text-xs text-slate-600">/</span>
            <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> {stats.todayCancelled}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Concluído / Cancelado</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Total Semana & Mês */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-sm backdrop-blur-sm col-span-2 md:col-span-4 lg:col-span-1">
        <div>
          <p className="text-xs text-slate-400 font-medium">Volume Período</p>
          <h4 className="text-base font-semibold text-slate-200 mt-1">
            Semana: <span className="text-indigo-400 font-bold">{stats.weekTotal}</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Total Mês: <span className="text-indigo-300 font-medium">{stats.monthTotal} agend.</span>
          </span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <CalendarRange className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
