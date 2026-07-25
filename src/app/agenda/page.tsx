'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ToastManager from '@/components/ui/ToastManager';
import { useToast } from '@/lib/useToast';
import { useAgendaStore } from '@/lib/store';
import { Appointment, WaitlistEntry } from '@/lib/types';
import {
  calculateAgendaStats,
  filterAppointments,
  AgendaFilterState,
} from '@/lib/agenda-utils';
import { exportAppointmentsToCSV } from '@/lib/export-utils';

import { AgendaHeader, CalendarView } from './_components/AgendaHeader';
import { AgendaStats } from './_components/AgendaStats';
import { AgendaFilters } from './_components/AgendaFilters';
import { AgendaDayView } from './_components/AgendaDayView';
import { AgendaWeekView } from './_components/AgendaWeekView';
import { AgendaMonthView } from './_components/AgendaMonthView';

import { CreateAppointmentModal } from './_components/CreateAppointmentModal';
import { AppointmentDetailModal } from './_components/AppointmentDetailModal';
import { QuickRescheduleModal } from './_components/QuickRescheduleModal';
import { ClientHistoryDrawer } from './_components/ClientHistoryDrawer';
import { BlockSlotModal } from './_components/BlockSlotModal';
import { WaitlistModal } from './_components/WaitlistModal';
import { ConfirmActionModal } from './_components/ConfirmActionModal';
import { PrintAgendaModal } from './_components/PrintAgendaModal';

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
    updateAppointment,
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
  const [isLoading, setIsLoading] = useState(true);

  // Calendar state
  const [view, setView] = useState<CalendarView>('DAY');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Filters state
  const [filters, setFilters] = useState<AgendaFilterState>({
    searchQuery: '',
    staffId: 'ALL',
    serviceId: 'ALL',
    status: 'ALL',
    clientId: 'ALL',
    minPrice: '',
    maxPrice: '',
  });

  // Modal visibility states
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Modal context variables
  const [defaultTimeForCreate, setDefaultTimeForCreate] = useState('09:00');
  const [defaultStaffIdForCreate, setDefaultStaffIdForCreate] = useState('');
  const [duplicateApt, setDuplicateApt] = useState<Appointment | null>(null);

  // Confirmation modal state
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
  });

  // Fetch real data on mount
  useEffect(() => {
    async function syncRealData() {
      try {
        setIsLoading(true);
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
        console.error('Erro ao sincronizar agenda com API real:', e);
      } finally {
        setIsLoading(false);
      }
    }
    syncRealData();
  }, []);

  // Keyboard Shortcuts (Ctrl+N, Ctrl+F, Ctrl+P, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setDuplicateApt(null);
        setIsCreateModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('agenda-search-input');
        if (searchInput) searchInput.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPrintModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsDetailModalOpen(false);
        setIsCreateModalOpen(false);
        setIsRescheduleModalOpen(false);
        setIsBlockModalOpen(false);
        setIsWaitlistModalOpen(false);
        setIsPrintModalOpen(false);
        setSelectedClientId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Appointments
  const filteredAppointmentsList = useMemo(() => {
    return filterAppointments(appointments, clients, staff, services, filters);
  }, [appointments, clients, staff, services, filters]);

  // Agenda Stats Dashboard Calculation
  const agendaStats = useMemo(() => {
    return calculateAgendaStats(appointments, selectedDateStr);
  }, [appointments, selectedDateStr]);

  // Date controls
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

  // Appointment Actions
  const handleCreateAppointment = (data: {
    clientId: string;
    staffId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    notes?: string;
  }) => {
    const res = addAppointment({ ...data, status: 'SCHEDULED' });
    if (res.success) {
      addToast({ title: 'Agendamento criado com sucesso!', type: 'success' });
      // Sync DB async
      fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.error(e));
    }
    return res;
  };

  const handleConfirmPresence = (id: string) => {
    updateAppointment(id, { status: 'CONFIRMED' });
    addToast({ title: 'Presença do cliente confirmada!', type: 'success' });
    fetch(`/api/agendamentos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CONFIRMED' }),
    }).catch((e) => console.error(e));
  };

  const handleComplete = (id: string) => {
    completeAppointment(id);
    addToast({ title: 'Agendamento concluído e receita lançada!', type: 'success' });
    fetch(`/api/agendamentos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    }).catch((e) => console.error(e));
  };

  const handleCancelRequest = (id: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Cancelar Agendamento',
      description: 'Tem certeza que deseja cancelar este agendamento?',
      action: () => {
        cancelAppointment(id);
        addToast({ title: 'Agendamento cancelado.', type: 'info' });
        fetch(`/api/agendamentos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CANCELLED' }),
        }).catch((e) => console.error(e));
      },
    });
  };

  const handleDeleteRequest = (id: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Excluir Agendamento',
      description: 'Esta ação removerá permanentemente o agendamento da base de dados.',
      action: () => {
        deleteAppointment(id);
        addToast({ title: 'Agendamento excluído com sucesso.', type: 'info' });
        fetch(`/api/agendamentos/${id}`, { method: 'DELETE' }).catch((e) =>
          console.error(e)
        );
      },
    });
  };

  const handleQuickRescheduleSave = (
    id: string,
    data: { date: string; startTime: string; staffId: string }
  ) => {
    const res = updateAppointment(id, data);
    if (res.success) {
      addToast({ title: 'Agendamento reagendado com sucesso!', type: 'success' });
      fetch(`/api/agendamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.error(e));
    }
    return res;
  };

  const handleDuplicate = (apt: Appointment) => {
    setDuplicateApt(apt);
    setIsCreateModalOpen(true);
  };

  const handleOpenCreateWithSlot = (time: string, staffIdParam?: string) => {
    setDefaultTimeForCreate(time);
    if (staffIdParam) setDefaultStaffIdForCreate(staffIdParam);
    setDuplicateApt(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenCreateWithDate = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setDuplicateApt(null);
    setIsCreateModalOpen(true);
  };

  const handleConvertToAppointmentFromWaitlist = (entry: WaitlistEntry) => {
    setSelectedDateStr(entry.preferredDate);
    setDuplicateApt(null);
    setIsCreateModalOpen(true);
  };

  const activeClientObject = useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [selectedClientId, clients]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <ToastManager />

      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          onOpenNewAppointment={() => {
            setDuplicateApt(null);
            setIsCreateModalOpen(true);
          }}
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
        />

        <main className="p-4 lg:p-8 space-y-6 max-w-[1700px] w-full mx-auto">
          {/* Skeleton Loading State */}
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-20 bg-slate-900/60 rounded-2xl border border-slate-800" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 bg-slate-900/60 rounded-xl border border-slate-800" />
                ))}
              </div>
              <div className="h-96 bg-slate-900/60 rounded-2xl border border-slate-800" />
            </div>
          ) : (
            <>
              {/* Agenda Header Controls */}
              <AgendaHeader
                view={view}
                setView={setView}
                selectedDateStr={selectedDateStr}
                onPrevDate={handlePrevDate}
                onNextDate={handleNextDate}
                onToday={handleToday}
                onOpenCreateModal={() => {
                  setDuplicateApt(null);
                  setIsCreateModalOpen(true);
                }}
                onOpenBlockModal={() => setIsBlockModalOpen(true)}
                onOpenWaitlistModal={() => setIsWaitlistModalOpen(true)}
                onExportCSV={() =>
                  exportAppointmentsToCSV(
                    filteredAppointmentsList,
                    clients,
                    staff,
                    services,
                    selectedDateStr
                  )
                }
                onPrint={() => setIsPrintModalOpen(true)}
                waitlistCount={waitlist.length}
              />

              {/* Agenda Dashboard KPI Stats */}
              <AgendaStats stats={agendaStats} />

              {/* Search & Multi-criteria Filters */}
              <AgendaFilters
                filters={filters}
                setFilters={setFilters}
                staffList={staff}
                services={services}
                clients={clients}
              />

              {/* Calendar Grid Views */}
              {view === 'DAY' && (
                <AgendaDayView
                  selectedDateStr={selectedDateStr}
                  appointments={filteredAppointmentsList}
                  clients={clients}
                  staffList={staff}
                  services={services}
                  blockedSlots={blockedSlots}
                  companyName={company.name}
                  selectedStaffFilter={filters.staffId}
                  onSelectAppointment={(apt) => {
                    setSelectedAppointment(apt);
                    setIsDetailModalOpen(true);
                  }}
                  onConfirmPresence={handleConfirmPresence}
                  onCompleteAppointment={handleComplete}
                  onCancelAppointment={handleCancelRequest}
                  onDuplicateAppointment={handleDuplicate}
                  onQuickReschedule={(apt) => {
                    setSelectedAppointment(apt);
                    setIsRescheduleModalOpen(true);
                  }}
                  onOpenClientHistory={(cid) => setSelectedClientId(cid)}
                  onOpenCreateWithTime={handleOpenCreateWithSlot}
                  onDeleteBlockedSlot={(id) => {
                    deleteBlockedSlot(id);
                    addToast({ title: 'Horário desbloqueado.', type: 'info' });
                  }}
                />
              )}

              {view === 'WEEK' && (
                <AgendaWeekView
                  selectedDateStr={selectedDateStr}
                  appointments={filteredAppointmentsList}
                  clients={clients}
                  staffList={staff}
                  services={services}
                  onSelectAppointment={(apt) => {
                    setSelectedAppointment(apt);
                    setIsDetailModalOpen(true);
                  }}
                  onSelectDate={(d) => {
                    setSelectedDateStr(d);
                    setView('DAY');
                  }}
                  onOpenCreateWithDate={handleOpenCreateWithDate}
                />
              )}

              {view === 'MONTH' && (
                <AgendaMonthView
                  selectedDateStr={selectedDateStr}
                  appointments={filteredAppointmentsList}
                  onSelectDate={(d) => {
                    setSelectedDateStr(d);
                    setView('DAY');
                  }}
                  onOpenCreateWithDate={handleOpenCreateWithDate}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        clients={clients}
        staffList={staff}
        services={services}
        selectedDateStr={selectedDateStr}
        defaultTime={defaultTimeForCreate}
        defaultStaffId={defaultStaffIdForCreate}
        duplicateApt={duplicateApt}
        onSave={handleCreateAppointment}
      />

      <AppointmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        appointment={selectedAppointment}
        client={clients.find((c) => c.id === selectedAppointment?.clientId)}
        staff={staff.find((s) => s.id === selectedAppointment?.staffId)}
        service={services.find((s) => s.id === selectedAppointment?.serviceId)}
        companyName={company.name}
        onUpdateStatus={(id, st) => {
          updateAppointment(id, { status: st });
          addToast({ title: `Status alterado para ${st}!`, type: 'success' });
        }}
        onDelete={handleDeleteRequest}
        onOpenReschedule={(apt) => {
          setSelectedAppointment(apt);
          setIsRescheduleModalOpen(true);
        }}
      />

      <QuickRescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        appointment={selectedAppointment}
        staffList={staff}
        onSave={handleQuickRescheduleSave}
      />

      <ClientHistoryDrawer
        isOpen={!!selectedClientId}
        onClose={() => setSelectedClientId(null)}
        client={activeClientObject}
        appointments={appointments}
        services={services}
        staffList={staff}
        companyName={company.name}
      />

      <BlockSlotModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        staffList={staff}
        selectedDateStr={selectedDateStr}
        onAddBlock={(b) => {
          addBlockedSlot(b);
          addToast({ title: 'Horário bloqueado na agenda com sucesso.', type: 'info' });
        }}
      />

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
        waitlist={waitlist}
        services={services}
        selectedDateStr={selectedDateStr}
        onAddWaitlist={(w) => {
          addWaitlistEntry(w);
          addToast({ title: 'Cliente adicionado à fila de espera.', type: 'success' });
        }}
        onDeleteWaitlist={(id) => {
          deleteWaitlistEntry(id);
          addToast({ title: 'Entrada da lista de espera removida.', type: 'info' });
        }}
        onConvertToAppointment={handleConvertToAppointmentFromWaitlist}
      />

      <ConfirmActionModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalState.action}
        title={confirmModalState.title}
        description={confirmModalState.description}
      />

      <PrintAgendaModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        appointments={filteredAppointmentsList}
        clients={clients}
        staffList={staff}
        services={services}
        selectedDateStr={selectedDateStr}
      />
    </div>
  );
}
