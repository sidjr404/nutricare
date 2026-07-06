'use client';
import { useState } from 'react';
import { Search, MessageSquare, Bot, Send } from 'lucide-react';

export default function ChatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  // Mock de dados replicando exatamente a sua imagem
  const chats = [
    {
      id: 1,
      name: 'Maria Silva',
      lastMessage: 'Gostaria de alterar minha dieta',
      time: '10 min atrás',
      unread: 2,
      needsAttention: true,
      initial: 'M'
    },
    {
      id: 2,
      name: 'Ana Costa',
      lastMessage: 'Obrigada pelas orientações!',
      time: '2h atrás',
      unread: 0,
      needsAttention: false,
      initial: 'A'
    },
    {
      id: 3,
      name: 'Beatriz Lima',
      lastMessage: 'Qual o horário da consulta?',
      time: '5h atrás',
      unread: 1,
      needsAttention: true,
      initial: 'B'
    }
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Chat</h1>
          <p className="text-slate-500 text-sm">Central de mensagens e chatbot</p>
        </div>
        <button className="bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-purple-50 transition-colors shadow-sm">
          <Bot size={18} /> Configurar Chatbot
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex min-h-0">
        
        {/* Sidebar (Lista de Conversas) */}
        <div className="w-80 md:w-96 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-100 flex-shrink-0">
            <h2 className="font-bold text-slate-800 text-lg">Conversas</h2>
            <p className="text-slate-500 text-sm mb-4">2 precisam de atenção</p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm text-slate-700 shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-slate-50 cursor-pointer transition-colors flex gap-3 ${
                  selectedChat === chat.id ? 'bg-purple-50 hover:bg-purple-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                    {chat.initial}
                  </div>
                  {chat.needsAttention && (
                    <div className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{chat.name}</h3>
                    {chat.unread > 0 && (
                      <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${chat.unread > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                    {chat.lastMessage}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{chat.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area (Painel da Direita) */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedChat ? (
            <div className="flex flex-col h-full w-full">
              {/* Header do Chat Ativo */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                  {chats.find(c => c.id === selectedChat)?.initial}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{chats.find(c => c.id === selectedChat)?.name}</h3>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>
              
              {/* Área de Mensagens */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-end">
                <div className="bg-white p-3.5 rounded-2xl rounded-bl-none shadow-sm max-w-md self-start border border-slate-200 mb-4">
                  <p className="text-slate-700 text-sm">{chats.find(c => c.id === selectedChat)?.lastMessage}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{chats.find(c => c.id === selectedChat)?.time}</span>
                </div>
              </div>
              
              {/* Input de Mensagem */}
              <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Digite sua mensagem..." 
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm text-slate-700 bg-slate-50" 
                  />
                  <button className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white p-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center shadow-md">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Tela Vazia (Default) */
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <MessageSquare size={64} className="mb-4 text-slate-300" strokeWidth={1.5} />
              <p className="text-slate-500 font-medium">Selecione uma conversa para começar</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}