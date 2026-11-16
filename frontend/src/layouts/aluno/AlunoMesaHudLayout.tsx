import React from 'react';
import { PortalNavBar, InterfaceOption } from '../common/PortalNavBar';

export interface AlunoLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  usuarioLogado?: any;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const AlunoMesaHudLayout: React.FC<AlunoLayoutProps> = ({
  children,
  activeTab = 'treinos',
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Cockpit do Lutador (HUD Arena Aluno)',
  subtitle = 'Telemetria de XP, streak de treinos seguidos e check-in expresso',
  headerActions,
}) => {
  const fighterTabs = [
    { id: 'treinos', label: 'Tatame & Check-in', icon: '🥊' },
    { id: 'frequencia', label: 'Horários ao Vivo', icon: '📅' },
    { id: 'conquistas', label: 'Streak & 30 Conquistas', icon: '🔥' },
    { id: 'recompensas', label: 'Loja de Points', icon: '🪙' },
    { id: 'contratos', label: 'Contratos & Passe', icon: '📄' },
    { id: 'mercado', label: 'Mercado do CT', icon: '🛍️' },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0a0c] text-white font-sans antialiased">
      <PortalNavBar
        currentPortal="aluno"
        currentInterface="mesa_hud"
        onInterfaceChange={onInterfaceChange}
        variant="hud"
        extraActions={headerActions}
      />

      {/* 1. BARRA HUD DO LUTADOR NO TOPO (ZERO SIDEBAR) */}
      <div className="w-full bg-[#121215] border-b border-red-900/40 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 border border-amber-400/40 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-red-950/60">
            🥊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-red-600 text-white">
                Nak Muay Nível 4
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">⚡ 840 XP</span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white mt-0.5">
              {usuarioLogado?.nome || 'Guerreiro do Tatame'}
            </h1>
          </div>
        </div>

        {/* INDICADORES EM TEMPO REAL: STREAK & CHECK-IN EXPRESSO */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-500/40 flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-black block">Streak Ativo</span>
              <span className="text-xs font-black text-orange-400">4 Semanas</span>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-900/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🥊</span>
            <span>Check-in Expresso</span>
          </button>
        </div>

        {/* Abas Horizontais do Cockpit Aluno */}
        <div className="w-full border-t border-zinc-800/60 pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {fighterTabs.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange && onTabChange(item.id)}
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

      {/* 2. ÁREA DE CONTEÚDO EM LARGURA TOTAL COM CARDS GRANDES */}
      <main className="w-full flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
