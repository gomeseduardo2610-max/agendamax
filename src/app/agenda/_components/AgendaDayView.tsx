import React from 'react';
import { Appointment, Client, Staff, Service, BlockedSlot } from '@/lib/types';
import { AppointmentCard } from './AppointmentCard';
import { formatTime } from '@/lib/agenda-utils';
import { Clock, Plus, Ban, AlertCircle } from 'lucide-react';

interface AgendaDayViewProps {
  selectedDateStr: string;
  appointments: Appointment[];
  clients: Client[];
  staffList: Staff[];
  services: Service[];
  blockedSlots: BlockedSlot[];
  companyName: string;
  selectedStaffFilter: string;
  onSelectAppointment: (apt: Appointment) => void;
  onConfirmPresence: (aptId: string) => void;
  onCompleteAppointment: (aptId: string) => void;
  onCancelAppointment: (aptId: string) => void;
  onDuplicateAppointment: (apt: Appointment) => void;
  onQuickReschedule: (apt: Appointment) => void;
  onOpenClientHistory: (clientId: string) => void;
  onOpenCreateWithTime: (startTime: string, staffId?: string) => void;
  onDeleteBlockedSlot: (id: string) => void;
}

export const AgendaDayView: React.FC<AgendaDayViewProps> = ({
  selectedDateStr,
  appointments,
  clients,
  staffList,
  services,
  blockedSlots,
  companyName,
  selectedStaffFilter,
  onSelectAppointment,
  onConfirmPresence,
  onCompleteAppointment,
  onCancelAppointment,
  onDuplicateAppointment,
  onQuickReschedule,
  onOpenClientHistory,
  onOpenCreateWithTime,
  onDeleteBlockedSlot,
}) => {
  const isToday = selectedDateStr === new Date().toISOString().split('T')[0];
  const [currentTimeStr, setCurrentTimeStr] = React.useState('');

  // Update current time line every minute
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeSlots = React.useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => {
      const hour = i + 8;
      return `${hour < 10 ? '0' + hour : hour}:00`;
    });
  }, []);

  const filteredStaff = React.useMemo(() => {
    if (selectedStaffFilter === 'ALL') return staffList;
    return staffList.filter((s) => s.id === selectedStaffFilter);
  }, [staffList, selectedStaffFilter]);

  // Blocked slots for this date
  const dateBlocks = React.useMemo(() => {
    return blockedSlots.filter((b) => b.date === selectedDateStr);
  }, [blockedSlots, selectedDateStr]);

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 lg:p-6 backdrop-blur-md">
      {/* Current Time Indicator Bar if Today */}
      {isToday && (
        <div className="mb-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
            <span>Horário Atual no Salão:</span>
            <span className="text-sm font-mono font-bold text-white bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
              {currentTimeStr}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Linha de tempo em tempo real</span>
        </div>
      )}

      {/* Grid Header — Staff Columns */}
      <div className="overflow-x-auto pb-4">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p>Nenhum profissional cadastrado ou selecionado.</p>
          </div>
        ) : (
          <div
            className="grid gap-4 min-w-[700px]"
            style={{
              gridTemplateColumns: `80px repeat(${filteredStaff.length}, minmax(240px, 1fr))`,
            }}
          >
            {/* Header top-left empty corner */}
            <div className="p-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
              Horário
            </div>

            {/* Staff Headers */}
            {filteredStaff.map((staffMember) => (
              <div
                key={staffMember.id}
                className="p-2.5 text-center bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center">
                  {staffMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-slate-200 truncate">{staffMember.name}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{staffMember.role}</p>
                </div>
              </div>
            ))}

            {/* Time Slot Rows */}
            {timeSlots.map((slotTime) => (
              <React.Fragment key={slotTime}>
                {/* Time slot column */}
                <div className="flex items-center justify-center text-xs font-mono text-slate-400 font-semibold border-t border-slate-800/60 py-4">
                  {slotTime}
                </div>

                {/* Staff columns for this time slot */}
                {filteredStaff.map((staffMember) => {
                  // Find appointments matching staff, date, and hour
                  const hourNum = parseInt(slotTime.split(':')[0], 10);
                  const matchingApts = appointments.filter((apt) => {
                    if (apt.date !== selectedDateStr) return false;
                    if (apt.staffId !== staffMember.id) return false;
                    const aptHour = parseInt(apt.startTime.split(':')[0], 10);
                    return aptHour === hourNum;
                  });

                  // Check if there is a blocked slot for this staff and time
                  const isBlocked = dateBlocks.find((b) => {
                    if (b.staffId !== staffMember.id && b.staffId !== 'ALL') return false;
                    const bStartHour = parseInt(b.startTime.split(':')[0], 10);
                    const bEndHour = parseInt(b.endTime.split(':')[0], 10);
                    return hourNum >= bStartHour && hourNum < bEndHour;
                  });

                  return (
                    <div
                      key={`${staffMember.id}-${slotTime}`}
                      className="border-t border-slate-800/60 py-2 px-1 relative group min-h-[90px] transition-colors hover:bg-slate-800/30 rounded-lg"
                    >
                      {/* Blocked Slot View */}
                      {isBlocked ? (
                        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Ban className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-semibold">{isBlocked.reason}</span>
                          </div>
                          <button
                            onClick={() => onDeleteBlockedSlot(isBlocked.id)}
                            className="text-[10px] text-amber-400/80 hover:text-amber-200 underline"
                          >
                            Desbloquear
                          </button>
                        </div>
                      ) : matchingApts.length > 0 ? (
                        <div className="space-y-2">
                          {matchingApts.map((apt) => {
                            const client = clients.find((c) => c.id === apt.clientId);
                            const service = services.find((s) => s.id === apt.serviceId);
                            return (
                              <AppointmentCard
                                key={apt.id}
                                appointment={apt}
                                client={client}
                                staff={staffMember}
                                service={service}
                                companyName={companyName}
                                onSelect={onSelectAppointment}
                                onConfirmPresence={onConfirmPresence}
                                onComplete={onCompleteAppointment}
                                onCancel={onCancelAppointment}
                                onDuplicate={onDuplicateAppointment}
                                onQuickReschedule={onQuickReschedule}
                                onOpenClientHistory={onOpenClientHistory}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        /* Empty slot click button */
                        <button
                          onClick={() => onOpenCreateWithTime(slotTime, staffMember.id)}
                          className="w-full h-full min-h-[50px] border border-dashed border-slate-800 hover:border-indigo-500/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs text-indigo-400 gap-1 bg-indigo-500/5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agendar às {slotTime}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
