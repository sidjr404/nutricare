'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, Calendar, DollarSign, AlertCircle, Clock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardAdminPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  
  // Estados para armazenar os dados do banco
  const [stats, setStats] = useState({
    pacientes: 0,
    consultasHoje: 0,
    pendencias: 0,
    receitaMes: 0
  });
  const [proximasConsultas, setProximasConsultas] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      // Data de hoje (local do navegador) no formato YYYY-MM-DD
      const hoje = new Date();
      const hojeString = hoje.toISOString().split('T')[0];
      
      // Primeiro e último dia do mês atual (para a receita)
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];

      // 1. Total de Pacientes
      const { data: pacientes } = await supabase.from('pacientes').select('id');

      // 2. Consultas de Hoje (Quantidade e Lista)
      const { data: consultasHoje } = await supabase
        .from('consultas')
        .select('id, data_hora, status, tipo, pacientes(nome)')
        .gte('data_hora', `${hojeString}T00:00:00`)
        .lte('data_hora', `${hojeString}T23:59:59`)
        .order('data_hora', { ascending: true });

      // 3. Receita do Mês (Pagamentos com status 'Pago' neste mês)
      const { data: pagamentosMes } = await supabase
        .from('pagamentos')
        .select('valor')
        .eq('status', 'Pago')
        .gte('data_pagamento', primeiroDiaMes)
        .lte('data_pagamento', ultimoDiaMes);
      
      const receitaCalculada = pagamentosMes?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0;

      // 4. Pendências (Pagamentos atrasados/pendentes)
      const { data: pendencias } = await supabase
        .from('pagamentos')
        .select('id')
        .eq('status', 'Pendente');

      // Atualiza os estados
      setStats({
        pacientes: pacientes ? pacientes.length : 0,
        consultasHoje: consultasHoje ? consultasHoje.length : 0,
        receitaMes: receitaCalculada,
        pendencias: pendencias ? pendencias.length : 0
      });
      setProximasConsultas(consultasHoje || []);
      setLoading(false);
    }

    loadDashboardData();
  }, [supabase]);

  // Função para formatar moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Função para extrair apenas a hora (HH:mm)
  const formatarHora = (dataString: string) => {
    return new Date(dataString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Visão Geral</h1>
        <p className="text-slate-500 text-sm">Acompanhe as métricas e a agenda da sua clínica hoje.</p>
      </div>

      {/* Grid de Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Pacientes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Total Pacientes</p>
            <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : stats.pacientes}</h3>
          </div>
        </div>

        {/* Card 2: Consultas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Consultas Hoje</p>
            <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : stats.consultasHoje}</h3>
          </div>
        </div>

        {/* Card 3: Receita */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Receita (Mês)</p>
            <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : formatarMoeda(stats.receitaMes)}</h3>
          </div>
        </div>

        {/* Card 4: Pendências */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Pendências</p>
            <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : stats.pendencias}</h3>
          </div>
        </div>

      </div>

      {/* Seção de Agenda Rápida */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock size={20} className="text-purple-500" /> Próximas Consultas de Hoje
          </h2>
          <Link href="/dashboard/agenda" className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">
            Ver Agenda Completa <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm font-medium">Sincronizando com o banco de dados...</div>
          ) : proximasConsultas.length === 0 ? (
            <div className="p-10 text-center text-slate-500 flex flex-col items-center gap-3">
              <Calendar size={32} className="text-slate-300" />
              <p>Nenhuma consulta agendada para hoje.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {proximasConsultas.map((consulta) => (
                <div key={consulta.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{consulta.pacientes?.nome || 'Paciente não identificado'}</h3>
                      <p className="text-sm text-slate-500">{consulta.tipo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatarHora(consulta.data_hora)}</p>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                        consulta.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                        consulta.status === 'cancelado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {consulta.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}