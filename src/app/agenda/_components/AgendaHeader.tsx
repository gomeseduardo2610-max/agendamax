import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Ban,
  ListPlus,
  Download,
  Printer,
} from 'lucide-react';

export type CalendarView = 'DAY' | 'WEEK' | 'MONTH';

interface AgendaHeaderProps {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  selectedDateStr: string;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
  onOpenCreateModal: () => void;
  onOpenBlockModal: () => void;
  onOpenWaitlistModal: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
  waitlistCount: number;
}

export const AgendaHeader: React.FC<AgendaHeaderProps> = ({
  view,
  setView,
  selectedDateStr,
  onPrevDate,
  onNextDate,
  onToday,
  onOpenCreateModal,
  onOpenBlockModal,
  onOpenWaitlistModal,
  onExportCSV,
  onPrint,
  waitlistCount,
}) => {
  const formattedDateTitle = React.useMemo(() => {
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [selectedDateStr]);

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
      {/* Date controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={onPrevDate}
            className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-xs"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-white rounded-lg transition-all shadow-xs"
          >
            Hoje
          </button>
          <button
            onClick={onNextDate}
            className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-xs"
            title="Próximo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg capitalize tracking-tight">
          <CalendarIcon className="w-5 h-5 text-brand-600" />
          <span>{formattedDateTitle}</span>
        </div>
      </div>

      {/* Action buttons and View Switcher */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* View mode switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setView('DAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'DAY'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dia
          </button>
          <button
            onClick={() => setView('WEEK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'WEEK'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setView('MONTH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'MONTH'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mês
          </button>
        </div>

        {/* Secondary utilities */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onExportCSV}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Exportar CSV (Ctrl+E)"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">CSV</span>
          </button>

          <button
            onClick={onPrint}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Imprimir Agenda (Ctrl+P)"
          >
            <Printer className="w-4 h-4 text-cyan-600" />
            <span className="hidden md:inline">Imprimir</span>
          </button>

          <button
            onClick={onOpenBlockModal}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-amber-600 rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Bloquear Horário"
          >
            <Ban className="w-4 h-4" />
            <span className="hidden sm:inline">Bloquear</span>
          </button>

          <button
            onClick={onOpenWaitlistModal}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-violet-600 rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all relative shadow-xs"
            title="Lista de Espera"
          >
            <ListPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Espera</span>
            {waitlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center -ml-0.5">
                {waitlistCount}
              </span>
            )}
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Agendamento</span>
          <span className="hidden sm:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono text-white/90">
            Ctrl+N
          </span>
        </button>
      </div>
    </div>
  );
};
