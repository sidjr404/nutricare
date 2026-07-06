'use client';
import { useState } from 'react';
import { Camera, User, Mail, Phone, Calendar, HeartPulse, Save, Lightbulb } from 'lucide-react';

export default function ClientePerfilPage() {
  // Estado para armazenar quais condições de saúde o paciente selecionou
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);

  // Array com as condições baseadas na sua imagem, usando emojis para espelhar o design
  const conditions = [
    { id: 1, label: 'Diabetes', icon: '💉' },
    { id: 2, label: 'Hipertensão (Pressão Alta)', icon: '🤍' },
    { id: 3, label: 'Doença Cardíaca', icon: '❤️' },
    { id: 4, label: 'Obesidade', icon: '⚖️' },
    { id: 5, label: 'Colesterol Alto', icon: '🧈' },
    { id: 6, label: 'Problemas na Tireoide', icon: '🦋' },
    { id: 7, label: 'Doença Renal', icon: '🫘' },
    { id: 8, label: 'Doença Hepática', icon: '🫀' },
    { id: 9, label: 'Anemia', icon: '🩸' },
    { id: 10, label: 'Gastrite/Refluxo', icon: '🔥' },
  ];

  const toggleCondition = (id: number) => {
    setSelectedConditions(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header da Página */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Meu Perfil</h1>
        <p className="text-slate-500 text-sm">Gerencie suas informações pessoais</p>
      </div>

      {/* Card 1: Informações Pessoais e de Saúde Base */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Banner com Gradiente */}
        <div className="h-32 bg-gradient-to-r from-fuchsia-500 to-purple-600"></div>
        
        <div className="p-6 relative">
          {/* Avatar com Foto e Botão de Editar */}
          <div className="flex justify-between items-end mb-6 -mt-16">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden relative shadow-sm">
                {/* Aqui futuramente entraria a tag <img src="..." /> com a foto real */}
                <div className="w-full h-full bg-slate-700"></div>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-purple-700 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            
            <button className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors">
              Editar Perfil
            </button>
          </div>

          {/* Nome e Email (Abaixo da foto) */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">Maria Silva</h2>
            <p className="text-slate-500 text-sm">cliente@email.com</p>
          </div>

          {/* Grid do Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Coluna Esquerda: Pessoal */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 mb-4">Informações Pessoais</h3>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-1.5">
                  <User size={14} /> Nome Completo
                </label>
                <input type="text" defaultValue="Maria Silva" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-1.5">
                  <Mail size={14} /> Email
                </label>
                <input type="email" defaultValue="cliente@email.com" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-1.5">
                  <Phone size={14} /> Telefone
                </label>
                <input type="text" defaultValue="(11) 91234-5678" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-1.5">
                  <Calendar size={14} /> Data de Nascimento
                </label>
                <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>
            </div>

            {/* Coluna Direita: Saúde Básica */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 mb-4">Informações de Saúde</h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Peso Atual (kg)</label>
                <input type="number" defaultValue="68" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Altura (cm)</label>
                <input type="number" defaultValue="165" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Objetivo</label>
                <input type="text" placeholder="Ex: Perda de peso, Hipertrofia..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>

              {/* Box do Biotipo */}
              <div className="bg-fuchsia-50 border border-fuchsia-100 p-4 rounded-xl mt-6">
                <p className="text-xs font-bold text-purple-800 mb-2">Seu Biotipo (Somatótipo)</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 mb-2">
                  💪 Mesomorfo
                </div>
                <p className="text-xs text-purple-700 font-medium mb-1">Atlético, ganha músculos com facilidade</p>
                <p className="text-[10px] text-purple-400">* Definido pela nutricionista</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Card 2: Condições de Saúde */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Header do Card */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
              <HeartPulse size={20} className="text-red-500" /> Condições de Saúde
            </h2>
            <p className="text-slate-500 text-xs">Informe suas condições de saúde para um atendimento mais personalizado</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-sm">
            <Save size={16} /> Salvar
          </button>
        </div>

        {/* Grid de Seleção de Condições */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {conditions.map((condition) => {
            const isSelected = selectedConditions.includes(condition.id);
            return (
              <div 
                key={condition.id}
                onClick={() => toggleCondition(condition.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isSelected ? 'bg-purple-100' : 'bg-slate-100'
                }`}>
                  {condition.icon}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-purple-700' : 'text-slate-700'}`}>
                  {condition.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Textarea para Observações */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-600 mb-2">Outras Condições ou Observações</label>
          <textarea 
            rows={3} 
            placeholder="Medicamentos em uso, cirurgias recentes, alergias medicamentosas, etc..."
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-slate-700"
          ></textarea>
        </div>

        {/* Alerta de Confidencialidade */}
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-start gap-2 text-xs text-blue-800">
          <Lightbulb size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Importante:</strong> Essas informações são confidenciais e serão usadas apenas pela sua nutricionista para criar um plano alimentar mais adequado às suas necessidades.
          </p>
        </div>

      </div>

    </div>
  );
}