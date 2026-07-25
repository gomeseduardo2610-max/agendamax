import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { AppointmentStatus, TransactionType } from '@prisma/client';

export async function POST() {
  try {
    // Check if demo company already exists
    let company = await prisma.company.findFirst({
      where: { slug: 'estetica-max' },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: 'Estética & Saúde Max',
          slug: 'estetica-max',
          phone: '(11) 98888-7777',
          email: 'contato@esteticamax.com.br',
        },
      });
    }

    // Check if demo user exists
    const hashedPassword = await hashPassword('123456');
    let user = await prisma.user.findUnique({
      where: { email: 'eduardo@agendamax.com.br' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          companyId: company.id,
          name: 'Eduardo Gomes',
          email: 'eduardo@agendamax.com.br',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
    }

    // Seed Clients
    const existingClients = await prisma.client.count({ where: { companyId: company.id } });
    if (existingClients === 0) {
      await prisma.client.createMany({
        data: [
          { companyId: company.id, name: 'Mariana Silva', email: 'mariana.silva@email.com', phone: '(11) 99123-4567', notes: 'Prefere atendimentos no período da manhã.' },
          { companyId: company.id, name: 'Carlos Eduardo', email: 'carlos.edu@email.com', phone: '(11) 98765-4321', notes: 'Alérgico a certos óleos de massagem.' },
          { companyId: company.id, name: 'Fernanda Lima', email: 'fernanda.lima@email.com', phone: '(11) 97777-8888' },
        ],
      });
    }

    // Seed Staff
    const existingStaff = await prisma.staff.count({ where: { companyId: company.id } });
    if (existingStaff === 0) {
      await prisma.staff.createMany({
        data: [
          { companyId: company.id, name: 'Dra. Beatriz Santos', role: 'Dermatologista & Esteticista', email: 'beatriz@esteticamax.com.br', phone: '(11) 96666-5555', avatar: 'https://images.unsplash.com/photo-1594824813572-c5cfa504131b?auto=format&fit=crop&w=200&q=80', workStart: '08:00', workEnd: '18:00' },
          { companyId: company.id, name: 'Lucas Mendes', role: 'Massoterapeuta Corporal', email: 'lucas@esteticamax.com.br', phone: '(11) 95555-4444', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80', workStart: '09:00', workEnd: '19:00' },
        ],
      });
    }

    // Seed Services
    const existingServices = await prisma.service.count({ where: { companyId: company.id } });
    if (existingServices === 0) {
      await prisma.service.createMany({
        data: [
          { companyId: company.id, name: 'Limpeza de Pele Profunda', description: 'Remoção de impurezas e hidratação facial completa', durationMin: 60, price: 150.0, category: 'Facial' },
          { companyId: company.id, name: 'Massagem Relaxante', description: 'Alívio de tensões musculares e estresse corporal', durationMin: 50, price: 180.0, category: 'Corporal' },
          { companyId: company.id, name: 'Drenagem Linfática', description: 'Estímulo do sistema linfático e redução de inchaço', durationMin: 45, price: 140.0, category: 'Corporal' },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado e populado com sucesso!',
      company,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Seed API Error:', error);
    return NextResponse.json(
      { error: 'Erro ao inicializar banco de dados.' },
      { status: 500 }
    );
  }
}
