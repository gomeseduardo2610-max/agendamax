import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';

export async function GET() {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const staff = await prisma.staff.findMany({
    where: { companyId: session.companyId },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(staff);
}

export async function POST(request: Request) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, email, phone, avatar, workStart, workEnd } = body;

    if (!name || !role || !email) {
      return NextResponse.json(
        { error: 'Nome, cargo e e-mail são obrigatórios.' },
        { status: 400 }
      );
    }

    const newStaff = await prisma.staff.create({
      data: {
        companyId: session.companyId,
        name,
        role,
        email,
        phone: phone || '',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        workStart: workStart || '08:00',
        workEnd: workEnd || '18:00',
      },
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar funcionário.' },
      { status: 500 }
    );
  }
}
