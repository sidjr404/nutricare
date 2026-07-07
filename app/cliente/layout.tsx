'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutGrid, User, Utensils, MessageSquare, FileEdit, CreditCard, LogOut, Loader2 } from 'lucide-react';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const pathname = usePathname(); // Descobre em qual página estamos para pintar o botão de roxo
  const router = useRouter();

  // Estados para guardar os dados reais do paciente
  const [nome, setNome] = useState('Carregando...');
  const [email, setEmail] = useState('');
  const [inicial, setInicial] = useState('');
  const [carregandoLogout, setCarregandoLogout] = useState(false);

  useEffect(() => {
    async function carregarUsuario() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || '');
        
        // Busca o nome real no banco de dados
        const { data: paciente } = await supabase
          .from('pacientes')
          .select('nome')
          .eq('id', user.id)
          .single();

        if (paciente && paciente.nome) {
          setNome(paciente.nome);
          setInicial(paciente.nome.charAt(0).toUpperCase());
        } else {
          setNome('Paciente');
          setInicial('P');
        }
      }
    }
    carregarUsuario();
  }, [supabase]);

  // Função real para deslogar do sistema
  const handleSair = async () => {
    setCarregandoLogout(true);
    await supabase.auth.signOut();
    router.push('/login'); // Mande para a sua tela de login
  };

  // Lista dos botões do menu
  const menuItens = [
    { href: '/cliente', icone: LayoutGrid, texto: 'Início' },
    { href: '/cliente/perfil', icone: User, texto: 'Meu Perfil' },
    { href: '/cliente/cardapio', icone: Utensils, texto: 'Cardápio Semanal' },
    { href: '/cliente/chat', icone: MessageSquare, texto: 'Chat' },
    { href: '/cliente/preferencias', icone: FileEdit, texto: 'Preferências' },
    { href: '/cliente/pagamentos', icone: CreditCard, texto: 'Pagamentos' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* Menu Lateral (Sidebar) */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between hidden md:flex">
        
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center border border-purple-200">
              <span className="font-bold text-purple-700">N</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">NutriGestão</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Cliente</p>
            </div>
          </div>

          {/* Perfil Dinâmico */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-100 to-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold border border-purple-100 shadow-sm">
              {inicial}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-slate-800 text-sm truncate">{nome}</p>
              <p className="text-xs text-slate-500 truncate">{email}</p>
            </div>
          </div>

          {/* Navegação */}
          <nav className="px-4 space-y-1.5">
            {menuItens.map((item) => {
              const isActive = pathname === item.href;
              const Icone = item.icone;
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-purple-600'
                  }`}
                >
                  <Icone size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {item.texto}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Botão de Sair */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleSair}
            disabled={carregandoLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all text-sm font-medium text-red-600 hover:bg-red-50"
          >
            {carregandoLogout ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            {carregandoLogout ? 'Saindo...' : 'Sair'}
          </button>
        </div>

      </aside>

      {/* Conteúdo da Página */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}