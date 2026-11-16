import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface ProfessorEditorialB2BLayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  professor?: {
    nome?: string;
    modalidade?: string;
    graduacao?: string;
    email?: string;
    foto?: string;
  };
  metricas?: {
    turmasMinistradasMes?: number;
    indiceFidelizacaoAlunos?: number;
    horasAula?: number;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Professor / Metodologia & Gestão Técnica (Tema: Editorial B2B)
 * Diretrizes:
 * - Menu lateral invertido à direita (Índice Pedagógico / Sumário de Turmas)
 * - Matriz técnica de avaliação marcial, diário executivo e matriz curricular
 * - Acabamento sóbrio e editorial com tipografia refinada
 */
export const ProfessorEditorialB2BLayout: React.FC<ProfessorEditorialB2BLayoutProps> = ({
  children,
  activeTab = 'aula_atual',
  onTabChange,
  professor,
  metricas,
  title = 'Caderno Docente & Matriz Metodológica',
  subtitle = 'Acompanhamento do corpo discente, planos técnicos de aula e evolução biomecânica',
  headerActions
}) => {
  const editorialTeacherNav = [
    {
      group: 'I. Diário & Sessão Atual',
      items: [
        { id: 'aula_atual', label: 'Chamada & Registro do Treino', code: 'A1' },
        { id: 'grade_semanal', label: 'Programação de Horários', code: 'A2' },
      ]
    },
    {
      group: 'II. Matriz Curricular & Alunos',
      items: [
        { id: 'desempenho_alunos', label: 'Auditoria de Graduações', code: 'B1' },
        { id: 'comissoes', label: 'Balanço de Atendimentos', code: 'B2' },
        { id: 'avisos', label: 'Circulares Técnicas', code: 'B3' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] text-[#edeef0] flex flex-col font-sans antialiased selection:bg-amber-600 selection:text-white">
      {/* Topbar com assinatura do Mestre */}
      <header className="h-16 bg-[#131318] border-b border-[#25252e] px-8 flex items-center justify-between z-20">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-base font-bold tracking-wider text-amber-400 uppercase">
            {ACADEMY_CONFIG.nome}
          </span>
          <span className="text-xs tracking-widest uppercase text-zinc-500 font-mono hidden md:inline">
            // Conselho Docente & Metodologia
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-right hidden sm:block">
            <span className="text-zinc-500 block text-[9px] uppercase font-mono tracking-wider">
              Docente Responsável
            </span>
            <span className="font-serif font-bold text-zinc-200">
              Mestre {professor?.nome || 'Felipe Borü'}
            </span>
          </div>
          <a
            href="/"
            className="px-3.5 py-1.5 rounded-sm bg-[#1c1c24] hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-[#2b2b36] hover:border-amber-500/40 text-[11px] font-mono uppercase tracking-wider transition"
          >
            Encerrar
          </a>
        </div>
      </header>

      {/* Grid: Matriz Central + Menu Direito */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#0a0a0c]">
          <div className="border-b border-[#25252e] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block">
                Caderno Pedagógico · Docente Titular
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-white">
                {title}
              </h1>
              <p className="text-xs text-zinc-400 font-sans max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>

          {/* KPIs Metodológicos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-sm bg-[#141418] border border-[#23232c] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">
                Aulas Ministradas / Mês
              </span>
              <span className="font-serif text-2xl text-white block">
                {metricas?.turmasMinistradasMes ?? 46}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">100% registradas no diário</span>
            </div>

            <div className="p-4 rounded-sm bg-[#141418] border border-[#23232c] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">
                Índice de Retenção de Alunos
              </span>
              <span className="font-serif text-2xl text-emerald-400 block">
                {metricas?.indiceFidelizacaoAlunos ?? 95.8}%
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Assiduidade alta no tatame</span>
            </div>

            <div className="p-4 rounded-sm bg-[#141418] border border-[#23232c] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">
                Carga Horária Tatame
              </span>
              <span className="font-serif text-2xl text-amber-300 block">
                {metricas?.horasAula ?? 64}h
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Turnos Tarde e Noite</span>
            </div>
          </div>

          <div className="bg-[#121216] border border-[#22222b] rounded-sm p-6 shadow-2xl">
            {children}
          </div>
        </main>

        {/* Menu Direito: Dossiê Pedagógico */}
        <aside className="w-full lg:w-72 bg-[#121217] border-b lg:border-b-0 lg:border-l border-[#22222b] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-5 border-b border-[#22222b]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
              Sumário Metodológico
            </span>
            <p className="text-xs text-zinc-400 font-serif italic">
              Navegação nos cadernos de avaliação docente.
            </p>
          </div>

          <nav className="p-4 space-y-5 flex-1">
            {editorialTeacherNav.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="font-serif text-[11px] font-bold tracking-wide text-zinc-400 block px-2">
                  {sec.group}
                </span>
                <div className="space-y-0.5">
                  {sec.items.map(item => {
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange?.(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all text-left ${
                          isSelected
                            ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-500 font-semibold pl-2.5'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a22]'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="font-mono text-[10px] text-zinc-600 pl-2 shrink-0">
                          §{item.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};
