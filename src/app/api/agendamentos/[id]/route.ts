import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';
import { AppointmentStatus, TransactionType } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, date, startTime, endTime, staffId, serviceId, notes } = body;

    const existing = await prisma.appointment.findFirst({
      where: { id: params.id, companyId: session.companyId },
      include: { client: true, service: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado.' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status as AppointmentStatus;
    if (notes !== undefined) updateData.notes = notes;
    if (staffId) updateData.staffId = staffId;
    if (serviceId) updateData.serviceId = serviceId;

    if (date && startTime && endTime) {
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const endDateTime = new Date(`${date}T${endTime}:00`);

      // Check conflict if staff/time modified
      const conflict = await prisma.appointment.findFirst({
        where: {
          id: { not: params.id },
          companyId: session.companyId,
          staffId: staffId || existing.staffId,
          status: { not: AppointmentStatus.CANCELLED },
          startTime: { lt: endDateTime },
          endTime: { gt: startDateTime },
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: 'Conflito de horário detectado para este funcionário.' },
          { status: 409 }
        );
      }

      updateData.startTime = startDateTime;
      updateData.endTime = endDateTime;
    }

    // Execute update in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const apt = await tx.appointment.update({
        where: { id: params.id },
        data: updateData,
        include: { client: true, staff: true, service: true },
      });

      // If transitioning to COMPLETED, auto-create financial income transaction
      if (status === 'COMPLETED' && existing.status !== 'COMPLETED') {
        const clientName = apt.client?.name || 'Cliente';
        const serviceName = apt.service?.name || 'Serviço';

        await tx.transaction.create({
          data: {
            companyId: session.companyId,
            type: TransactionType.INCOME,
            amount: apt.price,
            category: 'Serviços',
            description: `${serviceName} - ${clientName}`,
            date: apt.startTime,
          },
        });
      }

      return apt;
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar agendamento.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const existing = await prisma.appointment.findFirst({
      where: { id: params.id, companyId: session.companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado.' },
        { status: 404 }
      );
    }

    await prisma.appointment.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir agendamento.' },
      { status: 500 }
    );
  }
}
