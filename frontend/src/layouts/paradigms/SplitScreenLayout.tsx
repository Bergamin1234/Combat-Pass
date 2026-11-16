import React from 'react';
import { LayoutProps } from './EscolarLayout';

export const SplitScreenLayout: React.FC<LayoutProps> = ({
  children,
  title = 'Split-Screen Cockpit',
  subtitle = 'Visão dividida: controle fixo à esquerda e fluxo de dados à direita',
  activeTab,
  onTabChange,
  usuarioLogado,
  navItems = [],
  headerActions
}) => {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-black text-white font-sans antialiased">
      {/* 1. LADO ESQUERDO FIXO (40%) - ZERO SCROLL NA PÁGINA */}
      <aside className="w-full lg:w-[40%] h-full shrink-0 bg-gradient-to-br from-red-950 via-zinc-900 to-black p-6 sm:p-8 flex flex-col justify-between border-r border-zinc-800 shadow-2xl overflow-hidden relative">
        <div className="space-y-6 relative z-10">
          {/* Identidade Visual de Impacto */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-600/20 px-2.5 py-1 rounded-full border border-red-500/30">
              Split-Screen 40/60
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">
              {title}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Cartão de Resumo do Usuário Fixo */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-xl font-black text-red-300">
                🥊
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{usuarioLogado?.nome || 'Operador Combat'}</h4>
                <p className="text-xs text-zinc-400">{usuarioLogado?.email || 'Painel de Controle Central'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60 text-center">
              <div className="p-2 rounded-lg bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Conexão</span>
                <span className="text-xs font-black text-emerald-400">Ativa</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Perfil</span>
                <span className="text-xs font-black text-amber-400">{usuarioLogado?.cargo || 'Membro'}</span>
              </div>
            </div>
          </div>

          {/* Menu Lateral em Pílulas Verticais Grandes */}
          <nav className="space-y-1.5 max-h-[38vh] overflow-y-auto scrollbar-thin pr-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || activeTab === item.routeOrTab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange && onTabChange(item.routeOrTab || item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-red-600 text-white font-black shadow-lg shadow-red-950/60 translate-x-1'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{item.icon || '⚡'}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-red-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé Fixo */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 relative z-10">
          <span>Combat Split Engine</span>
          {headerActions}
        </div>
      </aside>

      {/* 2. LADO DIREITO (60%) - A ÚNICA ÁREA COM ROLAGEM */}
      <main className="w-full lg:w-[60%] h-full overflow-y-auto bg-zinc-950 p-6 sm:p-10 space-y-6">
        <div className="max-w-4xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
