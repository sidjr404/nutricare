import { LayoutDashboard, Users, Calendar, MessageSquare, CreditCard, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Em produção, você checaria o perfil do usuário (Admin vs Cliente) para renderizar os itens dinamicamente
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: Calendar, label: 'Agenda', href: '/dashboard/agenda', active: false },
    { icon: Users, label: 'Pacientes', href: '/dashboard/pacientes', active: false },
    { icon: MessageSquare, label: 'Chat', href: '/dashboard/chat', active: false },
    { icon: CreditCard, label: 'Pagamentos', href: '/dashboard/pagamentos', active: false },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-yellow-400"></div>
            <div>
              <h2 className="font-bold text-slate-900">NutriGestão</h2>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {menuItems.map((item, idx) => (
              <Link 
                key={idx} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.active ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-2 text-red-500 font-medium text-sm hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}