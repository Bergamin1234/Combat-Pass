import React from 'react';
import { ACADEMY_CONFIG } from '../../config/academyConfig';

export interface AdminArenaProLayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  usuarioLogado?: {
    nome?: string;
    email?: string;
    cargo?: string;
  };
  metricas?: {
    tatameOcupadoPercent?: number;
    atletasPresentes?: number;
    combatesOuAulasHoje?: number;
    checkinsExpresso?: number;
  };
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * SUB-LAYOUT: Admin / Central de Comando (Tema: Arena Pro Tatame)
 * Diretrizes:
 * - Abandona tabelas tradicionais: prioriza Cards de Luta, painel de ocupação ao vivo e gatilhos de Check-in Expresso
 * - Estética HUD de combate / eSports Arena, com alto contraste (carbono, vermelho neon e âmbar)
 * - Navegação de acesso ultra-rápido por cápsulas e comandos de tatame
 */
export const AdminArenaProLayout: React.FC<AdminArenaProLayoutProps> = ({
  children,
  activeTab = 'alunos',
  onTabChange,
  usuarioLogado,
  metricas,
  title = 'Centro de Operações de Combate & Tatame',
  subtitle = 'Monitoramento de ocupação em tempo real, check-ins expressos e painéis de tatame',
  headerActions
}) => {
  const arenaPills = [
    { id: 'chamada_diaria', label: 'Tatame Ao Vivo', icon: '⚡', hotkey: 'F1' },
    { id: 'alunos', label: 'Cards de Atletas', icon: '🥊', hotkey: 'F2' },
    { id: 'agendamentos', label: 'Leads & Ringue', icon: '🎯', hotkey: 'F3' },
    { id: 'financeiro_gestao', label: 'Passe & Caixa', icon: '💳', hotkey: 'F4' },
    { id: 'professores', label: 'Mestres & Cornermen', icon: '👑', hotkey: 'F5' },
    { id: 'ocupacao', label: 'Capacidade & Vagas', icon: '🔥', hotkey: 'F6' },
    { id: 'loja', label: 'Armaria / Loja CT', icon: '🛡️', hotkey: 'F7' },
  ];

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* Topo Tático HUD Arena */}
      <header className="h-16 bg-[#0e1015] border-b border-red-950/70 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center font-black text-white text-base shadow-lg shadow-red-900/40">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wider text-white">
                {ACADEMY_CONFIG.nome}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[9px] font-mono font-bold tracking-widest uppercase">
                ARENA PRO
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono block">
              CONSOLE MASTER DE TATAME // LIVE
            </span>
          </div>
        </div>

        {/* Status Rápido do Tatame */}
        <div className="hidden lg:flex items-center gap-5 bg-black/40 border border-zinc-800/80 px-4 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-zinc-300 font-bold">Tatame Ativo:</span>
            <span className="text-emerald-400 font-mono font-black">
              {metricas?.atletasPresentes ?? 38} Guerreiros
            </span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="text-zinc-400 font-mono">
            Ocupação: <span className="text-amber-400 font-bold">{metricas?.tatameOcupadoPercent ?? 82}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-zinc-500 font-mono block uppercase">
              Operador de Combate
            </span>
            <span className="text-xs font-bold text-zinc-200">
              {usuarioLogado?.nome || 'Comandante Geral'}
            </span>
          </div>
          <a
            href="/"
            className="px-3 py-1.5 rounded-md bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-xs font-bold transition"
          >
            Sair
          </a>
        </div>
      </header>

      {/* Barra Horizontal Superior de Comandos Rápidos do Arena Pro */}
      <div className="bg-[#0b0c10] border-b border-zinc-800 px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mr-2 shrink-0 hidden md:inline">
          Acesso Expresso:
        </span>
        {arenaPills.map(pill => {
          const isSelected = activeTab === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => onTabChange?.(pill.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-md shadow-red-950/60'
                  : 'bg-[#13151b] text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
              <span className="text-[9px] font-mono px-1 rounded bg-black/40 text-zinc-400">
                {pill.hotkey}
              </span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo Principal Focado em Cards Grandes e Check-in Expresso */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#07080a] to-[#0c0d12]">
        {/* Painel Tático de Entrada Rápida */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/20 via-[#101218] to-[#0e1015] border border-red-900/40 p-5 rounded-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                Painel Arena · Modo Operacional
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl">
              {subtitle}
            </p>
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>

        {/* 3 Blocos de Ação Rápida (Abandono de Tabelas Rígidas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0f1117] border border-zinc-800/80 hover:border-red-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400">⚡ Check-in Expresso</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Liberado
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {metricas?.checkinsExpresso ?? 24}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Check-ins validados na catraca/tatame na última hora.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0f1117] border border-zinc-800/80 hover:border-red-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400">🥊 Lutas & Treinos Hoje</span>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                Em Andamento
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {metricas?.combatesOuAulasHoje ?? 8} Aulas
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Turmas ativas com chamada sincronizada.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0f1117] border border-zinc-800/80 hover:border-red-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400">🛡️ Ocupação Máxima</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                Pico: 19:00
              </span>
            </div>
            <div className="text-2xl font-black text-amber-400">
              {metricas?.tatameOcupadoPercent ?? 82}%
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Capacidade do tatame principal monitorada.
            </p>
          </div>
        </div>

        {/* Content Container (Cards Grandes de Gestão) */}
        <div className="bg-[#0c0e14] border border-zinc-800/90 rounded-xl p-5 shadow-2xl">
          {children}
        </div>
      </main>
    </div>
  );
};
