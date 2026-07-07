'use client';
import { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
// 🚨 CORREÇÃO: Usando o mesmo cliente Supabase do restante do app!
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Inicializa a conexão com o banco usando a configuração do seu Next.js
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError('Credenciais inválidas. Verifique seu email e senha.');
        setLoading(false);
      } else {
        // Redirecionamento
        if (email.toLowerCase() === 'admin@nutri.com') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/cliente';
        }
      }
    } catch (err) {
      setError('Erro interno de conexão.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl shadow-md mb-4"></div>
          <h1 className="text-2xl font-bold text-slate-900">Nutri Care</h1>
          <p className="text-sm text-slate-500">Plataforma de Gestão Nutricional</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              required
              value={email}
              className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={password}
              className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}