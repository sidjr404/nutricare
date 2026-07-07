'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Calendar, Target, Activity, ArrowRight, Clock, User, Apple, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function ClienteDashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  console.log("🔍 Status da Sessão:", session ? "Logado" : "Não logado");
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState<any>(null);
  const [proximaConsulta, setProximaConsulta] = useState<any>(null);

  useEffect(() => {
    async function loadDadosPaciente() {
      // 🚨 LOG 1: Saber se a função chegou a ser executada
      console.log("🚀 1. A função loadDadosPaciente iniciou!");

      const { data: { user }, error: erroAuth } = await supabase.auth.getUser();
      
      // 🚨 LOG 2: Saber se o Supabase local encontrou alguma sessão ativa
      console.log("👤 2. Usuário logado encontrado:", user);
      if (erroAuth) console.log("❌ Erro na busca do usuário:", erroAuth);

      if (!user) {
        console.log("⚠️ 3. Parando a execução: Nenhum usuário está logado no localhost.");
        setLoading(false);
        return;
      }

      // Se passar daqui, significa que há um usuário logado
      const { data: dadosPaciente, error: erroBanco } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', user.id)
        .single(); 

      console.log("🆔 4. ID do Usuário:", user.id);
      console.log("📊 5. Dados da tabela 'pacientes':", dadosPaciente);
      if (erroBanco) console.log("❌ 6. Erro do Banco (RLS ou Tabela):", erroBanco);

      setPaciente(dadosPaciente);

      // Busca a consulta futura mais próxima
      const hoje = new Date().toISOString();
      const { data: consultaData } = await supabase
        .from('consultas')
        .select('*')
        .eq('paciente_id', user.id)
        .gte('data_hora', hoje)
        .order('data_hora', { ascending: true })
        .limit(1)
        .single();

      setProximaConsulta(consultaData || null);
      setLoading(false);
    }

    loadDadosPaciente();
  }, [supabase]);

  // Funções para formatar as datas para o visual do card
  const formatarData = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  };
  
  const formatarHora = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="font-medium">Carregando seu painel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-3xl p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Olá, {paciente?.nome ? paciente.nome.split(' ')[0] : 'Paciente'}! 👋
          </h1>
          <p className="text-purple-100 text-sm">
            Bem-vindo(a) ao seu painel NutriGestão. Aqui está o resumo do seu acompanhamento.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Principal (Esquerda - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Próxima Consulta */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Calendar size={100} />
            </div>
            
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Calendar size={20} className="text-purple-500" /> Próxima Consulta
            </h2>

            {proximaConsulta ? (
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="bg-purple-50 rounded-2xl p-4 text-center min-w-[120px] border border-purple-100">
                  <p className="text-purple-600 font-bold text-2xl">
                    {new Date(proximaConsulta.data_hora).getDate()}
                  </p>
                  <p className="text-sm font-medium text-purple-800 uppercase tracking-wider">
                    {new Date(proximaConsulta.data_hora).toLocaleDateString('pt-BR', { month: 'short' })}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 capitalize mb-1">{formatarData(proximaConsulta.data_hora)}</h3>
                  <p className="text-slate-500 flex items-center gap-2 mb-3">
                    <Clock size={16} /> às {formatarHora(proximaConsulta.data_hora)}
                  </p>
                  <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    {proximaConsulta.tipo}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 mb-4">Você não possui consultas agendadas no momento.</p>
                <Link href="/cliente/chat" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                  Falar com a nutricionista <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Grid Inferior: Biometria e Objetivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card: Meu Corpo */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Activity size={16} className="text-blue-500" /> Meu Corpo
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Peso Atual</p>
                  <p className="text-xl font-bold text-slate-900">{paciente?.peso_atual || '--'} <span className="text-sm font-medium text-slate-500">kg</span></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Altura</p>
                  <p className="text-xl font-bold text-slate-900">{paciente?.altura || '--'} <span className="text-sm font-medium text-slate-500">cm</span></p>
                </div>
                <div className="col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                  <p className="text-sm text-blue-700 font-medium">Índice IMC</p>
                  <p className="text-xl font-bold text-blue-900">{paciente?.imc || '--'}</p>
                </div>
              </div>
            </div>

            {/* Card: Meu Objetivo */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Target size={16} className="text-orange-500" /> Meu Objetivo
              </h2>
              <div className="flex flex-col h-[calc(100%-2rem)] justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-800 mb-2">
                    {paciente?.objetivo || 'Objetivo não definido'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Biotipo: <span className="font-semibold text-slate-700">{paciente?.biotipo || 'Não avaliado'}</span>
                  </p>
                </div>
                <Link href="/cliente/perfil" className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl transition-colors border border-slate-200 flex items-center justify-center">
                  Atualizar Dados Físicos
                </Link>
              </div>
            </div>
            
          </div>
        </div>

        {/* Coluna Lateral (Direita - 1/3) */}
        <div className="space-y-6">
          
          {/* Acesso Rápido */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Acesso Rápido</h2>
            <div className="space-y-3">
              
              <Link href="/cliente/cardapio" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Apple size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Meu Cardápio</p>
                    <p className="text-xs text-slate-500">Dieta da semana</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
              </Link>

              <Link href="/cliente/chat" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Falar no Chat</p>
                    <p className="text-xs text-slate-500">Dúvidas rápidas</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
              </Link>

            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}