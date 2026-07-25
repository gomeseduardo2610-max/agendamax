/**
 * Helper to generate WhatsApp Web / Direct Message URLs with pre-filled text
 */

export interface WhatsAppMessageParams {
  phone: string;
  clientName: string;
  serviceName: string;
  date: string;
  startTime: string;
  staffName?: string;
  companyName?: string;
  type?: 'CONFIRMATION' | 'REMINDER' | 'WELCOME';
}

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove non-numeric characters
  const digits = phone.replace(/\D/g, '');
  // Add 55 country code if not included
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

export function generateWhatsAppLink({
  phone,
  clientName,
  serviceName,
  date,
  startTime,
  staffName = 'Nossa Equipe',
  companyName = 'AgendaMax',
  type = 'CONFIRMATION',
}: WhatsAppMessageParams): string {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  let message = '';

  if (type === 'CONFIRMATION') {
    message = `Olá, *${clientName}*! 👋\n\nSeu agendamento para *${serviceName}* com *${staffName}* foi confirmado com sucesso!\n\n📅 *Data:* ${formattedDate}\n⏰ *Horário:* ${startTime}\n📍 *Empresa:* ${companyName}\n\nCaso precise reagendar, entre em contato conosco. Te esperamos! 😊`;
  } else if (type === 'REMINDER') {
    message = `Olá, *${clientName}*! ⏰ Passando para lembrar do seu atendimento de *${serviceName}* hoje às *${startTime}* com *${staffName}*.\n\nNos vemos em breve! ✨`;
  } else {
    message = `Olá, *${clientName}*! Seja muito bem-vindo(a) à *${companyName}*! Estamos à disposição para agendar seus atendimentos.`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
