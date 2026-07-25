import React from 'react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Appointment, Client, Staff, Service, AppointmentStatus } from '@/lib/types';
import { formatTime } from '@/lib/agenda-utils';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import {
  User,
  Clock,
  Calendar,
  Scissors,
  DollarSign,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit3,
} from 'lucide-react';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  client?: Client;
  staff?: Staff;
  service?: Service;
  companyName: string;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
  onOpenReschedule: (apt: Appointment) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  appointment,
  client,
  staff,
  service,
  companyName,
  onUpdateStatus,
  onDelete,
  onOpenReschedule,
}) => {
  if (!appointment) return null;

  const whatsappUrl = generateWhatsAppLink({
    phone: client?.phone || '',
    clientName: client?.name || 'Cliente',
    companyName: companyName || 'AgendaMax',
    serviceName: service?.name || 'Serviço',
    date: appointment.date,
    startTime: appointment.startTime,
    staffName: staff?.name || 'Profissional',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Agendamento" maxWidth="max-w-lg">
      <div className="space-y-5">
        {/* Status Badge & Header */}
        <div className="flex items-center justify-between bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Status Atual</span>
            <Badge status={appointment.status} />
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Valor do Serviço</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              R$ {appointment.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" /> Cliente:
            </span>
            <strong className="text-white text-sm">{client?.name || 'Desconhecido'}</strong>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-indigo-400" /> Serviço:
            </span>
            <span className="text-slate-200 font-medium">{service?.name || 'Serviço'}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" /> Profissional:
            </span>
            <span className="text-slate-200 font-medium">{staff?.name || 'Profissional'}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" /> Data:
            </span>
            <span className="text-slate-200 font-mono">{appointment.date}</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> Horário:
            </span>
            <span className="text-slate-200 font-mono font-bold">
              {formatTime(appointment.startTime)} às {formatTime(appointment.endTime)}
            </span>
          </div>

          {appointment.notes && (
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-slate-400 block mb-1">Observações Internas:</span>
              <p className="text-slate-300 italic bg-slate-900 p-2 rounded-xl">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Quick Action Controls */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Alterar Status Rápido
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onUpdateStatus(appointment.id, 'SCHEDULED')}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                appointment.status === 'SCHEDULED'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Agendado
            </button>

            <button
              onClick={() => onUpdateStatus(appointment.id, 'CONFIRMED')}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                appointment.status === 'CONFIRMED'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Confirmado
            </button>

            <button
              onClick={() => onUpdateStatus(appointment.id, 'COMPLETED')}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                appointment.status === 'COMPLETED'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Concluído
            </button>

            <button
              onClick={() => onUpdateStatus(appointment.id, 'CANCELLED')}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                appointment.status === 'CANCELLED'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Cancelado
            </button>
          </div>
        </div>

        {/* WhatsApp & Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
          {client?.phone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenReschedule(appointment);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Reagendar</span>
            </button>

            <button
              onClick={() => {
                onDelete(appointment.id);
                onClose();
              }}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1 border border-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
