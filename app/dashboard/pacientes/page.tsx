'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, X, Mail, Phone, CalendarDays } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// Importando o formulário seguro que criamos conectado com a Vercel/Supabase Auth
import NovoPacienteForm from './novo/page';

export default function PacientesAdminPage() {
  const supabase = createClient();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Buscar pacientes do banco
  const fetchPacientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('nome', { ascending: true });

    if (!error && data) {
      setPacientes(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPacientes();
  }, [supabase]);

  // 2. Sistema de Busca (Filtra no frontend para ser instantâneo)
  const filteredPacientes = pacientes.filter(p => 
    p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Calculadora de Idade
  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return 'Idade não informada';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return `${idade} anos`;
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Pacientes</h1>
          <p className="text-slate-500 text-sm">{pacientes.length} pacientes cadastrados</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={18} /> Novo Paciente
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition-all text-slate-700"
        />
      </div>

      {/* Grid de Pacientes */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          Carregando pacientes...
        </div>
      ) : filteredPacientes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-medium text-lg">Nenhum paciente encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacientes.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
              
              {/* Card Header: Avatar e Nome */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl border border-purple-100">
                  {p.nome ? p.nome.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 truncate max-w-[180px]">{p.nome}</h3>
                  <span className={`inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${p.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {p.status || 'Ativo'}
                  </span>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-3 text-sm text-slate-600 mb-6 flex-1">
                <p className="flex items-center gap-2"><Mail size={16} className="text-slate-400 flex-shrink-0" /> <span className="truncate">{p.email}</span></p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-slate-400 flex-shrink-0" /> {p.telefone || 'Não informado'}</p>
                <p className="flex items-center gap-2"><CalendarDays size={16} className="text-slate-400 flex-shrink-0" /> {calcularIdade(p.data_nascimento)}</p>
              </div>

              {/* Métricas (Peso, Altura, IMC) */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 mb-6 text-center bg-slate-50/50 rounded-xl">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Peso</p>
                  <p className="font-bold text-slate-800">{p.peso_atual ? `${p.peso_atual}kg` : '-'}</p>
                </div>
                <div className="border-x border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Altura</p>
                  <p className="font-bold text-slate-800">{p.altura ? `${p.altura}cm` : '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">IMC</p>
                  <p className="font-bold text-slate-800">{p.imc || '-'}</p>
                </div>
              </div>

              {/* Objetivo e Biotipo */}
              <div className="mb-6 space-y-2">
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-700">Objetivo:</span> {p.objetivo || 'Não definido'}</p>
                <div className="flex items-center gap-2 mt-2">
                  {p.biotipo ? (
                    <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md">
                      {p.biotipo}
                    </span>
                  ) : (
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">
                      Biotipo não definido
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-auto space-y-3">
                <button className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 flex items-center justify-center gap-2 transition-colors">
                  <Eye size={16} /> Ver Detalhes de Saúde
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                    <Edit size={16} /> Editar
                  </button>
                  <button className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}

      {/* Modal Sobreposto para Novo Paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            
            <button 
              onClick={() => {
                setIsModalOpen(false);
                fetchPacientes(); // Recarrega os pacientes ao fechar o modal
              }} 
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-2 pt-6">
              <NovoPacienteForm />
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
}