import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface AlunoSistemaEscolarLayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  aluno?: {
    nome?: string;
    cpf?: string;
    matricula?: string;
    plano?: string;
    modalidade?: string;
    prajied?: string;
    foto?: string;
  };
  metricas?: {
    frequenciaPercent?: number;
    treinosMes?: number;
    proximaAula?: string;
    statusMensalidade?: string;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Aluno / Portal Acadêmico do Estudante (Tema: Sistema Escolar)
 * Diretrizes:
 * - Menu lateral à esquerda estilizado como carteirinha estudantil e boletim de presença
 * - Visual institucional limpo, organizado por módulos acadêmicos e tabelas
 * - Foco em frequência percentual escolar, histórico de graduações e grade de horários
 */
export const AlunoSistemaEscolarLayout: React.FC<AlunoSistemaEscolarLayoutProps> = ({
  children,
  activeTab = 'treinos',
  onTabChange,
  aluno,
  metricas,
  title = 'Portal do Aluno & Boletim de Frequência',
  subtitle = 'Acompanhe sua assiduidade escolar, grade de treinos e graduação oficial',
  headerActions
}) => {
  const studentNav = [
    { id: 'treinos', label: 'Diário de Presença & Check-in', icon: '📝' },
    { id: 'frequencia', label: 'Boletim de Frequência & Aulas', icon: '📅' },
    { id: 'conquistas', label: 'Histórico de Graduações', icon: '🎓' },
    { id: 'financeiro', label: 'Situação de Matrícula & Mensalidade', icon: '💳' },
    { id: 'contratos', label: 'Contrato de Prestação de Serviços', icon: '📄' },
    { id: 'avisos', label: 'Mural de Avisos da Direção', icon: '📢' },
  ];

  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Topo Acadêmico do Aluno */}
      <header className="h-14 bg-[#141822] border-b border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-black text-blue-400 text-xs">
            {ACADEMY_CONFIG.sigla || 'CT'}
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              {ACADEMY_CONFIG.nome}
            </span>
            <span className="text-[10px] text-blue-400 font-bold block -mt-0.5">
              Portal do Estudante Marcial
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
            <span>Frequência Bimestral:</span>
            <span className="font-bold text-emerald-400">
              {metricas?.frequenciaPercent ?? 92}%
            </span>
          </div>

          <a
            href="/"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            Sair
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Menu Esquerdo: Carteirinha & Boletim */}
        <aside className="w-64 bg-[#11151e] border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Carteirinha do Aluno no Topo da Barra */}
          <div className="p-4 border-b border-slate-800/80 bg-[#0d1017]">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 block">
                Carteira de Estudante
              </span>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-300">
                  {aluno?.nome ? aluno.nome.charAt(0) : 'A'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">
                    {aluno?.nome || 'Aluno Matriculado'}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    Plano: {aluno?.plano || 'Semestral 3x'}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                <span>Graduação:</span>
                <span className="font-semibold text-slate-200">
                  {aluno?.prajied || 'Branco e Ponta Vermelha'}
                </span>
              </div>
            </div>
          </div>

          {/* Navegação Acadêmica */}
          <nav className="flex-1 p-3 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 block my-2">
              Secretaria Online
            </span>
            {studentNav.map(item => {
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

        {/* Centro: Boletim & Conteúdo */}
        <main className="flex-1 overflow-y-auto bg-[#0b0e14] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-blue-400 font-bold mb-1">
                <span>Secretaria do Aluno</span>
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
