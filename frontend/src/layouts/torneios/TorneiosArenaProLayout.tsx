import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface TorneiosArenaProLayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  metricas?: {
    lutaAtualNumero?: number;
    tatameArea?: string;
    tempoRestanteRound?: string;
    proximaLutaCorner?: string;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Torneios / Arena de Combate & Telão (Tema: Arena Pro Tatame)
 * Diretrizes:
 * - Telão de arena de luta com estética de evento esportivo ao vivo (UFC / Glory / ONE)
 * - Abandona tabelas estáticas: prioriza Cards de Confronto e chaves dinâmicas
 * - Indicadores visuais de Corners (Vermelho vs. Azul), cronômetro e rounds
 */
export const TorneiosArenaProLayout: React.FC<TorneiosArenaProLayoutProps> = ({
  children,
  activeTab = 'chaves',
  onTabChange,
  metricas,
  title = 'Arena Brackets & Telão de Luta',
  subtitle = 'Chaveamento dinâmico de lutas, cronômetro de combate e monitoramento de octógono',
  headerActions
}) => {
  const arenaTabs = [
    { id: 'chaves', label: 'Fight Brackets (Ao Vivo)', icon: '⚔️' },
    { id: 'calendario', label: 'Card do Evento', icon: '🥊' },
    { id: 'inscricoes', label: 'Pesagem & Corners', icon: '⚖️' },
    { id: 'regulamento', label: 'Regras do Tatame', icon: '🛡️' },
  ];

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* Topo Telão de Luta */}
      <header className="h-16 bg-[#0c0e14] border-b border-red-950/60 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center font-black text-white text-lg shadow-md shadow-red-900/40">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wider text-white">
                {ACADEMY_CONFIG.nome}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[9px] font-mono font-bold tracking-widest">
                LIVE ARENA
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono block">
              CIRCUITO DE TORNEIOS // MAIN CARD
            </span>
          </div>
        </div>

        {/* Telemetria do Confronto Atual */}
        <div className="hidden sm:flex items-center gap-4 bg-black/60 border border-zinc-800 px-4 py-1.5 rounded-full text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-zinc-400">Combate em Andamento:</span>
            <span className="text-white font-bold">Luta #{metricas?.lutaAtualNumero ?? 4}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <span className="text-red-400 font-bold">{metricas?.tatameArea || 'Octógono Principal'}</span>
        </div>

        <a
          href="/"
          className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold transition"
        >
          Sair
        </a>
      </header>

      {/* Navegação Rápida por Cápsulas de Evento */}
      <div className="bg-[#090b0e] border-b border-zinc-800 px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {arenaTabs.map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/60'
                  : 'bg-[#12141a] text-zinc-400 hover:text-white border-zinc-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo Principal com Chaves e Cards de Confronto */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#060709] to-[#0c0d12]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase">
                {title}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>

          <div className="bg-[#0b0d13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
