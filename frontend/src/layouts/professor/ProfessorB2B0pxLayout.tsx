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

export const ProfessorB2B0pxLayout: React.FC<ProfessorLayoutProps> = ({
  children,
  activeTab = 'comissoes',
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Dossiê Técnico & Prestação de Contas (Professor)',
  subtitle = 'Demonstrativo de horas-aula, matriz pedagógica e contratos vinculados',
  headerActions,
}) => {
  const b2bTeacherModules = [
    { id: 'comissoes', label: 'Balanço de Repasses (R$)', icon: '💵' },
    { id: 'grade_semanal', label: 'Quadro de Carga Horária', icon: '📅' },
    { id: 'aula_atual', label: 'Validação de Frequência', icon: '⚡' },
    { id: 'desempenho_alunos', label: 'Dossiê Técnico de Graduação', icon: '🏅' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0d0d10] text-zinc-100 font-serif antialiased rounded-none border-0 p-0 m-0">
      <PortalNavBar
        currentPortal="professor"
        currentInterface="b2b_0px"
        onInterfaceChange={onInterfaceChange}
        variant="b2b"
        extraActions={headerActions}
      />

      {/* HEADER TÉCNICO B2B 0px */}
      <div className="w-full bg-[#141418] border-b-2 border-amber-600/70 px-6 py-3.5 flex items-center justify-between rounded-none font-sans">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block">
            Corpo Docente Marcial • Protocolo B2B 0px
          </span>
          <h1 className="text-lg font-bold text-white font-serif">{title}</h1>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-400">Instrutor Contratado:</span>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/40 font-mono font-bold">
            {usuarioLogado?.nome || 'Prof. Titular'}
          </span>
        </div>
      </div>

      {/* GRID INVERTIDO: MATRIZ TÉCNICA À ESQUERDA, DOSSIÊ À DIREITA */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] w-full min-h-[calc(100vh-120px)] rounded-none gap-0">
        {/* ÁREA PRINCIPAL À ESQUERDA (0px) */}
        <main className="order-1 flex flex-col p-6 sm:p-8 border-r border-zinc-800 bg-[#101013] rounded-none overflow-y-auto space-y-6 font-sans">
          <div className="pb-3 border-b border-zinc-800 flex justify-between items-center text-xs">
            <span className="text-zinc-400">{subtitle}</span>
            <span className="font-mono text-emerald-400">STATUS: EM DIA</span>
          </div>

          <div className="w-full">
            {children}
          </div>
        </main>

        {/* SIDEBAR NA DIREITA */}
        <aside className="order-2 w-full lg:w-[320px] bg-[#141418] border-l border-zinc-800 p-5 flex flex-col justify-between rounded-none font-sans shrink-0">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 pb-2 border-b border-zinc-800">
                Menu de Prestação Docente
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">Selecione o relatório:</p>
            </div>

            <nav className="space-y-1">
              {b2bTeacherModules.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange && onTabChange(item.id)}
                    className={`w-full flex items-center justify-between p-3 text-xs font-bold text-left rounded-none border-l-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-500 bg-zinc-900 text-amber-300 font-black pl-4'
                        : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    {isActive && <span className="font-mono text-[10px]">●</span>}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Comissões Acumuladas</span>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Check-ins:</span>
                <span className="text-emerald-400 font-mono font-bold">Auditado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Repasse Previsto:</span>
                <span className="text-white font-mono font-bold">Em Aberto</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 text-center font-mono">
            DOCÊNCIA B2B • PROTOCOLO 0px
          </div>
        </aside>
      </div>
    </div>
  );
};
