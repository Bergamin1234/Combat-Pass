import React from 'react';
import { PortalNavBar, InterfaceOption, PORTALS_LIST } from '../common/PortalNavBar';
import { BaseLayoutProps } from './CommandCenterLayout';

/**
 * 7. Layout 'Floating Island' (Glassmorphism / Estilo macOS)
 * Estrutura: Ilha flutuante centralizada sobre gradiente com backdrop-blur.
 * Não encosta nas bordas do navegador. Possui botões traffic lights macOS no topo.
 */
export const FloatingIslandLayout: React.FC<BaseLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Ilha Flutuante macOS Glass',
  subtitle = 'Interface desacoplada das bordas com backdrop-blur e controles de janela',
  headerActions,
  portal = 'aluno',
}) => {
  return (
    <div className="min-h-screen w-full p-2 sm:p-5 md:p-8 bg-gradient-to-br from-slate-950 via-[#180a2e]/60 to-slate-950 flex flex-col justify-center items-center font-sans antialiased text-white">
      {/* JANELA FLUTUANTE MACOS GLASS */}
      <div className="w-full max-w-7xl h-[94vh] rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-all duration-300">
        {/* 1. BARRA DE TÍTULO MACOS (WINDOW HEADER & TRAFFIC LIGHTS) */}
        <div className="w-full bg-slate-950/80 border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 select-none">
          {/* Botões Traffic Lights macOS */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] shadow hover:opacity-80 transition cursor-pointer" title="Fechar Janela" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] shadow hover:opacity-80 transition cursor-pointer" title="Minimizar Janela" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] shadow hover:opacity-80 transition cursor-pointer" title="Expandir Janela" />
            <span className="ml-3 text-[11px] font-mono font-bold text-purple-300/80 hidden sm:inline">
              Combat-Pass OS • Glass Island Window
            </span>
          </div>

          {/* Título Central */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              {title}
            </span>
          </div>

          {/* Controles da Direita */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onInterfaceChange && onInterfaceChange('escolar')}
              className="px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-black hover:bg-purple-900 transition cursor-pointer"
            >
              🏝️ ALTERNAR INTERFACE
            </button>
            {headerActions}
          </div>
        </div>

        {/* 2. DOCK DE NAVEGAÇÃO DE PORTAIS INTEGRADO */}
        <div className="w-full bg-slate-950/40 border-b border-white/5 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            {PORTALS_LIST.map((p) => {
              const isActive = portal === p.id;
              return (
                <a
                  key={p.id}
                  href={p.route}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-950/50'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </a>
              );
            })}
          </div>

          <div className="text-[11px] text-purple-300/80 font-mono">
            Operador: <strong className="text-white">{usuarioLogado?.nome || 'Atleta VIP'}</strong>
          </div>
        </div>

        {/* 3. CORPO DA JANELA: CONTEÚDO PRINCIPAL COM SCROLL SUAVE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin space-y-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-black text-white">{title}</h2>
              <p className="text-xs text-purple-200/70">{subtitle}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black">
              ● ILHA FLUTUANTE ATIVA
            </span>
          </div>

          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FloatingIslandLayout;
