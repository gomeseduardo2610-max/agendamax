'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import ToastManager from '@/components/ui/ToastManager';
import { useToast } from '@/lib/useToast';
import { useAgendaStore } from '@/lib/store';
import { Client } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  History,
  Trash2,
  Edit2,
  MessageCircle,
} from 'lucide-react';

export default function ClientsPage() {
  const { company, clients, appointments, services, staff, addClient, updateClient, deleteClient } = useAgendaStore();
  const { addToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleOpenCreateModal = () => {
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone) {
      addClient({ name, email, phone, notes });
      setIsCreateModalOpen(false);
      addToast({ type: 'success', title: 'Cliente Cadastrado!', description: name });
    }
  };

  const handleOpenEditModal = (client: Client) => {
    setSelectedClient(client);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setNotes(client.notes || '');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && name && email && phone) {
      updateClient(selectedClient.id, { name, email, phone, notes });
      setIsEditModalOpen(false);
      addToast({ type: 'success', title: 'Cadastro Atualizado!' });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <ToastManager />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-600" />
                Gestão de Clientes
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {clients.length} cliente{clients.length > 1 ? 's' : ''} cadastrado{clients.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filtrar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-600"
                />
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Cliente</span>
              </button>
            </div>
          </div>

          {/* Client Cards Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => {
              const clientApts = appointments.filter((a) => a.clientId === client.id);
              const completedCount = clientApts.filter((a) => a.status === 'COMPLETED').length;

              return (
                <div
                  key={client.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">{client.name}</h3>
                        <span className="text-[10px] text-slate-400 font-medium">Desde: {client.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(client)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            deleteClient(client.id);
                            addToast({ type: 'info', title: 'Cliente Removido' });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-brand-600" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{client.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-indigo-600" />
                        Atendimentos:
                      </span>
                      <span className="font-extrabold text-slate-800">{completedCount} concluídos</span>
                    </div>

                    <div className="flex gap-2">
                      {client.phone && (
                        <a
                          href={generateWhatsAppLink({
                            phone: client.phone,
                            clientName: client.name,
                            serviceName: 'Atendimento',
                            date: new Date().toISOString().split('T')[0],
                            startTime: '09:00',
                            companyName: company.name,
                            type: 'WELCOME',
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setIsHistoryModalOpen(true);
                        }}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-bold text-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <History className="w-3.5 h-3.5 text-brand-600" />
                        <span>Histórico</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Cadastrar Novo Cliente"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mariana Silva"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cadastro do Cliente"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Observações Internas</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferências, alergias ou notas..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </Modal>

      {/* HISTORY MODAL */}
      {selectedClient && (
        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          title={`Histórico: ${selectedClient.name}`}
        >
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {(() => {
              const clientApts = appointments.filter((a) => a.clientId === selectedClient.id);
              if (clientApts.length === 0) {
                return <p className="text-xs text-slate-500 text-center py-6">Nenhum atendimento registrado para este cliente.</p>;
              }

              return clientApts.map((apt) => {
                const srv = services.find((s) => s.id === apt.serviceId);
                const stf = staff.find((s) => s.id === apt.staffId);
                return (
                  <div key={apt.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-brand-600">{apt.date} às {apt.startTime}</span>
                      <Badge status={apt.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{srv?.name || 'Serviço'}</span>
                      <span className="text-emerald-600">R$ {apt.price.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Profissional: {stf?.name || 'Equipe'}</p>
                  </div>
                );
              });
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
}
