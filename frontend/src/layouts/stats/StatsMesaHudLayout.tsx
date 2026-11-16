import React from 'react';
import { PortalNavBar, InterfaceOption } from '../common/PortalNavBar';

export interface StatsLayoutProps {
  children: React.ReactNode;
  activePeriodo?: string;
  onPeriodoChange?: (periodo: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const StatsMesaHudLayout: React.FC<StatsLayoutProps> = ({
  children,
  activePeriodo = 'geral',
  onPeriodoChange,
  onInterfaceChange,
  title = 'Telemetria de Combate (HUD Performance)',
  subtitle = 'Métricas biométricas de tatame, volume de golpes e split striking vs grappling',
  headerActions,
}) => {
  const telemetryModules = [
    { id: 'geral', label: 'Telemetria Geral Ao Vivo', icon: '⚡' },
    { id: 'striking', label: 'Striking (Muay Thai / Boxe)', icon: '🥊' },
    { id: 'grappling', label: 'Grappling (Jiu-Jitsu / BJJ)', icon: '🥋' },
    { id: 'endurance', label: 'Carga Semanal & V02', icon: '🫀' },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0a0c] text-white font-sans antialiased">
      <PortalNavBar
        currentPortal="stats"
        currentInterface="mesa_hud"
        onInterfaceChange={onInterfaceChange}
        variant="hud"
        extraActions={headerActions}
      />

      {/* 1. TOPO HUD COM TELEMETRIA TÁTICA (ZERO SIDEBAR) */}
      <div className="w-full bg-[#121215] border-b border-red-900/40 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded bg-red-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md">
            <span>📊</span>
            <span>TACTICAL HUD</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">{title}</h1>
            <p className="text-[10px] text-zinc-400">{subtitle}</p>
          </div>
        </div>

        {/* MEDIDORES TÁTICOS RÁPIDOS */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-2.5 py-1 rounded bg-red-950/40 border border-red-500/40 text-red-300">
            STRIKING: <strong>62%</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/40 text-blue-300">
            GRAPPLING: <strong>38%</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
            LOAD: <strong>ÓTIMO</strong>
          </div>
        </div>

        {/* Abas da Mesa de Estatísticas */}
        <div className="w-full border-t border-zinc-800/60 pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {telemetryModules.map((item) => {
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

      {/* 2. ÁREA DE CONTEÚDO EM LARGURA TOTAL COM PAINÉIS TÁTICOS */}
      <main className="w-full flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
