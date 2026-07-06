'use client';
import { useState } from 'react';
import { Plus, Search, Mail, Phone, CalendarDays, FileText, Eye, Edit, Trash2 } from 'lucide-react';

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock de dados baseado 100% no seu design
  const pacientes = [
    { 
      id: 1, name: 'Maria Silva', status: 'Ativo', email: 'maria@email.com', phone: '(11) 91234-5678', age: 36, 
      weight: '68kg', height: '165cm', imc: '25.0', objective: 'Perda de peso', biotype: 'Endomorfo', biotypeIcon: '🍞',
      initial: 'M', color: 'border-purple-200 text-purple-600', badgeObj: 'bg-orange-100 text-orange-700'
    },
    { 
      id: 2, name: 'Ana Costa', status: 'Ativo', email: 'ana@email.com', phone: '(11) 98765-4321', age: 40, 
      weight: '72kg', height: '170cm', imc: '24.9', objective: 'Ganho de massa', biotype: 'Mesomorfo', biotypeIcon: '💪',
      initial: 'A', color: 'border-fuchsia-200 text-fuchsia-600', badgeObj: 'bg-green-100 text-green-700'
    },
    { 
      id: 3, name: 'Beatriz Lima', status: 'Ativo', email: 'beatriz@email.com', phone: '(11) 99876-5432', age: 33, 
      weight: '60kg', height: '158cm', imc: '24.0', objective: 'Manutenção', biotype: 'Ectomorfo', biotypeIcon: '🏃',
      initial: 'B', color: 'border-pink-200 text-pink-600', badgeObj: 'bg-blue-100 text-blue-700'
    },
    { 
      id: 4, name: 'Carla Santos', status: 'Inativo', email: 'carla@email.com', phone: '(11) 97654-3210', age: 38, 
      weight: '75kg', height: '168cm', imc: '26.6', objective: 'Perda de peso', biotype: 'Endomorfo', biotypeIcon: '🍞',
      initial: 'C', color: 'border-purple-200 text-purple-600', badgeObj: 'bg-orange-100 text-orange-700'
    },
  ];

  // Filtro de busca inteligente
  const filteredPacientes = pacientes.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Pacientes</h1>
          <p className="text-slate-500 text-sm">{pacientes.length} pacientes cadastrados</p>
        </div>
        <button className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md">
          <Plus size={18} /> Novo Paciente
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-slate-700 shadow-sm"
        />
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPacientes.map((paciente) => (
          <div key={paciente.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            
            {/* Cabecalho do Card */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xl bg-slate-50 ${paciente.color}`}>
                {paciente.initial}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{paciente.name}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  paciente.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {paciente.status}
                </span>
              </div>
            </div>

            {/* Informacoes de Contato */}
            <div className="space-y-2 text-sm text-slate-500 mb-6 border-b border-slate-50 pb-4">
              <div className="flex items-center gap-2"><Mail size={16} /> {paciente.email}</div>
              <div className="flex items-center gap-2"><Phone size={16} /> {paciente.phone}</div>
              <div className="flex items-center gap-2"><CalendarDays size={16} /> {paciente.age} anos</div>
            </div>

            {/* Biometria Box */}
            <div className="bg-slate-50 rounded-xl p-4 flex justify-between mb-6">
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium mb-1">Peso</p>
                <p className="font-bold text-slate-800">{paciente.weight}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium mb-1">Altura</p>
                <p className="font-bold text-slate-800">{paciente.height}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium mb-1">IMC</p>
                <p className="font-bold text-slate-800">{paciente.imc}</p>
              </div>
            </div>

            {/* Objetivos */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                <FileText size={16} className="text-purple-500" />
                <span className="font-medium">Objetivo:</span> {paciente.objective}
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${paciente.badgeObj}`}>
                {paciente.biotypeIcon} {paciente.biotype}
              </div>
            </div>

            {/* Botoes de Acao */}
            <div className="space-y-2">
              <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <Eye size={16} /> Ver Detalhes de Saúde
              </button>
              <div className="flex gap-2">
                <button className="flex-1 bg-purple-50 text-purple-600 hover:bg-purple-100 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Edit size={16} /> Editar
                </button>
                <button className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredPacientes.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>Nenhum paciente encontrado com essa busca.</p>
        </div>
      )}
    </div>
  );
}