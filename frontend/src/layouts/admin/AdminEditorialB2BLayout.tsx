import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface AdminEditorialB2BLayoutProps {
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
    receitaEstimada?: string;
    crescimentoMes?: string;
    taxaRetencao?: number;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Admin / ERP Executivo (Tema: Editorial B2B)
 * Diretrizes:
 * - Estrutura invertida com Menu Lateral à Direita (Índice / Dossiê Executivo)
 * - Área central ampla em formato de Matriz de Informações e Blocos Executivos
 * - Tipografia sofisticada, contrastes sóbrios e acabamento premium
 */
export const AdminEditorialB2BLayout: React.FC<AdminEditorialB2BLayoutProps> = ({
  children,
  activeTab = 'alunos',
  onTabChange,
  usuarioLogado,
  metricas,
  title = 'Dossiê Estratégico & Relatório Corporativo',
  subtitle = 'Análise de performance institucional, controle de receitas e governança',
  headerActions
}) => {
  const editorialSections = [
    {
      group: 'I. Ativos & Quadro Social',
      items: [
        { id: 'alunos', label: 'Matriz de Alunos Ativos', code: '01' },
        { id: 'agendamentos', label: 'Funil de Novos Integrantes', code: '02' },
        { id: 'contratos', label: 'Acordos & Adesões Vigentes', code: '03' },
      ]
    },
    {
      group: 'II. Finanças & Governança',
      items: [
        { id: 'financeiro_gestao', label: 'Balanço & Cobranças', code: '04' },
        { id: 'caixa_diario', label: 'Auditoria de Caixa', code: '05' },
        { id: 'comissoes', label: 'Repasses do Corpo Técnico', code: '06' },
        { id: 'loja', label: 'Patrimônio & Mercadorias', code: '07' },
      ]
    },
    {
      group: 'III. Operações de Tatame',
      items: [
        { id: 'chamada_diaria', label: 'Livro de Frequência', code: '08' },
        { id: 'professores', label: 'Quadro de Mestres & Professores', code: '09' },
        { id: 'ocupacao', label: 'Capacidade & Densidade Operacional', code: '10' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#edeef0] flex flex-col font-sans antialiased selection:bg-amber-600 selection:text-white">
      {/* Topbar Editorial com Tipografia Nobre */}
      <header className="h-16 bg-[#131317] border-b border-[#25252e] px-8 flex items-center justify-between z-20">
        <div className="flex items-baseline gap-4">
          <span className="font-serif text-lg font-bold tracking-wider text-amber-400 uppercase">
            {ACADEMY_CONFIG.nome}
          </span>
          <span className="text-xs tracking-widest uppercase text-zinc-500 font-mono hidden md:inline">
            // Relatório de Governança B2B
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-right hidden sm:block">
            <span className="text-zinc-400 block text-[10px] uppercase font-mono tracking-wider">
              Assinatura do Gestor
            </span>
            <span className="font-serif font-bold text-zinc-200">
              {usuarioLogado?.nome || 'Diretoria Geral'}
            </span>
          </div>
          <a
            href="/"
            className="px-3.5 py-1.5 rounded-sm bg-[#1c1c24] hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-[#2b2b36] hover:border-amber-500/40 text-[11px] font-mono uppercase tracking-wider transition"
          >
            Encerrar Sessão
          </a>
        </div>
      </header>

      {/* Grid Principal Invertido: Matriz no Centro/Esquerda + Menu Direito */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden">
        {/* Centro: Matriz Executiva de Informações */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#0a0a0c]">
          {/* Cabeçalho da Seção em Estilo Editorial */}
          <div className="border-b border-[#25252e] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block">
                Volume Executivo · Exercício Atual
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

          {/* Matriz de Indicadores Corporativos (KPIs em Grid Editorial) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-sm bg-[#141418] border border-[#23232c] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">
                Quadro de Atletas
              </span>
              <span className="font-serif text-2xl text-white block">
                {metricas?.totalAlunos ?? 142}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Índice consolidado</span>
            </div>

            <div className="p-4 rounded-sm bg-[#141418] border border-[#23232c] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">
                Retenção Trimestral
              </span>
              <span className="font-serif text-2xl text-emerald-400 block">
                {metricas?.taxaRetencao ?? 92.4}%
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">+3.8% vs. anterior</span>
            </div>

            <div className="p-4 rounded-sm bg-[#141418] border border-[#23232c] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">
                Adesão Contratual
              </span>
              <span className="font-serif text-2xl text-amber-300 block">
                {metricas?.crescimentoMes ?? '+18 m/m'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Planos trimestrais e anuais</span>
            </div>

            <div className="p-4 rounded-sm bg-[#141418] border border-[#23232c] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">
                Eficiência Operacional
              </span>
              <span className="font-serif text-2xl text-zinc-200 block">
                98.1%
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Auditoria de chamadas</span>
            </div>
          </div>

          {/* Matriz Central de Conteúdo */}
          <div className="bg-[#121216] border border-[#22222b] rounded-sm p-6 shadow-2xl">
            {children}
          </div>
        </main>

        {/* Menu Lateral Direito Invertido (Índice Editorial / Dossiê) */}
        <aside className="w-full lg:w-72 bg-[#121217] border-b lg:border-b-0 lg:border-l border-[#22222b] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-5 border-b border-[#22222b]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
              Índice Temático
            </span>
            <p className="text-xs text-zinc-400 font-serif italic">
              Navegação analítica por cadernos administrativos.
            </p>
          </div>

          <nav className="p-4 space-y-5 flex-1">
            {editorialSections.map((sec, idx) => (
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
