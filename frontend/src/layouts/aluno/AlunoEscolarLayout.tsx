import React from 'react';
import { PortalNavBar, InterfaceOption } from '../common/PortalNavBar';

export interface AlunoLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  usuarioLogado?: any;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const AlunoEscolarLayout: React.FC<AlunoLayoutProps> = ({
  children,
  activeTab = 'treinos',
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Boletim & Frequência Escolar do Aluno',
  subtitle = 'Acompanhamento acadêmico de presenças, carteirinha e comunicados',
  headerActions,
}) => {
  const studentTabs = [
    { id: 'treinos', label: 'Início & Diário de Treinos', icon: '🥊' },
    { id: 'frequencia', label: 'Boletim de Presença', icon: '📅' },
    { id: 'conquistas', label: 'Evolução de Faixa / Prajied', icon: '🏆' },
    { id: 'recompensas', label: 'Créditos & Loja Points', icon: '🪙' },
    { id: 'contratos', label: 'Contrato de Matrícula', icon: '📄' },
    { id: 'avisos', label: 'Mural de Avisos da Escola', icon: '📢' },
  ];

  return (
    <div className="flex flex-row min-h-screen w-full bg-slate-900 text-slate-100 font-sans antialiased">
      {/* 1. SIDEBAR FIXO NA ESQUERDA (w-64) CARTEIRINHA DO ALUNO */}
      <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between shadow-2xl z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-black">
              🥊
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-white">Aluno Registrado</h2>
              <p className="text-[10px] text-slate-400">Matrícula Regular</p>
            </div>
          </div>

          {/* Carteirinha Escolar do Aluno */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate">{usuarioLogado?.nome || 'Atleta Aluno'}</p>
                <span className="text-[10px] text-blue-400 font-mono block">Matrícula: #2026-CT</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Plano:</span>
                <span className="text-white font-bold">Passaporte Livre</span>
              </div>
              <div className="flex justify-between">
                <span>Situação:</span>
                <span className="text-emerald-400 font-bold">REGULAR</span>
              </div>
            </div>
          </div>

          {/* Menu Lateral do Aluno */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block px-2 mb-2">
              Menu do Praticante
            </span>
            {studentTabs.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange && onTabChange(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center font-mono">
          Combat-Pass • Portal Escolar
        </div>
      </aside>

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL À DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        <PortalNavBar
          currentPortal="aluno"
          currentInterface="escolar"
          onInterfaceChange={onInterfaceChange}
          variant="escolar"
          extraActions={headerActions}
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-base font-black text-white">{title}</h1>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-blue-300 text-xs font-mono">
              ANO LETIVO ATIVO
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
