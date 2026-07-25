import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';
import { AppointmentStatus } from '@prisma/client';

export async function GET(request: Request) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');
  const staffId = searchParams.get('staffId');

  const whereClause: any = {
    companyId: session.companyId,
  };

  if (staffId && staffId !== 'ALL') {
    whereClause.staffId = staffId;
  }

  if (dateStr) {
    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59`);
    whereClause.startTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    include: {
      client: true,
      staff: true,
      service: true,
    },
    orderBy: { startTime: 'asc' },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clientId, staffId, serviceId, date, startTime, endTime, price, notes, status } = body;

    if (!clientId || !staffId || !serviceId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Cliente, funcionário, serviço, data e horários são obrigatórios.' },
        { status: 400 }
      );
    }

    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    // Conflict check in Prisma DB for overlap
    const conflict = await prisma.appointment.findFirst({
      where: {
        companyId: session.companyId,
        staffId,
        status: { not: AppointmentStatus.CANCELLED },
        startTime: { lt: endDateTime },
        endTime: { gt: startDateTime },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'Este funcionário já possui um agendamento neste mesmo horário.' },
        { status: 409 }
      );
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        companyId: session.companyId,
        clientId,
        staffId,
        serviceId,
        startTime: startDateTime,
        endTime: endDateTime,
        price: Number(price),
        notes: notes || '',
        status: (status as AppointmentStatus) || AppointmentStatus.CONFIRMED,
      },
      include: {
        client: true,
        staff: true,
        service: true,
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Erro ao criar agendamento.' },
      { status: 500 }
    );
  }
}
