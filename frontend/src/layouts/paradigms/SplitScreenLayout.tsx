import React from 'react';
import { PortalNavBar, InterfaceOption, PORTALS_LIST } from '../common/PortalNavBar';
import { BaseLayoutProps } from './CommandCenterLayout';

/**
 * 6. Layout 'Split Screen' (Painel Duplo 40/60)
 * Estrutura: Divisão vertical rígida 40/60.
 * Lado esquerdo (40%) totalmente fixo com navegação e status.
 * Lado direito (60%) exclusivo para rolagem e visualização do conteúdo principal.
 */
export const SplitScreenLayout: React.FC<BaseLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Divisão Tática 40/60',
  subtitle = 'Navegação fixa à esquerda e fluxo contínuo de dados à direita',
  headerActions,
  portal = 'aluno',
}) => {
  const getNavItemsByPortal = () => {
    if (portal === 'professor') {
      return [
        { id: 'chamada', label: 'Lista de Chamada & Avaliação', icon: '✅', badge: 'Ao Vivo' },
        { id: 'grade', label: 'Grade Multi-CT & Horários', icon: '📅', badge: 'Horários' },
        { id: 'comissoes', label: 'Extrato de Comissões & Ganhos', icon: '💵', badge: 'Repasse' },
        { id: 'merito', label: 'Bonificação de Mérito Técnico', icon: '🏅', badge: 'Bônus' }
      ];
    }

    if (portal === 'admin') {
      if (usuarioLogado?.cargo === 'ATENDENTE') {
        return [
          { id: 'alunos', label: 'Alunos & Nova Matrícula', icon: '👥', badge: 'Atend.' },
          { id: 'agendamentos', label: 'Leads & Aulas Experimentais', icon: '🎯', badge: 'Matrícula' },
          { id: 'chamada_diaria', label: 'Check-ins & Chamada do Dia', icon: '✅', badge: 'Ao Vivo' },
          { id: 'calendario_geral', label: 'Grade & Horários de Aulas', icon: '📅', badge: 'Horários' },
          { id: 'ocupacao', label: 'Ocupação & Vagas das Turmas', icon: '🔥', badge: 'Vagas' },
          { id: 'resgates_loja', label: 'Vouchers & Retiradas Recepção', icon: '🎟️', badge: 'Balcão' },
          { id: 'avisos', label: 'Mural de Avisos da Unidade', icon: '📢', badge: 'Avisos' }
        ];
      }
      return [
        { id: 'alunos', label: 'Alunos Matriculados & Dossiê', icon: '👥', badge: 'Roster' },
        { id: 'calendario_geral', label: 'Grade Oficial de Tatames', icon: '📅', badge: 'Tatames' },
        { id: 'financeiro_gestao', label: 'Gestão Financeira & Baixas', icon: '💰', badge: 'Contas' },
        { id: 'caixa_diario', label: 'Caixa Diário & PDV Recepção', icon: '💵', badge: 'Caixa' },
        { id: 'comissoes', label: 'Comissões dos Mestres', icon: '🥋', badge: 'Repasse' },
        { id: 'ocupacao', label: 'Ocupação & Lotação de Salas', icon: '🔥', badge: 'Lotação' },
        { id: 'avisos', label: 'Mural de Avisos da Rede', icon: '📢', badge: 'Avisos' },
        { id: 'gamificacao', label: 'Gestão de Gamificação & Níveis', icon: '🏆', badge: 'Regras' },
        { id: 'aparencia_layouts', label: 'Estúdio de Layouts & Temas', icon: '🎨', badge: 'Design' }
      ];
    }

    // Padrão: Portal do Aluno
    return [
      { id: 'treinos', label: 'Diário & Grade de Treinos', icon: '🥊', badge: 'Check-in' },
      { id: 'frequencia', label: 'Boletim & Calendário de Presença', icon: '📅', badge: '94%' },
      { id: 'conquistas', label: 'Gamificação & Trilha de XP', icon: '🏆', badge: 'Streak x8' },
      { id: 'torneios', label: 'Torneios & Brackets Oficiais', icon: '🏅', badge: 'Chaves' },
      { id: 'ranking', label: 'Ranking Geral & Desempenho', icon: '🥇', badge: 'Top CT' },
      { id: 'desempenho', label: 'Analytics & Radar Técnico', icon: '📊', badge: 'Radar' },
      { id: 'recompensas', label: 'Loja de Points & Resgates', icon: '🪙', badge: 'Points' },
      { id: 'contratos', label: 'Contrato de Matrícula & Termos', icon: '📄', badge: 'Digital' },
      { id: 'avisos', label: 'Comunicados & Mural de Avisos', icon: '📢', badge: 'Recados' },
      { id: 'mercado', label: 'Mercado do CT & Equipamentos', icon: '🥋', badge: 'Loja' },
      { id: 'financeiro', label: 'Mensalidades & Status de Acesso', icon: '💳', badge: 'Faturas' }
    ];
  };

  const splitNavItems = getNavItemsByPortal();

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* =========================================================================
          LADO ESQUERDO: 40% FIXO COM FUNDO DE DESTAQUE, NAVEGAÇÃO & SUMÁRIOS
          ========================================================================= */}
      <aside className="w-full lg:w-[40%] xl:w-[38%] h-auto lg:h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 border-r border-indigo-500/20 p-6 flex flex-col justify-between shrink-0 shadow-2xl overflow-y-auto scrollbar-thin">
        <div className="space-y-6">
          {/* Identidade do Split Screen */}
          <div className="flex items-center justify-between pb-4 border-b border-indigo-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-600/40">
                🌓
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block">
                  LAYOUT DUPLO 40/60
                </span>
                <h1 className="text-lg font-black text-white tracking-wide">
                  Combat-Pass Split
                </h1>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-900/60 border border-indigo-400/40 text-indigo-300 text-[10px] font-black">
              LADO FIXO
            </span>
          </div>

          {/* Cartão de Identidade do Atleta / Operador */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                  {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">{usuarioLogado?.nome || 'Operador Combat-Pass'}</h3>
                  <p className="text-[10px] text-indigo-300 font-mono">PORTAL: {portal.toUpperCase()}</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Conexão Ativa" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Status:</span>
                <span className="text-emerald-400 font-black">100% REGULAR</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Assiduidade:</span>
                <span className="text-indigo-300 font-black">94.8% MENSAL</span>
              </div>
            </div>
          </div>

          {/* Links Horizontais Rápidos para os 6 Portais */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400/80 block px-1">
              Portais do Ecossistema:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {PORTALS_LIST.map((p) => {
                const isActive = portal === p.id;
                return (
                  <a
                    key={p.id}
                    href={p.route}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      isActive
                        ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-900/40'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span className="truncate">{p.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Menu Vertical de Abas do Portal */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400/80 block px-1">
              Navegação do Módulo:
            </span>
            {splitNavItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange && onTabChange(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-950/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                    active ? 'bg-indigo-900/80 text-white' : 'bg-slate-950 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé do Lado Fixo */}
        <div className="pt-4 border-t border-indigo-500/20 text-[10px] text-indigo-400/60 flex items-center justify-between">
          <span>Split Screen Engine v8</span>
          <button
            type="button"
            onClick={() => onInterfaceChange && onInterfaceChange('escolar')}
            className="text-indigo-300 font-black hover:underline cursor-pointer"
          >
            Mudar Layout →
          </button>
        </div>
      </aside>

      {/* =========================================================================
          LADO DIREITO: 60% COM ROLAGEM EXCLUSIVA & CONTEÚDO PRINCIPAL
          ========================================================================= */}
      <section className="w-full lg:w-[60%] xl:w-[62%] h-screen bg-[#09090b] flex flex-col overflow-y-auto scrollbar-thin">
        {/* Barra Superior do Lado Direito */}
        <div className="sticky top-0 z-20 bg-[#09090b]/90 backdrop-blur-md p-4 px-6 border-b border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-sm font-black text-white">{title}</h2>
            <p className="text-xs text-zinc-400">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
              SCROLL ATIVO (60%)
            </span>
            {headerActions}
          </div>
        </div>

        {/* Conteúdo Dinâmico com Scroll */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </section>
    </div>
  );
};

export default SplitScreenLayout;
