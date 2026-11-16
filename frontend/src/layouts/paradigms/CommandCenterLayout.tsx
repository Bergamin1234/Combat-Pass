import React, { useState, useEffect } from 'react';
import { PortalNavBar, InterfaceOption, PORTALS_LIST } from '../common/PortalNavBar';

export interface BaseLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  usuarioLogado?: any;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  portal?: 'admin' | 'professor' | 'aluno' | 'torneios' | 'ranking' | 'stats';
}

/**
 * 5. Layout 'Command Center' (Grid Terminal 12x6)
 * Estrutura: Terminal de segurança / painel de trader / IDE com grade rígida 12x6.
 * Zero rolagem na página inteira; scroll apenas no bloco interno de dados.
 */
export const CommandCenterLayout: React.FC<BaseLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Command Center Terminal v8.0',
  subtitle = 'Monitoramento tático de operações marciais, buffers e telemetria',
  headerActions,
  portal = 'aluno',
}) => {
  const [clock, setClock] = useState(new Date());
  const [logBuffer, setLogBuffer] = useState<string[]>([
    'SYS_BOOT: Kernel initialized [OK]',
    'NET_LINK: Latency 14ms (Node SP-BR)',
    'TATAME_FEED: 8 mats operational',
    'SECURITY: Encrypted session verified'
  ]);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const terminalTabs = [
    { id: 'treinos', label: 'CMD://TREINOS', icon: '🥊' },
    { id: 'frequencia', label: 'CMD://GRADE_PRESENCA', icon: '📅' },
    { id: 'conquistas', label: 'CMD://XP_EVOLUCAO', icon: '🏆' },
    { id: 'alunos', label: 'CMD://ROSTER_360', icon: '👥' },
    { id: 'chamada_diaria', label: 'CMD://CHAMADA_TATAME', icon: '⚡' },
    { id: 'caixa_diario', label: 'CMD://CAIXA_BALCAO', icon: '💵' },
    { id: 'financeiro_gestao', label: 'CMD://FINANCEIRO', icon: '💰' },
    { id: 'avisos', label: 'CMD://MURAL_BROADCAST', icon: '📢' },
  ];

  return (
    <div className="h-screen w-full bg-[#050508] text-emerald-400 font-mono overflow-hidden p-2 flex flex-col gap-2 antialiased select-none">
      {/* 1. TOPO: TERMINAL HEADER & TELEMETRIA GLOBAL (col-span-12) */}
      <header className="w-full bg-[#0a0a10] border border-emerald-500/30 rounded p-2.5 flex items-center justify-between gap-3 shrink-0 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 rounded bg-emerald-500 text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow">
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
            <span>TERMINAL 12x6</span>
          </div>
          <div>
            <div className="text-[11px] font-black text-emerald-300 tracking-wider">
              SYS://COMBAT-PASS.COMMAND_CENTER • {portal.toUpperCase()}
            </div>
            <div className="text-[9px] text-emerald-500/70">
              UPTIME: 99.98% | LATENCY: 12ms | BUFFER: SECURE
            </div>
          </div>
        </div>

        {/* Links dos Portais em Estilo Terminal */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#0e0e16] p-1 rounded border border-emerald-500/20">
          {PORTALS_LIST.map((p) => (
            <a
              key={p.id}
              href={p.route}
              className={`px-2 py-1 text-[11px] font-bold rounded transition ${
                portal === p.id
                  ? 'bg-emerald-500 text-black font-black'
                  : 'text-emerald-400/80 hover:bg-emerald-950/60 hover:text-emerald-300'
              }`}
            >
              {p.icon} {p.label.toUpperCase()}
            </a>
          ))}
        </div>

        {/* Controles do Terminal */}
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-emerald-300 px-2 py-1 bg-black rounded border border-emerald-500/40">
            {clock.toLocaleTimeString('pt-BR')}
          </div>
          <button
            type="button"
            onClick={() => onInterfaceChange && onInterfaceChange('escolar')}
            className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-black hover:bg-emerald-900 transition"
            title="Alternar Interface"
          >
            🖥️ LAYOUTS
          </button>
          {headerActions}
        </div>
      </header>

      {/* 2. CORPO DO GRID: MENU LATERAL ESQUERDO + CONTEÚDO PRINCIPAL */}
      <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">
        {/* Painel Esquerdo: Menu de Comandos (col-span-2) */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-[#09090e] border border-emerald-500/20 rounded p-2.5 flex flex-col justify-between overflow-y-auto scrollbar-thin">
          <div className="space-y-3">
            <div className="text-[10px] text-emerald-500/70 font-black tracking-widest border-b border-emerald-500/20 pb-1">
              [COMMAND_ROSTER]
            </div>

            {/* Usuário Ativo */}
            <div className="p-2 bg-[#050508] border border-emerald-500/30 rounded text-[10px] space-y-0.5">
              <div className="text-emerald-500/60">OPERATOR:</div>
              <div className="text-emerald-200 font-bold truncate">
                {usuarioLogado?.nome || 'ATLETA_AUTORIZADO'}
              </div>
              <div className="text-emerald-400/80">ACCESS: LEVEL_5_PRO</div>
            </div>

            {/* Teclas de Ação / Abas */}
            <div className="space-y-1">
              {terminalTabs.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onTabChange && onTabChange(t.id)}
                    className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-bold transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-black font-black shadow-md'
                        : 'text-emerald-400 hover:bg-emerald-950/60 hover:text-emerald-300'
                    }`}
                  >
                    <span className="truncate">{t.label}</span>
                    <span>{isActive ? '●' : '›'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buffer de Logs do Sistema */}
          <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[9px] text-emerald-500/60 space-y-0.5 font-mono">
            <div className="text-emerald-400 font-black">LOG_BUFFER:</div>
            {logBuffer.map((line, i) => (
              <div key={i} className="truncate">› {line}</div>
            ))}
          </div>
        </aside>

        {/* Painel Central: Dados do Sistema com Scroll EXCLUSIVAMENTE Interno (col-span-10) */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 bg-[#0c0c14] border border-emerald-500/30 rounded p-4 flex flex-col overflow-hidden shadow-2xl relative">
          {/* Barra de Status do Bloco */}
          <div className="pb-2 mb-3 border-b border-emerald-500/20 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-black text-emerald-200">{title}</span>
              <span className="text-emerald-500/60 text-[10px] hidden sm:inline">({subtitle})</span>
            </div>
            <div className="text-[10px] text-emerald-400 bg-black px-2 py-0.5 rounded border border-emerald-500/30">
              STREAM: ACTIVE // SCROLL_INTERNO_ATIVO
            </div>
          </div>

          {/* Área de Conteúdo Renderizada */}
          <div className="flex-1 overflow-y-auto scrollbar-thin text-slate-100 pr-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommandCenterLayout;
