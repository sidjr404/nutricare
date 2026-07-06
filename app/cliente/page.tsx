'use client';
import { Activity, Target, TrendingUp, Apple, Calendar as CalendarIcon, Utensils, MessageSquare, CreditCard, Lightbulb } from 'lucide-react';

export default function ClienteDashboard() {
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Banner de Boas Vindas */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-2xl p-8 text-white shadow-md">
        <h1 className="text-3xl font-bold mb-2">Olá, Maria! 👋</h1>
        <p className="text-purple-100">Você está indo muito bem! Continue assim.</p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white mb-4">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">68 kg</h3>
            <p className="text-xs text-slate-500 font-medium">Peso Atual</p>
            <p className="text-xs text-purple-600 font-bold mt-1">- 2 kg</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white mb-4">
            <Target size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">65 kg</h3>
            <p className="text-xs text-slate-500 font-medium">Meta</p>
            <p className="text-xs text-purple-600 font-bold mt-1">Faltam 3 kg</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white mb-4">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">0%</h3>
            <p className="text-xs text-slate-500 font-medium">Adesão Semanal</p>
            <p className="text-xs text-purple-600 font-bold mt-1">Comece hoje!</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white mb-4">
            <Apple size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">0</h3>
            <p className="text-xs text-slate-500 font-medium">Calorias Hoje</p>
            <p className="text-xs text-purple-600 font-bold mt-1">0 - 0 gasto</p>
          </div>
        </div>
      </div>

      {/* Gráfico Mockup de Desempenho */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-500" /> Desempenho Semanal
          </h2>
          <span className="text-xs text-slate-500">Calorias consumidas vs Meta</span>
        </div>
        
        {/* Mockup visual do gráfico baseado na imagem */}
        <div className="h-48 bg-gradient-to-b from-purple-50/50 to-transparent border-b-2 border-green-400 relative mb-4 rounded-t-lg">
          <div className="absolute top-4 left-0 w-full border-t-2 border-purple-400 flex justify-between items-center px-4">
            {weekDays.map((day, i) => (
               <div key={i} className="w-2.5 h-2.5 bg-purple-500 rounded-full -mt-[5px]"></div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full flex justify-between items-center px-4">
            {weekDays.map((day, i) => (
               <div key={i} className="w-2.5 h-2.5 bg-green-500 rounded-full mb-[-5px]"></div>
            ))}
          </div>
        </div>
        <div className="flex justify-between px-4 text-xs text-slate-400 font-medium mb-6">
          {weekDays.map(day => <span key={day}>{day}</span>)}
        </div>

        <div className="flex justify-center gap-4 text-xs font-semibold mb-6">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Meta</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Consumido</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Líquido</span>
        </div>

        <div className="grid grid-cols-4 text-center border-t border-slate-100 pt-6 mb-4">
          <div><p className="text-xs text-slate-500 mb-1">Consumido</p><p className="font-bold text-red-500 text-lg">0 kcal</p></div>
          <div><p className="text-xs text-slate-500 mb-1">Gasto</p><p className="font-bold text-orange-500 text-lg">0 kcal</p></div>
          <div><p className="text-xs text-slate-500 mb-1">Líquido</p><p className="font-bold text-green-500 text-lg">0 kcal</p></div>
          <div><p className="text-xs text-slate-500 mb-1">Adesão</p><p className="font-bold text-red-500 text-lg">0%</p></div>
        </div>

        <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl flex items-start gap-2 text-xs text-purple-800">
          <Lightbulb size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p><strong>Dica:</strong> O cálculo de adesão considera calorias líquidas (consumidas - gastas) vs meta. Registre suas atividades no <strong>Registro Diário</strong> para um cálculo mais preciso!</p>
        </div>
      </div>

      {/* Seção Inferior: Consulta e Adesão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <CalendarIcon size={18} className="text-purple-500" /> Próxima Consulta
          </h2>
          <div className="bg-purple-50 p-4 rounded-xl flex items-center justify-between border border-purple-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Consulta de Retorno</h3>
                <p className="text-sm text-slate-600">22 de Abril, 2026</p>
                <p className="text-sm font-semibold text-purple-600">14:00 (1 hora)</p>
              </div>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-purple-700 transition-colors">
              Gerenciar Consulta
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-500" /> Dias com Boa Adesão
          </h2>
          <div className="flex justify-between gap-2 mb-4">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full aspect-square bg-slate-100 rounded-lg"></div>
                <span className="text-[10px] text-slate-400 font-medium">{day}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mb-2">0 de 7 dias com adesão ≥80%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-0 h-full bg-green-500"></div>
          </div>
        </div>
      </div>

      {/* Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-purple-200 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
            <Utensils size={20} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Meu Cardápio</h3>
          <p className="text-xs text-slate-500">Veja seu cardápio semanal personalizado</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare size={20} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Falar com Nutricionista</h3>
          <p className="text-xs text-slate-500">Tire suas dúvidas ou solicite alterações</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-green-200 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
            <CreditCard size={20} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Meus Pagamentos</h3>
          <p className="text-xs text-slate-500">Visualize e gerencie seus planos</p>
        </div>
      </div>

    </div>
  );
}