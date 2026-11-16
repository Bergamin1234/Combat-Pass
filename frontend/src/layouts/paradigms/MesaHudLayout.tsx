import React, { useState, useEffect } from 'react';
import { LayoutProps } from './EscolarLayout';

export const MesaHudLayout: React.FC<LayoutProps> = ({
  children,
  title = 'Mesa Técnica & Tatame HUD',
  subtitle = 'Painel de comando operacional de lutas e chamada expressa',
  activeTab,
  onTabChange,
  usuarioLogado,
  navItems = [],
  headerActions
}) => {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0a0c] text-white font-sans antialiased">
      {/* 1. NAVBAR DENSA NO TOPO OCUPANDO 100% DA LARGURA (ZERO SIDEBAR) */}
      <header className="w-full bg-[#121215] border-b border-red-900/40 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl shrink-0 sticky top-0 z-30">
        {/* Identidade HUD & Relógio Militar */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-red-900/40">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>TATAME HUD</span>
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tight text-zinc-100 flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] text-zinc-500 font-normal hidden sm:inline">•</span>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">{subtitle}</span>
            </h1>
          </div>
        </div>

        {/* Telemetria de Tatame & Botões Rápidos */}
        <div className="flex items-center gap-2">
          <div className="bg-[#18181c] border border-zinc-800 px-3 py-1 rounded-lg text-xs font-mono font-bold text-amber-400">
            ⏱️ {clock.toLocaleTimeString('pt-BR')}
          </div>
          <button
            type="button"
            className="px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs font-black uppercase tracking-wider hover:bg-emerald-900/60 transition"
          >
            ⚡ Chamada Rápida
          </button>
          <button
            type="button"
            className="px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-500/50 text-amber-400 text-xs font-black uppercase tracking-wider hover:bg-amber-900/60 transition"
          >
            🏅 Mérito Marcial
          </button>
          {headerActions}
        </div>

        {/* Faixa Horizontal de Abas Densas (Menu Topo) */}
        <div className="w-full border-t border-zinc-800/60 pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = activeTab === item.id || activeTab === item.routeOrTab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange && onTabChange(item.routeOrTab || item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 border border-red-500'
                    : 'bg-[#18181d] text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <span>{item.icon || '🥊'}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-black/40 text-red-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. ÁREA DE CONTEÚDO EM LARGURA TOTAL COM PAINÉIS AMPLOS */}
      <main className="w-full flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
