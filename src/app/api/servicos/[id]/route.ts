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
    const { name, description, durationMin, price, category } = body;

    const existing = await prisma.service.findFirst({
      where: { id: params.id, companyId: session.companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Serviço não encontrado.' },
        { status: 404 }
      );
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: {
        name,
        description,
        durationMin: Number(durationMin),
        price: Number(price),
        category,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar serviço.' },
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
    const existing = await prisma.service.findFirst({
      where: { id: params.id, companyId: session.companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Serviço não encontrado.' },
        { status: 404 }
      );
    }

    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir serviço.' },
      { status: 500 }
    );
  }
}
