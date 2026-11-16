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

export const StatsSuperAppLayout: React.FC<StatsLayoutProps> = ({
  children,
  activePeriodo = 'geral',
  onPeriodoChange,
  onInterfaceChange,
  title = 'Super-App Estatísticas & Performance',
  subtitle = 'Monitore seus gráficos de assiduidade e evolução pelo smartphone',
  headerActions,
}) => {
  const statsBottomItems = [
    { id: 'geral', label: 'Visão Geral', icon: '📊' },
    { id: 'striking', label: 'Striking', icon: '🥊' },
    { id: 'grappling', label: 'Grappling', icon: '🥋' },
    { id: 'endurance', label: 'Carga', icon: '🫀' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#070709] text-white font-sans antialiased flex flex-col justify-between pb-24">
      {/* 1. CONTAINER CENTRALIZADO COM LARGURA MÁXIMA RESTRITA */}
      <div className="w-full max-w-xl mx-auto flex flex-col min-h-screen bg-[#111114] border-x border-zinc-800/80 shadow-2xl relative">
        <PortalNavBar
          currentPortal="stats"
          currentInterface="super_app"
          onInterfaceChange={onInterfaceChange}
          variant="superapp"
          extraActions={headerActions}
        />

        {/* Minimalist Mobile Header */}
        <div className="px-4 py-3 bg-[#16161a] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-xs text-white">
              📊
            </div>
            <div>
              <h1 className="text-sm font-black text-white">{title}</h1>
              <p className="text-[10px] text-zinc-400">{subtitle}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
            METAS ATIVAS
          </span>
        </div>

        {/* Conteúdo Central em Cartões Mobile */}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {children}
        </main>
      </div>

      {/* 2. NAVEGAÇÃO FLUTUANTE NA BASE DA TELA (BOTTOM NAVIGATION) - SEM SIDEBARS */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-lg bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/60 rounded-2xl p-1.5 flex items-center justify-around shadow-2xl z-50">
        {statsBottomItems.map((item) => {
          const isActive = activePeriodo === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPeriodoChange && onPeriodoChange(item.id)}
              className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-900/40 scale-105'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px] uppercase tracking-wider font-bold truncate max-w-[65px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
