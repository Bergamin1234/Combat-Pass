import React from 'react';
import { LayoutProps } from './EscolarLayout';

export const SuperAppLayout: React.FC<LayoutProps> = ({
  children,
  title = 'Combat Super-App',
  subtitle = 'Experiência mobile-first para praticantes e mestres',
  activeTab,
  onTabChange,
  usuarioLogado,
  navItems = [],
  headerActions
}) => {
  return (
    <div className="min-h-screen w-full bg-[#070709] text-white font-sans antialiased flex flex-col justify-between pb-24">
      {/* 1. CONTAINER CENTRALIZADO COM LARGURA MÁXIMA RESTRITA */}
      <div className="w-full max-w-xl mx-auto flex flex-col min-h-screen bg-[#111114] border-x border-zinc-800/80 shadow-2xl relative">
        
        {/* NAVBAR MINIMALISTA NO TOPO */}
        <header className="sticky top-0 z-40 bg-[#111114]/90 backdrop-blur-md px-4 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-black text-xs text-white shadow-md">
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-tight">{title}</h1>
              <p className="text-[10px] text-zinc-400 leading-tight">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-300 font-bold">
              {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO PRINCIPAL (MOBILE CARD FLOW) */}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {children}
        </main>
      </div>

      {/* 2. NAVEGAÇÃO FLUTUANTE NA BASE DA TELA (BOTTOM NAVIGATION) - SEM SIDEBARS */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-lg bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/60 rounded-2xl p-1.5 flex items-center justify-around shadow-2xl shadow-black/90 z-50">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeTab === item.id || activeTab === item.routeOrTab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange && onTabChange(item.routeOrTab || item.id)}
              className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                isActive
                  ? 'bg-red-600 text-white font-black shadow-lg shadow-red-900/40 scale-105'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon || '🥊'}</span>
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
