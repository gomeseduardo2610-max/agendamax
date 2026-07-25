import React from 'react';
import { Appointment, Client, Staff, Service } from '@/lib/types';
import { formatTime } from '@/lib/agenda-utils';
import Badge from '@/components/ui/Badge';
import { Plus } from 'lucide-react';

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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-xs overflow-x-auto">
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
                  ? 'bg-brand-50/50 border-brand-300 shadow-sm'
                  : isSelected
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-slate-50/40 border-slate-200'
              }`}
            >
              {/* Day Header */}
              <div
                onClick={() => onSelectDate(isoStr)}
                className="cursor-pointer pb-2 mb-3 border-b border-slate-200 flex items-center justify-between group"
              >
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-500 block tracking-wider">
                    {name}
                  </span>
                  <span
                    className={`text-lg font-black ${
                      isToday
                        ? 'text-brand-700'
                        : isSelected
                        ? 'text-slate-900'
                        : 'text-slate-700 group-hover:text-brand-600'
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {dayApts.length}
                </span>
              </div>

              {/* Day List Body */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[500px] pr-1">
                {dayApts.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-xs font-medium">
                    <span>Sem horários</span>
                  </div>
                ) : (
                  dayApts.map((apt) => {
                    const client = clients.find((c) => c.id === apt.clientId);
                    const service = services.find((s) => s.id === apt.serviceId);

                    return (
                      <div
                        key={apt.id}
                        onClick={() => onSelectAppointment(apt)}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-brand-300 cursor-pointer hover:scale-[1.02] transition-all shadow-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700">
                          <span>
                            {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                          </span>
                          <span className="text-emerald-600 font-extrabold">R${apt.price}</span>
                        </div>
                        <h6 className="text-xs font-black text-slate-900 mt-1 truncate">
                          {client?.name || 'Cliente'}
                        </h6>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[10px] text-slate-500 font-medium truncate">
                            {service?.name || 'Serviço'}
                          </p>
                          <Badge status={apt.status} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add button for this day */}
              <button
                onClick={() => onOpenCreateWithDate(isoStr)}
                className="mt-3 w-full py-1.5 bg-white hover:bg-brand-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold border border-slate-200 hover:border-brand-600 flex items-center justify-center gap-1 transition-all shadow-xs"
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
