import React from 'react';
import { Appointment, Client, Staff, Service } from '@/lib/types';
import { formatTime, getStatusStyle } from '@/lib/agenda-utils';
import { Plus, Calendar, User, Scissors } from 'lucide-react';

interface AgendaWeekViewProps {
  selectedDateStr: string;
  appointments: Appointment[];
  clients: Client[];
  staffList: Staff[];
  services: Service[];
  onSelectAppointment: (apt: Appointment) => void;
  onSelectDate: (dateStr: string) => void;
  onOpenCreateWithDate: (dateStr: string) => void;
}

export const AgendaWeekView: React.FC<AgendaWeekViewProps> = ({
  selectedDateStr,
  appointments,
  clients,
  staffList,
  services,
  onSelectAppointment,
  onSelectDate,
  onOpenCreateWithDate,
}) => {
  const weekDays = React.useMemo(() => {
    const curr = new Date(selectedDateStr + 'T00:00:00');
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const name = d.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayNum = d.getDate();
      days.push({ isoStr, name, dayNum });
    }
    return days;
  }, [selectedDateStr]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 lg:p-6 backdrop-blur-md overflow-x-auto">
      <div className="grid grid-cols-7 gap-3 min-w-[850px]">
        {weekDays.map(({ isoStr, name, dayNum }) => {
          const isSelected = isoStr === selectedDateStr;
          const isToday = isoStr === todayStr;

          const dayApts = appointments
            .filter((a) => a.date === isoStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={isoStr}
              className={`rounded-2xl border p-3 flex flex-col h-full min-h-[450px] transition-all ${
                isToday
                  ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md shadow-indigo-500/5'
                  : isSelected
                  ? 'bg-slate-900/90 border-slate-700'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              {/* Day Header */}
              <div
                onClick={() => onSelectDate(isoStr)}
                className="cursor-pointer pb-2 mb-3 border-b border-slate-800 flex items-center justify-between group"
              >
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                    {name}
                  </span>
                  <span
                    className={`text-lg font-extrabold ${
                      isToday
                        ? 'text-indigo-400'
                        : isSelected
                        ? 'text-white'
                        : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {dayApts.length}
                </span>
              </div>

              {/* Day List Body */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[500px] pr-1">
                {dayApts.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-600 text-xs gap-1">
                    <span>Sem horários</span>
                  </div>
                ) : (
                  dayApts.map((apt) => {
                    const client = clients.find((c) => c.id === apt.clientId);
                    const service = services.find((s) => s.id === apt.serviceId);
                    const statusInfo = getStatusStyle(apt.status);

                    return (
                      <div
                        key={apt.id}
                        onClick={() => onSelectAppointment(apt)}
                        className={`p-2.5 rounded-xl border ${statusInfo.bg} cursor-pointer hover:scale-[1.02] transition-all shadow-sm`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-200">
                          <span>
                            {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                          </span>
                          <span className="text-emerald-400">R${apt.price}</span>
                        </div>
                        <h6 className="text-xs font-bold text-white mt-1 truncate">
                          {client?.name || 'Cliente'}
                        </h6>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {service?.name || 'Serviço'}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add button for this day */}
              <button
                onClick={() => onOpenCreateWithDate(isoStr)}
                className="mt-3 w-full py-1.5 bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agendar</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
