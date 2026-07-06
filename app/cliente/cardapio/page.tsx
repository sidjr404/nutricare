'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Clock, Coffee, Sun, Moon, Apple, Utensils, Info, Loader2, Download } from 'lucide-react';

export default function ClienteCardapioPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [refeicoes, setRefeicoes] = useState<any[]>([]);
  const [pacienteNome, setPacienteNome] = useState('');

  useEffect(() => {
    async function carregarCardapio() {
      // 1. Descobre quem é o paciente logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // 2. Busca o nome do paciente (para o cabeçalho)
      const { data: paciente } = await supabase
        .from('pacientes')
        .select('nome')
        .eq('id', user.id)
        .single();
        
      if (paciente) setPacienteNome(paciente.nome);

      // 3. Busca a dieta dele ordenada pelo horário (do mais cedo para o mais tarde)
      const { data: dietaDados } = await supabase
        .from('dietas')
        .select('*')
        .eq('paciente_id', user.id)
        .order('horario', { ascending: true });

      setRefeicoes(dietaDados || []);
      setLoading(false);
    }

    carregarCardapio();
  }, [supabase]);

  // Função para formatar o horário (ex: "08:00:00" para "08:00")
  const formatarHorario = (horarioStr: string) => {
    if (!horarioStr) return '--:--';
    return horarioStr.substring(0, 5); 
  };

  // Função inteligente que escolhe a cor e o ícone baseado no nome da refeição
  const getEstiloRefeicao = (titulo: string) => {
    const nome = titulo.toLowerCase();
    if (nome.includes('café') || nome.includes('manhã')) {
      return { icon: Coffee, corTexto: 'text-amber-700', corBg: 'bg-amber-100', corBorda: 'border-amber-200' };
    }
    if (nome.includes('almoço')) {
      return { icon: Sun, corTexto: 'text-orange-700', corBg: 'bg-orange-100', corBorda: 'border-orange-200' };
    }
    if (nome.includes('lanche')) {
      return { icon: Apple, corTexto: 'text-green-700', corBg: 'bg-green-100', corBorda: 'border-green-200' };
    }
    if (nome.includes('jantar') || nome.includes('ceia')) {
      return { icon: Moon, corTexto: 'text-indigo-700', corBg: 'bg-indigo-100', corBorda: 'border-indigo-200' };
    }
    // Padrão
    return { icon: Utensils, corTexto: 'text-purple-700', corBg: 'bg-purple-100', corBorda: 'border-purple-200' };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 gap-3">
        <Loader2 size={40} className="animate-spin text-purple-500" />
        <p className="font-medium">Preparando seu cardápio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      
      {/* Header do Cardápio */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Detalhe visual de fundo */}
        <div className="absolute -top-10 -right-10 text-purple-50 opacity-50 pointer-events-none">
          <Utensils size={200} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Meu Cardápio</h1>
          <p className="text-slate-500">
            Plano alimentar atualizado para <span className="font-bold text-purple-600">{pacienteNome.split(' ')[0]}</span>.
          </p>
        </div>

        <button className="relative z-10 bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors border border-slate-200">
          <Download size={18} /> Baixar PDF
        </button>
      </div>

      {/* Aviso Importante */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start">
        <Info size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Dica da Nutri</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            Lembre-se de beber pelo menos 2,5L de água por dia. As opções de substituição estão listadas abaixo de cada refeição. Tente manter os horários para um melhor resultado!
          </p>
        </div>
      </div>

      {/* Lista de Refeições */}
      {refeicoes.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Utensils size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Nenhum cardápio encontrado</h2>
          <p className="text-slate-500">Sua nutricionista ainda não cadastrou sua dieta no sistema. Tente novamente mais tarde.</p>
        </div>
      ) : (
        <div className="space-y-6 relative">
          
          {/* Linha do tempo visual (opcional, fica bonito no canto) */}
          <div className="hidden md:block absolute left-8 top-8 bottom-8 w-0.5 bg-slate-100 z-0"></div>

          {refeicoes.map((refeicao, index) => {
            const estilo = getEstiloRefeicao(refeicao.titulo);
            const Icone = estilo.icon;

            return (
              <div key={index} className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 group">
                
                {/* Bloco de Horário */}
                <div className="md:w-32 flex-shrink-0 flex items-center md:items-start md:justify-end md:pt-6 gap-2">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-slate-600 font-bold text-sm">
                    <Clock size={16} className="text-slate-400" />
                    {formatarHorario(refeicao.horario)}
                  </div>
                </div>

                {/* Card da Refeição */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  
                  {/* Título da Refeição */}
                  <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3 ${estilo.corBg} bg-opacity-30`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${estilo.corBg} ${estilo.corTexto} border ${estilo.corBorda}`}>
                      <Icone size={20} />
                    </div>
                    <h2 className={`text-lg font-bold ${estilo.corTexto}`}>
                      {refeicao.titulo}
                    </h2>
                  </div>

                  {/* Alimentos (Descrição) */}
                  <div className="p-6">
                    <div className="prose prose-sm text-slate-600 whitespace-pre-wrap max-w-none">
                      {/* O whitespace-pre-wrap faz com que as quebras de linha que você digitou no banco sejam respeitadas */}
                      {refeicao.descricao}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}