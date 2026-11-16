import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface TorneiosSistemaEscolarLayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  metricas?: {
    torneiosAbertos?: number;
    inscritosTotal?: number;
    categoriasDisputa?: number;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Torneios / Secretaria de Competições (Tema: Sistema Escolar)
 * Diretrizes:
 * - Menu lateral à esquerda focado no comitê de arbitragem e inscrições escolares
 * - Tabelas formais de chaveamento, listagem de atletas inscritos por peso e idade
 * - Estética acadêmica institucional limpa e sóbria
 */
export const TorneiosSistemaEscolarLayout: React.FC<TorneiosSistemaEscolarLayoutProps> = ({
  children,
  activeTab = 'calendario',
  onTabChange,
  metricas,
  title = 'Secretaria de Torneios & Competições Escolares',
  subtitle = 'Inscrições oficiais, pesagem, regulamento marcial e chaveamento de categorias',
  headerActions
}) => {
  const tournamentTabs = [
    { id: 'calendario', label: 'Calendário de Torneios', icon: '📅' },
    { id: 'inscricoes', label: 'Ficha de Inscrição Escolar', icon: '📝' },
    { id: 'chaves', label: 'Tabela de Chaveamento', icon: '📊' },
    { id: 'pesagem', label: 'Pesagem & Categorias', icon: '⚖️' },
    { id: 'regulamento', label: 'Regulamento & Arbitragem', icon: '📜' },
  ];

  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Header Institucional de Torneios */}
      <header className="h-14 bg-[#141822] border-b border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-black text-blue-400 text-xs">
            🏆
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              {ACADEMY_CONFIG.nome}
            </span>
            <span className="text-[10px] text-blue-400 font-bold block -mt-0.5">
              Comitê de Torneios & Brackets
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
            <span>Torneios Ativos:</span>
            <span className="font-bold text-amber-400">{metricas?.torneiosAbertos ?? 3} abertos</span>
          </div>
          <a
            href="/"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            ← Voltar
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Menu Esquerdo: Inscrições e Regulamentos */}
        <aside className="w-64 bg-[#11151e] border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-800/80 bg-[#0d1017]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Arbitragem & Chaves
            </span>
            <p className="text-xs text-slate-400 leading-tight">
              Gestão de disputas internas e interestaduais.
            </p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {tournamentTabs.map(item => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-950/40'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Centro: Tabelas de Chaves e Inscrições */}
        <main className="flex-1 overflow-y-auto bg-[#0b0e14] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-blue-400 font-bold mb-1">
                <span>Competições</span>
                <span>/</span>
                <span className="text-slate-300">{title}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {subtitle}
              </p>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>

          <div className="bg-[#131720] border border-slate-800 rounded-xl p-5 shadow-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
