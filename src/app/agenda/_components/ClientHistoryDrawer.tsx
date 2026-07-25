import React from 'react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Client, Appointment, Service, Staff } from '@/lib/types';
import { getClientAgendaStats, formatTime } from '@/lib/agenda-utils';
import {
  Phone,
  Mail,
  Crown,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

interface ClientHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  appointments: Appointment[];
  services: Service[];
  staffList: Staff[];
  companyName: string;
}

export const ClientHistoryDrawer: React.FC<ClientHistoryDrawerProps> = ({
  isOpen,
  onClose,
  client,
  appointments,
  services,
  staffList,
  companyName,
}) => {
  if (!client) return null;

  const stats = getClientAgendaStats(client.id, appointments);

  const whatsappUrl = generateWhatsAppLink({
    phone: client.phone,
    clientName: client.name,
    companyName: companyName || 'AgendaMax',
    serviceName: 'Atendimento',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    staffName: 'Equipe',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Perfil & Histórico do Cliente" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Header Profile Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md">
              {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">{client.name}</h3>
                {stats.isVip && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-600" /> VIP
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {client.phone}
                </span>
                {client.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {client.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Client KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <p className="text-[11px] font-bold text-slate-500">Total de Visitas</p>
            <h4 className="text-lg font-black text-slate-900 mt-1">{stats.totalVisits}</h4>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <p className="text-[11px] font-bold text-slate-500">Valor Acumulado</p>
            <h4 className="text-lg font-black text-emerald-600 mt-1">
              R$ {stats.totalSpent.toFixed(2)}
            </h4>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <p className="text-[11px] font-bold text-slate-500">Última Visita</p>
            <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">
              {stats.lastVisitDate}
            </h4>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <p className="text-[11px] font-bold text-slate-500">Próxima Visita</p>
            <h4 className="text-xs font-bold text-brand-600 mt-1 truncate">
              {stats.nextVisitDate}
            </h4>
          </div>
        </div>

        {/* Internal Notes */}
        {client.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <span className="font-bold flex items-center gap-1 mb-1">
              <FileText className="w-3.5 h-3.5 text-amber-600" /> Notas Internas do Cliente:
            </span>
            <p>{client.notes}</p>
          </div>
        )}

        {/* History Timeline List */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Histórico Completo de Agendamentos ({stats.history.length})
          </h4>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {stats.history.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium text-center py-6">
                Nenhum histórico registrado para este cliente.
              </p>
            ) : (
              stats.history.map((apt) => {
                const service = services.find((s) => s.id === apt.serviceId);
                const staff = staffList.find((s) => s.id === apt.staffId);

                return (
                  <div
                    key={apt.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {apt.date} às {formatTime(apt.startTime)}
                        </span>
                        <Badge status={apt.status} />
                      </div>
                      <p className="text-slate-500 font-medium mt-1">
                        {service?.name || 'Serviço'} • Prof: {staff?.name || 'Profissional'}
                      </p>
                    </div>

                    <div className="text-right font-mono font-bold text-emerald-600">
                      R$ {apt.price.toFixed(2)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
