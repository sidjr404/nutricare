'use client';
import { LayoutDashboard, Users, Calendar, MessageSquare, CreditCard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Agenda', href: '/dashboard/agenda' },
    { icon: Users, label: 'Pacientes', href: '/dashboard/pacientes' },
    { icon: MessageSquare, label: 'Chat', href: '/dashboard/chat' },
    { icon: CreditCard, label: 'Pagamentos', href: '/dashboard/pagamentos' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-500 to-orange-400 p-1 flex items-center justify-center">
              <div className="bg-white w-full h-full rounded-full flex items-center justify-center text-xs font-bold text-fuchsia-600">N</div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 leading-tight">NutriGestão</h2>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={idx} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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
          <button className="flex items-center gap-3 px-4 py-2 text-red-500 font-medium text-sm hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}