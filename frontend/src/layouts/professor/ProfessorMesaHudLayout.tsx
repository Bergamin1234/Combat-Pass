import React, { useState, useEffect } from 'react';
import { PortalNavBar, InterfaceOption } from '../common/PortalNavBar';

export interface ProfessorLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  usuarioLogado?: any;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const ProfessorMesaHudLayout: React.FC<ProfessorLayoutProps> = ({
  children,
  activeTab = 'aula_atual',
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Mesa Técnica do Tatame (HUD Professor)',
  subtitle = 'Chamada rápida touch, acompanhamento de alunos e mérito de combate',
  headerActions,
}) => {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const teacherTabs = [
    { id: 'aula_atual', label: 'Aula Atual / Chamada', icon: '⚡' },
    { id: 'grade_semanal', label: 'Grade & Vagas', icon: '📅' },
    { id: 'comissoes', label: 'Extrato de Comissões', icon: '💵' },
    { id: 'desempenho_alunos', label: 'Avaliações de Grau', icon: '🏅' },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0a0c] text-white font-sans antialiased">
      <PortalNavBar
        currentPortal="professor"
        currentInterface="mesa_hud"
        onInterfaceChange={onInterfaceChange}
        variant="hud"
        extraActions={headerActions}
      />

      {/* 1. BARRA HUD DENSA NO TOPO OCUPANDO 100% DA LARGURA (ZERO SIDEBAR) */}
      <div className="w-full bg-[#121215] border-b border-red-900/40 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/30 border-2 border-red-500/60 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-red-950/50">
            {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-red-600 text-white">
                Mestre de Tatame
              </span>
              <span className="text-xs font-mono text-zinc-400">⏱️ {clock.toLocaleTimeString('pt-BR')}</span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white mt-0.5">
              {usuarioLogado?.nome || 'Professor Especialista'}
            </h1>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO RÁPIDA: CHAMADA E MÉRITO MARCIAL */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>✅</span>
            <span>Chamada Touch</span>
          </button>
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-950/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🏅</span>
            <span>Mérito Marcial (+XP)</span>
          </button>
        </div>

        {/* Abas Horizontais da Mesa do Professor */}
        <div className="w-full border-t border-zinc-800/60 pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {teacherTabs.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60 border border-red-500'
                    : 'bg-[#18181d] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ÁREA DE CONTEÚDO EM LARGURA TOTAL COM CARDS HORIZONTAIS */}
      <main className="w-full flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
