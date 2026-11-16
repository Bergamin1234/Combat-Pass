import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface TorneiosEditorialB2BLayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  metricas?: {
    edicaoAtual?: string;
    premiacaoTotal?: string;
    patrocinadoresOficiais?: number;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Torneios / Dossiê de Campeonatos (Tema: Editorial B2B)
 * Diretrizes:
 * - Menu lateral invertido à direita (Dossiê de Patrocínios, Federação e Diretrizes)
 * - Matriz editorial de confrontos, quadro de honra e cobertura de eventos
 * - Estética corporativa de alta classe para ligas e parceiros
 */
export const TorneiosEditorialB2BLayout: React.FC<TorneiosEditorialB2BLayoutProps> = ({
  children,
  activeTab = 'calendario',
  onTabChange,
  metricas,
  title = 'Caderno Oficial de Competições & Torneios',
  subtitle = 'Dossiê da temporada, quadro de honra, patrocínios e diretrizes técnicas',
  headerActions
}) => {
  const editorialTournamentNav = [
    { id: 'calendario', label: 'Calendário da Temporada', code: 'T1' },
    { id: 'chaves', label: 'Matriz de Confrontos', code: 'T2' },
    { id: 'inscricoes', label: 'Credenciamento de Atletas', code: 'T3' },
    { id: 'pesagem', label: 'Protocolo de Pesagem', code: 'T4' },
    { id: 'regulamento', label: 'Estatuto de Arbitragem', code: 'T5' },
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
            // Ligas & Torneios Corporativos
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-right hidden sm:block">
            <span className="text-zinc-500 block text-[9px] uppercase font-mono tracking-wider">
              Circuito Oficial
            </span>
            <span className="font-serif font-bold text-zinc-200">
              {metricas?.edicaoAtual || 'Grand Prix Anual 2026'}
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
                Caderno de Lutas & Arbitragem
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

        {/* Menu Direito: Dossiê de Torneio */}
        <aside className="w-full lg:w-72 bg-[#121217] border-b lg:border-b-0 lg:border-l border-[#22222b] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-5 border-b border-[#22222b]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
              Índice da Competição
            </span>
            <p className="text-xs text-zinc-400 font-serif italic">
              Navegação no caderno de chaves e regulamentos.
            </p>
          </div>

          <nav className="p-4 space-y-1.5 flex-1">
            {editorialTournamentNav.map(item => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
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
