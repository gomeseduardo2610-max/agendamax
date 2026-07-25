'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import ToastManager from '@/components/ui/ToastManager';
import { useToast } from '@/lib/useToast';
import { useAgendaStore } from '@/lib/store';
import { Appointment } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Scissors,
  UserCheck,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Filter,
  MessageCircle,
  Ban,
  ListPlus,
  Check,
  AlertCircle,
  Users,
} from 'lucide-react';
import Link from 'next/link';

type CalendarView = 'DAY' | 'WEEK' | 'MONTH';

export default function AgendaPage() {
  const {
    company,
    appointments,
    clients,
    staff,
    services,
    blockedSlots,
    waitlist,
    addAppointment,
    cancelAppointment,
    completeAppointment,
    deleteAppointment,
    addBlockedSlot,
    deleteBlockedSlot,
    addWaitlistEntry,
    deleteWaitlistEntry,
  } = useAgendaStore();

  const { addToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState<CalendarView>('DAY');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('ALL');

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Modals for Blocked Slots & Waitlist
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState<boolean>(false);

  const [blockStaffId, setBlockStaffId] = useState('');
  const [blockDate, setBlockDate] = useState(selectedDateStr);
  const [blockStart, setBlockStart] = useState('12:00');
  const [blockEnd, setBlockEnd] = useState('13:00');
  const [blockReason, setBlockReason] = useState('Intervalo de Almoço');

  const [wtClientName, setWtClientName] = useState('');
  const [wtPhone, setWtPhone] = useState('');
  const [wtDate, setWtDate] = useState(selectedDateStr);
  const [wtService, setWtService] = useState('');

  const [formClientId, setFormClientId] = useState('');
  const [formStaffId, setFormStaffId] = useState('');
  const [formServiceId, setFormServiceId] = useState('');
  const [formDate, setFormDate] = useState(selectedDateStr);
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formNotes, setFormNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch real data on mount if available via API
  useEffect(() => {
    async function syncRealData() {
      try {
        const [aptsRes, cliRes, stfRes, srvRes] = await Promise.all([
          fetch('/api/agendamentos').catch(() => null),
          fetch('/api/clientes').catch(() => null),
          fetch('/api/funcionarios').catch(() => null),
          fetch('/api/servicos').catch(() => null),
        ]);

        if (aptsRes && aptsRes.ok) {
          const apts = await aptsRes.json();
          if (Array.isArray(apts)) useAgendaStore.setState({ appointments: apts });
        }
        if (cliRes && cliRes.ok) {
          const clis = await cliRes.json();
          if (Array.isArray(clis)) useAgendaStore.setState({ clients: clis });
        }
        if (stfRes && stfRes.ok) {
          const stfs = await stfRes.json();
          if (Array.isArray(stfs)) useAgendaStore.setState({ staff: stfs });
        }
        if (srvRes && srvRes.ok) {
          const srvs = await srvRes.json();
          if (Array.isArray(srvs)) useAgendaStore.setState({ services: srvs });
        }
      } catch (e) {
        console.error('Failed to sync agenda real data:', e);
      }
    }
    syncRealData();
  }, []);

  // Helper for week view
  const weekDays = React.useMemo(() => {
    const curr = new Date(selectedDateStr + 'T00:00:00');
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, [selectedDateStr]);

  // Helper for month view grid
  const monthDays = React.useMemo(() => {
    const curr = new Date(selectedDateStr + 'T00:00:00');
    const year = curr.getFullYear();
    const month = curr.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startDayOfWeek = firstDay.getDay();

    for (let i = startDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({ date: prevDate.toISOString().split('T')[0], isCurrentMonth: false, dayNum: prevDate.getDate() });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateObj = new Date(year, month, d);
      days.push({ date: dateObj.toISOString().split('T')[0], isCurrentMonth: true, dayNum: d });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({ date: nextDate.toISOString().split('T')[0], isCurrentMonth: false, dayNum: nextDate.getDate() });
      }
    }
    return days;
  }, [selectedDateStr]);

  const handlePrevDate = () => {
    const d = new Date(selectedDateStr + 'T00:00:00');
    if (view === 'DAY') d.setDate(d.getDate() - 1);
    else if (view === 'WEEK') d.setDate(d.getDate() - 7);
    else if (view === 'MONTH') d.setMonth(d.getMonth() - 1);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const handleNextDate = () => {
    const d = new Date(selectedDateStr + 'T00:00:00');
    if (view === 'DAY') d.setDate(d.getDate() + 1);
    else if (view === 'WEEK') d.setDate(d.getDate() + 7);
    else if (view === 'MONTH') d.setMonth(d.getMonth() + 1);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDateStr(new Date().toISOString().split('T')[0]);
  };

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    return `${hour < 10 ? '0' + hour : hour}:00`;
  });

  const getEndTime = (startTime: string, serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    const duration = service ? service.durationMin : 30;
    const [h, m] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + duration, 0);
    const endH = date.getHours().toString().padStart(2, '0');
    const endM = date.getMinutes().toString().padStart(2, '0');
    return `${endH}:${endM}`;
  };

  const handleOpenCreateModal = (slotTime?: string, staffId?: string) => {
    setFormClientId(clients[0]?.id || '');
    setFormStaffId(staffId || staff[0]?.id || '');
    setFormServiceId(services[0]?.id || '');
    setFormDate(selectedDateStr);
    setFormStartTime(slotTime || '09:00');
    setFormNotes('');
    setErrorMessage('');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formClientId) {
      setErrorMessage('Por favor, selecione um cliente.');
      return;
    }
    if (!formStaffId) {
      setErrorMessage('Por favor, selecione um funcionário.');
      return;
    }
    if (!formServiceId) {
      setErrorMessage('Por favor, selecione um serviço.');
      return;
    }

    const service = services.find((s) => s.id === formServiceId);
    const endTime = getEndTime(formStartTime, formServiceId);

    const result = addAppointment({
      clientId: formClientId,
      staffId: formStaffId,
      serviceId: formServiceId,
      date: formDate,
      startTime: formStartTime,
      endTime: endTime,
      status: 'CONFIRMED',
      price: service ? service.price : 0,
      notes: formNotes,
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Erro ao criar agendamento.');
      addToast({ type: 'error', title: 'Conflito de Horário', description: result.error });
    } else {
      setIsCreateModalOpen(false);
      addToast({
        type: 'success',
        title: 'Agendamento Criado!',
        description: `Horário ${formStartTime} reservado com sucesso.`,
      });
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedStaffFilter !== 'ALL' && apt.staffId !== selectedStaffFilter) return false;
    return true;
  });

  const handleBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (blockStaffId && blockStart && blockEnd) {
      addBlockedSlot({
        staffId: blockStaffId,
        date: blockDate,
        startTime: blockStart,
        endTime: blockEnd,
        reason: blockReason || 'Horário Indisponível',
      });
      setIsBlockModalOpen(false);
      addToast({ type: 'info', title: 'Horário Bloqueado!', description: `${blockStart} às ${blockEnd}` });
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wtClientName && wtPhone) {
      addWaitlistEntry({
        clientName: wtClientName,
        phone: wtPhone,
        preferredDate: wtDate,
        serviceName: wtService || 'Serviço Geral',
      });
      setIsWaitlistModalOpen(false);
      addToast({ type: 'success', title: 'Adicionado à Lista de Espera!', description: wtClientName });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <ToastManager />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenNewAppointment={() => handleOpenCreateModal()}
          onToggleMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Top Control Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleToday}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl transition-colors"
              >
                Hoje
              </button>

              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                <button onClick={handlePrevDate} className="p-1.5 text-slate-600 hover:text-slate-900">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={handleNextDate} className="p-1.5 text-slate-600 hover:text-slate-900">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-600" />
                <span>
                  {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  setBlockStaffId(staff[0]?.id || '');
                  setBlockDate(selectedDateStr);
                  setIsBlockModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-colors"
              >
                <Ban className="w-3.5 h-3.5 text-amber-600" />
                <span>Bloquear Horário</span>
              </button>

              <button
                onClick={() => {
                  setWtClientName('');
                  setWtPhone('');
                  setWtDate(selectedDateStr);
                  setIsWaitlistModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold rounded-xl transition-colors relative"
              >
                <ListPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Lista de Espera</span>
                {waitlist.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold ml-0.5">
                    {waitlist.length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedStaffFilter}
                  onChange={(e) => setSelectedStaffFilter(e.target.value)}
                  className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-white">Todos Funcionários</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white">{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setView('DAY')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    view === 'DAY' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Dia
                </button>
                <button
                  onClick={() => setView('WEEK')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    view === 'WEEK' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setView('MONTH')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    view === 'MONTH' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Mês
                </button>
              </div>
            </div>
          </div>

          {/* DAY VIEW */}
          {view === 'DAY' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {staff.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-extrabold text-slate-800">Nenhum funcionário cadastrado</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Para visualizar e organizar a agenda do dia, você precisa cadastrar os profissionais da sua equipe.
                  </p>
                  <Link
                    href="/funcionarios"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Funcionário</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {(selectedStaffFilter === 'ALL'
                    ? staff
                    : staff.filter((s) => s.id === selectedStaffFilter)
                  ).map((stf) => {
                    const stfApts = filteredAppointments.filter(
                      (a) => a.staffId === stf.id && a.date === selectedDateStr
                    );

                    return (
                      <div key={stf.id} className="p-4 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                          {stf.avatar ? (
                            <img
                              src={stf.avatar}
                              alt={stf.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-black text-sm">
                              {stf.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900">{stf.name}</h4>
                            <p className="text-[10px] text-brand-600 font-bold">{stf.role}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {timeSlots.map((time) => {
                            const matchedApt = stfApts.find((a) => a.startTime === time);
                            const matchedBlock = blockedSlots.find(
                              (b) => b.staffId === stf.id && b.date === selectedDateStr && b.startTime === time
                            );

                            if (matchedBlock) {
                              return (
                                <div
                                  key={time}
                                  className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-between shadow-2xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <Ban className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <div>
                                      <span className="text-xs font-bold text-slate-800 block">
                                        {matchedBlock.startTime} - {matchedBlock.endTime}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-medium">{matchedBlock.reason}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteBlockedSlot(matchedBlock.id);
                                      addToast({ type: 'info', title: 'Horário Desbloqueado' });
                                    }}
                                    className="text-[10px] text-red-600 font-bold hover:underline"
                                  >
                                    Desbloquear
                                  </button>
                                </div>
                              );
                            }

                            if (matchedApt) {
                              const client = clients.find((c) => c.id === matchedApt.clientId);
                              const service = services.find((s) => s.id === matchedApt.serviceId);

                              const waUrl = client?.phone
                                ? generateWhatsAppLink({
                                    phone: client.phone,
                                    clientName: client.name,
                                    serviceName: service?.name || 'Atendimento',
                                    date: matchedApt.date,
                                    startTime: matchedApt.startTime,
                                    staffName: stf.name,
                                    companyName: company.name,
                                  })
                                : null;

                              return (
                                <div
                                  key={time}
                                  onClick={() => {
                                    setSelectedAppointment(matchedApt);
                                    setIsDetailModalOpen(true);
                                  }}
                                  className="p-3 rounded-xl bg-brand-50/60 border border-brand-200 hover:border-brand-400 cursor-pointer shadow-xs transition-all group"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-extrabold text-brand-700">
                                      {matchedApt.startTime} - {matchedApt.endTime}
                                    </span>
                                    <Badge status={matchedApt.status} />
                                  </div>
                                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-brand-600">
                                    {client?.name || 'Cliente'}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    {service?.name || 'Serviço'} • R$ {matchedApt.price.toFixed(2)}
                                  </p>

                                  {/* Quick Action Buttons on Card */}
                                  <div className="mt-2.5 pt-2 border-t border-brand-200/60 flex items-center justify-between">
                                    {waUrl && (
                                      <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-colors"
                                      >
                                        <MessageCircle className="w-3 h-3" />
                                        <span>WhatsApp</span>
                                      </a>
                                    )}

                                    {matchedApt.status !== 'COMPLETED' && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          completeAppointment(matchedApt.id);
                                          addToast({ type: 'success', title: 'Concluído!', description: 'Receita registrada no caixa.' });
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors ml-auto"
                                      >
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span>Concluir</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <button
                                key={time}
                                onClick={() => handleOpenCreateModal(time, stf.id)}
                                className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-xs text-slate-500 font-semibold flex items-center justify-between group transition-all"
                              >
                                <span>{time}</span>
                                <span className="text-[10px] text-slate-400 group-hover:text-brand-600 font-bold">
                                  + Agendar
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* WEEK VIEW */}
          {view === 'WEEK' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <div className="min-w-[800px] grid grid-cols-7 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50/80 text-center font-bold text-xs text-slate-700">
                {weekDays.map((dateStr) => {
                  const dObj = new Date(dateStr + 'T00:00:00');
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  return (
                    <div
                      key={dateStr}
                      onClick={() => {
                        setSelectedDateStr(dateStr);
                        setView('DAY');
                      }}
                      className={`p-3 cursor-pointer hover:bg-brand-50/50 transition-colors ${
                        isToday ? 'bg-brand-50 text-brand-700 font-extrabold' : ''
                      }`}
                    >
                      <span className="block text-[10px] text-slate-400 uppercase">
                        {dObj.toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </span>
                      <span className="text-sm">{dObj.getDate()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="min-w-[800px] grid grid-cols-7 divide-x divide-slate-200 p-2 min-h-[450px]">
                {weekDays.map((dateStr) => {
                  const dayApts = filteredAppointments.filter((a) => a.date === dateStr);
                  return (
                    <div key={dateStr} className="p-2 space-y-2">
                      {dayApts.length === 0 ? (
                        <button
                          onClick={() => {
                            setSelectedDateStr(dateStr);
                            handleOpenCreateModal('09:00');
                          }}
                          className="w-full py-8 text-center border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-brand-600 transition-all"
                        >
                          + Agendar
                        </button>
                      ) : (
                        dayApts.map((apt) => {
                          const client = clients.find((c) => c.id === apt.clientId);
                          const srv = services.find((s) => s.id === apt.serviceId);
                          const stf = staff.find((s) => s.id === apt.staffId);
                          return (
                            <div
                              key={apt.id}
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-2.5 rounded-xl bg-brand-50 border border-brand-200 hover:border-brand-400 cursor-pointer shadow-xs transition-all text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-brand-700 text-[11px]">{apt.startTime}</span>
                                <Badge status={apt.status} />
                              </div>
                              <h5 className="font-bold text-slate-900 truncate mt-1">{client?.name || 'Cliente'}</h5>
                              <p className="text-[10px] text-slate-500 truncate">{srv?.name} • {stf?.name}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MONTH VIEW */}
          {view === 'MONTH' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-7 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50 text-center font-bold text-xs text-slate-600 py-2.5">
                <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
              </div>

              <div className="grid grid-cols-7 divide-x divide-y divide-slate-200">
                {monthDays.map((item, idx) => {
                  const dayApts = filteredAppointments.filter((a) => a.date === item.date);
                  const isToday = item.date === new Date().toISOString().split('T')[0];

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDateStr(item.date);
                        setView('DAY');
                      }}
                      className={`min-h-[90px] p-2 transition-colors cursor-pointer hover:bg-slate-50 ${
                        !item.isCurrentMonth ? 'bg-slate-50/40 text-slate-300' : 'text-slate-800'
                      } ${isToday ? 'bg-brand-50/60 font-bold' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${isToday ? 'px-1.5 py-0.5 rounded-full bg-brand-600 text-white font-extrabold' : ''}`}>
                          {item.dayNum}
                        </span>
                        {dayApts.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-brand-100 text-brand-700 border border-brand-200">
                            {dayApts.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        {dayApts.slice(0, 2).map((apt) => {
                          const cli = clients.find((c) => c.id === apt.clientId);
                          return (
                            <div
                              key={apt.id}
                              className="px-1.5 py-0.5 rounded bg-brand-50 border border-brand-200 text-[10px] font-semibold text-brand-800 truncate"
                            >
                              {apt.startTime} {cli?.name || 'Cliente'}
                            </div>
                          );
                        })}
                        {dayApts.length > 2 && (
                          <span className="text-[9px] font-bold text-slate-400 block pl-1">
                            +{dayApts.length - 2} mais
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DETAIL MODAL */}
      {selectedAppointment && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Detalhes do Agendamento"
        >
          {(() => {
            const client = clients.find((c) => c.id === selectedAppointment.clientId);
            const stf = staff.find((s) => s.id === selectedAppointment.staffId);
            const srv = services.find((s) => s.id === selectedAppointment.serviceId);

            return (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Status</span>
                    <div className="mt-1"><Badge status={selectedAppointment.status} /></div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-semibold block">Valor</span>
                    <span className="text-lg font-black text-emerald-600">R$ {selectedAppointment.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-medium text-slate-700">
                  <p><strong className="text-slate-900">Cliente:</strong> {client?.name || 'Não informado'}</p>
                  <p><strong className="text-slate-900">Serviço:</strong> {srv?.name || 'Não informado'}</p>
                  <p><strong className="text-slate-900">Profissional:</strong> {stf?.name || 'Não informado'}</p>
                  <p><strong className="text-slate-900">Horário:</strong> {selectedAppointment.date} às {selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
                  {selectedAppointment.notes && (
                    <p><strong className="text-slate-900">Observações:</strong> {selectedAppointment.notes}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    {selectedAppointment.status !== 'COMPLETED' && (
                      <button
                        onClick={() => {
                          completeAppointment(selectedAppointment.id);
                          setIsDetailModalOpen(false);
                          addToast({ type: 'success', title: 'Concluído!', description: 'Receita lançada no caixa.' });
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Concluir
                      </button>
                    )}
                    {selectedAppointment.status !== 'CANCELLED' && (
                      <button
                        onClick={() => {
                          cancelAppointment(selectedAppointment.id);
                          setIsDetailModalOpen(false);
                          addToast({ type: 'info', title: 'Agendamento Cancelado' });
                        }}
                        className="px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      deleteAppointment(selectedAppointment.id);
                      setIsDetailModalOpen(false);
                      addToast({ type: 'info', title: 'Agendamento Removido' });
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                    title="Excluir agendamento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Agendamento"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Validation Warnings for Empty Entities */}
          {clients.length === 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
              <p className="font-bold text-amber-800">Você ainda não tem clientes cadastrados.</p>
              <Link href="/clientes" className="inline-block font-extrabold text-brand-600 hover:underline">
                + Ir para página de Clientes cadastrar
              </Link>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cliente</label>
              <select
                required
                value={formClientId}
                onChange={(e) => setFormClientId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="">Selecione um cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {staff.length === 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
              <p className="font-bold text-amber-800">Você ainda não tem funcionários cadastrados.</p>
              <Link href="/funcionarios" className="inline-block font-extrabold text-brand-600 hover:underline">
                + Ir para página de Funcionários cadastrar
              </Link>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Profissional</label>
              <select
                required
                value={formStaffId}
                onChange={(e) => setFormStaffId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="">Selecione um funcionário...</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
          )}

          {services.length === 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
              <p className="font-bold text-amber-800">Você ainda não tem serviços cadastrados.</p>
              <Link href="/servicos" className="inline-block font-extrabold text-brand-600 hover:underline">
                + Ir para página de Serviços cadastrar
              </Link>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Serviço</label>
              <select
                required
                value={formServiceId}
                onChange={(e) => setFormServiceId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="">Selecione um serviço...</option>
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>{srv.name} (R$ {srv.price.toFixed(2)})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Horário de Início</label>
              <input
                type="time"
                required
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Observações (Opcional)</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Detalhes ou preferências do cliente..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={clients.length === 0 || staff.length === 0 || services.length === 0}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </Modal>

      {/* BLOCK TIME MODAL */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title="Bloquear Horário de Atendimento"
      >
        <form onSubmit={handleBlockSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Profissional</label>
            <select
              required
              value={blockStaffId}
              onChange={(e) => setBlockStaffId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            >
              <option value="">Selecione...</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Motivo do Bloqueio</label>
            <input
              type="text"
              required
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Ex: Intervalo de Almoço / Reunião"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Início</label>
              <input
                type="time"
                required
                value={blockStart}
                onChange={(e) => setBlockStart(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fim</label>
              <input
                type="time"
                required
                value={blockEnd}
                onChange={(e) => setBlockEnd(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBlockModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Confirmar Bloqueio
            </button>
          </div>
        </form>
      </Modal>

      {/* WAITLIST MODAL */}
      <Modal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
        title="Lista de Espera por Encaixes"
      >
        <div className="space-y-4">
          <form onSubmit={handleWaitlistSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900">+ Adicionar Cliente à Lista de Espera</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={wtClientName}
                  onChange={(e) => setWtClientName(e.target.value)}
                  placeholder="Ex: Roberto Alves"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Telefone WhatsApp</label>
                <input
                  type="text"
                  required
                  value={wtPhone}
                  onChange={(e) => setWtPhone(e.target.value)}
                  placeholder="(11) 98888-8888"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Data Preferencial</label>
                <input
                  type="date"
                  required
                  value={wtDate}
                  onChange={(e) => setWtDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Serviço Pretendido</label>
                <input
                  type="text"
                  value={wtService}
                  onChange={(e) => setWtService(e.target.value)}
                  placeholder="Ex: Limpeza de Pele"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Cadastrar na Fila
              </button>
            </div>
          </form>

          {/* WAITLIST ENTRIES LIST */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <h4 className="text-xs font-extrabold text-slate-800">Clientes Fila de Espera ({waitlist.length})</h4>
            {waitlist.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Nenhum cliente na lista de espera.</p>
            ) : (
              waitlist.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900">{entry.clientName}</h5>
                    <p className="text-[11px] text-slate-500">{entry.serviceName} • {entry.phone}</p>
                    <span className="text-[10px] text-indigo-600 font-semibold">Data: {entry.preferredDate}</span>
                  </div>

                  <button
                    onClick={() => {
                      deleteWaitlistEntry(entry.id);
                      addToast({ type: 'info', title: 'Removido da Fila' });
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
