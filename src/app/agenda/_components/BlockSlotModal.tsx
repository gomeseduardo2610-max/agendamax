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
    if (isOpen) {
      setDate(selectedDateStr);
    }
  }, [isOpen, selectedDateStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBlock({ staffId, date, startTime, endTime, reason });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bloquear Horário na Agenda" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-400" /> Profissional Afetado
          </label>
          <select
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
          >
            <option value="ALL">Todos os Profissionais (Empresa Toda)</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Início</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Fim</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 block">Motivo / Descrição</label>
          <input
            type="text"
            placeholder="Ex: Almoço, Reunião de equipe, Manutenção..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
          />
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
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Confirmar Bloqueio</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
