import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromCookie } from '@/lib/auth';

export async function GET() {
  const session = await getAuthUserFromCookie();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const companyId = session.companyId;

  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const startOfToday = new Date(`${todayStr}T00:00:00.000Z`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

    // Calculate start and end of week (Sunday to Saturday)
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Calculate start and end of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Batch query for performance optimization
    const [
      todayAppointments,
      weekAppointmentsCount,
      nextAppointment,
      clientsCount,
      staffMembers,
      servicesCount,
      monthTransactions,
      todayTransactions,
      cancelledAppointmentsCount,
      completedAppointmentsCount,
      allAppointmentsRecent,
      allClientsRecent,
      allStaffRecent,
      allServicesRecent,
      allTransactionsRecent,
    ] = await Promise.all([
      // 1. Today's appointments
      prisma.appointment.findMany({
        where: {
          companyId,
          startTime: { gte: startOfToday, lte: endOfToday },
        },
        include: {
          client: true,
          staff: true,
          service: true,
        },
        orderBy: { startTime: 'asc' },
      }),

      // 2. Week's appointments count
      prisma.appointment.count({
        where: {
          companyId,
          startTime: { gte: startOfWeek, lte: endOfWeek },
        },
      }),

      // 3. Next upcoming appointment
      prisma.appointment.findFirst({
        where: {
          companyId,
          startTime: { gte: now },
          status: { in: ['SCHEDULED', 'CONFIRMED'] },
        },
        include: {
          client: true,
          staff: true,
          service: true,
        },
        orderBy: { startTime: 'asc' },
      }),

      // 4. Clients count
      prisma.client.count({
        where: { companyId },
      }),

      // 5. Staff list
      prisma.staff.findMany({
        where: { companyId },
        select: {
          id: true,
          name: true,
          role: true,
          avatar: true,
          workStart: true,
          workEnd: true,
        },
      }),

      // 6. Services count
      prisma.service.count({
        where: { companyId },
      }),

      // 7. Month transactions
      prisma.transaction.findMany({
        where: {
          companyId,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
      }),

      // 8. Today transactions
      prisma.transaction.findMany({
        where: {
          companyId,
          date: { gte: startOfToday, lte: endOfToday },
        },
      }),

      // 9. Cancelled count
      prisma.appointment.count({
        where: {
          companyId,
          status: 'CANCELLED',
        },
      }),

      // 10. Completed count
      prisma.appointment.count({
        where: {
          companyId,
          status: 'COMPLETED',
        },
      }),

      // Recent items for activity log synthesis
      prisma.appointment.findMany({
        where: { companyId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { client: true, service: true, staff: true },
      }),
      prisma.client.findMany({
        where: { companyId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.staff.findMany({
        where: { companyId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.service.findMany({
        where: { companyId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.findMany({
        where: { companyId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Financial calculations
    const monthIncome = monthTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);

    const monthExpense = monthTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);

    const todayIncome = todayTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);

    // Free slots calculation
    let totalSlots = 0;
    staffMembers.forEach((st) => {
      const startHour = parseInt(st.workStart?.split(':')[0] || '8', 10);
      const endHour = parseInt(st.workEnd?.split(':')[0] || '18', 10);
      const hours = Math.max(0, endHour - startHour);
      totalSlots += hours;
    });

    const activeTodayAppointmentsCount = todayAppointments.filter(
      (a) => a.status !== 'CANCELLED'
    ).length;

    const freeSlotsToday = Math.max(0, totalSlots - activeTodayAppointmentsCount);

    // Chart Data Generation (Last 7 days revenue & appointments)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];

      const dayStart = new Date(`${dateKey}T00:00:00.000Z`);
      const dayEnd = new Date(`${dateKey}T23:59:59.999Z`);

      const dayRevenue = monthTransactions
        .filter((t) => t.type === 'INCOME' && new Date(t.date) >= dayStart && new Date(t.date) <= dayEnd)
        .reduce((acc, t) => acc + t.amount, 0);

      const dayApts = todayAppointments.filter(
        (a) => new Date(a.startTime) >= dayStart && new Date(a.startTime) <= dayEnd
      ).length;

      const dayLabel = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });

      chartData.push({
        date: dateKey,
        label: dayLabel,
        revenue: dayRevenue,
        appointments: dayApts,
      });
    }

    // Dynamic Recent Activities Synthesis
    const activities: Array<{ id: string; type: string; title: string; description: string; timestamp: Date }> = [];

    allAppointmentsRecent.forEach((apt) => {
      let actionTitle = 'Agendamento Criado';
      if (apt.status === 'CANCELLED') actionTitle = 'Agendamento Cancelado';
      if (apt.status === 'COMPLETED') actionTitle = 'Agendamento Concluído';

      activities.push({
        id: `act_apt_${apt.id}_${apt.updatedAt.getTime()}`,
        type: 'APPOINTMENT',
        title: actionTitle,
        description: `${apt.client?.name || 'Cliente'} - ${apt.service?.name || 'Serviço'} (${apt.staff?.name || 'Profissional'})`,
        timestamp: apt.updatedAt || apt.createdAt,
      });
    });

    allClientsRecent.forEach((cli) => {
      activities.push({
        id: `act_cli_${cli.id}`,
        type: 'CLIENT',
        title: 'Cliente Cadastrado',
        description: `${cli.name} foi adicionado à base de clientes`,
        timestamp: cli.createdAt,
      });
    });

    allStaffRecent.forEach((st) => {
      activities.push({
        id: `act_stf_${st.id}`,
        type: 'STAFF',
        title: 'Funcionário Cadastrado',
        description: `${st.name} (${st.role}) ingressou na equipe`,
        timestamp: st.createdAt,
      });
    });

    allServicesRecent.forEach((srv) => {
      activities.push({
        id: `act_srv_${srv.id}`,
        type: 'SERVICE',
        title: 'Serviço Atualizado',
        description: `${srv.name} (R$ ${srv.price.toFixed(2)}) cadastrado`,
        timestamp: srv.createdAt,
      });
    });

    allTransactionsRecent.forEach((tx) => {
      activities.push({
        id: `act_tx_${tx.id}`,
        type: 'FINANCE',
        title: 'Pagamento Registrado',
        description: `${tx.description} - R$ ${tx.amount.toFixed(2)}`,
        timestamp: tx.createdAt,
      });
    });

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const topActivities = activities.slice(0, 8);

    // Dynamic Real Notifications Synthesis
    const notifications: Array<{ id: string; type: string; title: string; message: string }> = [];

    if (nextAppointment) {
      notifications.push({
        id: `notif_next_${nextAppointment.id}`,
        type: 'INFO',
        title: 'Próximo Atendimento',
        message: `${nextAppointment.client.name} às ${new Date(nextAppointment.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} (${nextAppointment.service.name})`,
      });
    }

    if (todayAppointments.length === 0) {
      notifications.push({
        id: 'notif_no_today',
        type: 'NEUTRAL',
        title: 'Agenda de Hoje',
        message: 'Nenhum agendamento para hoje.',
      });
    }

    if (staffMembers.length === 0) {
      notifications.push({
        id: 'notif_no_staff',
        type: 'WARNING',
        title: 'Equipe em Aberto',
        message: 'Nenhum funcionário cadastrado.',
      });
    }

    if (servicesCount === 0) {
      notifications.push({
        id: 'notif_no_services',
        type: 'WARNING',
        title: 'Catálogo de Serviços',
        message: 'Cadastre seu primeiro serviço.',
      });
    }

    if (monthIncome === 0 && monthExpense === 0) {
      notifications.push({
        id: 'notif_no_finance',
        type: 'NEUTRAL',
        title: 'Financeiro',
        message: 'Ainda não há movimentações financeiras.',
      });
    }

    return NextResponse.json({
      kpis: {
        todayAppointmentsCount: todayAppointments.length,
        weekAppointmentsCount,
        nextAppointment: nextAppointment
          ? {
              id: nextAppointment.id,
              clientName: nextAppointment.client.name,
              serviceName: nextAppointment.service.name,
              staffName: nextAppointment.staff.name,
              time: new Date(nextAppointment.startTime).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              date: new Date(nextAppointment.startTime).toLocaleDateString('pt-BR'),
            }
          : null,
        clientsCount,
        staffCount: staffMembers.length,
        servicesCount,
        monthRevenue: monthIncome,
        monthNetProfit: monthIncome - monthExpense,
        todayRevenue: todayIncome,
        cancellationsCount: cancelledAppointmentsCount,
        completedAppointmentsCount,
        freeSlotsToday,
      },
      todayAppointments: todayAppointments.map((apt) => ({
        id: apt.id,
        clientId: apt.clientId,
        clientName: apt.client.name,
        clientPhone: apt.client.phone,
        serviceId: apt.serviceId,
        serviceName: apt.service.name,
        staffId: apt.staffId,
        staffName: apt.staff.name,
        startTime: new Date(apt.startTime).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        endTime: new Date(apt.endTime).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: apt.status,
        price: apt.price,
        notes: apt.notes,
      })),
      staffMembers,
      chartData,
      recentActivities: topActivities,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar dados do dashboard.' },
      { status: 500 }
    );
  }
}
