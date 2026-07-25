import React from 'react';
import Modal from '@/components/ui/Modal';
import { Client, Staff, Service, Appointment } from '@/lib/types';
import { Clock, Calendar, User, Scissors, FileText } from 'lucide-react';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  staffList: Staff[];
  services: Service[];
  selectedDateStr: string;
  defaultTime?: string;
  defaultStaffId?: string;
  duplicateApt?: Appointment | null;
  onSave: (data: {
    clientId: string;
    staffId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    notes?: string;
  }) => { success: boolean; error?: string };
}

export const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  clients,
  staffList,
  services,
  selectedDateStr,
  defaultTime = '09:00',
  defaultStaffId = '',
  duplicateApt = null,
  onSave,
}) => {
  const [clientId, setClientId] = React.useState('');
  const [staffId, setStaffId] = React.useState('');
  const [serviceId, setServiceId] = React.useState('');
  const [date, setDate] = React.useState(selectedDateStr);
  const [startTime, setStartTime] = React.useState(defaultTime);
  const [notes, setNotes] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (duplicateApt) {
        setClientId(duplicateApt.clientId);
        setStaffId(duplicateApt.staffId);
        setServiceId(duplicateApt.serviceId);
        setDate(selectedDateStr);
        setStartTime(duplicateApt.startTime);
        setNotes(duplicateApt.notes || 'Agendamento Duplicado');
      } else {
        setClientId(clients[0]?.id || '');
        setStaffId(defaultStaffId || staffList[0]?.id || '');
        setServiceId(services[0]?.id || '');
        setDate(selectedDateStr);
        setStartTime(defaultTime);
        setNotes('');
      }
      setErrorMessage('');
    }
  }, [isOpen, duplicateApt, selectedDateStr, defaultTime, defaultStaffId, clients, staffList, services]);

  const selectedService = services.find((s) => s.id === serviceId);
  const servicePrice = selectedService ? selectedService.price : 0;

  const calculatedEndTime = React.useMemo(() => {
    const duration = selectedService ? selectedService.durationMin : 30;
    const [h, m] = startTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return '09:30';
    const endMinTotal = h * 60 + m + duration;
    const endH = Math.floor(endMinTotal / 60) % 24;
    const endM = endMinTotal % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [startTime, selectedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !staffId || !serviceId || !date || !startTime) {
      setErrorMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    const result = onSave({
      clientId,
      staffId,
      serviceId,
      date,
      startTime,
      endTime: calculatedEndTime,
      price: servicePrice,
      notes,
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Erro ao realizar agendamento.');
    } else {
      onClose();
    }
  };

  const inputClass = 'w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl p-2.5 text-xs font-medium text-slate-900 outline-none transition-all';
  const labelClass = 'text-xs font-bold text-slate-600 mb-1 flex items-center gap-1';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={duplicateApt ? 'Duplicar Agendamento' : 'Novo Agendamento'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

        <div>
          <label className={labelClass}>
            <User className="w-3.5 h-3.5 text-brand-600" /> Cliente *
          </label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className={inputClass}>
            <option value="">Selecione o Cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            <Scissors className="w-3.5 h-3.5 text-brand-600" /> Serviço *
          </label>
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} required className={inputClass}>
            <option value="">Selecione o Serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.durationMin} min — R$ {s.price}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            <User className="w-3.5 h-3.5 text-brand-600" /> Profissional *
          </label>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} required className={inputClass}>
            <option value="">Selecione o Profissional</option>
            {staffList.map((st) => (
              <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              <Calendar className="w-3.5 h-3.5 text-brand-600" /> Data *
            </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>
              <Clock className="w-3.5 h-3.5 text-brand-600" /> Início *
            </label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className={inputClass} />
          </div>
        </div>

        {/* Auto calculation banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700">
          <div>
            Término Estimado: <strong className="text-brand-600 font-mono ml-1">{calculatedEndTime}</strong>
          </div>
          <div>
            Valor Total: <strong className="text-emerald-600 font-mono ml-1">R$ {servicePrice.toFixed(2)}</strong>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            <FileText className="w-3.5 h-3.5 text-brand-600" /> Observações Internas
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Alergias, preferências do cliente..."
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all">
            Salvar Agendamento
          </button>
        </div>
      </form>
    </Modal>
  );
};
