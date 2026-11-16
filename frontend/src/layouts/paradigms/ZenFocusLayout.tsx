import React, { useState } from 'react';
import { LayoutProps } from './EscolarLayout';

export const ZenFocusLayout: React.FC<LayoutProps> = ({
  children,
  title = 'Zen Notion Focus',
  subtitle = 'Foco absoluto em leitura e produtividade com interface minimalista',
  activeTab,
  onTabChange,
  usuarioLogado,
  navItems = [],
  headerActions
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full items-center bg-[#0d0d0f] text-zinc-200 antialiased font-sans">
      {/* 1. BARRA SUPERIOR EXTREMAMENTE FINA E MINIMALISTA */}
      <header className="w-full max-w-3xl h-12 flex items-center justify-between px-4 border-b border-zinc-800/50 text-xs text-zinc-400 shrink-0 sticky top-0 bg-[#0d0d0f]/90 backdrop-blur-sm z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          <span className="font-mono text-zinc-300 font-semibold tracking-wide">{title}</span>
        </div>

        <div className="flex items-center gap-3">
          {headerActions}
          <button
            type="button"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-mono transition"
          >
            {showQuickMenu ? '✕ Fechar Menu' : '☰ Navegar'}
          </button>
        </div>
      </header>

      {/* GAVETA SUSPENSA DE NAVEGAÇÃO ZEN (QUANDO ACIONADA) */}
      {showQuickMenu && (
        <div className="w-full max-w-3xl px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || activeTab === item.routeOrTab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange && onTabChange(item.routeOrTab || item.id);
                    setShowQuickMenu(false);
                  }}
                  className={`px-3 py-1.5 rounded text-xs transition-all ${
                    isActive
                      ? 'bg-zinc-200 text-black font-black'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span className="mr-1.5">{item.icon || '•'}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CONTEÚDO PRINCIPAL EM COLUNA CENTRAL ESTREITA (MAX-W-3XL COM MARGENS GIGANTES) */}
      <main className="w-full max-w-3xl px-4 py-10 flex-1 space-y-8">
        <div className="space-y-1 pb-4 border-b border-zinc-800/40">
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-xs text-zinc-400">{subtitle}</p>
        </div>

        <div className="w-full space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};
