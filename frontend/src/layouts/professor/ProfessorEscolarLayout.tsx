import React from 'react';
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

export const ProfessorEscolarLayout: React.FC<ProfessorLayoutProps> = ({
  children,
  activeTab = 'aula_atual',
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Diário Docente Escolar',
  subtitle = 'Caderneta de chamadas, lançamento de presenças e assiduidade de turmas',
  headerActions,
}) => {
  const teacherTabs = [
    { id: 'aula_atual', label: 'Diário & Chamada Atual', icon: '⚡' },
    { id: 'grade_semanal', label: 'Quadro Semanal de Horários', icon: '📅' },
    { id: 'comissoes', label: 'Extrato de Aulas / Comissões', icon: '💵' },
    { id: 'desempenho_alunos', label: 'Avaliação & Notas Marciais', icon: '🏅' },
  ];

  return (
    <div className="flex flex-row min-h-screen w-full bg-slate-900 text-slate-100 font-sans antialiased">
      {/* 1. SIDEBAR FIXO NA ESQUERDA (w-64) FOCADO NO PROFESSOR AUTENTICADO */}
      <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between shadow-2xl z-20">
        <div className="space-y-6">
          {/* Header Docente */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-black">
              🥋
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-white">Corpo Docente</h2>
              <p className="text-[10px] text-slate-400">Diário do Professor</p>
            </div>
          </div>

          {/* Card do Professor Autenticado */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
              {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white truncate">{usuarioLogado?.nome || 'Professor Graduado'}</p>
              <span className="text-[10px] text-blue-400 font-mono block">Grau: Instrutor Master</span>
            </div>
          </div>

          {/* Menu Lateral Docente */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block px-2 mb-2">
              Menu do Professor
            </span>
            {teacherTabs.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange && onTabChange(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center font-mono">
          Ano Letivo 2026 • Registro Docente
        </div>
      </aside>

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL À DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        <PortalNavBar
          currentPortal="professor"
          currentInterface="escolar"
          onInterfaceChange={onInterfaceChange}
          variant="escolar"
          extraActions={headerActions}
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-base font-black text-white">{title}</h1>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-blue-300 text-xs font-mono">
              TURMA AO VIVO
            </span>
          </div>

          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
