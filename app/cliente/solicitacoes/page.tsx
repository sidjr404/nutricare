'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { HeartPulse, AlertCircle, Ban, Save, Loader2, CheckCircle, Info } from 'lucide-react';

export default function ClientePreferenciasPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    restricoes: 'Nenhuma',
    alergias: '',
    aversoes: ''
  });

  useEffect(() => {
    async function carregarPreferencias() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Busca as preferências alimentares na tabela
        const { data: preferencias } = await supabase
          .from('preferencias_alimentares')
          .select('*')
          .eq('paciente_id', user.id)
          .single();

        if (preferencias) {
          setFormData({
            restricoes: preferencias.restricoes || 'Nenhuma',
            alergias: preferencias.alergias || '',
            aversoes: preferencias.aversoes || ''
          });
        }
      }
      setLoading(false);
    }

    carregarPreferencias();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setMensagemSucesso(false);

    // Como o gatilho já cria a linha na tabela, fazemos um UPDATE. 
    // Caso a linha não exista (pacientes antigos), usamos upsert ou checagem.
    const { data: existe } = await supabase
      .from('preferencias_alimentares')
      .select('id')
      .eq('paciente_id', userId)
      .single();

    let error;

    if (existe) {
      const { error: updateError } = await supabase
        .from('preferencias_alimentares')
        .update({
          restricoes: formData.restricoes,
          alergias: formData.alergias,
          aversoes: formData.aversoes
        })
        .eq('paciente_id', userId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('preferencias_alimentares')
        .insert({
          paciente_id: userId,
          restricoes: formData.restricoes,
          alergias: formData.alergias,
          aversoes: formData.aversoes
        });
      error = insertError;
    }

    setSaving(false);

    if (!error) {
      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 3000);
    } else {
      alert('Erro ao salvar suas preferências. Tente novamente.');
      console.error(error);
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
          Conte para a nutricionista o que você gosta de comer, suas restrições e alergias para montarmos o cardápio perfeito.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start">
        <Info size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Importante</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            As informações abaixo serão usadas para gerar o seu plano alimentar. Seja o mais detalhista possível nas suas aversões (alimentos que você não come de jeito nenhum) e alergias.
          </p>
        </div>
      </div>

      <form onSubmit={handleSalvar} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        <div className="p-8 space-y-8">
          
          {/* Seção 1: Restrições / Estilo de Vida */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <HeartPulse size={18} className="text-purple-500" /> Estilo de Dieta / Restrições Médicas
            </label>
            <select 
              name="restricoes"
              value={formData.restricoes}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all cursor-pointer"
            >
              <option value="Nenhuma">Nenhuma restrição específica</option>
              <option value="Vegetariano">Vegetariano</option>
              <option value="Vegano">Vegano</option>
              <option value="Intolerante à Lactose">Intolerante à Lactose</option>
              <option value="Celíaco (Zero Glúten)">Celíaco (Zero Glúten)</option>
              <option value="Diabético">Diabético</option>
              <option value="Low Carb">Low Carb</option>
            </select>
          </div>

          {/* Seção 2: Alergias Severas */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" /> Alergias ou Intolerâncias (Risco à saúde)
            </label>
            <textarea 
              name="alergias"
              rows={3}
              value={formData.alergias}
              onChange={handleChange}
              placeholder="Ex: Alergia severa a amendoim, camarão, corante amarelo..."
              className="w-full p-4 bg-red-50/30 border border-red-100 rounded-xl text-slate-700 focus:ring-2 focus:ring-red-400 outline-none transition-all resize-none placeholder-slate-400"
            />
            <p className="text-xs text-slate-400 mt-2">Deixe em branco se você não possui nenhuma alergia confirmada.</p>
          </div>

          {/* Seção 3: Aversões (O que não desce de jeito nenhum) */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Ban size={18} className="text-orange-500" /> Aversões e Gostos (O que você não come)
            </label>
            <textarea 
              name="aversoes"
              rows={4}
              value={formData.aversoes}
              onChange={handleChange}
              placeholder="Ex: Odeio cebola, não suporto fígado, prefiro evitar pimentão..."
              className="w-full p-4 bg-orange-50/30 border border-orange-100 rounded-xl text-slate-700 focus:ring-2 focus:ring-orange-400 outline-none transition-all resize-none placeholder-slate-400"
            />
          </div>

        </div>

        {/* Rodapé e Botão Salvar */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
          {mensagemSucesso && (
            <span className="text-green-600 text-sm font-bold flex items-center gap-1 animate-pulse">
              <CheckCircle size={18} /> Preferências atualizadas!
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