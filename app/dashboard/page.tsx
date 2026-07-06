'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, Calendar, DollarSign, AlertCircle } from 'lucide-react';

export default function DashboardAdmin() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalPacientes: 0,
    consultasHoje: 0,
    receitaMes: 0,
    pendencias: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadDashboardData() {
    // Defina a variável aqui dentro
    const hoje = new Date().toISOString().split('T')[0];

    const { data: pacientes } = await supabase.from('pacientes').select('id');
    const { data: consultas } = await supabase.from('consultas').select('id')
      .gte('data_hora', `${hoje}T00:00:00`)
      .lte('data_hora', `${hoje}T23:59:59`);
    
    const { data: pendencias } = await supabase.from('pagamentos').select('id')
      .eq('status', 'Pendente');

    setStats({
      totalPacientes: pacientes ? pacientes.length : 0,
      consultasHoje: consultas ? consultas.length : 0,
      receitaMes: 0,
      pendencias: pendencias ? pendencias.length : 0
    });
    setLoading(false);
  }

  loadDashboardData();
}, [supabase]);

  if (loading) return <div className="p-8 text-center">Carregando dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Pacientes" value={stats.totalPacientes} icon={Users} color="text-blue-600" />
        <DashboardCard title="Consultas Hoje" value={stats.consultasHoje} icon={Calendar} color="text-purple-600" />
        <DashboardCard title="Receita (Mensal)" value={`R$ ${stats.receitaMes}`} icon={DollarSign} color="text-green-600" />
        <DashboardCard title="Pendências" value={stats.pendencias} icon={AlertCircle} color="text-red-600" />
      </div>

      {/* Aqui você pode adicionar uma tabela com os últimos pacientes ou consultas */}
    </div>
  );
}

function DashboardCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}