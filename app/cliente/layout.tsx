'use client';
import { LayoutDashboard, User, Calendar, History, BookOpen, Apple, FileText, Utensils, MessageSquare, CreditCard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Início', href: '/cliente' },
    { icon: User, label: 'Perfil', href: '/cliente/perfil' },
    { icon: Calendar, label: 'Consultas', href: '/cliente/consultas' },
    { icon: History, label: 'Histórico de Consultas', href: '/cliente/historico' },
    { icon: BookOpen, label: 'Registro Diário', href: '/cliente/registro' },
    { icon: Apple, label: 'Preferências Alimentares', href: '/cliente/preferencias' },
    { icon: FileText, label: 'Documentos Médicos', href: '/cliente/documentos' },
    { icon: Utensils, label: 'Cardápio', href: '/cliente/cardapio' },
    { icon: MessageSquare, label: 'Chat', href: '/cliente/chat' },
    { icon: CreditCard, label: 'Pagamentos', href: '/cliente/pagamentos' },
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar do Cliente */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header da Clínica */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-500 to-orange-400 p-1 flex items-center justify-center shadow-sm">
              <div className="bg-white w-full h-full rounded-full flex items-center justify-center text-xs font-bold text-fuchsia-600">N</div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 leading-tight">NutriGestão</h2>
              <p className="text-xs text-slate-500">Cliente</p>
            </div>
          </div>
          
          {/* Perfil do Paciente Logado */}
          <div className="p-4 flex items-center gap-3 border-b border-slate-100 mb-2">
            <div className="w-10 h-10 rounded-full border-2 border-fuchsia-100 flex items-center justify-center bg-slate-50 text-fuchsia-600 font-bold">
              M
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-slate-800 text-sm truncate">Maria Silva</p>
              <p className="text-xs text-slate-500 truncate">cliente@email.com</p>
            </div>
          </div>

          {/* Navegação */}
          <nav className="px-4 pb-4 space-y-1">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={idx} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2 text-red-500 font-medium text-sm hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}