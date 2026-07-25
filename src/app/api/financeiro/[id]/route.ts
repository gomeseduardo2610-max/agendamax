import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: params.id, companyId: session.companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Transação não encontrada.' },
        { status: 404 }
      );
    }

    await prisma.transaction.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir transação.' },
      { status: 500 }
    );
  }
}
