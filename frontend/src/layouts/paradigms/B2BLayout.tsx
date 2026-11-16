import React from 'react';
import { LayoutProps } from './EscolarLayout';

export const B2BLayout: React.FC<LayoutProps> = ({
  children,
  title = 'Dossiê Corporativo & Balanço B2B',
  subtitle = 'Gestão financeira, contratos de academias e auditoria',
  activeTab,
  onTabChange,
  usuarioLogado,
  navItems = [],
  headerActions
}) => {
  return (
    <div className="min-h-screen w-full bg-[#0d0d10] text-zinc-100 font-serif antialiased rounded-none border-0 p-0 m-0">
      {/* HEADER EXECUTIVO COM BORDA INFERIOR SÓLIDA */}
      <header className="w-full bg-[#141418] border-b-2 border-amber-600/70 px-6 py-4 flex items-center justify-between rounded-none">
        <div>
          <span className="text-[10px] font-sans font-black uppercase tracking-widest text-amber-500 block">
            Corporativo & Convênios Marcias • Versão 0px
          </span>
          <h1 className="text-xl font-bold text-white tracking-wide">{title}</h1>
        </div>
        <div className="flex items-center gap-4 font-sans text-xs">
          <span className="text-zinc-400">Auditoria: <strong>Fechada</strong></span>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/40 rounded-none font-mono">
            REF: 2026-Q4
          </span>
          {headerActions}
        </div>
      </header>

      {/* CONTAINER GRID INVERTIDO: CONTEÚDO PRIMEIRO, SIDEBAR NA DIREITA */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] w-full min-h-[calc(100vh-73px)] rounded-none gap-0">
        {/* ÁREA PRINCIPAL À ESQUERDA (SEM ARREDONDAMENTOS, 0px) */}
        <main className="order-1 flex flex-col p-6 sm:p-8 border-r border-zinc-800 bg-[#101013] rounded-none overflow-y-auto space-y-6">
          <div className="pb-4 border-b border-zinc-800 flex justify-between items-center font-sans">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">{subtitle}</p>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              Operador: <span className="text-white font-bold">{usuarioLogado?.nome || 'Gestor Master'}</span>
            </div>
          </div>

          <div className="w-full font-sans">
            {children}
          </div>
        </main>

        {/* SIDEBAR NA DIREITA (FILTROS & AÇÕES RÁPIDAS) */}
        <aside className="order-2 w-full lg:w-[320px] bg-[#141418] border-l border-zinc-800/90 p-5 flex flex-col justify-between rounded-none font-sans shrink-0">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 pb-2 border-b border-zinc-800">
                Índice de Módulos & Dossiês
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">
                Selecione a tabela de controle consolidada:
              </p>
            </div>

            {/* Menu Vertical Direito */}
            <nav className="space-y-1 rounded-none">
              {navItems.map((item) => {
                const isActive = activeTab === item.id || activeTab === item.routeOrTab;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange && onTabChange(item.routeOrTab || item.id)}
                    className={`w-full flex items-center justify-between p-3 text-xs font-bold text-left rounded-none border-l-2 transition-all ${
                      isActive
                        ? 'border-amber-500 bg-zinc-900 text-amber-300 font-black pl-4'
                        : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{item.icon || '📑'}</span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 font-mono bg-black text-amber-400 border border-zinc-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Caixa de Resumo Rápido */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500">
                Sumário Fiscal B2B
              </span>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Repasse CTs:</span>
                <span className="text-emerald-400 font-mono font-bold">100% OK</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Contratos Assinados:</span>
                <span className="text-white font-mono font-bold">Ativos</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 text-center font-mono">
            CONTRATO REGISTRADO • PROTOCOLO 0px
          </div>
        </aside>
      </div>
    </div>
  );
};
