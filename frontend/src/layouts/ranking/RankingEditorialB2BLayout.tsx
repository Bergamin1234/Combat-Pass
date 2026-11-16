import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface RankingEditorialB2BLayoutProps {
  children?: React.ReactNode;
  activePeriodo?: string;
  onPeriodoChange?: (periodo: string) => void;
  metricas?: {
    liderTemporada?: string;
    maiorStreakRegistrado?: string;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Ranking / Hall da Fama & Notabilidade (Tema: Editorial B2B)
 * Diretrizes:
 * - Menu lateral invertido à direita (Dossiê dos Notáveis / Estatuto de Mérito)
 * - Matriz editorial com perfil dos atletas de maior destaque da temporada
 * - Tipografia serifada clássica com estética de anuário prestigioso
 */
export const RankingEditorialB2BLayout: React.FC<RankingEditorialB2BLayoutProps> = ({
  children,
  activePeriodo = 'mes',
  onPeriodoChange,
  metricas,
  title = 'Hall da Fama & Registro de Notáveis',
  subtitle = 'Anuário de atletas exemplares, constância de treinamento e conduta marcial',
  headerActions
}) => {
  const editorialRankingNav = [
    { id: 'mes', label: 'Destaques do Trimestre', code: 'R1' },
    { id: 'geral', label: 'Quadro Histórico Geral', code: 'R2' },
    { id: 'semana', label: 'Atletas Destaque da Semana', code: 'R3' },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] text-[#edeef0] flex flex-col font-sans antialiased selection:bg-amber-600 selection:text-white">
      {/* Topbar Editorial */}
      <header className="h-16 bg-[#131318] border-b border-[#25252e] px-8 flex items-center justify-between z-20">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-base font-bold tracking-wider text-amber-400 uppercase">
            {ACADEMY_CONFIG.nome}
          </span>
          <span className="text-xs tracking-widest uppercase text-zinc-500 font-mono hidden md:inline">
            // Galeria dos Notáveis
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-right hidden sm:block">
            <span className="text-zinc-500 block text-[9px] uppercase font-mono tracking-wider">
              Líder do Período
            </span>
            <span className="font-serif font-bold text-zinc-200">
              {metricas?.liderTemporada || 'Atleta Destaque'}
            </span>
          </div>
          <a
            href="/"
            className="px-3.5 py-1.5 rounded-sm bg-[#1c1c24] hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-[#2b2b36] hover:border-amber-500/40 text-[11px] font-mono uppercase tracking-wider transition"
          >
            Sair
          </a>
        </div>
      </header>

      {/* Grid: Matriz Central + Menu Direito */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#0a0a0c]">
          <div className="border-b border-[#25252e] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block">
                Galeria Anual de Atletas
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-white">
                {title}
              </h1>
              <p className="text-xs text-zinc-400 font-sans max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>

          <div className="bg-[#121216] border border-[#22222b] rounded-sm p-6 shadow-2xl">
            {children}
          </div>
        </main>

        {/* Menu Lateral Direito Invertido */}
        <aside className="w-full lg:w-72 bg-[#121217] border-b lg:border-b-0 lg:border-l border-[#22222b] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-5 border-b border-[#22222b]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
              Recortes de Avaliação
            </span>
            <p className="text-xs text-zinc-400 font-serif italic">
              Selecione o corte temporal dos notáveis.
            </p>
          </div>

          <nav className="p-4 space-y-1.5 flex-1">
            {editorialRankingNav.map(item => {
              const isSelected = activePeriodo === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPeriodoChange?.(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-500 font-semibold pl-2.5'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a22]'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="font-mono text-[10px] text-zinc-600 pl-2 shrink-0">
                    §{item.code}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>
      </div>
    </div>
  );
};
