import React from 'react';
import { PortalNavBar, InterfaceOption, PORTALS_LIST } from '../common/PortalNavBar';
import { BaseLayoutProps } from './CommandCenterLayout';

/**
 * 8. Layout 'Zen Foco Total' (Estilo Notion / Documento Limpo)
 * Estrutura: Minimalismo absoluto, sem bordas pesadas e sem sidebars fixos.
 * Coluna central estreita (max-w-4xl), navegação minimalista estilo breadcrumb,
 * foco integral na leitura, métricas e tipografia limpa.
 */
export const ZenFocusLayout: React.FC<BaseLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Documento Zen & Foco Operacional',
  subtitle = 'Interface purista sem distrações periféricas, otimizada para leitura e análise',
  headerActions,
  portal = 'aluno',
}) => {
  return (
    <div className="min-h-screen w-full bg-[#0d0d0f] text-zinc-200 font-sans antialiased py-6 px-4 sm:px-8">
      {/* Container Central Estreito estilo Notion */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 1. TOPO MINIMALISTA ESTILO BREADCRUMB DISCRETO */}
        <header className="pb-4 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-zinc-500 font-mono">Combat-Pass</span>
            <span>/</span>
            <span className="font-bold text-zinc-300 uppercase tracking-wider">{portal}</span>
            <span>/</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <span>🧘</span> Zen Foco
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onInterfaceChange && onInterfaceChange('escolar')}
              className="text-zinc-400 hover:text-white transition font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>⚙️</span> Alternar Layout
            </button>
            {headerActions}
          </div>
        </header>

        {/* 2. NAVEGAÇÃO DE PORTAIS MINIMALISTA */}
        <nav className="flex items-center gap-4 overflow-x-auto pb-1 text-xs text-zinc-400 scrollbar-thin">
          {PORTALS_LIST.map((p) => {
            const isActive = portal === p.id;
            return (
              <a
                key={p.id}
                href={p.route}
                className={`transition pb-1 whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'text-white font-black border-b-2 border-amber-400'
                    : 'hover:text-zinc-200'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </a>
            );
          })}
        </nav>

        {/* 3. TÍTULO DO DOCUMENTO NOTION */}
        <div className="pt-2 pb-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>🧘</span>
            <span>{title}</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {subtitle} • Operador: <strong className="text-zinc-200">{usuarioLogado?.nome || 'Atleta Zen'}</strong>
          </p>
        </div>

        {/* 4. CORPO DO CONTEÚDO (STREAM LIMPO) */}
        <main className="w-full space-y-6 pt-2">
          {children}
        </main>

        {/* 5. RODAPÉ ZEN DISCRETO */}
        <footer className="pt-10 pb-6 border-t border-zinc-900 text-center text-[11px] text-zinc-600 font-mono">
          Combat-Pass Zen Focus Document • {new Date().toLocaleDateString('pt-BR')}
        </footer>
      </div>
    </div>
  );
};

export default ZenFocusLayout;
