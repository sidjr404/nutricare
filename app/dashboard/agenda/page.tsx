'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';

export default function AgendaPage() {
  const supabase = createClient();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgenda() {
      // Busca consultas e inclui os dados do paciente (nome)
      // O Supabase faz o JOIN automaticamente se a chave estrangeira estiver definida
      const { data, error } = await supabase
        .from('consultas')
        .select(`
          *,
          pacientes (nome)
        `)
        .order('data_hora', { ascending: true });

      if (!error && data) {
        setConsultas(data);
      }
      setLoading(false);
    }

    fetchAgenda();
  }, [supabase]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Agenda de Consultas</h1>

      {loading ? (
        <div className="text-center py-10">Carregando agenda...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Paciente</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Tipo</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Data e Hora</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {consultas.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 flex items-center gap-2">
                    <User size={16} className="text-purple-500" />
                    <span className="font-medium">{c.pacientes?.nome || 'Paciente sem nome'}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{c.tipo}</td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(c.data_hora).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      c.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                      c.status === 'cancelado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {consultas.length === 0 && (
            <div className="p-10 text-center text-slate-400">Nenhuma consulta agendada.</div>
          )}
        </div>
      )}
    </div>
  );
}