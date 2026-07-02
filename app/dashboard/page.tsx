export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 mb-8">Bem-vinda de volta! Aqui está o resumo de hoje.</p>
      
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-2xl p-6 text-white flex justify-between items-center mb-8 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            ⏰
          </div>
          <div>
            <p className="font-semibold text-lg flex items-center gap-2">🔔 Próxima Consulta</p>
            <p className="text-purple-100">Carla Santos às 14:00 (1 hora)</p>
          </div>
        </div>
        <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-sm">
          Ver Agenda
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white mb-2">👥</div>
          <div>
            <p className="text-2xl font-bold text-slate-800">48</p>
            <p className="text-xs text-slate-500 font-medium">Pacientes Ativos</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white mb-2">📅</div>
          <div>
            <p className="text-2xl font-bold text-slate-800">8</p>
            <p className="text-xs text-slate-500 font-medium">Consultas Hoje</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white mb-2">💬</div>
          <div>
            <p className="text-2xl font-bold text-slate-800">12</p>
            <p className="text-xs text-slate-500 font-medium">Mensagens Pendentes</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white mb-2">💲</div>
          <div>
            <p className="text-2xl font-bold text-slate-800">R$ 12.450</p>
            <p className="text-xs text-slate-500 font-medium">Receita Mensal</p>
          </div>
        </div>
      </div>
    </div>
  );
}