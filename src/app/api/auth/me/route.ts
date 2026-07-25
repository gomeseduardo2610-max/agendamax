import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthUserFromCookie();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      company: user.company,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao verificar sessão.' },
      { status: 500 }
    );
  }
}
