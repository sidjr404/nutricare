'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle, Apple, AlertCircle, Info } from 'lucide-react';

// Categorias de alimentos para o paciente selecionar
const CATEGORIAS_ALIMENTOS = [
  { 
    titulo: 'Proteínas', 
    itens: ['Frango', 'Carne Bovina', 'Carne Suína', 'Peixes', 'Frutos do Mar', 'Ovos'] 
  },
  { 
    titulo: 'Laticínios', 
    itens: ['Leite de Vaca', 'Queijos', 'Iogurte', 'Manteiga', 'Zero Lactose'] 
  },
  { 
    titulo: 'Carboidratos', 
    itens: ['Arroz Branco', 'Arroz Integral', 'Feijão', 'Macarrão', 'Pão Francês', 'Pão Integral', 'Aveia', 'Batata Doce', 'Tapioca'] 
  },
  { 
    titulo: 'Vegetais e Frutas', 
    itens: ['Salada Crua (Folhas)', 'Legumes Cozidos', 'Frutas Cítricas', 'Frutas Doces (Banana, Maçã)'] 
  }
];

export default function ClientePreferenciasPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Estados do Formulário
  const [alimentosSelecionados, setAlimentosSelecionados] = useState<string[]>([]);
  const [restricoes, setRestricoes] = useState('');

  useEffect(() => {
    async function carregarPreferencias() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        const { data: pref } = await supabase
          .from('preferencias_alimentares')
          .select('*')
          .eq('paciente_id', user.id)
          .single();

        if (pref) {
          // Converte a string salva no banco de volta para um array de botões selecionados
          if (pref.alimentos_selecionados) {
            setAlimentosSelecionados(pref.alimentos_selecionados.split(', '));
          }
          setRestricoes(pref.restricoes_medicas || '');
        }
      }
      setLoading(false);
    }
    carregarPreferencias();
  }, [supabase]);

  // Função que liga/desliga a cor do botão quando clicado
  const toggleAlimento = (item: string) => {
    if (alimentosSelecionados.includes(item)) {
      setAlimentosSelecionados(alimentosSelecionados.filter(a => a !== item));
    } else {
      setAlimentosSelecionados([...alimentosSelecionados, item]);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setMensagemSucesso(false);

    // Junta os botões selecionados numa string só para salvar facilmente no banco
    const dadosParaSalvar = {
      alimentos_selecionados: alimentosSelecionados.join(', '),
      restricoes_medicas: restricoes
    };

    // Verifica se já existe uma linha de preferência para este paciente
    const { data: existe } = await supabase
      .from('preferencias_alimentares')
      .select('id')
      .eq('paciente_id', userId)
      .single();

    let error;

    if (existe) {
      const { error: updateError } = await supabase
        .from('preferencias_alimentares')
        .update(dadosParaSalvar)
        .eq('paciente_id', userId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('preferencias_alimentares')
        .insert({
          paciente_id: userId,
          ...dadosParaSalvar
        });
      error = insertError;
    }

    setSaving(false);

    if (!error) {
      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 3000);
    } else {
      console.error(error);
      alert('Erro ao salvar suas preferências. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-slate-400">
        <Loader2 size={32} className="animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Preferências Alimentares</h1>
        <p className="text-slate-500 text-sm">
          Selecione o que você gosta e tem costume de comer para montarmos o cardápio perfeito.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start">
        <Info size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Como preencher</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            Basta clicar nos alimentos que você consome no seu dia a dia. O que ficar desmarcado, a nutricionista tentará evitar no seu plano alimentar.
          </p>
        </div>
      </div>

      <form onSubmit={handleSalvar} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        <div className="p-8 space-y-8">
          
          {/* Seção 1: Seleção de Alimentos (Tags) */}
          <div className="space-y-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Apple size={20} className="text-green-500" /> Meus Hábitos
            </h2>
            
            <div className="space-y-6">
              {CATEGORIAS_ALIMENTOS.map((categoria) => (
                <div key={categoria.titulo}>
                  <p className="text-sm font-bold text-slate-600 mb-3">{categoria.titulo}</p>
                  <div className="flex flex-wrap gap-3">
                    {categoria.itens.map((item) => {
                      const selecionado = alimentosSelecionados.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleAlimento(item)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                            selecionado 
                              ? 'bg-purple-100 border-purple-300 text-purple-700 shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 2: Restrições Médicas */}
          <div className="pt-6">
            <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" /> Restrições Médicas ou Alergias Severas
            </label>
            <textarea 
              rows={3}
              value={restricoes}
              onChange={(e) => setRestricoes(e.target.value)}
              placeholder="Ex: Alergia a amendoim, Doença Celíaca (Zero Glúten), Diabetes..."
              className="w-full p-4 bg-red-50/30 border border-red-100 rounded-xl text-slate-700 focus:ring-2 focus:ring-red-400 outline-none transition-all resize-none placeholder-slate-400"
            />
          </div>

        </div>

        {/* Rodapé e Botão Salvar */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
          {mensagemSucesso && (
            <span className="text-green-600 text-sm font-bold flex items-center gap-1 animate-pulse">
              <CheckCircle size={18} /> Preferências salvas!
            </span>
          )}
          <button 
            type="submit" 
            disabled={saving}
            className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Salvando...' : 'Salvar Preferências'}
          </button>
        </div>

      </form>
    </div>
  );
}