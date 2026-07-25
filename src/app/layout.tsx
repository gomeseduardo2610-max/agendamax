import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgendaMax — Gestão & Agendamentos Inteligentes',
  description: 'Sistema completo de agendamento online, gestão de clientes, funcionários, serviços e financeiro para empresas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-slate-900 antialiased selection:bg-brand-600 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
