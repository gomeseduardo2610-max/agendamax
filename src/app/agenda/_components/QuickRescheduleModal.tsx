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

  const inputClass = 'w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl p-2.5 text-xs font-medium text-slate-900 outline-none transition-all';
  const labelClass = 'text-xs font-bold text-slate-600 mb-1 flex items-center gap-1';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reagendar Rapidamente" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <div>
          <label className={labelClass}>
            <Calendar className="w-3.5 h-3.5 text-brand-600" /> Nova Data *
          </label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            <Clock className="w-3.5 h-3.5 text-brand-600" /> Novo Horário *
          </label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            <User className="w-3.5 h-3.5 text-brand-600" /> Profissional *
          </label>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} required className={inputClass}>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all">
            Confirmar Reagendamento
          </button>
        </div>
      </form>
    </Modal>
  );
};
