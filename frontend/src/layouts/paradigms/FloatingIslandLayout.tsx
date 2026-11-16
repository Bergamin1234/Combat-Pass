import React from 'react';
import { LayoutProps } from './EscolarLayout';

export const FloatingIslandLayout: React.FC<LayoutProps> = ({
  children,
  title = 'Floating Island Glass',
  subtitle = 'Interface flutuante glassmorphism estilo macOS com janelas desacopladas',
  activeTab,
  onTabChange,
  usuarioLogado,
  navItems = [],
  headerActions
}) => {
  return (
    <div className="h-screen w-full p-4 sm:p-6 md:p-8 lg:p-10 flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 text-white font-sans antialiased overflow-hidden">
      {/* 1. CARD GIGANTE FLUTUANTE COM EFEITO DE VIDRO (GLASSMORPHISM) */}
      <div className="w-full max-w-7xl h-full max-h-[92vh] flex flex-col rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-white/15 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* NAVBAR SUPERIOR ESTILO macOS DENTRO DA ILHA */}
        <header className="h-16 px-6 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
          {/* Botões Traffic Lights macOS */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/90 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm" />
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div>
              <h2 className="text-sm font-black tracking-tight text-white">{title}</h2>
              <p className="text-[10px] text-zinc-400 hidden sm:block">{subtitle}</p>
            </div>
          </div>

          {/* Abas e Ações da Ilha */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-md scrollbar-thin">
              {navItems.map((item) => {
                const isActive = activeTab === item.id || activeTab === item.routeOrTab;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange && onTabChange(item.routeOrTab || item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm border border-white/20 font-black'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.icon || '🏝️'}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            {headerActions}
          </div>
        </header>

        {/* 2. ÁREA DE CONTEÚDO ROLÁVEL DENTRO DA ILHA */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 scrollbar-thin">
          <div className="max-w-6xl w-full mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
