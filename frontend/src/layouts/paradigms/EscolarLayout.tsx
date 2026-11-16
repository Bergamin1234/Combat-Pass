import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  usuarioLogado?: any;
  navItems?: Array<{ id: string; label: string; icon?: string; badge?: string; routeOrTab?: string }>;
  headerActions?: React.ReactNode;
}

export const EscolarLayout: React.FC<LayoutProps> = ({
  children,
  title = 'Sistema Escolar & Acadêmico',
  subtitle = 'Gestão pedagógica, diário de classe e frequência',
  activeTab,
  onTabChange,
  usuarioLogado,
  navItems = [],
  headerActions
}) => {
  return (
    <div className="flex flex-row min-h-screen w-full bg-slate-900 text-slate-100 font-sans antialiased">
      {/* 1. SIDEBAR FIXO NA ESQUERDA (w-64, h-screen) */}
      <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 p-4 shadow-xl z-20">
        <div className="space-y-6">
          {/* Header Acadêmico */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-black">
              🎓
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black uppercase tracking-wider text-white truncate">
                Portal Escolar
              </h1>
              <p className="text-[10px] text-slate-400 truncate">
                Diário & Quadro Docente
              </p>
            </div>
          </div>

          {/* Perfil do Usuário */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">
              {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'E'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {usuarioLogado?.nome || 'Usuário Acadêmico'}
              </p>
              <span className="text-[9px] font-mono uppercase text-blue-400">
                {usuarioLogado?.cargo || 'Secretaria'}
              </span>
            </div>
          </div>

          {/* Menu Lateral em Lista Escolar */}
          <nav className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 mb-2">
              Menu de Aulas & Notas
            </p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id || activeTab === item.routeOrTab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange && onTabChange(item.routeOrTab || item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span>{item.icon || '📄'}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
          Ano Letivo 2026 • Registro Escolar
        </div>
      </aside>

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL À DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        {/* Topbar Escolar */}
        <header className="h-16 px-6 bg-slate-950/70 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div>
            <h2 className="text-base font-black text-white">{title}</h2>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            {headerActions}
            <span className="px-2.5 py-1 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800/50 text-[11px] font-mono">
              Status: Ativo
            </span>
          </div>
        </header>

        {/* Miolo de Dados & Tabelas */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
