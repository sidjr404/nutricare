'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Mail, Phone, Calendar as CalendarIcon, Activity, Target, Save, Loader2, CheckCircle, Lock, AlertCircle } from 'lucide-react';

export default function ClientePerfilPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Estados do Formulário de Perfil
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [msgPerfil, setMsgPerfil] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    peso_atual: '',
    altura: '',
    objetivo: '',
    biotipo: ''
  });

  // Estados do Formulário de Senha
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [savingSenha, setSavingSenha] = useState(false);
  const [msgSenha, setMsgSenha] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    async function carregarPerfil() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        const { data: paciente } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id', user.id)
          .single();

        if (paciente) {
          setFormData({
            nome: paciente.nome || '',
            email: paciente.email || user.email || '',
            telefone: paciente.telefone || '',
            data_nascimento: paciente.data_nascimento || '',
            peso_atual: paciente.peso_atual?.toString() || '',
            altura: paciente.altura?.toString() || '',
            objetivo: paciente.objetivo || '',
            biotipo: paciente.biotipo || ''
          });
        }
      }
      setLoading(false);
    }
    carregarPerfil();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calcularIMC = (pesoStr: string, alturaStr: string) => {
    const peso = parseFloat(pesoStr);
    const alturaCm = parseFloat(alturaStr);
    if (peso > 0 && alturaCm > 0) {
      const alturaM = alturaCm / 100;
      return (peso / (alturaM * alturaM)).toFixed(1);
    }
    return null;
  };

  // --- LÓGICA DE SALVAR PERFIL ---
  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSavingPerfil(true);
    setMsgPerfil(false);

    const dadosParaSalvar = {
      telefone: formData.telefone,
      data_nascimento: formData.data_nascimento || null,
      peso_atual: formData.peso_atual ? parseFloat(formData.peso_atual) : null,
      altura: formData.altura ? parseFloat(formData.altura) : null,
      
      // CORREÇÃO: Se o formulário enviar "", transformamos em null para o banco aceitar
      objetivo: formData.objetivo || null,
      biotipo: formData.biotipo || null
    };

    console.log("Enviando estes dados para o banco:", dadosParaSalvar);

    const { error } = await supabase
      .from('pacientes')
      .update(dadosParaSalvar)
      .eq('id', userId);

    setSavingPerfil(false);

    if (!error) {
      setMsgPerfil(true);
      setTimeout(() => setMsgPerfil(false), 3000);
    } else {
      console.error("Erro ao salvar:", error);
      alert('Erro ao atualizar o perfil. Olhe o console.');
    }
  };

  // --- LÓGICA DE ALTERAR SENHA ---
  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSenha({ tipo: '', texto: '' });

    if (novaSenha !== confirmarSenha) {
      setMsgSenha({ tipo: 'erro', texto: 'As senhas não coincidem.' });
      return;
    }

    if (novaSenha.length < 6) {
      setMsgSenha({ tipo: 'erro', texto: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setSavingSenha(true);

    // O Supabase entende que deve atualizar a senha do usuário atualmente logado
    const { error } = await supabase.auth.updateUser({
      password: novaSenha
    });

    setSavingSenha(false);

    if (error) {
      setMsgSenha({ tipo: 'erro', texto: 'Erro ao alterar a senha. Tente novamente.' });
      console.error(error);
    } else {
      setMsgSenha({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
      setNovaSenha('');
      setConfirmarSenha('');
      setTimeout(() => setMsgSenha({ tipo: '', texto: '' }), 4000);
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
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-100 to-purple-200 text-purple-700 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm border border-purple-100">
          {formData.nome.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Meu Perfil</h1>
          <p className="text-slate-500 text-sm">Gerencie suas informações pessoais, biometria e segurança.</p>
        </div>
      </div>

      {/* FORMULÁRIO 1: DADOS E BIOMETRIA */}
      <form onSubmit={handleSalvarPerfil} className="space-y-6">
        
        {/* Dados Pessoais */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <User size={18} className="text-purple-500" />
            <h2 className="font-bold text-slate-800">Dados Pessoais</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
              <input 
                type="text" name="nome" value={formData.nome} disabled 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" name="email" value={formData.email} disabled 
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="text" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000"
                  className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Data de Nascimento</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Biometria e Objetivos */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Activity size={18} className="text-blue-500" />
            <h2 className="font-bold text-slate-800">Corpo e Objetivos</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Peso (kg)</label>
                <input 
                  type="number" step="0.1" name="peso_atual" value={formData.peso_atual} onChange={handleChange} placeholder="Ex: 70.5"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Altura (cm)</label>
                <input 
                  type="number" name="altura" value={formData.altura} onChange={handleChange} placeholder="Ex: 175"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Target size={16} className="text-orange-500"/> Objetivo Principal
              </label>
              <select 
                name="objetivo" value={formData.objetivo} onChange={handleChange}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
              >
                <option value="">Selecione...</option>
                <option value="Emagrecimento">Emagrecimento</option>
                <option value="Hipertrofia">Ganho de Massa (Hipertrofia)</option>
                <option value="Manutenção">Manutenção de Peso</option>
                <option value="Reeducação Alimentar">Reeducação Alimentar</option>
              </select>
            </div>
          </div>
          <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50">
            {msgPerfil && (
              <span className="text-green-600 text-sm font-bold flex items-center gap-1 animate-pulse">
                <CheckCircle size={18} /> Perfil atualizado!
              </span>
            )}
            <button 
              type="submit" disabled={savingPerfil}
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-sm disabled:opacity-50"
            >
              {savingPerfil ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Salvar Perfil
            </button>
          </div>
        </div>
      </form>

      {/* FORMULÁRIO 2: SEGURANÇA E SENHA */}
      <form onSubmit={handleAlterarSenha} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-100 bg-red-50/30 flex items-center gap-2">
          <Lock size={18} className="text-red-500" />
          <h2 className="font-bold text-slate-800">Segurança e Acesso</h2>
        </div>
        <div className="p-6">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nova Senha</label>
              <input 
                type="password" 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="No mínimo 6 caracteres"
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirmar Nova Senha</label>
              <input 
                type="password" 
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            {msgSenha.tipo === 'erro' && (
              <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                <AlertCircle size={18} /> {msgSenha.texto}
              </span>
            )}
            {msgSenha.tipo === 'sucesso' && (
              <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                <CheckCircle size={18} /> {msgSenha.texto}
              </span>
            )}
          </div>
          <button 
            type="submit" 
            disabled={savingSenha || !novaSenha || !confirmarSenha}
            className="bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 shadow-sm disabled:opacity-50 transition-colors"
          >
            {savingSenha ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            Atualizar Senha
          </button>
        </div>
      </form>

    </div>
  );
}