import { Company, User, Client, Staff, Service, Appointment, Transaction } from './types';

export const initialCompany: Company = {
  id: 'comp_1',
  name: 'Estética & Saúde Lux',
  slug: 'estetica-lux',
  logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80',
  phone: '(11) 98765-4321',
  email: 'contato@esteticalux.com.br',
  address: 'Av. Paulista, 1000 - Sala 402, São Paulo - SP',
};

export const initialUser: User = {
  id: 'usr_1',
  name: 'Eduardo Gomes',
  email: 'eduardo@agendamax.com.br',
  role: 'ADMIN',
  companyId: 'comp_1',
};

export const initialClients: Client[] = [
  {
    id: 'cli_1',
    companyId: 'comp_1',
    name: 'Mariana Silva',
    email: 'mariana.silva@gmail.com',
    phone: '(11) 99123-4567',
    notes: 'Preferência por atendimento no final da tarde. Alérgica a látex.',
    createdAt: '2026-01-15',
  },
  {
    id: 'cli_2',
    companyId: 'comp_1',
    name: 'Lucas Ferreira',
    email: 'lucas.f@hotmail.com',
    phone: '(11) 98234-5678',
    notes: 'Cliente VIP. Corte moderno com navalha.',
    createdAt: '2026-02-10',
  },
  {
    id: 'cli_3',
    companyId: 'comp_1',
    name: 'Beatriz Santos',
    email: 'biasantos@outlook.com',
    phone: '(11) 97345-6789',
    notes: 'Limpeza de pele mensal.',
    createdAt: '2026-03-05',
  },
  {
    id: 'cli_4',
    companyId: 'comp_1',
    name: 'Rafael Oliveira',
    email: 'rafael.oli@yahoo.com.br',
    phone: '(11) 96456-7890',
    notes: 'Massagem terapêutica pós-treino.',
    createdAt: '2026-04-18',
  },
  {
    id: 'cli_5',
    companyId: 'comp_1',
    name: 'Camila Rodrigues',
    email: 'camila.r@gmail.com',
    phone: '(11) 95567-8901',
    notes: 'Atendimento pontual. Design de sobrancelhas.',
    createdAt: '2026-05-22',
  },
];

export const initialStaff: Staff[] = [
  {
    id: 'stf_1',
    companyId: 'comp_1',
    name: 'Dra. Patricia Lima',
    role: 'Esteticista Chefe',
    email: 'patricia@esteticalux.com.br',
    phone: '(11) 99888-1111',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?auto=format&fit=crop&w=200&q=80',
    workStart: '08:00',
    workEnd: '18:00',
  },
  {
    id: 'stf_2',
    companyId: 'comp_1',
    name: 'Carlos Eduardo',
    role: 'Hairstylist & Barber',
    email: 'carlos@esteticalux.com.br',
    phone: '(11) 99888-2222',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    workStart: '09:00',
    workEnd: '19:00',
  },
  {
    id: 'stf_3',
    companyId: 'comp_1',
    name: 'Juliana Mendes',
    role: 'Massoterapeuta',
    email: 'juliana@esteticalux.com.br',
    phone: '(11) 99888-3333',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    workStart: '08:00',
    workEnd: '17:00',
  },
];

export const initialServices: Service[] = [
  {
    id: 'srv_1',
    companyId: 'comp_1',
    name: 'Limpeza de Pele Profunda',
    description: 'Higienização, esfoliação, extração de cravos e máscara calmante.',
    durationMin: 60,
    price: 180.0,
    category: 'Facial',
  },
  {
    id: 'srv_2',
    companyId: 'comp_1',
    name: 'Corte de Cabelo & Visagismo',
    description: 'Corte personalizado feminino/masculino com lavagem e finalização.',
    durationMin: 45,
    price: 120.0,
    category: 'Capilar',
  },
  {
    id: 'srv_3',
    companyId: 'comp_1',
    name: 'Massagem Relaxante com Pedras Quentes',
    description: 'Alívio de tensões musculares e bem-estar corporal completo.',
    durationMin: 60,
    price: 220.0,
    category: 'Corporal',
  },
  {
    id: 'srv_4',
    companyId: 'comp_1',
    name: 'Design de Sobrancelhas & Henna',
    description: 'Mapeamento facial e aplicação de pigmento natural.',
    durationMin: 30,
    price: 85.0,
    category: 'Estética',
  },
  {
    id: 'srv_5',
    companyId: 'comp_1',
    name: 'Barba Completa com Toalha Quente',
    description: 'Modelagem de barba com alinhamento a navalha e hidratação de óleos.',
    durationMin: 30,
    price: 70.0,
    category: 'Capilar',
  },
];

// Helper to compute dynamic relative dates (always relative to today's execution)
function getRelativeDateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const todayStr = getRelativeDateStr(0);
const yesterdayStr = getRelativeDateStr(-1);
const tomorrowStr = getRelativeDateStr(1);
const dayAfterTomorrowStr = getRelativeDateStr(2);

export const initialAppointments: Appointment[] = [
  {
    id: 'apt_1',
    companyId: 'comp_1',
    clientId: 'cli_1',
    staffId: 'stf_1',
    serviceId: 'srv_1',
    date: todayStr,
    startTime: '09:00',
    endTime: '10:00',
    status: 'CONFIRMED',
    price: 180.0,
    notes: 'Confirmado via WhatsApp.',
  },
  {
    id: 'apt_2',
    companyId: 'comp_1',
    clientId: 'cli_2',
    staffId: 'stf_2',
    serviceId: 'srv_2',
    date: todayStr,
    startTime: '10:30',
    endTime: '11:15',
    status: 'CONFIRMED',
    price: 120.0,
    notes: 'Cliente preferencial.',
  },
  {
    id: 'apt_3',
    companyId: 'comp_1',
    clientId: 'cli_3',
    staffId: 'stf_3',
    serviceId: 'srv_3',
    date: todayStr,
    startTime: '14:00',
    endTime: '15:00',
    status: 'SCHEDULED',
    price: 220.0,
  },
  {
    id: 'apt_4',
    companyId: 'comp_1',
    clientId: 'cli_4',
    staffId: 'stf_1',
    serviceId: 'srv_4',
    date: tomorrowStr,
    startTime: '11:00',
    endTime: '11:30',
    status: 'SCHEDULED',
    price: 85.0,
  },
  {
    id: 'apt_5',
    companyId: 'comp_1',
    clientId: 'cli_5',
    staffId: 'stf_2',
    serviceId: 'srv_5',
    date: dayAfterTomorrowStr,
    startTime: '15:00',
    endTime: '15:30',
    status: 'SCHEDULED',
    price: 70.0,
  },
  {
    id: 'apt_6',
    companyId: 'comp_1',
    clientId: 'cli_1',
    staffId: 'stf_1',
    serviceId: 'srv_1',
    date: yesterdayStr,
    startTime: '10:00',
    endTime: '11:00',
    status: 'COMPLETED',
    price: 180.0,
  },
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx_1',
    companyId: 'comp_1',
    type: 'INCOME',
    amount: 180.0,
    category: 'Serviços',
    description: 'Pagamento Limpeza de Pele - Mariana Silva',
    date: yesterdayStr,
  },
  {
    id: 'tx_2',
    companyId: 'comp_1',
    type: 'INCOME',
    amount: 120.0,
    category: 'Serviços',
    description: 'Pagamento Corte de Cabelo - Lucas Ferreira',
    date: todayStr,
  },
  {
    id: 'tx_3',
    companyId: 'comp_1',
    type: 'EXPENSE',
    amount: 350.0,
    category: 'Produtos',
    description: 'Reposição de dermocosméticos e ceras',
    date: todayStr,
  },
  {
    id: 'tx_4',
    companyId: 'comp_1',
    type: 'EXPENSE',
    amount: 1200.0,
    category: 'Aluguel & Contas',
    description: 'Condomínio e energia elétrica da sala',
    date: yesterdayStr,
  },
  {
    id: 'tx_5',
    companyId: 'comp_1',
    type: 'INCOME',
    amount: 3200.0,
    category: 'Pacotes VIP',
    description: 'Venda de pacotes mensais de bem-estar',
    date: todayStr,
  },
];
