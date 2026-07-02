'use client';
import { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui entra a lógica do supabase.auth.signInWithPassword()
    console.log("Tentando logar:", email);
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
          >
            <LogIn size={18} /> Entrar
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