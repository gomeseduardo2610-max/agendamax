import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';

export async function GET() {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id: session.companyId },
    });
    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(null);
  }
}

export async function PUT(request: Request) {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, email, logoUrl } = body;

    const updatedCompany = await prisma.company.update({
      where: { id: session.companyId },
      data: {
        name,
        phone,
        email,
        logoUrl,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar dados da empresa.' },
      { status: 500 }
    );
  }
}
