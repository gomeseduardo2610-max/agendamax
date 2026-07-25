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

  const inputClass = 'bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl p-2.5 text-xs font-medium text-slate-900 outline-none transition-all';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lista de Espera & Encaixes" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Add to waitlist form */}
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
          <h4 className="text-xs font-extrabold text-brand-700 flex items-center gap-1.5">
            <ListPlus className="w-4 h-4" /> Adicionar Cliente na Fila de Espera
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome do Cliente *"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Telefone / WhatsApp *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
              className={inputClass}
            />
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Selecione o Serviço Desejado *</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Adicionar à Lista de Espera
          </button>
        </form>

        {/* Existing waitlist */}
        <div>
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
            Clientes Aguardando Vaga ({waitlist.length})
          </h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {waitlist.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium text-center py-6">
                Nenhum cliente na fila de espera no momento.
              </p>
            ) : (
              waitlist.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <div>
                    <h5 className="font-black text-slate-900">{entry.clientName}</h5>
                    <p className="text-slate-500 font-medium mt-0.5">
                      {entry.serviceName} • Data: {entry.preferredDate}
                    </p>
                    <p className="text-slate-400 font-mono text-[11px] mt-0.5">{entry.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onConvertToAppointment(entry);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg text-xs font-bold hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all"
                    >
                      Converter em Agendamento
                    </button>
                    <button
                      onClick={() => onDeleteWaitlist(entry.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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
