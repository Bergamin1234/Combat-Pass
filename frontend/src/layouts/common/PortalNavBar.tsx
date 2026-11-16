import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayoutEngine } from '../../config/layoutEngine';
import { THEMES_LIST } from '../../config/themeConfig';

export type InterfaceOption = 'escolar' | 'mesa_hud' | 'b2b_0px' | 'super_app';

export interface PortalNavBarProps {
  currentPortal: 'admin' | 'professor' | 'aluno' | 'torneios' | 'ranking' | 'stats';
  currentInterface: InterfaceOption;
  onInterfaceChange?: (option: InterfaceOption) => void;
  variant?: 'escolar' | 'hud' | 'b2b' | 'superapp';
  extraActions?: React.ReactNode;
}

export const INTERFACE_OPTIONS: Array<{ id: InterfaceOption; label: string; icon: string }> = [
  { id: 'escolar', label: '1. Escolar', icon: '🎓' },
  { id: 'mesa_hud', label: '2. Mesa HUD', icon: '⚡' },
  { id: 'b2b_0px', label: '3. B2B 0px', icon: '🏛️' },
  { id: 'super_app', label: '4. Super-App', icon: '📱' },
];

export const PORTALS_LIST: Array<{ id: string; label: string; route: string; icon: string }> = [
  { id: 'torneios', label: 'Torneios', route: '/portal?tab=torneios', icon: '🏆' },
  { id: 'ranking', label: 'Ranking', route: '/portal?tab=ranking', icon: '🌍' },
  { id: 'stats', label: 'Stats', route: '/portal?tab=desempenho', icon: '📊' },
  { id: 'aluno', label: 'Área do Aluno', route: '/portal', icon: '🥊' },
  { id: 'professor', label: 'Professor', route: '/professor', icon: '🥋' },
  { id: 'admin', label: 'Admin', route: '/admin', icon: '👑' },
];

export const PortalNavBar: React.FC<PortalNavBarProps> = ({
  currentPortal,
  currentInterface,
  onInterfaceChange,
  variant = 'escolar',
  extraActions,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences, setPalette } = useLayoutEngine();
  const [showPalettes, setShowPalettes] = useState(false);
  const [showInterfaceMenu, setShowInterfaceMenu] = useState(false);

  // Determina portal ativo conferindo pathname e query params
  const isPortalActive = (pId: string, pRoute: string) => {
    if (currentPortal === pId) return true;
    const fullCurrent = location.pathname + location.search;
    return fullCurrent === pRoute;
  };

  const handleInterfaceSelect = (id: InterfaceOption) => {
    try {
      localStorage.setItem(`combat_pass_interface_${currentPortal}`, id);
      localStorage.setItem('combat_pass_global_interface', id);
    } catch {}
    if (onInterfaceChange) {
      onInterfaceChange(id);
    }
    setShowInterfaceMenu(false);
  };

  const containerClasses = {
    escolar: 'bg-slate-950/80 border-b border-slate-800 text-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap',
    hud: 'bg-[#121215] border-b border-red-900/50 text-white px-4 py-2 flex items-center justify-between gap-3 flex-wrap shadow-xl',
    b2b: 'bg-[#141418] border-b-2 border-amber-600/70 text-zinc-200 px-4 py-2 flex items-center justify-between gap-3 flex-wrap rounded-none',
    superapp: 'bg-[#111114] border-b border-zinc-800 text-zinc-300 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto',
  }[variant];

  return (
    <header className={`${containerClasses} w-full sticky top-0 z-40 backdrop-blur-md`}>
      {/* 1. LINKS HORIZONTAIS DOS 6 PORTAIS */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
        {PORTALS_LIST.map((portal) => {
          const active = isPortalActive(portal.id, portal.route);
          return (
            <button
              key={portal.id}
              type="button"
              onClick={() => navigate(portal.route)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                variant === 'b2b' ? 'rounded-none' : ''
              } ${
                active
                  ? variant === 'hud'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/60 font-black'
                    : variant === 'b2b'
                    ? 'bg-zinc-800 text-amber-300 border-b-2 border-amber-500 font-black'
                    : 'bg-blue-600 text-white shadow-md font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <span>{portal.icon}</span>
              <span>{portal.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. CONTROLES: ALTERNAR INTERFACE, ORDENAR, PALETAS & AÇÕES */}
      <div className="flex items-center gap-2 shrink-0">
        {/* BOTÃO ALTERNAR INTERFACE COM DROPDOWN DAS 4 OPÇÕES */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowInterfaceMenu(!showInterfaceMenu)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
              variant === 'b2b' ? 'rounded-none' : ''
            } ${
              variant === 'hud'
                ? 'bg-red-950/40 border-red-700/60 text-red-300 hover:bg-red-900/60'
                : variant === 'b2b'
                ? 'bg-amber-950/30 border-amber-600/50 text-amber-300 hover:bg-amber-900/50'
                : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
            }`}
            title="Alternar entre as 4 opções de interface estruturais"
          >
            <span>🖥️</span>
            <span>Alternar Interface</span>
            <span className="text-[10px] opacity-70">▼</span>
          </button>

          {showInterfaceMenu && (
            <div className={`absolute right-0 mt-1.5 w-48 bg-[#18181c] border border-zinc-700 p-1.5 shadow-2xl z-50 animate-in fade-in ${
              variant === 'b2b' ? 'rounded-none' : 'rounded-2xl'
            }`}>
              <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 mb-1">
                Escolha a Interface:
              </div>
              {INTERFACE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleInterfaceSelect(opt.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    variant === 'b2b' ? 'rounded-none' : 'rounded-xl'
                  } ${
                    currentInterface === opt.id
                      ? 'bg-red-600 text-white font-black'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  {currentInterface === opt.id && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SELETOR DE PALETAS DE CORES */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPalettes(!showPalettes)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition border border-zinc-700/80 bg-zinc-900 text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer ${
              variant === 'b2b' ? 'rounded-none' : ''
            }`}
            title="Alternar paleta de cores"
          >
            <span>🎨</span>
            <span className="hidden sm:inline">Paletas</span>
          </button>

          {showPalettes && (
            <div className={`absolute right-0 mt-1.5 w-56 bg-[#18181c] border border-zinc-700 p-2 shadow-2xl z-50 max-h-72 overflow-y-auto scrollbar-thin ${
              variant === 'b2b' ? 'rounded-none' : 'rounded-2xl'
            }`}>
              <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-2 py-1 border-b border-zinc-800 mb-1">
                Paletas Semânticas
              </div>
              {THEMES_LIST.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setPalette(theme.id);
                    setShowPalettes(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between mb-1 ${
                    preferences.activePaletteId === theme.id
                      ? 'bg-zinc-800 text-white ring-1 ring-white/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
                    <span className="truncate">{theme.name.split(' (')[0]}</span>
                  </span>
                  <span className="text-[9px] uppercase font-mono opacity-60">({theme.mode})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {extraActions}
      </div>
    </header>
  );
};
