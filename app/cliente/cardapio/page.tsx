'use client';
import { useState } from 'react';
import { UtensilsCrossed, Clock, Flame, Coffee, Sun, Moon, Apple, Info, CheckCircle2 } from 'lucide-react';

export default function ClienteCardapioPage() {
  // Estado para simular se o paciente tem ou não um cardápio (para você testar)
  const [temCardapio, setTemCardapio] = useState(true);
  
  // Estado para controlar qual dia da semana está selecionado
  const [diaSelecionado, setDiaSelecionado] = useState('Seg');

  const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // Mock de dados do cardápio preenchido
  const refeicoes = [
    {
      id: 1,
      nome: 'Café da Manhã',
      horario: '08:00',
      calorias: '320',
      icon: Coffee,
      itens: [
        '2 Ovos inteiros mexidos (sem óleo)',
        '1 Fatia de pão de forma integral',
        '1/2 Mamão papaia (150g)',
        '1 Xícara de café sem açúcar'
      ]
    },
    {
      id: 2,
      nome: 'Lanche da Manhã',
      horario: '10:30',
      calorias: '150',
      icon: Apple,
      itens: [
        '1 Maçã média',
        '30g de Aveia em flocos finos'
      ]
    },
    {
      id: 3,
      nome: 'Almoço',
      horario: '13:00',
      calorias: '450',
      icon: Sun,
      itens: [
        '150g de Peito de frango grelhado',
        '100g de Arroz integral cozido',
        'Salada de folhas verdes à vontade',
        '1 Colher de sopa de azeite de oliva extra virgem'
      ]
    },
    {
      id: 4,
      nome: 'Lanche da Tarde',
      horario: '16:00',
      calorias: '200',
      icon: Coffee,
      itens: [
        '1 Pote de Iogurte natural desnatado (170g)',
        '1 Colher de sopa de chia'
      ]
    },
    {
      id: 5,
      nome: 'Jantar',
      horario: '20:00',
      calorias: '380',
      icon: Moon,
      itens: [
        '120g de Filé de peixe branco assado',
        '100g de Batata doce assada',
        'Brócolis no vapor à vontade'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header com o Botão de Teste (Toggle) */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Meu Cardápio</h1>
          <p className="text-slate-500 text-sm">Seu plano alimentar personalizado</p>
        </div>
        
        {/* BOTÃO APENAS PARA TESTE DO DESENVOLVEDOR - Você pode remover depois */}
        <button 
          onClick={() => setTemCardapio(!temCardapio)}
          className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
        >
          Simular: {temCardapio ? 'Estado Vazio' : 'Cardápio Preenchido'}
        </button>
      </div>

      {!temCardapio ? (
        /* =========================================
           ESTADO VAZIO (Baseado na sua imagem)
           ========================================= */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <UtensilsCrossed size={64} className="text-slate-300 mb-6" strokeWidth={1.5} />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Nenhum cardápio disponível</h2>
          <p className="text-slate-500">
            Sua nutricionista ainda não criou um cardápio personalizado para você.<br/>
            Entre em contato para agendar uma consulta!
          </p>
        </div>
      ) : (
        /* =========================================
           ESTADO PREENCHIDO (Design do Cardápio)
           ========================================= */
        <div className="space-y-6">
          
          {/* Seletor de Dias da Semana */}
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex overflow-x-auto">
            {diasDaSemana.map((dia) => (
              <button
                key={dia}
                onClick={() => setDiaSelecionado(dia)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  diaSelecionado === dia 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {dia}
              </button>
            ))}
          </div>

          {/* Aviso / Meta Diária */}
          <div className="bg-fuchsia-50 border border-fuchsia-100 p-4 rounded-2xl flex items-start gap-3">
            <Info className="text-fuchsia-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-fuchsia-900 text-sm mb-1">Foco na hidratação!</p>
              <p className="text-fuchsia-800 text-xs">Lembre-se de beber pelo menos 2,5L de água ao longo do dia. O cardápio abaixo foi calculado para uma meta diária de <strong>1500 kcal</strong>.</p>
            </div>
          </div>

          {/* Lista de Refeições */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {refeicoes.map((refeicao) => {
              const Icone = refeicao.icon;
              return (
                <div key={refeicao.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  
                  {/* Cabeçalho do Card da Refeição */}
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-purple-600 shadow-sm">
                        <Icone size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{refeicao.nome}</h3>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
                          <Clock size={12} /> {refeicao.horario}
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <Flame size={12} /> {refeicao.calorias} kcal
                    </div>
                  </div>

                  {/* Lista de Itens para comer */}
                  <div className="p-5 flex-1">
                    <ul className="space-y-3">
                      {refeicao.itens.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}