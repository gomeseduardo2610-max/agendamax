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
    <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:shadow-lg group">
      <div className="flex items-start justify-between gap-2">
        {/* Time and Status */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-mono font-bold text-slate-200 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </span>
          <Badge status={appointment.status} />
        </div>

        {/* Price & Actions */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-emerald-400 font-mono">
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
            className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-indigo-400 transition-colors text-left truncate"
            title="Clique para ver histórico do cliente"
          >
            <User className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate">{client?.name || 'Cliente Desconhecido'}</span>
          </button>

          {/* WhatsApp Button */}
          {client?.phone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/20"
              title="Enviar mensagem / Lembrete no WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Service & Staff */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <Scissors className="w-3 h-3 text-slate-400" />
            {service?.name || 'Serviço'}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            Prof: <strong className="text-slate-200">{staff?.name || 'Profissional'}</strong>
          </span>
        </div>

        {appointment.notes && (
          <p className="text-[11px] text-slate-400 italic line-clamp-1 bg-slate-950/40 p-1.5 rounded border border-slate-800/60">
            {`"${appointment.notes}"`}
          </p>
        )}
      </div>

      {/* Action Footer Buttons */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-1 text-xs">
        <div className="flex items-center gap-1">
          {appointment.status === 'SCHEDULED' && (
            <button
              onClick={() => onConfirmPresence(appointment.id)}
              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 font-medium flex items-center gap-1 transition-colors"
              title="Confirmar presença do cliente"
            >
              <UserCheck className="w-3 h-3" />
              <span>Confirmar</span>
            </button>
          )}

          {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
            <button
              onClick={() => onComplete(appointment.id)}
              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 font-medium flex items-center gap-1 transition-colors"
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
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reagendar"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDuplicate(appointment)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Duplicar agendamento"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelect(appointment)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Editar / Detalhes"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {appointment.status !== 'CANCELLED' && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="p-1.5 text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
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
