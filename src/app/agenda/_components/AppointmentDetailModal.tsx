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
  MessageCircle,
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
        <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block mb-1">Status Atual</span>
            <Badge status={appointment.status} />
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-bold block">Valor do Serviço</span>
            <span className="text-base font-black text-emerald-600 font-mono">
              R$ {appointment.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs shadow-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-600" /> Cliente:
            </span>
            <strong className="text-slate-900 text-sm">{client?.name || 'Desconhecido'}</strong>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-brand-600" /> Serviço:
            </span>
            <span className="text-slate-800 font-bold">{service?.name || 'Serviço'}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-600" /> Profissional:
            </span>
            <span className="text-slate-800 font-bold">{staff?.name || 'Profissional'}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-600" /> Data:
            </span>
            <span className="text-slate-800 font-mono font-bold">{appointment.date}</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-600" /> Horário:
            </span>
            <span className="text-slate-900 font-mono font-black">
              {formatTime(appointment.startTime)} às {formatTime(appointment.endTime)}
            </span>
          </div>

          {appointment.notes && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-500 font-bold block mb-1">Observações Internas:</span>
              <p className="text-slate-700 italic bg-slate-50 p-2 rounded-xl border border-slate-200">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Quick Action Controls */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Alterar Status Rápido
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onUpdateStatus(appointment.id, 'SCHEDULED')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                appointment.status === 'SCHEDULED'
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Agendado
            </button>

            <button
              onClick={() => onUpdateStatus(appointment.id, 'CONFIRMED')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                appointment.status === 'CONFIRMED'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Confirmado
            </button>

            <button
              onClick={() => onUpdateStatus(appointment.id, 'COMPLETED')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                appointment.status === 'COMPLETED'
                  ? 'bg-blue-100 border-blue-300 text-blue-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Concluído
            </button>

            <button
              onClick={() => onUpdateStatus(appointment.id, 'CANCELLED')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                appointment.status === 'CANCELLED'
                  ? 'bg-rose-100 border-rose-300 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancelado
            </button>
          </div>
        </div>

        {/* WhatsApp & Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
          {client?.phone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
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
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-brand-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Reagendar</span>
            </button>

            <button
              onClick={() => {
                onDelete(appointment.id);
                onClose();
              }}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 border border-rose-200 transition-colors"
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
