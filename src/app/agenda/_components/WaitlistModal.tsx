import React from 'react';
import Modal from '@/components/ui/Modal';
import { WaitlistEntry, Service } from '@/lib/types';
import { ListPlus, Trash2, Plus } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  waitlist: WaitlistEntry[];
  services: Service[];
  selectedDateStr: string;
  onAddWaitlist: (entry: {
    clientName: string;
    phone: string;
    preferredDate: string;
    serviceName: string;
    notes?: string;
  }) => void;
  onDeleteWaitlist: (id: string) => void;
  onConvertToAppointment: (entry: WaitlistEntry) => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  waitlist,
  services,
  selectedDateStr,
  onAddWaitlist,
  onDeleteWaitlist,
  onConvertToAppointment,
}) => {
  const [clientName, setClientName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [preferredDate, setPreferredDate] = React.useState(selectedDateStr);
  const [serviceName, setServiceName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !serviceName) return;
    onAddWaitlist({ clientName, phone, preferredDate, serviceName });
    setClientName('');
    setPhone('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lista de Espera & Encaixes" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Form to add to waitlist */}
        <form onSubmit={handleSubmit} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <ListPlus className="w-4 h-4" /> Adicionar Cliente na Fila de Espera
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome do Cliente *"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Telefone / WhatsApp *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
            />
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
            />
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
            >
              <option value="">Selecione o Serviço Desejado *</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar à Lista de Espera</span>
          </button>
        </form>

        {/* Existing waitlist list */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Clientes Aguardando Vaga ({waitlist.length})
          </h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {waitlist.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Nenhum cliente na fila de espera no momento.
              </p>
            ) : (
              waitlist.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-white">{entry.clientName}</h5>
                    <p className="text-slate-400 mt-0.5">
                      {entry.serviceName} • Data Desejada: {entry.preferredDate}
                    </p>
                    <p className="text-slate-500 text-[11px] font-mono mt-0.5">{entry.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onConvertToAppointment(entry);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      Converter em Agendamento
                    </button>
                    <button
                      onClick={() => onDeleteWaitlist(entry.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
