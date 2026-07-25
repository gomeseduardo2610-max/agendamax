import { Appointment, Client, Staff, Service } from './types';

/**
 * Downloads data as a CSV file compatible with Excel
 */
export function exportAppointmentsToCSV(
  appointments: Appointment[],
  clients: Client[],
  staffList: Staff[],
  services: Service[],
  dateStr: string
) {
  const headers = [
    'ID',
    'Data',
    'Horario Inicio',
    'Horario Fim',
    'Cliente',
    'Telefone',
    'Profissional',
    'Servico',
    'Preco (R$)',
    'Status',
    'Observacoes',
  ];

  const rows = appointments.map((apt) => {
    const client = clients.find((c) => c.id === apt.clientId);
    const staff = staffList.find((s) => s.id === apt.staffId);
    const service = services.find((srv) => srv.id === apt.serviceId);

    return [
      apt.id,
      apt.date,
      apt.startTime,
      apt.endTime,
      `"${client?.name || 'Cliente Removido'}"`,
      `"${client?.phone || ''}"`,
      `"${staff?.name || 'Profissional Removido'}"`,
      `"${service?.name || 'Serviço Removido'}"`,
      apt.price.toFixed(2).replace('.', ','),
      apt.status,
      `"${(apt.notes || '').replace(/"/g, '""')}"`,
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `agendamax-agenda-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Trigger print dialog with clean formatted table layout
 */
export function printAgendaWindow(
  appointments: Appointment[],
  clients: Client[],
  staffList: Staff[],
  services: Service[],
  dateStr: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const rowsHtml = appointments
    .map((apt) => {
      const client = clients.find((c) => c.id === apt.clientId);
      const staff = staffList.find((s) => s.id === apt.staffId);
      const service = services.find((srv) => srv.id === apt.serviceId);

      return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${apt.startTime} - ${apt.endTime}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${client?.name || 'N/A'}</strong><br/><small>${client?.phone || ''}</small></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${service?.name || 'N/A'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${staff?.name || 'N/A'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">R$ ${apt.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${apt.status}</td>
      </tr>
    `;
    })
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>AgendaMax - Impressão da Agenda (${dateStr})</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; color: #111; }
          h1 { margin-bottom: 4px; font-size: 20px; }
          p { margin-top: 0; color: #555; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th { text-align: left; background: #f3f4f6; padding: 8px; border-bottom: 2px solid #ccc; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>AgendaMax — Agendamentos de ${dateStr}</h1>
        <p>Relatório de agendamentos impresso em ${new Date().toLocaleString('pt-BR')}</p>
        <table>
          <thead>
            <tr>
              <th>Horário</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Profissional</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="6" style="padding: 16px; text-align: center;">Nenhum agendamento encontrado.</td></tr>'}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
