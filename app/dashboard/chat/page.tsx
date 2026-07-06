'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Send, User, MessageCircle, Clock, Loader2 } from 'lucide-react';

export default function ChatAdminPage() {
  const supabase = createClient();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  
  // Estados do Chat Ativo
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any | null>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [isCarregandoMensagens, setIsCarregandoMensagens] = useState(false);
  const [isEnviando, setIsEnviando] = useState(false);

  // Referência para rolar a tela para o final automaticamente
  const fimDasMensagensRef = useRef<HTMLDivElement>(null);

  // 1. Carregar a lista de pacientes na barra lateral
  useEffect(() => {
    async function carregarPacientes() {
      const { data } = await supabase
        .from('pacientes')
        .select('id, nome, status')
        .order('nome', { ascending: true });
      
      setPacientes(data || []);
      setPacientesFiltrados(data || []);
    }
    carregarPacientes();
  }, [supabase]);

  // Filtro de busca na barra lateral
  useEffect(() => {
    const filtrados = pacientes.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
    setPacientesFiltrados(filtrados);
  }, [busca, pacientes]);

  // 2. Carregar mensagens e ativar "Tempo Real" quando selecionar um paciente
  useEffect(() => {
    if (!pacienteSelecionado) return;

    async function carregarMensagens() {
      setIsCarregandoMensagens(true);
      const { data } = await supabase
        .from('mensagens_chat')
        .select('*')
        .eq('paciente_id', pacienteSelecionado.id)
        .order('criado_em', { ascending: true });
      
      setMensagens(data || []);
      setIsCarregandoMensagens(false);
      rolarParaBaixo();
    }

    carregarMensagens();

    // 🔴 O "Pulo do Gato": Escutar mensagens em tempo real no banco
    const canalRealtime = supabase
      .channel(`chat_${pacienteSelecionado.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensagens_chat', 
        filter: `paciente_id=eq.${pacienteSelecionado.id}` 
      }, (payload) => {
        // Quando uma nova mensagem entra no banco, adiciona na tela
        setMensagens((prev) => [...prev, payload.new]);
        setTimeout(rolarParaBaixo, 100);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canalRealtime);
    };
  }, [pacienteSelecionado, supabase]);

  // 3. Enviar uma nova mensagem
  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !pacienteSelecionado) return;

    setIsEnviando(true);
    const textoEnviado = novaMensagem;
    setNovaMensagem(''); // Limpa o input imediatamente para parecer mais rápido

    const { error } = await supabase.from('mensagens_chat').insert({
      paciente_id: pacienteSelecionado.id,
      enviado_por: 'admin',
      texto: textoEnviado
    });

    if (error) {
      alert('Erro ao enviar mensagem.');
      setNovaMensagem(textoEnviado); // Devolve o texto em caso de erro
    }
    setIsEnviando(false);
  };

  // Função auxiliar para rolar o scroll
  const rolarParaBaixo = () => {
    fimDasMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formatar hora da mensagem
  const formatarHora = (dataString: string) => {
    return new Date(dataString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 h-[calc(100vh-100px)] flex flex-col">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Central de Mensagens</h1>
        <p className="text-slate-500 text-sm">Comunique-se diretamente com seus pacientes.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex">
        
        {/* BARRA LATERAL (LISTA DE PACIENTES) */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar paciente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm text-slate-700"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {pacientesFiltrados.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">Nenhum paciente encontrado.</div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {pacientesFiltrados.map((p) => (
                  <li key={p.id}>
                    <button 
                      onClick={() => setPacienteSelecionado(p)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left ${pacienteSelecionado?.id === p.id ? 'bg-purple-50/50 border-l-4 border-purple-500' : 'border-l-4 border-transparent'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {p.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold truncate ${pacienteSelecionado?.id === p.id ? 'text-purple-900' : 'text-slate-700'}`}>{p.nome}</p>
                        <p className="text-xs text-slate-500 truncate">Clique para abrir o chat</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ÁREA DO CHAT */}
        <div className="flex-1 flex flex-col bg-white">
          {!pacienteSelecionado ? (
            // Tela de estado vazio
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={40} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-1">Nenhum chat selecionado</h3>
              <p className="text-sm">Selecione um paciente na lista lateral para iniciar uma conversa.</p>
            </div>
          ) : (
            // Chat Ativo
            <>
              {/* Header do Chat */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white shadow-sm z-10">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                  {pacienteSelecionado.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">{pacienteSelecionado.nome}</h2>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 block"></span> Paciente Ativo
                  </p>
                </div>
              </div>

              {/* Histórico de Mensagens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {isCarregandoMensagens ? (
                  <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                    <Loader2 size={18} className="animate-spin" /> Carregando mensagens...
                  </div>
                ) : mensagens.length === 0 ? (
                  <div className="text-center mt-10">
                    <p className="text-slate-500 bg-white inline-block px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-sm">
                      Esta é a sua primeira conversa com {pacienteSelecionado.nome}. Envie um "Olá"!
                    </p>
                  </div>
                ) : (
                  mensagens.map((msg, index) => {
                    const isAdmin = msg.enviado_por === 'admin';
                    return (
                      <div key={index} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm text-sm ${
                            isAdmin 
                              ? 'bg-purple-600 text-white rounded-br-sm' 
                              : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
                          }`}
                        >
                          {msg.texto}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 px-1">
                          {formatarHora(msg.criado_em)}
                        </span>
                      </div>
                    );
                  })
                )}
                {/* Elemento invisível para forçar o scroll até o final */}
                <div ref={fimDasMensagensRef} />
              </div>

              {/* Input de Envio */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleEnviarMensagem} className="flex items-center gap-3 relative">
                  <input 
                    type="text" 
                    placeholder="Digite sua mensagem aqui..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    className="flex-1 py-3.5 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all shadow-sm text-slate-700"
                  />
                  <button 
                    type="submit" 
                    disabled={!novaMensagem.trim() || isEnviando}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white p-3.5 rounded-xl transition-colors shadow-sm flex-shrink-0"
                  >
                    {isEnviando ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}