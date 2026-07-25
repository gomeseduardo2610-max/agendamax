import React from 'react';
import Modal from '@/components/ui/Modal';
import { Staff } from '@/lib/types';
import { Ban, User } from 'lucide-react';

interface BlockSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  selectedDateStr: string;
  onAddBlock: (block: {
    staffId: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
  }) => void;
}

export const BlockSlotModal: React.FC<BlockSlotModalProps> = ({
  isOpen,
  onClose,
  staffList,
  selectedDateStr,
  onAddBlock,
}) => {
  const [staffId, setStaffId] = React.useState('ALL');
  const [date, setDate] = React.useState(selectedDateStr);
  const [startTime, setStartTime] = React.useState('12:00');
  const [endTime, setEndTime] = React.useState('13:00');
  const [reason, setReason] = React.useState('Intervalo de Almoço');

  React.useEffect(() => {
    if (isOpen) setDate(selectedDateStr);
  }, [isOpen, selectedDateStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBlock({ staffId, date, startTime, endTime, reason });
    onClose();
  };

  const inputClass = 'w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl p-2 text-xs font-medium text-slate-900 outline-none transition-all';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bloquear Horário na Agenda" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-600" /> Profissional Afetado
          </label>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className={inputClass}>
            <option value="ALL">Todos os Profissionais (Empresa Toda)</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Início</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Fim</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 mb-1 block">Motivo / Descrição</label>
          <input
            type="text"
            placeholder="Ex: Almoço, Reunião de equipe, Manutenção..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className={inputClass + ' p-2.5'}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all">
            <Ban className="w-3.5 h-3.5" />
            Confirmar Bloqueio
          </button>
        </div>
      </form>
    </Modal>
  );
};
