'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, Bot, User, MessageSquare } from 'lucide-react';

export default function ClienteChatPage() {
  const [inputText, setInputText] = useState('');
  
  // Estado inicial das mensagens espelhando a sua imagem
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Olá! Bem-vinda ao chat da NutriGestão. Como posso ajudar você hoje?',
      time: '21:44'
    },
    {
      id: 2,
      sender: 'user',
      text: 'Gostaria de saber sobre minha próxima consulta',
      time: '21:49'
    },
    {
      id: 3,
      sender: 'bot',
      text: 'Sua próxima consulta está agendada para 22 de Abril às 14:00. É uma Consulta de Retorno. Posso ajudar com mais alguma coisa?',
      time: '21:50'
    }
  ]);

  const respostasRapidas = [
    'Alterar minha dieta',
    'Agendar consulta',
    'Dúvidas sobre pagamento',
    'Horário de atendimento'
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para rolar o chat para baixo automaticamente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para enviar uma nova mensagem
  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Adiciona a mensagem do usuário
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: timeString
    }]);

    setInputText('');

    // Simula uma resposta do bot após 1 segundo
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Entendido! Um momento enquanto verifico essa informação para você. Se for algo complexo, vou transferir para a nutricionista.',
        time: timeString
      }]);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-100px)]">
      
      {/* Header da Página */}
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Chat</h1>
        <p className="text-slate-500 text-sm">Converse com a nutricionista ou assistente virtual</p>
      </div>

      {/* Alerta de Assistente Virtual */}
      <div className="flex-shrink-0 bg-purple-50 border border-purple-200 p-4 rounded-xl flex items-start gap-3 mb-6">
        <AlertTriangle size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-purple-900">
          <strong>Assistente Virtual Ativo:</strong> Respostas automáticas estão ativas. Para falar diretamente com a nutricionista, mencione que precisa de atendimento personalizado.
        </p>
      </div>

      {/* Container Principal do Chat */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-0 overflow-hidden">
        
        {/* Header Interno do Chat */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-sm">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">NutriGestão</h2>
            <p className="text-sm text-green-500 font-medium">Online - Respondemos em minutos</p>
          </div>
        </div>

        {/* Área de Mensagens (Rolável) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className="flex-shrink-0 mt-auto mb-6">
                {msg.sender === 'bot' ? (
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200">
                    <Bot size={20} />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">
                    <User size={20} />
                  </div>
                )}
              </div>

              {/* Balão de Mensagem */}
              <div className={`max-w-[70%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-2xl rounded-br-sm' 
                    : 'bg-purple-50 border border-purple-100 text-purple-900 rounded-2xl rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 px-1">{msg.time}</span>
              </div>

            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Respostas Rápidas & Input (Rodapé) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2 font-medium px-1">Respostas rápidas:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {respostasRapidas.map((resp, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(resp)}
                  className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm hover:border-purple-300 hover:text-purple-600 transition-colors shadow-sm"
                >
                  {resp}
                </button>
              ))}
            </div>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className="flex gap-3"
          >
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua mensagem..." 
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-700 shadow-sm"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              <Send size={18} /> Enviar
            </button>
          </form>

        </div>
      </div>
      
    </div>
  );
}