'use client';
import { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Inicializa a conexão com o seu banco de dados Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        // --- AQUI ESTÁ A MÁGICA DO REDIRECIONAMENTO! ---
        // Se o email digitado for o do administrador, vai para o dashboard
        if (email.toLowerCase() === 'admin@nutri.com') {
          window.location.href = '/dashboard';
        } 
        // Se for qualquer outro (incluindo o cliente@email.com), vai para a área do paciente
        else {
          window.location.href = '/cliente';
        }
        // -----------------------------------------------
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

        <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
          <p className="font-semibold text-purple-700 mb-1">Credenciais de teste:</p>
          <p className="mb-2"><strong>Administrador:</strong><br/>Email: admin@nutri.com<br/>Senha: admin123</p>
          <p><strong>Cliente:</strong><br/>Email: cliente@email.com<br/>Senha: cliente123</p>
        </div>
      </div>
    </div>
  );
}