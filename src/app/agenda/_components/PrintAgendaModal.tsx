import React from 'react';
import Modal from '@/components/ui/Modal';
import { Appointment, Client, Staff, Service } from '@/lib/types';
import { printAgendaWindow } from '@/lib/export-utils';
import { Printer } from 'lucide-react';

interface PrintAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  clients: Client[];
  staffList: Staff[];
  services: Service[];
  selectedDateStr: string;
}

export const PrintAgendaModal: React.FC<PrintAgendaModalProps> = ({
  isOpen,
  onClose,
  appointments,
  clients,
  staffList,
  services,
  selectedDateStr,
}) => {
  const handleTriggerPrint = () => {
    printAgendaWindow(appointments, clients, staffList, services, selectedDateStr);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Imprimir Agenda Diária" maxWidth="max-w-md">
      <div className="space-y-4">
        <p className="text-xs text-slate-300">
          Você está prestes a gerar a folha de impressão da agenda para a data{' '}
          <strong className="text-white font-mono">{selectedDateStr}</strong> ({appointments.length}{' '}
          agendamentos).
        </p>

        <div className="max-h-[250px] overflow-y-auto border border-slate-800 rounded-xl p-3 bg-slate-950 text-xs space-y-2">
          {appointments.map((apt) => {
            const client = clients.find((c) => c.id === apt.clientId);
            const service = services.find((s) => s.id === apt.serviceId);
            return (
              <div
                key={apt.id}
                className="flex items-center justify-between py-1 border-b border-slate-900"
              >
                <span className="font-mono text-indigo-400 font-bold">
                  {apt.startTime} - {apt.endTime}
                </span>
                <span className="text-white font-semibold">{client?.name || 'Cliente'}</span>
                <span className="text-slate-400">{service?.name || 'Serviço'}</span>
                <span className="text-emerald-400 font-mono">R$ {apt.price}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleTriggerPrint}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Folha</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
