import React from 'react';
import { Appointment, Client, Staff, Service } from '@/lib/types';
import { formatTime } from '@/lib/agenda-utils';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import Badge from '@/components/ui/Badge';
import {
  Clock,
  User,
  Scissors,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  Copy,
  Calendar,
  UserCheck,
} from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  client?: Client;
  staff?: Staff;
  service?: Service;
  companyName: string;
  onSelect: (apt: Appointment) => void;
  onConfirmPresence: (aptId: string) => void;
  onComplete: (aptId: string) => void;
  onCancel: (aptId: string) => void;
  onDuplicate: (apt: Appointment) => void;
  onQuickReschedule: (apt: Appointment) => void;
  onOpenClientHistory: (clientId: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  client,
  staff,
  service,
  companyName,
  onSelect,
  onConfirmPresence,
  onComplete,
  onCancel,
  onDuplicate,
  onQuickReschedule,
  onOpenClientHistory,
}) => {
  const whatsappUrl = React.useMemo(() => {
    if (!client?.phone) return '#';
    return generateWhatsAppLink({
      phone: client.phone,
      clientName: client.name,
      companyName: companyName || 'AgendaMax',
      serviceName: service?.name || 'Serviço',
      date: appointment.date,
      startTime: appointment.startTime,
      staffName: staff?.name || 'Profissional',
    });
  }, [client, service, staff, appointment, companyName]);

  return (
    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/80 shadow-xs transition-all hover:border-brand-300 hover:shadow-md group">
      <div className="flex items-start justify-between gap-2">
        {/* Time and Status */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </span>
          <Badge status={appointment.status} />
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-emerald-600 font-mono">
            R$ {appointment.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Info Body */}
      <div className="mt-3 space-y-1.5">
        {/* Client Name (Click to open Drawer) */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => client && onOpenClientHistory(client.id)}
            className="flex items-center gap-1.5 text-sm font-black text-slate-900 hover:text-brand-600 transition-colors text-left truncate"
            title="Clique para ver histórico do cliente"
          >
            <User className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="truncate">{client?.name || 'Cliente Desconhecido'}</span>
          </button>

          {/* WhatsApp Button */}
          {client?.phone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200 bg-emerald-50/50"
              title="Enviar mensagem / Lembrete no WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Service & Staff */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <Scissors className="w-3 h-3 text-slate-400" />
            {service?.name || 'Serviço'}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-500">
            Prof: <strong className="text-slate-800">{staff?.name || 'Profissional'}</strong>
          </span>
        </div>

        {appointment.notes && (
          <p className="text-[11px] text-slate-600 italic line-clamp-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            {`"${appointment.notes}"`}
          </p>
        )}
      </div>

      {/* Action Footer Buttons */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
        <div className="flex items-center gap-1">
          {appointment.status === 'SCHEDULED' && (
            <button
              onClick={() => onConfirmPresence(appointment.id)}
              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 font-bold flex items-center gap-1 transition-colors"
              title="Confirmar presença do cliente"
            >
              <UserCheck className="w-3 h-3" />
              <span>Confirmar</span>
            </button>
          )}

          {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
            <button
              onClick={() => onComplete(appointment.id)}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 font-bold flex items-center gap-1 transition-colors"
              title="Concluir e gerar caixa"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Concluir</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onQuickReschedule(appointment)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reagendar"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDuplicate(appointment)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Duplicar agendamento"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelect(appointment)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Editar / Detalhes"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {appointment.status !== 'CANCELLED' && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              title="Cancelar agendamento"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
