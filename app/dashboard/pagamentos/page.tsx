'use client';
import { useState } from 'react';
import { Plus, Search, DollarSign, TrendingUp, Check, Clock, X } from 'lucide-react';

export default function PagamentosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Dados fictícios baseados exatamente na sua imagem
  const pagamentos = [
    {
      id: 1,
      paciente: 'Maria Silva',
      metodo: 'Pix',
      plano: 'Plano Mensal',
      valor: 'R$ 250.00',
      vencimento: '19/04/2026',
      status: 'Pago',
      acao: 'Pago em 17/04/2026'
    },
    {
      id: 2,
      paciente: 'Ana Costa',
      metodo: 'Cartão de Crédito',
      plano: 'Plano Trimestral',
      valor: 'R$ 450.00',
      vencimento: '14/04/2026',
      status: 'Pago',
      acao: 'Pago em 13/04/2026'
    },
    {
      id: 3,
      paciente: 'Beatriz Lima',
      metodo: '',
      plano: 'Plano Mensal',
      valor: 'R$ 250.00',
      vencimento: '24/04/2026',
      status: 'Pendente',
      acao: 'Marcar como Pago'
    },
    {
      id: 4,
      paciente: 'Carla Santos',
      metodo: '',
      plano: 'Plano Mensal',
      valor: 'R$ 250.00',
      vencimento: '09/04/2026',
      status: 'Vencido',
      acao: 'Marcar como Pago'
    },
    {
      id: 5,
      paciente: 'Diana Souza',
      metodo: '',
      plano: 'Plano Semestral',
      valor: 'R$ 800.00',
      vencimento: '29/04/2026',
      status: 'Pendente',
      acao: 'Marcar como Pago'
    }
  ];

  // Filtros dinâmicos (Pesquisa + Botões de Estado)
  const filteredPagamentos = pagamentos.filter(pagamento => {
    const matchesSearch = pagamento.paciente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'Todos' || pagamento.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filtros = ['Todos', 'Pago', 'Pendente', 'Vencido'];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Pagamentos</h1>
          <p className="text-slate-500 text-sm">Gerencie cobranças e recebimentos</p>
        </div>
        <button className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
          <Plus size={18} /> Nova Cobrança
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              <DollarSign size={20} />
            </div>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">R$ 2000.00</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Total do Mês</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white">
              <Check size={20} strokeWidth={3} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">R$ 700.00</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Recebido</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center text-white">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">R$ 1050.00</p>
          <p className="text-xs text-slate-500 font-medium mt-1">A Receber</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white">
              <X size={20} strokeWidth={3} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">1</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Vencidos</p>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm text-slate-700"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {filtros.map(filtro => (
            <button
              key={filtro}
              onClick={() => setActiveFilter(filtro)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filtro
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Pagamentos */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-medium">Paciente</th>
                <th className="p-4 font-medium">Plano</th>
                <th className="p-4 font-medium">Valor</th>
                <th className="p-4 font-medium">Vencimento</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredPagamentos.map((pagamento) => (
                <tr key={pagamento.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{pagamento.paciente}</p>
                    {pagamento.metodo && <p className="text-xs text-slate-400">{pagamento.metodo}</p>}
                  </td>
                  <td className="p-4 text-slate-500">{pagamento.plano}</td>
                  <td className="p-4 font-bold text-slate-800">{pagamento.valor}</td>
                  <td className="p-4 text-slate-500">{pagamento.vencimento}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                      pagamento.status === 'Pago' ? 'bg-green-100 text-green-700' :
                      pagamento.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {pagamento.status === 'Pago' && <Check size={14} className="mr-1" />}
                      {pagamento.status === 'Pendente' && <Clock size={14} className="mr-1" />}
                      {pagamento.status === 'Vencido' && <X size={14} className="mr-1" />}
                      {pagamento.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {pagamento.status === 'Pago' ? (
                      <span className="text-xs text-slate-400">{pagamento.acao}</span>
                    ) : (
                      <button className="bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors">
                        {pagamento.acao}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPagamentos.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              Nenhum pagamento encontrado com os filtros atuais.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}