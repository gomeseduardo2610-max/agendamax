import React from 'react';
import Modal from '@/components/ui/Modal';
import { Appointment, Staff } from '@/lib/types';
import { Calendar, Clock, User } from 'lucide-react';

interface QuickRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  staffList: Staff[];
  onSave: (
    id: string,
    data: { date: string; startTime: string; staffId: string }
  ) => { success: boolean; error?: string };
}

export const QuickRescheduleModal: React.FC<QuickRescheduleModalProps> = ({
  isOpen,
  onClose,
  appointment,
  staffList,
  onSave,
}) => {
  const [date, setDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('09:00');
  const [staffId, setStaffId] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    if (appointment && isOpen) {
      setDate(appointment.date);
      setStartTime(appointment.startTime);
      setStaffId(appointment.staffId);
      setErrorMsg('');
    }
  }, [appointment, isOpen]);

  if (!appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !staffId) {
      setErrorMsg('Preencha a nova data, horário e profissional.');
      return;
    }

    const res = onSave(appointment.id, { date, startTime, staffId });
    if (!res.success) {
      setErrorMsg(res.error || 'Conflito de horário detectado.');
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reagendar Rápidamente" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Nova Data *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Novo Horário *
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-indigo-400" /> Profissional *
          </label>
          <select
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
          >
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
          >
            Confirmar Reagendamento
          </button>
        </div>
      </form>
    </Modal>
  );
};
