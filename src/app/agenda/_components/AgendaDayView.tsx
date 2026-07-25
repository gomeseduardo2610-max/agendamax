import React from 'react';
import { Appointment, Client, Staff, Service, BlockedSlot } from '@/lib/types';
import { AppointmentCard } from './AppointmentCard';
import { Ban, AlertCircle, Plus } from 'lucide-react';

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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-xs">
      {/* Current Time Indicator Bar if Today */}
      {isToday && (
        <div className="mb-4 bg-brand-50 border border-brand-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-ping"></span>
            <span>Horário Atual no Salão:</span>
            <span className="text-sm font-mono font-black text-brand-700 bg-white px-2 py-0.5 rounded-lg border border-brand-200 shadow-xs">
              {currentTimeStr}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Linha de tempo em tempo real</span>
        </div>
      )}

      {/* Grid Header — Staff Columns */}
      <div className="overflow-x-auto pb-4">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Nenhum profissional cadastrado ou selecionado.</p>
          </div>
        ) : (
          <div
            className="grid gap-4 min-w-[700px]"
            style={{
              gridTemplateColumns: `80px repeat(${filteredStaff.length}, minmax(240px, 1fr))`,
            }}
          >
            {/* Header top-left empty corner */}
            <div className="p-2 text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              Horário
            </div>

            {/* Staff Headers */}
            {filteredStaff.map((staffMember) => (
              <div
                key={staffMember.id}
                className="p-2.5 text-center bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 text-brand-700 font-black text-xs flex items-center justify-center">
                  {staffMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-slate-900 truncate">{staffMember.name}</h5>
                  <p className="text-[10px] text-slate-500 truncate font-medium">{staffMember.role}</p>
                </div>
              </div>
            ))}

            {/* Time Slot Rows */}
            {timeSlots.map((slotTime) => (
              <React.Fragment key={slotTime}>
                {/* Time slot column */}
                <div className="flex items-center justify-center text-xs font-mono text-slate-500 font-bold border-t border-slate-100 py-4">
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
                      className="border-t border-slate-100 py-2 px-1 relative group min-h-[90px] transition-colors hover:bg-slate-50 rounded-xl"
                    >
                      {/* Blocked Slot View */}
                      {isBlocked ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Ban className="w-3.5 h-3.5 text-amber-600" />
                            <span>{isBlocked.reason}</span>
                          </div>
                          <button
                            onClick={() => onDeleteBlockedSlot(isBlocked.id)}
                            className="text-[10px] text-amber-600 hover:text-amber-900 underline font-semibold"
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
                          className="w-full h-full min-h-[50px] border border-dashed border-slate-200 hover:border-brand-400 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs font-bold text-brand-600 gap-1 bg-brand-50/50"
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
