'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Calendar as CalendarIcon, Clock, Plus, User, X, Save, Loader2, CheckCircle2, Clock3, XCircle } from 'lucide-react';

export default function AgendaAdminPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado do Formulário
  const [formData, setFormData] = useState({
    paciente_id: '',
    tipo: 'Consulta Inicial',
    data: '',
    hora: '14:00'
  });

  // 1. Carregar Consultas e Pacientes
  const fetchData = async () => {
    setLoading(true);
    
    // Busca consultas futuras e de hoje, ordenadas pela mais próxima
    const { data: agendaData } = await supabase
      .from('consultas')
      .select('id, data_hora, status, tipo, pacientes(nome)')
      .order('data_hora', { ascending: true });
      
    // Busca pacientes para preencher o "Select" do formulário de agendamento
    const { data: pacientesData } = await supabase
      .from('pacientes')
      .select('id, nome')
      .order('nome', { ascending: true });

    setConsultas(agendaData || []);
    setPacientes(pacientesData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  // 2. Função para salvar nova consulta
  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Combina a data e a hora do formulário para o formato do banco (Timestamp ISO)
      const dataHoraIso = new Date(`${formData.data}T${formData.hora}:00`).toISOString();

      const { error } = await supabase.from('consultas').insert({
        paciente_id: formData.paciente_id,
        tipo: formData.tipo,
        data_hora: dataHoraIso,
        status: 'pendente' // Toda consulta nova nasce como pendente
      });

      if (error) throw error;

      // Sucesso: fecha o modal, limpa o form e recarrega a lista
      setIsModalOpen(false);
      setFormData({ paciente_id: '', tipo: 'Consulta Inicial', data: '', hora: '14:00' });
      fetchData(); 

    } catch (error) {
      alert('Erro ao agendar consulta. Verifique os dados.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funções de formatação de data e hora para exibição
  const formatarData = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  };
  const formatarHora = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Ícones e cores dinâmicas para o Status
  const renderStatus = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700"><CheckCircle2 size={14} /> Confirmado</span>;
      case 'cancelado':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700"><XCircle size={14} /> Cancelado</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700"><Clock3 size={14} /> Pendente</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Agenda</h1>
          <p className="text-slate-500 text-sm">Gerencie todos os seus atendimentos programados</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={18} /> Nova Consulta
        </button>
      </div>

      {/* Lista de Consultas */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Carregando sua agenda...</div>
        ) : consultas.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
              <CalendarIcon size={32} />
            </div>
            <p className="text-lg font-bold text-slate-700">Agenda livre!</p>
            <p className="text-sm">Você não tem nenhuma consulta programada.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="p-5 text-sm font-bold text-slate-600">Paciente</th>
                <th className="p-5 text-sm font-bold text-slate-600">Data e Horário</th>
                <th className="p-5 text-sm font-bold text-slate-600">Tipo de Atendimento</th>
                <th className="p-5 text-sm font-bold text-slate-600 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consultas.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100">
                      {c.pacientes?.nome ? c.pacientes.nome.charAt(0) : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{c.pacientes?.nome || 'Paciente não encontrado'}</p>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 capitalize">{formatarData(c.data_hora)}</span>
                      <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock size={12} /> {formatarHora(c.data_hora)}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-sm font-medium text-slate-600">
                    {c.tipo}
                  </td>
                  <td className="p-5 text-right">
                    {renderStatus(c.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            
            {/* Header do Modal */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Agendar Consulta</h2>
                <p className="text-sm text-slate-500 mt-1">Selecione o paciente e o horário</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 bg-slate-100 text-slate-500 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleAgendar} className="p-6 space-y-5">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Paciente</label>
                <select 
                  required
                  value={formData.paciente_id}
                  onChange={(e) => setFormData({...formData, paciente_id: e.target.value})}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all shadow-sm"
                >
                  <option value="" disabled>Selecione um paciente...</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Consulta</label>
                <select 
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all shadow-sm"
                >
                  <option value="Consulta Inicial">Consulta Inicial</option>
                  <option value="Retorno">Retorno</option>
                  <option value="Avaliação Completa">Avaliação Completa</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Data</label>
                  <input 
                    type="date" 
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Horário</label>
                  <input 
                    type="time" 
                    required
                    value={formData.hora}
                    onChange={(e) => setFormData({...formData, hora: e.target.value})}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !formData.paciente_id}
                  className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSubmitting ? 'Agendando...' : 'Confirmar Agenda'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}