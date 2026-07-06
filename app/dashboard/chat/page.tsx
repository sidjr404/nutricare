'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Send, User, Bot } from 'lucide-react';

export default function ChatAdminPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Buscar histórico de mensagens
  useEffect(() => {
    if (!selectedPatientId) return;

    async function fetchMessages() {
      const { data } = await supabase
        .from('mensagens_chat')
        .select('*')
        .eq('paciente_id', selectedPatientId)
        .order('criado_em', { ascending: true });
      
      setMessages(data || []);
    }

    fetchMessages();

    // 2. Escutar mensagens novas em tempo real
    const channel = supabase
      .channel('chat_updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensagens_chat',
        filter: `paciente_id=eq.${selectedPatientId}` 
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedPatientId, supabase]);

  // 3. Enviar mensagem
  const handleSend = async () => {
    if (!inputText.trim() || !selectedPatientId) return;

    await supabase.from('mensagens_chat').insert({
      paciente_id: selectedPatientId,
      enviado_por: 'admin',
      texto: inputText
    });
    
    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Sidebar: Lista de Pacientes (simples) */}
      <div className="w-80 border-r border-slate-100 p-4 overflow-y-auto">
        <h2 className="font-bold text-slate-800 mb-4">Conversas</h2>
        {/* Aqui você faria um map dos pacientes que têm mensagens */}
        <p className="text-sm text-slate-400">Selecione um paciente para ver o histórico...</p>
      </div>

      {/* Área do Chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.enviado_por === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl max-w-md ${m.enviado_por === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                {m.texto}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2 border border-slate-200 rounded-lg"
            placeholder="Responder ao paciente..."
          />
          <button onClick={handleSend} className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}