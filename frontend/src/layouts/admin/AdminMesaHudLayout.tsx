import React, { useState, useEffect } from 'react';
import { PortalNavBar, InterfaceOption } from '../common/PortalNavBar';

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  usuarioLogado?: any;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const AdminMesaHudLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab = 'alunos',
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Mesa de Operações & Tatame HUD (Admin)',
  subtitle = 'Painel de controle em tempo real, recepção expressa e telemetria',
  headerActions,
}) => {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hudTabs = [
    { id: 'alunos', label: 'Alunos 360°', icon: '👥' },
    { id: 'chamada_diaria', label: 'Tatame & Grade', icon: '⚡' },
    { id: 'caixa_diario', label: 'Caixa & Balcão', icon: '💵' },
    { id: 'financeiro_gestao', label: 'Financeiro', icon: '💰' },
    { id: 'comissoes', label: 'Comissões', icon: '🥋' },
    { id: 'ocupacao', label: 'Ocupação Ao Vivo', icon: '🔥' },
    { id: 'agendamentos', label: 'Aulas Exp.', icon: '🎯' },
    { id: 'gamificacao', label: 'Ranks & XP', icon: '🏆' },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#09090b] text-white font-sans antialiased">
      {/* 1. NAVBAR DENSA NO TOPO OCUPANDO 100% DA LARGURA (ZERO SIDEBAR) */}
      <PortalNavBar
        currentPortal="admin"
        currentInterface="mesa_hud"
        onInterfaceChange={onInterfaceChange}
        variant="hud"
        extraActions={headerActions}
      />

      {/* Faixa Tática HUD com Telemetria e Abas Rápidas */}
      <div className="w-full bg-[#121215] border-b border-red-900/40 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-red-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>ADMIN HUD</span>
          </div>
          <span className="text-sm font-black text-zinc-100 hidden sm:inline">{title}</span>
          <div className="bg-[#18181c] border border-zinc-800 px-2.5 py-0.5 rounded text-xs font-mono text-amber-400">
            ⏱️ {clock.toLocaleTimeString('pt-BR')}
          </div>
        </div>

        {/* Abas Horizontais da Mesa HUD */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {hudTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60 border border-red-500'
                    : 'bg-[#18181d] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ÁREA DE CONTEÚDO EM LARGURA TOTAL COM PAINÉIS AMPLOS */}
      <main className="w-full flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
