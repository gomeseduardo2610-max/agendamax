import { Company, User, Client, Staff, Service, Appointment, Transaction } from './types';

export const initialCompany: Company = {
  id: 'comp_default',
  name: 'Minha Empresa',
  slug: 'minha-empresa',
  logoUrl: '',
  phone: '',
  email: '',
  address: '',
};

export const initialUser: User = {
  id: 'usr_default',
  name: 'Administrador',
  email: 'admin@agendamax.com.br',
  role: 'ADMIN',
  companyId: 'comp_default',
};

export const initialClients: Client[] = [];
export const initialStaff: Staff[] = [];
export const initialServices: Service[] = [];
export const initialAppointments: Appointment[] = [];
export const initialTransactions: Transaction[] = [];
