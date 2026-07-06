'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Send, Loader2, MessageSquare, ShieldCheck, User } from 'lucide-react';

export default function ClienteChatPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [isEnviando, setIsEnviando] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Referência para rolar a tela automaticamente para a última mensagem
  const fimDasMensagensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function iniciarChat() {
      // 1. Identifica o paciente logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // 2. Busca o histórico de mensagens deste paciente
      const { data: historico } = await supabase
        .from('mensagens_chat')
        .select('*')
        .eq('paciente_id', user.id)
        .order('criado_em', { ascending: true });
      
      setMensagens(historico || []);
      setLoading(false);
      rolarParaBaixo();

      // 3. 🔴 Ativa o "Tempo Real" para escutar respostas da Nutricionista
      const canalRealtime = supabase
        .channel('chat_paciente')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'mensagens_chat', 
          filter: `paciente_id=eq.${user.id}` 
        }, (payload) => {
          setMensagens((prev) => [...prev, payload.new]);
          setTimeout(rolarParaBaixo, 100);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(canalRealtime);
      };
    }

    iniciarChat();
  }, [supabase]);

  // Enviar mensagem
  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !userId) return;

    setIsEnviando(true);
    const textoEnviado = novaMensagem;
    setNovaMensagem(''); // Limpa o campo visualmente para dar sensação de velocidade

    // Salva a mensagem no banco identificando que foi o 'paciente' que enviou
    const { error } = await supabase.from('mensagens_chat').insert({
      paciente_id: userId,
      enviado_por: 'paciente',
      texto: textoEnviado
    });

    if (error) {
      alert('Erro ao enviar mensagem. Verifique sua conexão.');
      setNovaMensagem(textoEnviado); // Devolve o texto se der erro
    }
    
    setIsEnviando(false);
  };

  // Função para descer o scroll
  const rolarParaBaixo = () => {
    fimDasMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formatador de hora
  const formatarHora = (dataString: string) => {
    return new Date(dataString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-slate-400 gap-3">
        <Loader2 size={32} className="animate-spin text-purple-500" />
        <p>Carregando conversa...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col pb-6">
      
      {/* Header do Chat */}
      <div className="bg-white rounded-t-3xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm z-10">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center border border-purple-200">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Atendimento Nutricional</h1>
          <p className="text-sm text-green-600 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Nutricionista Online
          </p>
        </div>
      </div>

      {/* Área das Mensagens */}
      <div className="flex-1 bg-slate-50/50 border-x border-slate-100 overflow-y-auto p-6 space-y-6">
        
        {/* Mensagem Inicial Padrão */}
        <div className="text-center pb-4">
          <p className="inline-block bg-white border border-slate-200 text-slate-500 text-xs px-4 py-2 rounded-full shadow-sm">
            Este é um canal direto e seguro com sua nutricionista.
          </p>
        </div>

        {mensagens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
            <MessageSquare size={48} className="mb-4" />
            <p>Nenhuma mensagem ainda.</p>
            <p className="text-sm">Envie sua dúvida abaixo!</p>
          </div>
        ) : (
          mensagens.map((msg, index) => {
            const isPaciente = msg.enviado_por === 'paciente';
            
            return (
              <div key={index} className={`flex flex-col ${isPaciente ? 'items-end' : 'items-start'} w-full`}>
                
                {/* Balão de Mensagem */}
                <div 
                  className={`max-w-[80%] md:max-w-[65%] px-5 py-3.5 rounded-2xl shadow-sm text-[15px] ${
                    isPaciente 
                      ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-br-sm' // Mensagem do Paciente
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm' // Mensagem da Nutri
                  }`}
                >
                  {msg.texto}
                </div>

                {/* Hora da mensagem */}
                <div className={`text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 ${isPaciente ? 'mr-1' : 'ml-1'}`}>
                  {!isPaciente && <ShieldCheck size={10} className="text-purple-400" />}
                  {isPaciente && <User size={10} className="text-slate-300" />}
                  {formatarHora(msg.criado_em)}
                </div>

              </div>
            );
          })
        )}
        
        {/* Elemento âncora para o scroll descer automaticamente */}
        <div ref={fimDasMensagensRef} className="h-1" />
      </div>

      {/* Área de Envio (Input) */}
      <div className="bg-white rounded-b-3xl border border-slate-100 p-4 shadow-sm z-10">
        <form onSubmit={handleEnviarMensagem} className="flex items-center gap-3 relative">
          <input 
            type="text" 
            placeholder="Escreva sua mensagem aqui..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            className="flex-1 py-4 pl-5 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all shadow-sm text-slate-700"
          />
          <button 
            type="submit" 
            disabled={!novaMensagem.trim() || isEnviando}
            className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white w-12 rounded-xl transition-colors shadow-sm flex items-center justify-center"
          >
            {isEnviando ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
          </button>
        </form>
      </div>

    </div>
  );
}