import React from 'react';
import { PortalNavBar, InterfaceOption } from '../common/PortalNavBar';

export interface RankingLayoutProps {
  children: React.ReactNode;
  activePeriodo?: string;
  onPeriodoChange?: (periodo: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const RankingMesaHudLayout: React.FC<RankingLayoutProps> = ({
  children,
  activePeriodo = 'geral',
  onPeriodoChange,
  onInterfaceChange,
  title = 'Hall of Fame & Pódio Arena (HUD Ranking)',
  subtitle = 'Classificação geral de combate, pódio eletrônico dos Top 3 e streaks',
  headerActions,
}) => {
  const rankingCategories = [
    { id: 'geral', label: 'Pódio Global Geral', icon: '🏆' },
    { id: 'mes', label: 'Líderes do Mês', icon: '⚡' },
    { id: 'streaks', label: 'Maiores Streaks 🔥', icon: '🔥' },
    { id: 'conquistas', label: 'Colecionadores de Badges', icon: '🎖️' },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0a0c] text-white font-sans antialiased">
      <PortalNavBar
        currentPortal="ranking"
        currentInterface="mesa_hud"
        onInterfaceChange={onInterfaceChange}
        variant="hud"
        extraActions={headerActions}
      />

      {/* 1. TOPO HUD COM DESTAQUE DE PÓDIO (ZERO SIDEBAR) */}
      <div className="w-full bg-[#121215] border-b border-red-900/40 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded bg-amber-500 text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md">
            <span>👑</span>
            <span>TOP FIGHTERS</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">{title}</h1>
            <p className="text-[10px] text-zinc-400">{subtitle}</p>
          </div>
        </div>

        {/* MEDALHAS RÁPIDAS TOP 3 */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1">
            <span>🥇</span>
            <span>1º Lugar</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-slate-400/20 border border-slate-400/40 text-slate-300 flex items-center gap-1">
            <span>🥈</span>
            <span>2º Lugar</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-orange-700/20 border border-orange-700/40 text-orange-300 flex items-center gap-1">
            <span>🥉</span>
            <span>3º Lugar</span>
          </div>
        </div>

        {/* Abas Horizontais do Ranking */}
        <div className="w-full border-t border-zinc-800/60 pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {rankingCategories.map((item) => {
            const isActive = activePeriodo === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPeriodoChange && onPeriodoChange(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60 border border-red-500'
                    : 'bg-[#18181d] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ÁREA DE CONTEÚDO EM LARGURA TOTAL COM CARDS GIGANTES DE PÓDIO */}
      <main className="w-full flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
