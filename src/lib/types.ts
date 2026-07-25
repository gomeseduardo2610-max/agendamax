export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  phone: string;
  email: string;
  address?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  companyId: string;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  companyId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  workStart: string; // e.g. "08:00"
  workEnd: string;   // e.g. "18:00"
  servicesHandled?: string[];
}

export interface Service {
  id: string;
  companyId: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  category: string;
}

export interface Appointment {
  id: string;
  companyId: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  date: string;     // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  status: AppointmentStatus;
  price: number;
  notes?: string;
}

export interface Transaction {
  id: string;
  companyId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
}

export interface BlockedSlot {
  id: string;
  companyId: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface WaitlistEntry {
  id: string;
  companyId: string;
  clientName: string;
  phone: string;
  preferredDate: string;
  serviceName: string;
  notes?: string;
  createdAt: string;
}
