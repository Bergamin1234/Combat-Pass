import React, { useState, useEffect } from 'react';
import { LayoutProps } from './EscolarLayout';

export const CommandCenterLayout: React.FC<LayoutProps> = ({
  children,
  title = 'Command Center Terminal',
  subtitle = 'Painel de telemetria operacional, streams e consoles',
  activeTab,
  onTabChange,
  usuarioLogado,
  navItems = [],
  headerActions
}) => {
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full grid grid-cols-12 grid-rows-6 gap-2 p-2 bg-black text-emerald-400 font-mono overflow-hidden select-none antialiased">
      {/* 1. NAVBAR EMBUTIDA NO TOPO (COL-SPAN-12 ROW-SPAN-1) */}
      <div className="col-span-12 row-span-1 bg-zinc-950 border border-emerald-500/40 p-2.5 px-4 flex items-center justify-between rounded shadow-lg shadow-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SYS_ONLINE</span>
          </div>
          <span className="text-white text-xs font-bold uppercase tracking-widest hidden sm:inline">
            // {title}
          </span>
          <span className="text-zinc-500 text-[10px] hidden md:inline">[{subtitle}]</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-400 font-mono text-[11px] hidden sm:inline">
            LATENCY: <strong className="text-emerald-300">12ms</strong> • MEM: <strong className="text-emerald-300">64MB</strong>
          </span>
          <div className="bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded text-emerald-300 text-xs font-bold">
            {timestamp.toISOString().split('T')[1].slice(0, 8)} UTC
          </div>
          {headerActions}
        </div>
      </div>

      {/* 2. MENU LATERAL EM BLOCO À ESQUERDA (COL-SPAN-12 MD:COL-SPAN-3 LG:COL-SPAN-2 ROW-SPAN-5) */}
      <div className="col-span-12 md:col-span-3 lg:col-span-2 row-span-5 bg-zinc-950 border border-emerald-500/30 p-2.5 flex flex-col justify-between overflow-y-auto rounded scrollbar-thin">
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-500/70 border-b border-zinc-800 pb-1.5 flex items-center justify-between">
            <span>&gt;_ ROUTE_INDEX</span>
            <span className="text-[9px] text-zinc-600">[{navItems.length}]</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const isActive = activeTab === item.id || activeTab === item.routeOrTab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange && onTabChange(item.routeOrTab || item.id)}
                  className={`w-full text-left px-2.5 py-2 rounded text-xs transition-all flex items-center justify-between font-mono ${
                    isActive
                      ? 'bg-emerald-500 text-black font-black shadow-md'
                      : 'text-zinc-400 hover:text-emerald-300 hover:bg-zinc-900/80 border border-transparent hover:border-emerald-500/20'
                  }`}
                >
                  <span className="truncate flex items-center gap-1.5">
                    <span className="opacity-60">{`0${idx + 1}`.slice(-2)}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-[9px] px-1 rounded bg-black/60 text-emerald-300 font-sans font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé do Terminal Lateral */}
        <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 space-y-1">
          <p className="truncate">USER: {usuarioLogado?.nome || 'ROOT_OPERATOR'}</p>
          <p className="text-[9px] text-emerald-600 font-black">STATION: COMBAT_NODE_01</p>
        </div>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL (COL-SPAN-12 MD:COL-SPAN-9 LG:COL-SPAN-10 ROW-SPAN-5) */}
      <div className="col-span-12 md:col-span-9 lg:col-span-10 row-span-5 bg-zinc-950/80 border border-emerald-500/40 p-4 sm:p-6 overflow-y-auto rounded scrollbar-thin font-sans text-zinc-100">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
