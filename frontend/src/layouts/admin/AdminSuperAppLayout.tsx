import React from 'react';
import { PortalNavBar, InterfaceOption } from '../common/PortalNavBar';

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onInterfaceChange?: (option: InterfaceOption) => void;
  usuarioLogado?: any;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const AdminSuperAppLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab = 'alunos',
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Super-App Gestão Admin',
  subtitle = 'Interface tátil mobile-first para controle rápido de recepção',
  headerActions,
}) => {
  const bottomItems = [
    { id: 'alunos', label: 'Alunos', icon: '👥' },
    { id: 'caixa_diario', label: 'Caixa', icon: '💵' },
    { id: 'chamada_diaria', label: 'Chamada', icon: '✅' },
    { id: 'financeiro_gestao', label: 'Financeiro', icon: '💰' },
    { id: 'professores', label: 'Equipe', icon: '👑' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#070709] text-white font-sans antialiased flex flex-col justify-between pb-24">
      {/* 1. CONTAINER CENTRALIZADO COM LARGURA MÁXIMA RESTRITA */}
      <div className="w-full max-w-xl mx-auto flex flex-col min-h-screen bg-[#111114] border-x border-zinc-800/80 shadow-2xl relative">
        <PortalNavBar
          currentPortal="admin"
          currentInterface="super_app"
          onInterfaceChange={onInterfaceChange}
          variant="superapp"
          extraActions={headerActions}
        />

        {/* Minimalist Mobile Header */}
        <div className="px-4 py-3 bg-[#16161a] border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black text-white">{title}</h1>
            <p className="text-[10px] text-zinc-400">{subtitle}</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
            {activeTab.toUpperCase()}
          </span>
        </div>

        {/* Conteúdo Central em Cartões Mobile */}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {children}
        </main>
      </div>

      {/* 2. NAVEGAÇÃO FLUTUANTE NA BASE DA TELA (BOTTOM NAVIGATION) - SEM SIDEBARS */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-lg bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/60 rounded-2xl p-1.5 flex items-center justify-around shadow-2xl z-50">
        {bottomItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange && onTabChange(item.id)}
              className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white font-black shadow-lg shadow-red-900/40 scale-105'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px] uppercase tracking-wider font-bold truncate max-w-[65px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
