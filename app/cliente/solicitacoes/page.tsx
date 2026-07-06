'use client';
import { useState } from 'react';
import { Save, Leaf, AlertCircle, Beef, Milk, Wheat, Carrot, Apple, Cookie, CheckCircle2, XCircle } from 'lucide-react';

export default function ClienteAlterarDietaPage() {
  // Estados para controlar o que o usuário selecionou
  const [estiloSelecionado, setEstiloSelecionado] = useState('onivoro');
  const [restricoes, setRestricoes] = useState<string[]>(['lactose']); // Simulando uma intolerância já marcada
  
  // Estado com os alimentos marcados como "consumidos" (verde)
  const [alimentosPermitidos, setAlimentosPermitidos] = useState<string[]>([
    'Carne Vermelha', 'Carne Branca (Frango, Peru)', 'Peixes', 'Frutos do Mar', 'Ovos',
    'Leite', 'Queijos', 'Iogurtes',
    'Arroz', 'Feijão', 'Lentilha', 'Grão de Bico', 'Aveia', 'Soja e Derivados',
    'Folhas Verdes (Alface, Espinafre)', 'Crucíferos (Brócolis, Couve-flor)', 'Raízes (Batata, Cenoura)', 'Cogumelos',
    'Cítricos (Laranja, Limão)', 'Frutas Vermelhas (Morango, Mirtilo)', 'Frutas Tropicais (Banana, Manga)',
    'Oleaginosas (Castanhas, Amêndoas, Nozes)', 'Sementes (Chia, Linhaça, Gergelim)'
  ]);

  const estilosAlimentares = [
    { id: 'onivoro', titulo: 'Onívoro/Carnívoro', desc: 'Consome todos os tipos de alimentos' },
    { id: 'flexitariano', titulo: 'Flexitariano', desc: 'Base vegetal, carne ocasionalmente' },
    { id: 'pescetariano', titulo: 'Pescetariano', desc: 'Vegetariana + peixes e frutos do mar' },
    { id: 'ovolacto', titulo: 'Ovolactovegetariano', desc: 'Sem carnes, com ovos e laticínios' },
    { id: 'lacto', titulo: 'Lactovegetariano', desc: 'Sem carnes e ovos, com laticínios' },
    { id: 'ovo', titulo: 'Ovovegetariano', desc: 'Sem carnes e laticínios, com ovos' },
    { id: 'estrito', titulo: 'Vegetariano Estrito', desc: 'Nenhum alimento de origem animal' },
    { id: 'vegano', titulo: 'Vegano', desc: 'Filosofia de vida sem produtos animais' },
    { id: 'plant', titulo: 'Plant-based', desc: 'Foco em vegetais inteiros' },
  ];

  const intolerancias = ['Intolerante à Lactose', 'Intolerante ao Glúten'];

  const categoriasAlimentos = [
    { id: 'proteinas', titulo: 'Proteínas Animais', icone: Beef, cor: 'text-red-500', itens: ['Carne Vermelha', 'Carne Branca (Frango, Peru)', 'Peixes', 'Frutos do Mar', 'Ovos'] },
    { id: 'laticinios', titulo: 'Laticínios', icone: Milk, cor: 'text-blue-500', itens: ['Leite', 'Queijos', 'Iogurtes'] },
    { id: 'graos', titulo: 'Grãos e Cereais', icone: Wheat, cor: 'text-amber-600', itens: ['Arroz', 'Feijão', 'Lentilha', 'Grão de Bico', 'Aveia', 'Soja e Derivados'] },
    { id: 'vegetais', titulo: 'Vegetais', icone: Carrot, cor: 'text-green-600', itens: ['Folhas Verdes (Alface, Espinafre)', 'Crucíferos (Brócolis, Couve-flor)', 'Raízes (Batata, Cenoura)', 'Cogumelos'] },
    { id: 'frutas', titulo: 'Frutas', icone: Apple, cor: 'text-red-400', itens: ['Cítricos (Laranja, Limão)', 'Frutas Vermelhas (Morango, Mirtilo)', 'Frutas Tropicais (Banana, Manga)'] },
    { id: 'oleaginosas', titulo: 'Oleaginosas e Sementes', icone: Cookie, cor: 'text-orange-500', itens: ['Oleaginosas (Castanhas, Amêndoas, Nozes)', 'Sementes (Chia, Linhaça, Gergelim)'] },
  ];

  // Funções de Toggle (Liga/Desliga)
  const toggleRestricao = (item: string) => {
    setRestricoes(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const toggleAlimento = (item: string) => {
    setAlimentosPermitidos(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Preferências Alimentares</h1>
          <p className="text-slate-500 text-sm">Selecione os alimentos que você consome para solicitar alteração na dieta</p>
        </div>
        <button className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
          <Save size={18} /> Salvar Preferências
        </button>
      </div>

      <div className="space-y-8">
        
        {/* Seção 1: Estilo Alimentar */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Leaf size={20} className="text-green-500" /> Estilo Alimentar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {estilosAlimentares.map((estilo) => {
              const isSelected = estiloSelecionado === estilo.id;
              return (
                <div 
                  key={estilo.id}
                  onClick={() => setEstiloSelecionado(estilo.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>{estilo.titulo}</h3>
                  <p className={`text-xs ${isSelected ? 'text-purple-700' : 'text-slate-500'}`}>{estilo.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Seção 2: Intolerâncias e Restrições */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-orange-500" /> Intolerâncias e Restrições
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intolerancias.map((item) => {
              const isRestrito = restricoes.includes(item);
              return (
                <div 
                  key={item}
                  onClick={() => toggleRestricao(item)}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    isRestrito ? 'border-slate-300 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isRestrito ? 'bg-slate-300 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <XCircle size={16} />
                  </div>
                  <span className={`text-sm font-medium ${isRestrito ? 'line-through opacity-70' : ''}`}>{item}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Seções de Categorias de Alimentos */}
        {categoriasAlimentos.map((categoria) => {
          const Icone = categoria.icone;
          return (
            <section key={categoria.id}>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Icone size={20} className={categoria.cor} /> {categoria.titulo}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoria.itens.map((alimento) => {
                  const isPermitido = alimentosPermitidos.includes(alimento);
                  return (
                    <div 
                      key={alimento}
                      onClick={() => toggleAlimento(alimento)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isPermitido 
                          ? 'border-green-400 bg-green-50 text-green-800 shadow-sm' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <CheckCircle2 size={18} className={isPermitido ? 'text-green-500' : 'text-slate-300'} />
                      <span className="text-sm font-medium">{alimento}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Seção Final: Observações Adicionais */}
        <section className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 mb-3">Observações Adicionais</h2>
          <textarea 
            rows={4}
            placeholder="Alguma alergia, restrição ou preferência adicional que gostaria de mencionar para a sua próxima dieta?"
            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-slate-700 shadow-sm"
          ></textarea>
        </section>

      </div>
    </div>
  );
}