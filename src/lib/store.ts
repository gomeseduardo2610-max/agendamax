import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Company,
  User,
  Client,
  Staff,
  Service,
  Appointment,
  Transaction,
  AppointmentStatus,
  BlockedSlot,
  WaitlistEntry,
} from './types';
import {
  initialCompany,
  initialUser,
  initialClients,
  initialStaff,
  initialServices,
  initialAppointments,
  initialTransactions,
} from './mock-data';

interface AgendaStore {
  company: Company;
  user: User | null;
  isLoggedIn: boolean;
  clients: Client[];
  staff: Staff[];
  services: Service[];
  appointments: Appointment[];
  transactions: Transaction[];
  blockedSlots: BlockedSlot[];
  waitlist: WaitlistEntry[];

  // Auth actions
  login: (email: string) => boolean;
  register: (companyName: string, name: string, email: string, companyId?: string, userId?: string) => void;
  logout: () => void;
  updateCompany: (data: Partial<Company>) => void;
  updateUser: (data: Partial<User>) => void;

  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'companyId'>) => { success: boolean; error?: string };
  updateAppointment: (id: string, appointment: Partial<Appointment>) => { success: boolean; error?: string };
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  deleteAppointment: (id: string) => void;

  // Client actions
  addClient: (client: Omit<Client, 'id' | 'companyId' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Staff actions
  addStaff: (staff: Omit<Staff, 'id' | 'companyId'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Service actions
  addService: (service: Omit<Service, 'id' | 'companyId'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'companyId'>) => void;
  deleteTransaction: (id: string) => void;

  // Blocked Slots & Waitlist
  addBlockedSlot: (slot: Omit<BlockedSlot, 'id' | 'companyId'>) => void;
  deleteBlockedSlot: (id: string) => void;

  addWaitlistEntry: (entry: Omit<WaitlistEntry, 'id' | 'companyId' | 'createdAt'>) => void;
  deleteWaitlistEntry: (id: string) => void;

  // Conflict helper
  checkConflict: (staffId: string, date: string, startTime: string, endTime: string, ignoreId?: string) => boolean;
}

export const useAgendaStore = create<AgendaStore>()(
  persist(
    (set, get) => ({
      company: initialCompany,
      user: initialUser,
      isLoggedIn: true,
      clients: initialClients,
      staff: initialStaff,
      services: initialServices,
      appointments: initialAppointments,
      transactions: initialTransactions,
      blockedSlots: [
        {
          id: 'blk_1',
          companyId: initialCompany.id,
          staffId: 'stf_1',
          date: new Date().toISOString().split('T')[0],
          startTime: '12:00',
          endTime: '13:00',
          reason: 'Intervalo de Almoço',
        },
      ],
      waitlist: [
        {
          id: 'wt_1',
          companyId: initialCompany.id,
          clientName: 'Roberto Alves',
          phone: '(11) 98111-2222',
          preferredDate: new Date().toISOString().split('T')[0],
          serviceName: 'Limpeza de Pele Profunda',
          notes: 'Aguardando desistência no período da tarde',
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],

      // Auth
      login: (email: string) => {
        set({
          isLoggedIn: true,
          user: {
            id: 'usr_' + Date.now(),
            name: email.split('@')[0] || 'Usuário',
            email,
            role: 'ADMIN',
            companyId: get().company.id,
          },
        });
        return true;
      },
      register: (companyName: string, name: string, email: string, companyId?: string, userId?: string) => {
        const newCompany: Company = {
          id: companyId || 'comp_' + Date.now(),
          name: companyName,
          slug: companyName.toLowerCase().replace(/\s+/g, '-'),
          phone: '(11) 90000-0000',
          email,
        };
        const newUser: User = {
          id: userId || 'usr_' + Date.now(),
          name,
          email,
          role: 'ADMIN',
          companyId: newCompany.id,
        };
        set({
          company: newCompany,
          user: newUser,
          isLoggedIn: true,
        });
      },
      logout: () => set({ isLoggedIn: false, user: null }),
      updateCompany: (data) =>
        set((state) => ({ company: { ...state.company, ...data } })),
      updateUser: (data) =>
        set((state) => (state.user ? { user: { ...state.user, ...data } } : {})),

      // Conflict detection: returns true if there IS a conflict
      checkConflict: (staffId, date, startTime, endTime, ignoreId) => {
        const appointments = get().appointments;
        return appointments.some((apt) => {
          if (apt.id === ignoreId) return false;
          if (apt.status === 'CANCELLED') return false;
          if (apt.staffId !== staffId || apt.date !== date) return false;

          // Check time overlap: (StartA < EndB) and (EndA > StartB)
          const startA = apt.startTime;
          const endA = apt.endTime;
          const startB = startTime;
          const endB = endTime;

          return startA < endB && endA > startB;
        });
      },

      // Appointments
      addAppointment: (data) => {
        const hasConflict = get().checkConflict(
          data.staffId,
          data.date,
          data.startTime,
          data.endTime
        );

        if (hasConflict) {
          return {
            success: false,
            error: 'Este funcionário já possui um agendamento neste mesmo horário. Escolha outro horário ou profissional.',
          };
        }

        const newApt: Appointment = {
          ...data,
          id: 'apt_' + Date.now(),
          companyId: get().company.id,
        };

        set((state) => ({
          appointments: [newApt, ...state.appointments],
        }));

        return { success: true };
      },

      updateAppointment: (id, data) => {
        const current = get().appointments.find((a) => a.id === id);
        if (!current) return { success: false, error: 'Agendamento não encontrado.' };

        const targetStaff = data.staffId || current.staffId;
        const targetDate = data.date || current.date;
        const targetStart = data.startTime || current.startTime;
        const targetEnd = data.endTime || current.endTime;

        const hasConflict = get().checkConflict(
          targetStaff,
          targetDate,
          targetStart,
          targetEnd,
          id
        );

        if (hasConflict) {
          return {
            success: false,
            error: 'Conflito de horário detectado para este funcionário.',
          };
        }

        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        }));

        return { success: true };
      },

      cancelAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status: 'CANCELLED' as AppointmentStatus } : a
          ),
        })),

      completeAppointment: (id) => {
        const apt = get().appointments.find((a) => a.id === id);
        if (!apt) return;

        set((state) => {
          // Check if transaction already exists for this appointment
          const clientName = state.clients.find((c) => c.id === apt.clientId)?.name || 'Cliente';
          const serviceName = state.services.find((s) => s.id === apt.serviceId)?.name || 'Serviço';

          const newTransaction: Transaction = {
            id: 'tx_' + Date.now(),
            companyId: state.company.id,
            type: 'INCOME',
            amount: apt.price,
            category: 'Serviços',
            description: `${serviceName} - ${clientName}`,
            date: apt.date,
          };

          return {
            appointments: state.appointments.map((a) =>
              a.id === id ? { ...a, status: 'COMPLETED' as AppointmentStatus } : a
            ),
            transactions: [newTransaction, ...state.transactions],
          };
        });
      },

      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),

      // Clients
      addClient: (data) => {
        const newClient: Client = {
          ...data,
          id: 'cli_' + Date.now(),
          companyId: get().company.id,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ clients: [newClient, ...state.clients] }));
      },

      updateClient: (id, data) =>
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),

      // Staff
      addStaff: (data) => {
        const newStaff: Staff = {
          ...data,
          id: 'stf_' + Date.now(),
          companyId: get().company.id,
        };
        set((state) => ({ staff: [...state.staff, newStaff] }));
      },

      updateStaff: (id, data) =>
        set((state) => ({
          staff: state.staff.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),

      deleteStaff: (id) =>
        set((state) => ({
          staff: state.staff.filter((s) => s.id !== id),
        })),

      // Services
      addService: (data) => {
        const newService: Service = {
          ...data,
          id: 'srv_' + Date.now(),
          companyId: get().company.id,
        };
        set((state) => ({ services: [...state.services, newService] }));
      },

      updateService: (id, data) =>
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),

      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      // Financials
      addTransaction: (data) => {
        const newTx: Transaction = {
          ...data,
          id: 'tx_' + Date.now(),
          companyId: get().company.id,
        };
        set((state) => ({ transactions: [newTx, ...state.transactions] }));
      },

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Blocked Slots & Waitlist
      addBlockedSlot: (data) => {
        const newSlot: BlockedSlot = {
          ...data,
          id: 'blk_' + Date.now(),
          companyId: get().company.id,
        };
        set((state) => ({ blockedSlots: [...state.blockedSlots, newSlot] }));
      },

      deleteBlockedSlot: (id) =>
        set((state) => ({
          blockedSlots: state.blockedSlots.filter((b) => b.id !== id),
        })),

      addWaitlistEntry: (data) => {
        const newEntry: WaitlistEntry = {
          ...data,
          id: 'wt_' + Date.now(),
          companyId: get().company.id,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ waitlist: [newEntry, ...state.waitlist] }));
      },

      deleteWaitlistEntry: (id) =>
        set((state) => ({
          waitlist: state.waitlist.filter((w) => w.id !== id),
        })),
    }),
    {
      name: 'agendamax-storage',
    }
  )
);
