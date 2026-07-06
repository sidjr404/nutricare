'use client';
import { useState } from 'react';
import { CreditCard, Download, Check } from 'lucide-react';

export default function ClientePagamentosPage() {
  const [activeTab, setActiveTab] = useState('historico');

  // Mock de dados baseado 100% na sua imagem
  const historico = [
    {
      id: 1,
      plano: 'Plano Mensal',
      vencimento: '19/04/2026',
      pagamento: '17/04/2026',
      valor: 'R$ 250.00',
      status: 'Pago'
    },
    {
      id: 2,
      plano: 'Plano Mensal',
      vencimento: '19/03/2026',
      pagamento: '18/03/2026',
      valor: 'R$ 250.00',
      status: 'Pago'
    },
    {
      id: 3,
      plano: 'Plano Mensal',
      vencimento: '19/05/2026',
      pagamento: null,
      valor: 'R$ 250.00',
      status: 'Pendente'
    }
  ];

  // Mock básico para a aba de Planos (para não deixar a tela vazia ao trocar de aba)
  const planosDisponiveis = [
    { titulo: 'Plano Trimestral', valor: 'R$ 650,00', economia: 'Economize R$ 100', popular: true },
    { titulo: 'Plano Semestral', valor: 'R$ 1.200,00', economia: 'Economize R$ 300', popular: false }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Pagamentos e Planos</h1>
        <p className="text-slate-500 text-sm">Gerencie seus pagamentos e visualize planos disponíveis</p>
      </div>

      {/* Banner Principal - Resumo do Plano Atual */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-2xl p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-3">
            Plano Atual
          </span>
          <h2 className="text-3xl font-bold mb-1">Plano Mensal</h2>
          <p className="text-purple-100 text-sm">Renovação automática ativa</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl min-w-[240px]">
          <p className="text-purple-100 text-sm font-medium mb-1">Valor Mensal</p>
          <p className="text-3xl font-bold mb-2">R$ 250,00</p>
          <p className="text-purple-100 text-xs">Próximo vencimento: 20/05/2026</p>
        </div>
      </div>

      {/* Container Principal com Abas */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Navegação das Abas */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('historico')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === 'historico'
                ? 'text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Histórico de Pagamentos
          </button>
          <button
            onClick={() => setActiveTab('planos')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === 'planos'
                ? 'text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Planos Disponíveis
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6">
          
          {activeTab === 'historico' && (
            <div className="space-y-4">
              {historico.map((item) => (
                <div key={item.id} className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-shadow">
                  
                  {/* Informações à Esquerda */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 border border-purple-200 flex-shrink-0">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.plano}</h3>
                      <p className="text-xs text-slate-500 mt-1">Vencimento: {item.vencimento}</p>
                      {item.pagamento && (
                        <p className="text-xs text-green-600 font-medium mt-0.5">Pago em: {item.pagamento}</p>
                      )}
                    </div>
                  </div>

                  {/* Valores e Ações à Direita */}
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="font-bold text-slate-900 mb-1">{item.valor}</p>
                      {item.status === 'Pago' ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          <Check size={12} strokeWidth={3} /> Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          Pendente
                        </span>
                      )}
                    </div>

                    <div className="flex items-center">
                      {item.status === 'Pago' ? (
                        <button className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                          <Download size={20} />
                        </button>
                      ) : (
                        <button className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                          Pagar Agora
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {activeTab === 'planos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {planosDisponiveis.map((plano, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${plano.popular ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'}`}>
                  {plano.popular && <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Mais Popular</span>}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{plano.titulo}</h3>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{plano.valor}</p>
                  <p className="text-green-600 text-sm font-medium mb-6">{plano.economia}</p>
                  <button className={`w-full py-3 rounded-xl font-bold transition-colors ${plano.popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    Mudar para este plano
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}