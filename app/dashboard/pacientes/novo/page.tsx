'use client';
import { useState } from 'react';
import { ArrowLeft, User, Mail, KeyRound, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NovoPacientePage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Chama a nossa rota de API criada no Passo 4
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar novo paciente.');
      }

      setSuccess(true);
      // Aguarda 2 segundos e joga o admin de volta para a lista de pacientes
      setTimeout(() => {
        router.push('/dashboard/pacientes');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/pacientes" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Cadastrar Novo Paciente</h1>
          <p className="text-slate-500 text-sm">Crie as credenciais de acesso para um novo cliente</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        
        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Save size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Paciente cadastrado com sucesso!</h2>
            <p className="text-slate-500">O banco de dados foi atualizado. Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                Ocorreu um erro: {error}
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <User size={16} className="text-purple-500" /> Nome Completo
              </label>
              <input 
                type="text" 
                required
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all" 
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Mail size={16} className="text-purple-500" /> E-mail de Acesso
              </label>
              <input 
                type="email" 
                required
                placeholder="cliente@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all" 
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <KeyRound size={16} className="text-purple-500" /> Senha Temporária
              </label>
              <input 
                type="text" 
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all" 
              />
              <p className="text-xs text-slate-400 mt-2">O paciente usará esta senha no primeiro login e poderá alterá-la nas configurações do perfil.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link href="/dashboard/pacientes" className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-70 min-w-[200px]"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {loading ? 'Criando Conta...' : 'Cadastrar Paciente'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}