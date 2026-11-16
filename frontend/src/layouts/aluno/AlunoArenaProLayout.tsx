import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface AlunoArenaProLayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  aluno?: {
    nome?: string;
    apelido?: string;
    prajied?: string;
    xpTotal?: number;
    pointsDisponiveis?: number;
    streakSemanas?: number;
    foto?: string;
    modalidade?: string;
  };
  onQuickCheckIn?: () => void;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Aluno / Arena Fighter HUD (Tema: Arena Pro Tatame)
 * Diretrizes:
 * - HUD de combate pessoal do guerreiro
 * - Grande Fighter Card no topo com Streak de Fogo, Barra de XP e Points
 * - Bloco de Check-in Expresso em 1 clique
 * - Abandona tabelas clássicas e foca em cards horizontais de treino/luta
 */
export const AlunoArenaProLayout: React.FC<AlunoArenaProLayoutProps> = ({
  children,
  activeTab = 'treinos',
  onTabChange,
  aluno,
  onQuickCheckIn,
  title = 'Arena do Guerreiro · HUD Pessoal',
  subtitle = 'Check-in expresso, medalhas de streak, ranking e progressão de XP',
  headerActions
}) => {
  const arenaTabs = [
    { id: 'treinos', label: 'Check-in & Lutas', icon: '⚡' },
    { id: 'frequencia', label: 'Grade & Tatame', icon: '📅' },
    { id: 'conquistas', label: 'Trilha & XP', icon: '🏆' },
    { id: 'recompensas', label: 'Loja de Points', icon: '🪙' },
    { id: 'financeiro', label: 'Meu Passe', icon: '💳' },
    { id: 'avisos', label: 'Mural de Guerra', icon: '📢' },
  ];

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* Topo Tático Fighter */}
      <header className="h-16 bg-[#0c0e14] border-b border-red-950/60 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-lg font-black text-white shadow-md shadow-red-900/40">
            🥊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wider text-white">
                {ACADEMY_CONFIG.nome}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[9px] font-mono font-bold tracking-widest">
                FIGHTER HUD
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono block">
              PORTAL DO ATLETA // ARENA PRO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Botão de Check-in Expresso no Header */}
          <button
            type="button"
            onClick={onQuickCheckIn}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 border border-red-400/40 transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>⚡</span>
            <span>Check-in Expresso</span>
          </button>

          <a
            href="/"
            className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-bold transition"
          >
            Sair
          </a>
        </div>
      </header>

      {/* Fighter Card do Aluno (Banner de Status Superior) */}
      <div className="bg-gradient-to-r from-[#12151f] via-[#0e1017] to-[#140b0e] border-b border-zinc-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-950/50">
              <div className="w-full h-full rounded-[10px] bg-[#0c0d12] flex items-center justify-center text-2xl font-black text-white">
                {aluno?.foto ? (
                  <img src={aluno.foto} alt="Atleta" className="w-full h-full object-cover rounded-[10px]" />
                ) : (
                  '🥋'
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight uppercase">
                  {aluno?.nome || 'Guerreiro Combat'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  {aluno?.prajied || 'Prajied Vermelho'}
                </span>
              </div>
              <span className="text-xs text-zinc-400 block mt-0.5">
                {aluno?.modalidade || 'Muay Thai & MMA'} · Nível 12 Combatente
              </span>
            </div>
          </div>

          {/* Medidores de Guerra: Streak, XP e Points */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-zinc-800 flex items-center gap-2.5">
              <span className="text-xl">🔥</span>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block leading-tight">
                  Streak
                </span>
                <span className="text-xs font-black text-amber-400">
                  {aluno?.streakSemanas ?? 6} Semanas
                </span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-zinc-800 flex items-center gap-2.5">
              <span className="text-xl">⭐</span>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block leading-tight">
                  XP Total
                </span>
                <span className="text-xs font-black text-emerald-400">
                  {aluno?.xpTotal ?? 1420} XP
                </span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-zinc-800 flex items-center gap-2.5">
              <span className="text-xl">🪙</span>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block leading-tight">
                  Points
                </span>
                <span className="text-xs font-black text-amber-300">
                  {aluno?.pointsDisponiveis ?? 350} pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Rápida por Cápsulas */}
      <div className="bg-[#090b0e] border-b border-zinc-800 px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {arenaTabs.map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/60'
                  : 'bg-[#12141a] text-zinc-400 hover:text-white border-zinc-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo Principal com Foco em Cards de Luta */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#07080a] to-[#0c0d12]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase">
                {title}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>

          <div className="bg-[#0b0d13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
