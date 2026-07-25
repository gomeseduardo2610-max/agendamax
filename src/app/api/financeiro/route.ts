import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';
import { TransactionType } from '@prisma/client';

export async function GET() {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { companyId: session.companyId },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, amount, category, description, date } = body;

    if (!type || !amount || !description) {
      return NextResponse.json(
        { error: 'Tipo, valor e descrição são obrigatórios.' },
        { status: 400 }
      );
    }

    const txDate = date ? new Date(`${date}T12:00:00`) : new Date();

    const newTransaction = await prisma.transaction.create({
      data: {
        companyId: session.companyId,
        type: type as TransactionType,
        amount: Number(amount),
        category: category || 'Outros',
        description,
        date: txDate,
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar transação.' },
      { status: 500 }
    );
  }
}
