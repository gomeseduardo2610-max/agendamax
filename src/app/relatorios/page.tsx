'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ToastManager from '@/components/ui/ToastManager';
import { useToast } from '@/lib/useToast';
import { useAgendaStore } from '@/lib/store';
import {
  BarChart3,
  Calendar,
  Users,
  Scissors,
  UserCheck,
  DollarSign,
  Download,
} from 'lucide-react';

export default function ReportsPage() {
  const { appointments, clients, staff, services, transactions } = useAgendaStore();
  const { addToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'APPOINTMENTS' | 'CLIENTS' | 'SERVICES' | 'STAFF' | 'FINANCIAL'
  >('APPOINTMENTS');

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'APPOINTMENTS') {
      csvContent += 'ID,Data,Horario,Cliente,Profissional,Servico,Valor,Status\n';
      appointments.forEach((a) => {
        const cli = clients.find((c) => c.id === a.clientId)?.name || 'Cliente';
        const stf = staff.find((s) => s.id === a.staffId)?.name || 'Profissional';
        const srv = services.find((s) => s.id === a.serviceId)?.name || 'Serviço';
        csvContent += `"${a.id}","${a.date}","${a.startTime}","${cli}","${stf}","${srv}",${a.price},"${a.status}"\n`;
      });
    } else if (activeTab === 'CLIENTS') {
      csvContent += 'ID,Nome,Email,Telefone,DataCadastro\n';
      clients.forEach((c) => {
        csvContent += `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.createdAt}"\n`;
      });
    } else if (activeTab === 'FINANCIAL') {
      csvContent += 'ID,Tipo,Valor,Categoria,Descricao,Data\n';
      transactions.forEach((t) => {
        csvContent += `"${t.id}","${t.type}",${t.amount},"${t.category}","${t.description}","${t.date}"\n`;
      });
    } else {
      csvContent += 'ID,Nome,Preco\n';
      services.forEach((s) => {
        csvContent += `"${s.id}","${s.name}",${s.price}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agendamax_${activeTab.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Relatório Exportado!',
      description: 'O arquivo CSV foi gerado com sucesso.',
    });
  };

  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');
  const totalRevenue = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <ToastManager />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-600" />
                Relatórios Gerenciais
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Análise de dados de agendamentos, retenção de clientes e finanças
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Relatório CSV</span>
            </button>
          </div>

          {/* Report Category Tabs */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl text-xs overflow-x-auto shadow-xs">
            <button
              onClick={() => setActiveTab('APPOINTMENTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'APPOINTMENTS'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Agendamentos</span>
            </button>

            <button
              onClick={() => setActiveTab('CLIENTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'CLIENTS'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes</span>
            </button>

            <button
              onClick={() => setActiveTab('SERVICES')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'SERVICES'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Serviços</span>
            </button>

            <button
              onClick={() => setActiveTab('STAFF')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'STAFF'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Funcionários</span>
            </button>

            <button
              onClick={() => setActiveTab('FINANCIAL')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'FINANCIAL'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Financeiro</span>
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === 'APPOINTMENTS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block">Total Agendados</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    {appointments.length}
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block">Taxa de Conclusão</span>
                  <span className="text-2xl font-black text-emerald-600 mt-1 block">
                    {appointments.length > 0
                      ? Math.round((completedAppointments.length / appointments.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block">Cancelamentos</span>
                  <span className="text-2xl font-black text-red-600 mt-1 block">
                    {appointments.filter((a) => a.status === 'CANCELLED').length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CLIENTS' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900">Relatório de Frequência de Clientes</h3>
              <div className="space-y-3">
                {clients.map((cli) => {
                  const cliApts = appointments.filter((a) => a.clientId === cli.id);
                  const totalSpent = cliApts
                    .filter((a) => a.status === 'COMPLETED')
                    .reduce((acc, curr) => acc + curr.price, 0);

                  return (
                    <div
                      key={cli.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800"
                    >
                      <div>
                        <h4 className="font-extrabold text-slate-900">{cli.name}</h4>
                        <span className="text-slate-500 text-[11px]">{cli.phone}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 block">R$ {totalSpent.toFixed(2)}</span>
                        <span className="text-slate-500 text-[11px]">{cliApts.length} atendimentos</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
