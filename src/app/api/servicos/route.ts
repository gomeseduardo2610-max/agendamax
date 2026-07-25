import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';

export async function GET() {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const services = await prisma.service.findMany({
      where: { companyId: session.companyId },
      orderBy: { category: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, durationMin, price, category } = body;

    if (!name || !durationMin || price === undefined) {
      return NextResponse.json(
        { error: 'Nome, duração e preço são obrigatórios.' },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        companyId: session.companyId,
        name,
        description: description || '',
        durationMin: Number(durationMin),
        price: Number(price),
        category: category || 'Geral',
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar serviço.' },
      { status: 500 }
    );
  }
}
