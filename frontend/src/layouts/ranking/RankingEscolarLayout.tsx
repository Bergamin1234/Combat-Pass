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

export const RankingEscolarLayout: React.FC<RankingLayoutProps> = ({
  children,
  activePeriodo = 'geral',
  onPeriodoChange,
  onInterfaceChange,
  title = 'Quadro de Honra & Classificação Escolar',
  subtitle = 'Pontuação acadêmica, assiduidade e mérito por período letivo',
  headerActions,
}) => {
  const semesters = [
    { id: 'geral', label: 'Ranking Anual 2026', icon: '🌍' },
    { id: 'semestre_1', label: '1º Semestre Letivo', icon: '📅' },
    { id: 'semestre_2', label: '2º Semestre Letivo', icon: '📅' },
    { id: 'mensal', label: 'Destaques do Mês Atual', icon: '⭐' },
  ];

  return (
    <div className="flex flex-row min-h-screen w-full bg-slate-900 text-slate-100 font-sans antialiased">
      {/* 1. SIDEBAR FIXO NA ESQUERDA (w-64) FILTROS ESCOLARES DE RANKING */}
      <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between shadow-2xl z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-black">
              🌍
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-white">Quadro de Honra</h2>
              <p className="text-[10px] text-slate-400">Classificação Escolar</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Critério de Pontuação</span>
            <p className="text-xs font-black text-white">Presença + Mérito Técnico</p>
            <span className="text-[10px] text-blue-400 font-mono block">Cálculo: Contínuo</span>
          </div>

          <nav className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block px-2 mb-2">
              Período de Avaliação
            </span>
            {semesters.map((item) => {
              const isActive = activePeriodo === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPeriodoChange && onPeriodoChange(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center font-mono">
          MÉRITO ESCOLAR • 2026
        </div>
      </aside>

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL À DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        <PortalNavBar
          currentPortal="ranking"
          currentInterface="escolar"
          onInterfaceChange={onInterfaceChange}
          variant="escolar"
          extraActions={headerActions}
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-base font-black text-white">{title}</h1>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-blue-300 text-xs font-mono">
              TABELA CONSOLIDADA
            </span>
          </div>

          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
