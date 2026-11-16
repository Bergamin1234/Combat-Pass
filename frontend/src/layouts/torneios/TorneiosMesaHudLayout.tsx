import React, { useState, useEffect } from 'react';
import { PortalNavBar, InterfaceOption } from '../common/PortalNavBar';

export interface TorneiosLayoutProps {
  children: React.ReactNode;
  activePeriodo?: string;
  onPeriodoChange?: (periodo: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const TorneiosMesaHudLayout: React.FC<TorneiosLayoutProps> = ({
  children,
  activePeriodo = 'geral',
  onPeriodoChange,
  onInterfaceChange,
  title = 'Arena Combat Championship (HUD Torneios)',
  subtitle = 'Placar eletrônico de lutas, cronômetro de rounds e chaves de eliminatória',
  headerActions,
}) => {
  const [matchClock, setMatchClock] = useState('03:00');

  const tournamentCategories = [
    { id: 'geral', label: 'Ao Vivo: Chaves de Luta', icon: '⚡' },
    { id: 'pena', label: 'Pena (-65kg)', icon: '🥋' },
    { id: 'medio', label: 'Médio (-75kg)', icon: '🥋' },
    { id: 'pesado', label: 'Pesado (+85kg)', icon: '🥋' },
    { id: 'finais', label: 'Disputa de Cinturão', icon: '🏆' },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0a0c] text-white font-sans antialiased">
      <PortalNavBar
        currentPortal="torneios"
        currentInterface="mesa_hud"
        onInterfaceChange={onInterfaceChange}
        variant="hud"
        extraActions={headerActions}
      />

      {/* 1. PLACAR ELETRÔNICO DE ARENA NO TOPO (ZERO SIDEBAR) */}
      <div className="w-full bg-[#121215] border-b border-red-900/40 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded bg-red-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>TATAME 01: AO VIVO</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">{title}</h1>
            <p className="text-[10px] text-zinc-400">{subtitle}</p>
          </div>
        </div>

        {/* CRONÔMETRO DE COMBATE & CORNERS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#18181c] border border-zinc-800 px-3 py-1 rounded-xl font-mono">
            <span className="text-[10px] text-zinc-500 uppercase mr-1">Round 2:</span>
            <span className="text-sm font-black text-amber-400">{matchClock}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/50 text-red-300 text-xs font-bold">
              Corner Vermelho
            </span>
            <span className="text-xs font-black text-zinc-500">VS</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/50 text-blue-300 text-xs font-bold">
              Corner Azul
            </span>
          </div>
        </div>

        {/* Abas de Divisão do Torneio */}
        <div className="w-full border-t border-zinc-800/60 pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {tournamentCategories.map((item) => {
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

      {/* 2. ÁREA DE CONTEÚDO EM LARGURA TOTAL COM CARDS DE DUELOS */}
      <main className="w-full flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
