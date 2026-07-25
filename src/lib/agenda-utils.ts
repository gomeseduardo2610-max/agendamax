import { Appointment, Client, Staff, Service, BlockedSlot } from './types';

export interface AgendaStats {
  todayTotal: number;
  todayCompleted: number;
  todayCancelled: number;
  todayConfirmed: number;
  todayRevenue: number;
  monthRevenue: number;
  weekTotal: number;
  monthTotal: number;
  attendanceRate: number; // percentage 0 - 100
  upcomingCount: number;
}

export interface AgendaFilterState {
  searchQuery: string;
  staffId: string;
  serviceId: string;
  status: string;
  clientId: string;
  minPrice: string;
  maxPrice: string;
}

/**
 * Calculates real-time agenda statistics for dashboard cards
 */
export function calculateAgendaStats(
  appointments: Appointment[],
  selectedDateStr: string
): AgendaStats {
  const selectedDate = new Date(`${selectedDateStr}T00:00:00`);
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Get week range (Monday to Sunday)
  const dayOfWeek = selectedDate.getDay();
  const diffToMonday = selectedDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(selectedDate);
  monday.setDate(diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  let todayTotal = 0;
  let todayCompleted = 0;
  let todayCancelled = 0;
  let todayConfirmed = 0;
  let todayRevenue = 0;
  let monthRevenue = 0;
  let weekTotal = 0;
  let monthTotal = 0;
  let upcomingCount = 0;

  const now = new Date();

  appointments.forEach((apt) => {
    const aptDateObj = new Date(`${apt.date}T${apt.startTime}:00`);
    const isToday = apt.date === selectedDateStr;
    const isSameMonth =
      aptDateObj.getMonth() === currentMonth && aptDateObj.getFullYear() === currentYear;
    const isSameWeek = aptDateObj >= monday && aptDateObj <= sunday;

    if (isToday) {
      todayTotal++;
      if (apt.status === 'COMPLETED') {
        todayCompleted++;
        todayRevenue += apt.price;
      } else if (apt.status === 'CANCELLED') {
        todayCancelled++;
      } else if (apt.status === 'CONFIRMED') {
        todayConfirmed++;
      }

      if (aptDateObj >= now && apt.status !== 'CANCELLED') {
        upcomingCount++;
      }
    }

    if (isSameWeek) {
      weekTotal++;
    }

    if (isSameMonth) {
      monthTotal++;
      if (apt.status === 'COMPLETED') {
        monthRevenue += apt.price;
      }
    }
  });

  const totalFinishedOrCancelledToday = todayCompleted + todayCancelled;
  const attendanceRate =
    totalFinishedOrCancelledToday > 0
      ? Math.round((todayCompleted / totalFinishedOrCancelledToday) * 100)
      : todayTotal > 0
      ? 100
      : 0;

  return {
    todayTotal,
    todayCompleted,
    todayCancelled,
    todayConfirmed,
    todayRevenue,
    monthRevenue,
    weekTotal,
    monthTotal,
    attendanceRate,
    upcomingCount,
  };
}

/**
 * Filter appointments based on search query and advanced filters
 */
export function filterAppointments(
  appointments: Appointment[],
  clients: Client[],
  staffList: Staff[],
  services: Service[],
  filters: AgendaFilterState
): Appointment[] {
  return appointments.filter((apt) => {
    const client = clients.find((c) => c.id === apt.clientId);
    const staff = staffList.find((s) => s.id === apt.staffId);
    const service = services.find((s) => s.id === apt.serviceId);

    // Search query match
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchClient = client?.name.toLowerCase().includes(q) || client?.phone.includes(q);
      const matchStaff = staff?.name.toLowerCase().includes(q);
      const matchService = service?.name.toLowerCase().includes(q);
      const matchNotes = apt.notes?.toLowerCase().includes(q);
      const matchDate = apt.date.includes(q);

      if (!matchClient && !matchStaff && !matchService && !matchNotes && !matchDate) {
        return false;
      }
    }

    // Filter Staff
    if (filters.staffId && filters.staffId !== 'ALL' && apt.staffId !== filters.staffId) {
      return false;
    }

    // Filter Service
    if (filters.serviceId && filters.serviceId !== 'ALL' && apt.serviceId !== filters.serviceId) {
      return false;
    }

    // Filter Status
    if (filters.status && filters.status !== 'ALL' && apt.status !== filters.status) {
      return false;
    }

    // Filter Client
    if (filters.clientId && filters.clientId !== 'ALL' && apt.clientId !== filters.clientId) {
      return false;
    }

    // Price range
    if (filters.minPrice && apt.price < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && apt.price > Number(filters.maxPrice)) {
      return false;
    }

    return true;
  });
}

/**
 * Formats time string to display HH:mm
 */
export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

/**
 * Helper to get status color theme
 */
export function getStatusStyle(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        badge: 'success' as const,
        label: 'Confirmado',
      };
    case 'COMPLETED':
      return {
        bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        badge: 'info' as const,
        label: 'Concluído',
      };
    case 'CANCELLED':
      return {
        bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        badge: 'danger' as const,
        label: 'Cancelado',
      };
    case 'SCHEDULED':
    default:
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        badge: 'warning' as const,
        label: 'Agendado',
      };
  }
}

/**
 * Get client stats for client history drawer
 */
export function getClientAgendaStats(clientId: string, appointments: Appointment[]) {
  const clientApts = appointments.filter((a) => a.clientId === clientId);
  const completedApts = clientApts.filter((a) => a.status === 'COMPLETED');
  const cancelledApts = clientApts.filter((a) => a.status === 'CANCELLED');
  const totalSpent = completedApts.reduce((sum, a) => sum + a.price, 0);

  const sortedDates = [...clientApts].sort(
    (a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime()
  );

  const lastVisit = sortedDates.find((a) => a.status === 'COMPLETED');
  const nextVisit = sortedDates.find(
    (a) => new Date(`${a.date}T${a.startTime}`).getTime() > Date.now() && a.status !== 'CANCELLED'
  );

  const isVip = completedApts.length >= 5 || totalSpent >= 500;

  return {
    totalVisits: completedApts.length,
    totalSpent,
    cancelledCount: cancelledApts.length,
    lastVisitDate: lastVisit ? `${lastVisit.date} (${formatTime(lastVisit.startTime)})` : 'Nenhuma',
    nextVisitDate: nextVisit ? `${nextVisit.date} às ${formatTime(nextVisit.startTime)}` : 'Nenhum agendado',
    isVip,
    history: sortedDates,
  };
}
