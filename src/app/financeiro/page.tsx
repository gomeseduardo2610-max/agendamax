'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import ToastManager from '@/components/ui/ToastManager';
import { useToast } from '@/lib/useToast';
import { useAgendaStore } from '@/lib/store';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
} from 'lucide-react';

export default function FinancialPage() {
  const { transactions, addTransaction, deleteTransaction } = useAgendaStore();
  const { addToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [amount, setAmount] = useState(150);
  const [category, setCategory] = useState('Serviços');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const incomeTotal = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = incomeTotal - expenseTotal;

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && description) {
      addTransaction({
        type,
        amount: Number(amount),
        category,
        description,
        date,
      });
      setIsModalOpen(false);
      addToast({
        type: 'success',
        title: 'Transação Registrada!',
        description: `${type === 'INCOME' ? 'Receita' : 'Despesa'} de R$ ${amount.toFixed(2)}`,
      });
    }
  };

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
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Painel Financeiro &amp; Caixa
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Controle de receitas, despesas operacionais e fluxo de caixa
              </p>
            </div>

            <button
              onClick={() => {
                setDescription('');
                setAmount(100);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Lançar Transação</span>
            </button>
          </div>

          {/* 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Receita Bruta (Entradas)</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-black text-emerald-600">
                  R$ {incomeTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Despesas (Saídas)</span>
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-black text-red-600">
                  R$ {expenseTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Lucro Líquido Real</span>
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-black text-slate-900">
                  R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Category Distribution & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
                <span>Receita por Categoria de Serviço</span>
                <span className="text-xs text-brand-600 font-bold">100% Consolidado</span>
              </h3>

              <div className="space-y-3">
                {(() => {
                  const categories = ['Serviços', 'Produtos', 'Estética', 'Outros'];
                  return categories.map((cat) => {
                    const catIncome = transactions
                      .filter((t) => t.type === 'INCOME' && t.category.includes(cat))
                      .reduce((a, b) => a + b.amount, 0);
                    const pct = incomeTotal > 0 ? Math.min(100, Math.round((catIncome / incomeTotal) * 100)) : 25;

                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{cat}</span>
                          <span className="text-slate-900">R$ {catIncome.toFixed(2)} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Indicadores de Saúde Financeira</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-semibold block">Margem de Lucro</span>
                  <span className="text-xl font-black text-emerald-600 mt-1 block">
                    {incomeTotal > 0 ? Math.round((netProfit / incomeTotal) * 100) : 0}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-semibold block">Ticket Médio</span>
                  <span className="text-xl font-black text-brand-600 mt-1 block">
                    R${' '}
                    {transactions.filter((t) => t.type === 'INCOME').length > 0
                      ? (
                          incomeTotal / transactions.filter((t) => t.type === 'INCOME').length
                        ).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Histórico de Transações</h3>
                <p className="text-xs text-slate-500 font-medium">Extrato detalhado de entradas e saídas</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs border border-slate-200">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterType('INCOME')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterType === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Entradas
                </button>
                <button
                  onClick={() => setFilterType('EXPENSE')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterType === 'EXPENSE' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Saídas
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        tx.type === 'INCOME'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{tx.description}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {tx.category} • {tx.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-extrabold ${
                        tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                    </span>

                    <button
                      onClick={() => {
                        deleteTransaction(tx.id);
                        addToast({ type: 'info', title: 'Transação Removida' });
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200/60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* CREATE TRANSACTION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lançar Transação Financeira"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Receita (Entrada)
            </button>
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                type === 'EXPENSE'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Despesa (Saída)
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Pagamento cliente / Compra insumos"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                required
                min={1}
                step={0.01}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              >
                <option value="Serviços">Serviços</option>
                <option value="Produtos">Produtos</option>
                <option value="Aluguel & Contas">Aluguel &amp; Contas</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Confirmar Lançamento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
