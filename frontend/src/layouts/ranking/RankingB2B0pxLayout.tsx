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

export const RankingB2B0pxLayout: React.FC<RankingLayoutProps> = ({
  children,
  activePeriodo = 'geral',
  onPeriodoChange,
  onInterfaceChange,
  title = 'Hall of Fame Corporativo & Matriz de Mérito (Ranking)',
  subtitle = 'Classificação institucional auditada, indicadores de constância e atletas notáveis 0px',
  headerActions,
}) => {
  const b2bRankingModules = [
    { id: 'geral', label: 'Matriz Geral de Assiduidade', icon: '🏆' },
    { id: 'trimestral', label: 'Balanço Trimestral Q4', icon: '📊' },
    { id: 'notaveis', label: 'Quadro de Atletas Notáveis', icon: '⭐' },
    { id: 'federados', label: 'Atletas Federados Graduados', icon: '🥋' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0d0d10] text-zinc-100 font-serif antialiased rounded-none border-0 p-0 m-0">
      <PortalNavBar
        currentPortal="ranking"
        currentInterface="b2b_0px"
        onInterfaceChange={onInterfaceChange}
        variant="b2b"
        extraActions={headerActions}
      />

      {/* HEADER B2B 0px */}
      <div className="w-full bg-[#141418] border-b-2 border-amber-600/70 px-6 py-3.5 flex items-center justify-between rounded-none font-sans">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block">
            Hall da Fama Institucional • Critério Auditado 0px
          </span>
          <h1 className="text-lg font-bold text-white font-serif">{title}</h1>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-400">Classificação:</span>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/40 font-mono font-bold">
            HOMOLOGADA
          </span>
        </div>
      </div>

      {/* GRID INVERTIDO: MATRIZ DE RANKING À ESQUERDA, DESTAQUES À DIREITA */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] w-full min-h-[calc(100vh-120px)] rounded-none gap-0">
        <main className="order-1 flex flex-col p-6 sm:p-8 border-r border-zinc-800 bg-[#101013] rounded-none overflow-y-auto space-y-6 font-sans">
          <div className="pb-3 border-b border-zinc-800 flex justify-between items-center text-xs">
            <span className="text-zinc-400">{subtitle}</span>
            <span className="font-mono text-emerald-400">PONTOS CONSOLIDADOS</span>
          </div>

          <div className="w-full">
            {children}
          </div>
        </main>

        <aside className="order-2 w-full lg:w-[320px] bg-[#141418] border-l border-zinc-800 p-5 flex flex-col justify-between rounded-none font-sans shrink-0">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 pb-2 border-b border-zinc-800">
                Menu de Avaliação
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">Selecione o relatório de mérito:</p>
            </div>

            <nav className="space-y-1">
              {b2bRankingModules.map((item) => {
                const isActive = activePeriodo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onPeriodoChange && onPeriodoChange(item.id)}
                    className={`w-full flex items-center justify-between p-3 text-xs font-bold text-left rounded-none border-l-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-500 bg-zinc-900 text-amber-300 font-black pl-4'
                        : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    {isActive && <span className="font-mono text-[10px]">●</span>}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Destaque do Trimestre</span>
              <div className="flex justify-between">
                <span className="text-zinc-400">Atleta Exemplar:</span>
                <span className="text-amber-400 font-bold">100% Presença</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total de Faixas:</span>
                <span className="text-white font-mono font-bold">38 Graduados</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 text-center font-mono">
            MÉRITO INSTITUCIONAL • PROTOCOLO 0px
          </div>
        </aside>
      </div>
    </div>
  );
};
