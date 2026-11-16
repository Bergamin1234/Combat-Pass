import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface ProfessorSistemaEscolarLayoutProps {
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
    turmasHoje?: number;
    alunosAguardandoChamada?: number;
    presencaMediaTurmas?: number;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Professor / Diário Docente (Tema: Sistema Escolar)
 * Diretrizes:
 * - Menu lateral à esquerda focado na caderneta escolar do professor (Turmas, Diário, Chamadas)
 * - Identidade acadêmica, diário de classe clássico com tabelas densas de frequência
 * - Cabeçalho institucional com status do turno letivo
 */
export const ProfessorSistemaEscolarLayout: React.FC<ProfessorSistemaEscolarLayoutProps> = ({
  children,
  activeTab = 'aula_atual',
  onTabChange,
  professor,
  metricas,
  title = 'Diário Docente & Caderneta Acadêmica',
  subtitle = 'Lançamento de presenças, frequência escolar e plano de aula',
  headerActions
}) => {
  const teacherTabs = [
    { id: 'aula_atual', label: 'Chamada da Aula Atual', icon: '📝' },
    { id: 'grade_semanal', label: 'Minha Grade de Aulas', icon: '📅' },
    { id: 'desempenho_alunos', label: 'Avaliações & Notas de Alunos', icon: '🎓' },
    { id: 'comissoes', label: 'Relatório de Horas & Repasses', icon: '💵' },
    { id: 'avisos', label: 'Mural de Avisos da Secretaria', icon: '📢' },
  ];

  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Topo Acadêmico do Professor */}
      <header className="h-14 bg-[#141822] border-b border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎓</span>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              {ACADEMY_CONFIG.nome}
            </span>
            <span className="text-[10px] text-indigo-400 font-bold block -mt-0.5">
              Portal do Docente · Diário Escolar Oficial
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
            <span>Turmas Ativas:</span>
            <span className="font-bold text-indigo-400">{metricas?.turmasHoje ?? 4} hoje</span>
          </div>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-xs">
              {professor?.nome ? professor.nome.charAt(0) : 'P'}
            </div>
            <div className="hidden md:block text-left">
              <span className="block font-bold text-slate-200 leading-tight">
                Prof. {professor?.nome || 'Docente Marcial'}
              </span>
              <span className="block text-[10px] text-slate-400">
                {professor?.modalidade || 'Muay Thai & Jiu-Jitsu'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Menu Esquerdo: Caderneta Escolar */}
        <aside className="w-64 bg-[#11151e] border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Ficha Rápida do Professor */}
          <div className="p-4 border-b border-slate-800/80 bg-[#0d1017]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-lg">
                🥋
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-white truncate block">
                  {professor?.nome || 'Professor Cadastrado'}
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold block truncate">
                  {professor?.graduacao || 'Prajied / Faixa Titular'}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 block my-2">
              Caderneta de Aulas
            </span>
            {teacherTabs.map(item => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-950/40'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-800 bg-[#0d1017]">
            <a
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
            >
              ← Painel Público
            </a>
          </div>
        </aside>

        {/* Centro: Tabela de Chamada e Diário de Frequência */}
        <main className="flex-1 overflow-y-auto bg-[#0b0e14] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-bold mb-1">
                <span>Diário de Classe</span>
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
