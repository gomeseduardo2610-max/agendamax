import React from 'react';
import { Appointment } from '@/lib/types';

interface AgendaMonthViewProps {
  selectedDateStr: string;
  appointments: Appointment[];
  onSelectDate: (dateStr: string) => void;
  onOpenCreateWithDate: (dateStr: string) => void;
}

export const AgendaMonthView: React.FC<AgendaMonthViewProps> = ({
  selectedDateStr,
  appointments,
  onSelectDate,
  onOpenCreateWithDate,
}) => {
  const monthDays = React.useMemo(() => {
    const curr = new Date(selectedDateStr + 'T00:00:00');
    const year = curr.getFullYear();
    const month = curr.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startDayOfWeek = firstDay.getDay();

    // Previous month filler
    for (let i = startDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({
        date: prevDate.toISOString().split('T')[0],
        isCurrentMonth: false,
        dayNum: prevDate.getDate(),
      });
    }

    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateObj = new Date(year, month, d);
      days.push({
        date: dateObj.toISOString().split('T')[0],
        isCurrentMonth: true,
        dayNum: d,
      });
    }

    // Next month filler
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({
          date: nextDate.toISOString().split('T')[0],
          isCurrentMonth: false,
          dayNum: nextDate.getDate(),
        });
      }
    }
    return days;
  }, [selectedDateStr]);

  const todayStr = new Date().toISOString().split('T')[0];

  const weekHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-xs">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {weekHeaders.map((dayName) => (
          <div key={dayName} className="text-xs font-bold text-slate-500 py-2 uppercase tracking-wider">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Month Grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map(({ date, isCurrentMonth, dayNum }) => {
          const isToday = date === todayStr;
          const isSelected = date === selectedDateStr;

          const dayApts = appointments.filter((a) => a.date === date);
          const completedCount = dayApts.filter((a) => a.status === 'COMPLETED').length;
          const scheduledCount = dayApts.filter((a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length;

          return (
            <div
              key={date}
              onClick={() => onSelectDate(date)}
              className={`min-h-[100px] p-2 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                !isCurrentMonth
                  ? 'bg-slate-50/50 border-slate-100 opacity-40 hover:opacity-80'
                  : isToday
                  ? 'bg-brand-50/40 border-brand-300 shadow-sm'
                  : isSelected
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-white border-slate-200 hover:border-brand-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-black ${
                    isToday
                      ? 'w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs shadow-xs'
                      : isCurrentMonth
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {dayNum}
                </span>

                {dayApts.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 border border-brand-200">
                    {dayApts.length}
                  </span>
                )}
              </div>

              {/* Status pills inside month cell */}
              <div className="mt-2 space-y-1">
                {scheduledCount > 0 && (
                  <div className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-lg truncate font-bold">
                    {scheduledCount} agendados
                  </div>
                )}
                {completedCount > 0 && (
                  <div className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded-lg truncate font-bold">
                    {completedCount} concluídos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
