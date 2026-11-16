import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface AdminSistemaEscolarLayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  usuarioLogado?: {
    nome?: string;
    email?: string;
    cargo?: string;
  };
  metricas?: {
    totalAlunos?: number;
    alunosAtivos?: number;
    taxaPresencaMedia?: number;
    inadimplentes?: number;
    capacidadeOcupada?: number;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Admin / ERP Escolar (Tema: Sistema Escolar)
 * Diretrizes:
 * - Barra lateral longa à esquerda categorizada (Secretaria, Financeiro, Competitivo, Equipe)
 * - Painel de Indicadores (KPIs) no topo com estética institucional/acadêmica
 * - Área central ampla e contínua projetada para tabelas de alta densidade
 */
export const AdminSistemaEscolarLayout: React.FC<AdminSistemaEscolarLayoutProps> = ({
  children,
  activeTab = 'alunos',
  onTabChange,
  usuarioLogado,
  metricas,
  title = 'Secretaria Geral & Controle Acadêmico',
  subtitle = 'Gestão centralizada de matrículas, chamadas, mensalidades e corpo docente',
  headerActions
}) => {
  const menuCategories = [
    {
      category: 'Secretaria & Matrículas',
      items: [
        { id: 'alunos', label: 'Cadastro de Alunos', icon: '👥' },
        { id: 'agendamentos', label: 'Aulas Experimentais / Leads', icon: '🎯' },
        { id: 'contratos', label: 'Contratos & Termos', icon: '📄' },
        { id: 'avisos', label: 'Mural de Comunicados', icon: '📢' },
      ]
    },
    {
      category: 'Gestão Financeira & Caixa',
      items: [
        { id: 'financeiro_gestao', label: 'Mensalidades & Baixas', icon: '💰' },
        { id: 'caixa_diario', label: 'Livro Caixa Diário', icon: '🏦' },
        { id: 'comissoes', label: 'Comissões de Docentes', icon: '💵' },
        { id: 'loja', label: 'Mercado & Estoque CT', icon: '🛍️' },
      ]
    },
    {
      category: 'Pedagógico & Frequência',
      items: [
        { id: 'chamada_diaria', label: 'Diário de Presença', icon: '✅' },
        { id: 'calendario_geral', label: 'Calendário Letivo', icon: '📅' },
        { id: 'ocupacao', label: 'Lotação de Salas/Tatame', icon: '📊' },
      ]
    },
    {
      category: 'Corpo Docente & Turmas',
      items: [
        { id: 'professores', label: 'Corpo de Professores', icon: '🥋' },
        { id: 'grade_horaria', label: 'Grade & Horários', icon: '⏰' },
        { id: 'gamificacao', label: 'Graduações & Faixas', icon: '🏆' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Topo Institucional Escolar */}
      <header className="h-14 bg-[#161b22] border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sm font-black text-blue-400">
            {ACADEMY_CONFIG.sigla || 'CT'}
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              {ACADEMY_CONFIG.nome}
            </span>
            <span className="text-[10px] text-blue-400 font-bold block -mt-0.5">
              ERP Escolar Marcial · Diretoria
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-medium">Ano Letivo 2026/1</span>
          </div>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
              👑
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-slate-200 font-bold leading-tight">
                {usuarioLogado?.nome || 'Administrador Master'}
              </span>
              <span className="block text-[10px] text-slate-400">
                {usuarioLogado?.cargo || 'Diretoria Executiva'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Barra Lateral Longa à Esquerda (Categorizada) */}
        <aside className="w-64 bg-[#12161f] border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-800/80">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Módulos Acadêmicos
            </span>
            <p className="text-xs text-slate-300 leading-snug">
              Navegação estruturada por departamentos escolares.
            </p>
          </div>

          <nav className="flex-1 p-3 space-y-4">
            {menuCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 block mb-1">
                  {cat.category}
                </span>
                {cat.items.map(item => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange?.(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm font-bold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span className="text-sm shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-slate-800 bg-[#0d1017]">
            <a
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
            >
              <span>← Sair para o Site</span>
            </a>
          </div>
        </aside>

        {/* Área Central: KPIs no Topo + Ampla Área para Tabelas */}
        <main className="flex-1 overflow-y-auto bg-[#0b0e14] p-6 space-y-6">
          {/* Cabeçalho do Módulo & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-blue-400 font-bold mb-1">
                <span>ERP</span>
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

          {/* Painel de Indicadores Institucionais (KPIs Escolares) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#151923] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                Alunos Matriculados
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {metricas?.totalAlunos ?? metricas?.alunosAtivos ?? 142}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">94% matriculados ativos</span>
            </div>

            <div className="bg-[#151923] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                Taxa de Frequência
              </span>
              <span className="text-2xl font-black text-blue-400 mt-1 block">
                {metricas?.taxaPresencaMedia ?? 88}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Diário de classe sincronizado</span>
            </div>

            <div className="bg-[#151923] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                Inadimplência Escolar
              </span>
              <span className="text-2xl font-black text-rose-400 mt-1 block">
                {metricas?.inadimplentes ?? 4}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Regularização amigável</span>
            </div>

            <div className="bg-[#151923] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                Ocupação de Tatame
              </span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">
                {metricas?.capacidadeOcupada ?? 76}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Média dos turnos Tarde/Noite</span>
            </div>
          </div>

          {/* Área Central Ampla para Tabelas de Dados */}
          <div className="bg-[#131720] border border-slate-800 rounded-xl p-5 shadow-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
