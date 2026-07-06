'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, Clock, Check, X } from 'lucide-react';

export default function AgendaPage() {
  // Inicializamos as variáveis vazias para a Vercel não dar erro de fuso horário
  const [currentDate, setCurrentDate] = useState<Date | null>(null); 
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Assim que a tela carrega, nós puxamos a data atual do computador do usuário
  useEffect(() => {
    const hoje = new Date();
    setCurrentDate(hoje);
    setSelectedDate(hoje.getDate());
  }, []);

  // Tela de carregamento rápida enquanto a data é descoberta
  if (!currentDate || selectedDate === null) {
    return <div className="p-8 text-slate-500 animate-pulse font-medium">Carregando calendário...</div>;
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const days = Array.from({ length: firstDayOfMonth }, () => null).concat(
Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  // Variáveis para atrelar as consultas sempre ao dia de "hoje"
  const dataDeHoje = new Date();
  const isCurrentMonth = dataDeHoje.getMonth() === currentDate.getMonth() && dataDeHoje.getFullYear() === currentDate.getFullYear();
  const todayNumber = dataDeHoje.getDate();

  const appointments = [
    { id: 1, name: 'Maria Silva', type: 'Consulta Inicial', time: '09:00', duration: '1 hora', status: 'confirmado', initial: 'M', color: 'bg-purple-500' },
    { id: 2, name: 'Ana Costa', type: 'Retorno', time: '10:30', duration: '1 hora', status: 'confirmado', initial: 'A', color: 'bg-fuchsia-500' },
    { id: 3, name: 'Beatriz Lima', type: 'Avaliação Completa', time: '14:00', duration: '1 hora', status: 'pendente', initial: 'B', color: 'bg-yellow-500' },
    { id: 4, name: 'Carla Santos', type: 'Consulta Inicial', time: '15:30', duration: '1 hora', status: 'confirmado', initial: 'C', color: 'bg-purple-500' },
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.getDate());
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Agenda</h1>
          <p className="text-slate-500 text-sm">Gerencie suas consultas e compromissos</p>
        </div>
        <button className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md">
          <Plus size={18} /> Nova Consulta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Calendário */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={handleToday} className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-md hover:bg-purple-100 transition-colors">
                Hoje
              </button>
              <button onClick={handlePrevMonth} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeft size={20} /></button>
              <button onClick={handleNextMonth} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const isSelected = day === selectedDate;
              // A bolinha roxa vai aparecer apenas no dia de "hoje"
              const hasAppointments = day === todayNumber && isCurrentMonth; 
              const isToday = day === todayNumber && isCurrentMonth;
              
              return (
                <div 
                  key={index} 
                  onClick={() => day && setSelectedDate(day)}
                  className={`h-24 rounded-xl p-2 relative cursor-pointer transition-all ${
                    !day ? 'bg-transparent' : 
                    isSelected ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-md scale-105 z-10' : 
                    'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {day && (
                    <>
                      <span className={`font-semibold text-sm ${isToday && !isSelected ? 'text-purple-600' : ''}`}>
                        {day}
                      </span>
                      {hasAppointments && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5">
                          <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-fuchsia-500'}`}></div>
                          <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-fuchsia-500'}`}></div>
                          <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-fuchsia-500'}`}></div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-6 text-xs text-slate-500 font-medium border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-200"></div> Hoje</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-fuchsia-500"></div> Dia Selecionado</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Com Consultas</div>
          </div>
        </div>

        {/* Lado Direito: Lista de Consultas */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[800px] overflow-y-auto">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={18} className="text-purple-500" />
              Consultas - {selectedDate} de {monthNames[currentDate.getMonth()]}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {(selectedDate === todayNumber && isCurrentMonth) ? '4 consultas' : '0 consultas'}
            </span>
          </div>

          <div className="space-y-4">
            {(selectedDate === todayNumber && isCurrentMonth) ? (
              appointments.map((apt) => (
                <div key={apt.id} className={`p-4 rounded-xl border-l-4 flex flex-col gap-3 ${
                  apt.status === 'confirmado' ? 'bg-green-50/50 border-l-green-500' : 'bg-yellow-50/50 border-l-yellow-400'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shadow-sm ${apt.color}`}>
                        {apt.initial}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{apt.name}</p>
                        <p className="text-xs text-slate-500">{apt.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pl-[52px]">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {apt.time} ({apt.duration})</span>
                    <span className="flex items-center gap-1.5"><Bell size={14} /> Notificação ativa</span>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    {apt.status === 'pendente' && (
                      <button className="bg-green-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 hover:bg-green-600 transition-colors shadow-sm">
                        <Check size={14} /> Confirmar
                      </button>
                    )}
                    <button className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors shadow-sm">
                      <X size={14} /> Cancelar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-10 flex flex-col items-center gap-2">
                <Calendar size={32} className="opacity-20" />
                <p className="text-sm">Nenhuma consulta para este dia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}