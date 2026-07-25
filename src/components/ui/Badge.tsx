import React from 'react';
import { AppointmentStatus } from '@/lib/types';

interface BadgeProps {
  status: AppointmentStatus;
}

export default function Badge({ status }: BadgeProps) {
  switch (status) {
    case 'CONFIRMED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Confirmado
        </span>
      );
    case 'SCHEDULED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Agendado
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-100 text-brand-800 border border-brand-300/80">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
          Concluído
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300/80">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          Cancelado
        </span>
      );
    default:
      return null;
  }
}
