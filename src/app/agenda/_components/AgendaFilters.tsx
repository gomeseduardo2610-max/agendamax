import React from 'react';
import { Staff, Service, Client } from '@/lib/types';
import { AgendaFilterState } from '@/lib/agenda-utils';
import { Search, Filter, X, RefreshCw } from 'lucide-react';

interface AgendaFiltersProps {
  filters: AgendaFilterState;
  setFilters: React.Dispatch<React.SetStateAction<AgendaFilterState>>;
  staffList: Staff[];
  services: Service[];
  clients: Client[];
}

export const AgendaFilters: React.FC<AgendaFiltersProps> = ({
  filters,
  setFilters,
  staffList,
  services,
  clients,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const hasActiveFilters =
    filters.staffId !== 'ALL' ||
    filters.serviceId !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.clientId !== 'ALL' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.searchQuery !== '';

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      staffId: 'ALL',
      serviceId: 'ALL',
      status: 'ALL',
      clientId: 'ALL',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="agenda-search-input"
            type="text"
            placeholder="Pesquisar por cliente, telefone, serviço, profissional... (Ctrl+F)"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl pl-10 pr-9 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Staff Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filters.staffId}
            onChange={(e) => setFilters((prev) => ({ ...prev, staffId: e.target.value }))}
            className="bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition-all w-full md:w-48"
          >
            <option value="ALL">Todos os Profissionais</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Quick Status Select */}
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition-all w-full md:w-40"
          >
            <option value="ALL">Todos Status</option>
            <option value="SCHEDULED">Agendado</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="COMPLETED">Concluído</option>
            <option value="CANCELLED">Cancelado</option>
          </select>

          {/* Advanced toggle button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              showAdvanced || hasActiveFilters
                ? 'bg-brand-50 border-brand-200 text-brand-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-600 inline-block"></span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Collapse */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 animate-fadeIn">
          {/* Service Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Serviço</label>
            <select
              value={filters.serviceId}
              onChange={(e) => setFilters((prev) => ({ ...prev, serviceId: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="ALL">Todos os Serviços</option>
              {services.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.name} (R$ {srv.price})
                </option>
              ))}
            </select>
          </div>

          {/* Client Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Cliente</label>
            <select
              value={filters.clientId}
              onChange={(e) => setFilters((prev) => ({ ...prev, clientId: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="ALL">Todos os Clientes</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">
              Preço Mínimo (R$)
            </label>
            <input
              type="number"
              placeholder="Ex: 50"
              value={filters.minPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">
              Preço Máximo (R$)
            </label>
            <input
              type="number"
              placeholder="Ex: 300"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
            />
          </div>

          {hasActiveFilters && (
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={handleReset}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
