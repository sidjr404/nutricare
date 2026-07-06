'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import NovoPacienteForm from './novo/page';

export default function PacientesPage() {
  const supabase = createClient();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para buscar pacientes do banco
  const fetchPacientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('nome', { ascending: true });

    if (!error) setPacientes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const filteredPacientes = pacientes.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="text-slate-500 text-sm">{pacientes.length} pacientes cadastrados</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 shadow-md"
        >
          <Plus size={18} /> Novo Paciente
        </button>
      </div>

      {/* Busca */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou email..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Pacientes */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Carregando pacientes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacientes.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                  {p.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{p.nome}</h3>
                  <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{p.status}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600 mb-6">
                <p>📧 {p.email}</p>
                <p>📞 {p.telefone || 'Sem telefone'}</p>
                <p>📅 {p.data_nascimento || 'Data não definida'}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 mb-6 text-center">
                <div><p className="text-[10px] text-slate-400">Peso</p><p className="font-bold">{p.peso_atual || '-'}kg</p></div>
                <div><p className="text-[10px] text-slate-400">Altura</p><p className="font-bold">{p.altura || '-'}cm</p></div>
                <div><p className="text-[10px] text-slate-400">IMC</p><p className="font-bold">{p.imc || '-'}</p></div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 flex items-center justify-center gap-1">
                  <Eye size={14} /> Detalhes
                </button>
                <button className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">
                  <Edit size={14} />
                </button>
                <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
              <X size={20} />
            </button>
            <div className="p-8">
              <NovoPacienteForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}