'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Scissors,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAgendaStore } from '@/lib/store';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Agenda', href: '/agenda', icon: Calendar, badge: 'Principal' },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Funcionários', href: '/funcionarios', icon: UserCheck },
  { label: 'Serviços', href: '/servicos', icon: Scissors },
  { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { company, logout } = useAgendaStore();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    logout();
    window.location.href = '/login';
  };

  const content = (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1">
              Agenda<span className="text-brand-600">Max</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">SaaS de Gestão</p>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Company info card */}
      <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="truncate pr-2">
          <p className="text-xs font-bold text-slate-800 truncate">{company.name}</p>
          <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded border border-emerald-200">
            Ambiente Ativo
          </span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-brand-50 text-brand-600 font-bold border border-brand-200/60 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-brand-100 text-brand-700 border border-brand-200'
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                <ChevronRight
                  className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive ? 'text-brand-600 opacity-100' : 'text-slate-400'
                  }`}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-screen sticky top-0 z-40">
        {content}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
          />
          <div className="relative z-10 h-full animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
