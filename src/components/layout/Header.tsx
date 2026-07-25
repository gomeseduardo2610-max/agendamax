'use client';

import React, { useState } from 'react';
import { Search, Bell, Plus, User as UserIcon, Building2, Menu, Settings, LogOut } from 'lucide-react';
import { useAgendaStore } from '@/lib/store';
import Link from 'next/link';

interface HeaderProps {
  onOpenNewAppointment?: () => void;
  onToggleMobileMenu?: () => void;
}

export default function Header({ onOpenNewAppointment, onToggleMobileMenu }: HeaderProps) {
  const { user, company, clients, staff, services, appointments, logout } = useAgendaStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const matchedClients = searchQuery.trim()
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchedStaff = searchQuery.trim()
    ? staff.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.role.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchedServices = searchQuery.trim()
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults =
    matchedClients.length > 0 || matchedStaff.length > 0 || matchedServices.length > 0;

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-48 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cliente, profissional, serviço..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:bg-white transition-all"
          />

          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-full sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Resultados da Busca
                </span>
                <button
                  onClick={() => setShowSearchDropdown(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-700 font-bold"
                >
                  Fechar
                </button>
              </div>

              {!hasResults ? (
                <p className="text-xs text-slate-500 py-3 text-center">Nenhum resultado encontrado.</p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {matchedClients.length > 0 && (
                    <div>
                      <span className="text-[10px] font-extrabold text-brand-600 uppercase block mb-1">
                        Clientes
                      </span>
                      <div className="space-y-1">
                        {matchedClients.map((c) => (
                          <Link
                            key={c.id}
                            href="/clientes"
                            onClick={() => setShowSearchDropdown(false)}
                            className="block p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors"
                          >
                            <div>{c.name}</div>
                            <span className="text-[10px] text-slate-400 font-normal">{c.phone}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedStaff.length > 0 && (
                    <div>
                      <span className="text-[10px] font-extrabold text-cyan-600 uppercase block mb-1">
                        Equipe
                      </span>
                      <div className="space-y-1">
                        {matchedStaff.map((s) => (
                          <Link
                            key={s.id}
                            href="/funcionarios"
                            onClick={() => setShowSearchDropdown(false)}
                            className="block p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors"
                          >
                            <div>{s.name}</div>
                            <span className="text-[10px] text-slate-400 font-normal">{s.role}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedServices.length > 0 && (
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase block mb-1">
                        Serviços
                      </span>
                      <div className="space-y-1">
                        {matchedServices.map((srv) => (
                          <Link
                            key={srv.id}
                            href="/servicos"
                            onClick={() => setShowSearchDropdown(false)}
                            className="block p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors"
                          >
                            <div>{srv.name}</div>
                            <span className="text-[10px] text-slate-400 font-normal">
                              R$ {srv.price.toFixed(2)} • {srv.durationMin} min
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        {onOpenNewAppointment ? (
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Agendamento</span>
          </button>
        ) : (
          <Link
            href="/agenda"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Agendamento</span>
          </Link>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-slate-600 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <h4 className="text-xs font-bold text-slate-800">Notificações Recentes</h4>
                <span className="text-[10px] text-brand-600 font-medium cursor-pointer" onClick={() => setShowNotifications(false)}>
                  Fechar
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <p className="font-semibold text-slate-800">Agendamento Confirmado</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Mariana Silva confirmou para hoje às 09:00.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-2 border-l border-slate-200 focus:outline-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Administrador'}</p>
              <p className="text-[10px] text-brand-600 font-semibold leading-tight flex items-center justify-end gap-1">
                <Building2 className="w-2.5 h-2.5" />
                {company?.name || 'Minha Empresa'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in duration-150">
              <Link
                href="/configuracoes"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 transition-colors font-medium"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Configurações</span>
              </Link>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors font-medium mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
