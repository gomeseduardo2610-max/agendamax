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
    const { name, email, phone, notes } = body;

    const existingClient = await prisma.client.findFirst({
      where: { id: params.id, companyId: session.companyId },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado.' },
        { status: 404 }
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: { name, email, phone, notes },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente.' },
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
    const existingClient = await prisma.client.findFirst({
      where: { id: params.id, companyId: session.companyId },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado.' },
        { status: 404 }
      );
    }

    await prisma.client.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir cliente.' },
      { status: 500 }
    );
  }
}
