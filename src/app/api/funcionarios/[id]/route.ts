import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';

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
    const { name, role, email, phone, avatar, workStart, workEnd } = body;

    const existing = await prisma.staff.findFirst({
      where: { id: params.id, companyId: session.companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Funcionário não encontrado.' },
        { status: 404 }
      );
    }

    const updated = await prisma.staff.update({
      where: { id: params.id },
      data: { name, role, email, phone, avatar, workStart, workEnd },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar funcionário.' },
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
    const existing = await prisma.staff.findFirst({
      where: { id: params.id, companyId: session.companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Funcionário não encontrado.' },
        { status: 404 }
      );
    }

    await prisma.staff.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir funcionário.' },
      { status: 500 }
    );
  }
}
