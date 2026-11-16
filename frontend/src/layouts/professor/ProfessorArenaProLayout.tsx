import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface ProfessorArenaProLayoutProps {
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
    turmaAtualNome?: string;
    horarioAtual?: string;
    presentesContados?: number;
    totalEsperados?: number;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  onActionChamadaRapida?: () => void;
  onActionMeritoMarcial?: () => void;
}

/**
 * SUB-LAYOUT: Professor / Diário de Borda de Tatame (Tema: Arena Pro Tatame)
 * Diretrizes Específicas do Prompt:
 * - Interface tipo HUD de Tatame
 * - Barra lateral focada na foto/nome do professor autenticado
 * - Botões de ação rápida para "Chamada" e "Mérito Marcial"
 * - Centro focado em cards horizontais para lista de alunos e calendário
 */
export const ProfessorArenaProLayout: React.FC<ProfessorArenaProLayoutProps> = ({
  children,
  activeTab = 'aula_atual',
  onTabChange,
  professor,
  metricas,
  title = 'HUD Docente de Tatame · Operação ao Vivo',
  subtitle = 'Chamada rápida em 1 clique, atribuição de mérito marcial e controle de round',
  headerActions,
  onActionChamadaRapida,
  onActionMeritoMarcial
}) => {
  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* Topo HUD Tático */}
      <header className="h-16 bg-[#0c0e14] border-b border-red-950/60 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-lg font-black text-white shadow-md shadow-red-900/40">
            🥋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wider text-white">
                {ACADEMY_CONFIG.nome}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[9px] font-mono font-bold tracking-widest">
                HUD PROFESSOR
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono block">
              DIÁRIO DE BORDA DE TATAME // LIVE
            </span>
          </div>
        </div>

        {/* Status da Aula Atual no Topo */}
        <div className="flex items-center gap-4 bg-black/50 border border-zinc-800/80 px-4 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-bold">
              {metricas?.turmaAtualNome || 'Muay Thai Adulto'}
            </span>
            <span className="text-zinc-500 font-mono">({metricas?.horarioAtual || '19:00 - 20:00'})</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="text-zinc-300 font-mono text-[11px]">
            Presentes:{' '}
            <span className="text-emerald-400 font-black">
              {metricas?.presentesContados ?? 18} / {metricas?.totalEsperados ?? 22}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold transition"
          >
            Sair
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Barra Lateral Esquerda focada na Foto/Nome do Professor e Botões de Ação Rápida */}
        <aside className="w-72 bg-[#0a0c10] border-r border-zinc-800/80 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-6">
            {/* Bloco de Identidade do Mestre / Professor */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#131722] to-[#0c0e14] border border-red-950/60 text-center relative overflow-hidden">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-1 shadow-xl shadow-red-950/50 mb-3">
                <div className="w-full h-full rounded-full bg-[#0a0c10] flex items-center justify-center overflow-hidden">
                  {professor?.foto ? (
                    <img src={professor.foto} alt={professor.nome} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🥋</span>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block mb-0.5">
                Mestre de Tatame
              </span>
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                {professor?.nome || 'Felipe Borü'}
              </h2>
              <span className="text-xs text-amber-400 font-bold block mt-0.5">
                {professor?.graduacao || 'Prajied Azul Escuro e Preto'}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">
                {professor?.modalidade || 'Muay Thai & Striking Coach'}
              </span>
            </div>

            {/* BOTÕES DE AÇÃO RÁPIDA OBRIGATÓRIOS DO PROMPT */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-1 block">
                Comandos de Ação Imediata:
              </span>

              {/* Botão de Ação Rápida 1: Chamada */}
              <button
                type="button"
                onClick={() => {
                  onTabChange?.('aula_atual');
                  onActionChamadaRapida?.();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 border border-red-400/40 transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">✅</span>
                  <span>Chamada Rápida</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-red-200">
                  1-CLIQUE
                </span>
              </button>

              {/* Botão de Ação Rápida 2: Mérito Marcial */}
              <button
                type="button"
                onClick={() => {
                  onTabChange?.('desempenho_alunos');
                  onActionMeritoMarcial?.();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 border border-amber-300/40 transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">⭐</span>
                  <span>Mérito Marcial</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-black font-bold">
                  +XP
                </span>
              </button>
            </div>

            {/* Menu de Sub-Navegação */}
            <nav className="space-y-1 pt-2 border-t border-zinc-800/80">
              {[
                { id: 'aula_atual', label: 'Diário de Presenças', icon: '📝' },
                { id: 'grade_semanal', label: 'Grade & Horários', icon: '📅' },
                { id: 'comissoes', label: 'Bônus & Repasses', icon: '💵' },
                { id: 'desempenho_alunos', label: 'Ranking da Turma', icon: '🏆' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-zinc-800 text-white font-bold border-l-2 border-red-500 pl-2.5'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Centro Focado em Cards Horizontais para Lista de Alunos e Calendário */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#060709] via-[#090b10] to-[#0c0e14]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold mb-1">
                <span>Controle de Borda de Tatame</span>
                <span>//</span>
                <span>Cards de Alunos</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                {title}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>

          {/* Área Principal de Cards Horizontais de Alunos e Calendário */}
          <div className="bg-[#0b0d13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
