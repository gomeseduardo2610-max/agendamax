'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ToastManager from '@/components/ui/ToastManager';
import { useToast } from '@/lib/useToast';
import { useAgendaStore } from '@/lib/store';
import {
  Settings,
  Building,
  User,
  ShieldCheck,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const { company, user, updateCompany, updateUser } = useAgendaStore();
  const { addToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [companyName, setCompanyName] = useState(company.name);
  const [companyPhone, setCompanyPhone] = useState(company.phone);
  const [companyEmail, setCompanyEmail] = useState(company.email);
  const [companyAddress, setCompanyAddress] = useState(company.address || '');

  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany({
      name: companyName,
      phone: companyPhone,
      email: companyEmail,
      address: companyAddress,
    });
    addToast({ type: 'success', title: 'Dados da Empresa Atualizados!' });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: userName,
      email: userEmail,
    });
    addToast({ type: 'success', title: 'Perfil do Usuário Atualizado!' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <ToastManager />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-600" />
              Configurações da Empresa &amp; Perfil
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Personalize o nome da empresa, contatos, dados cadastrais e perfil
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COMPANY PROFILE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-600" />
                Dados da Empresa / Estabelecimento
              </h3>

              <form onSubmit={handleSaveCompany} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Empresa</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      required
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      required
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Endereço Físico</label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados da Empresa</span>
                </button>
              </form>
            </div>

            {/* USER PROFILE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-600" />
                Perfil do Usuário Administrador
              </h3>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Gestor</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail de Acesso</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Permissão de Acesso
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Sua conta é <strong>ADMINISTRADOR MASTER</strong>.
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all"
                >
                  <Save className="w-4 h-4 text-brand-600" />
                  <span>Atualizar Perfil</span>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
