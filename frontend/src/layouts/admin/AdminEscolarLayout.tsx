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

export const AdminEscolarLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab = 'alunos',
  onTabChange,
  onInterfaceChange,
  usuarioLogado,
  title = 'Administração Escolar (ERP)',
  subtitle = 'Secretaria, financeiro escolar, grade docente e gestão geral',
  headerActions,
}) => {
  const menuCategories = [
    {
      categoria: 'Secretaria & Matrículas',
      itens: [
        { id: 'alunos', label: 'Alunos & Visão 360°', icon: '👥' },
        { id: 'chamada_diaria', label: 'Diário & Chamadas', icon: '✅' },
        { id: 'agendamentos', label: 'Aulas Experimentais', icon: '🎯' },
        { id: 'avisos', label: 'Mural de Avisos', icon: '📢' },
      ],
    },
    {
      categoria: 'Financeiro & Contratos',
      itens: [
        { id: 'financeiro_gestao', label: 'Gestão Financeira', icon: '💰' },
        { id: 'caixa_diario', label: 'Caixa Diário (PDV)', icon: '💵' },
        { id: 'comissoes', label: 'Repasses & Comissões', icon: '🥋' },
      ],
    },
    {
      categoria: 'Corpo Docente & Turmas',
      itens: [
        { id: 'professores', label: 'Professores & Horários', icon: '👑' },
        { id: 'ocupacao', label: 'Ocupação de Salas', icon: '🔥' },
      ],
    },
    {
      categoria: 'Competitivo & Estoque',
      itens: [
        { id: 'gamificacao', label: 'Ranking & Ranks', icon: '🏆' },
        { id: 'loja', label: 'Estoque da Recepção', icon: '🛍️' },
        { id: 'resgates_loja', label: 'Vouchers e Resgates', icon: '🎟️' },
      ],
    },
  ];

  return (
    <div className="flex flex-row min-h-screen w-full bg-slate-900 text-slate-100 font-sans antialiased">
      {/* 1. SIDEBAR FIXO NA ESQUERDA (w-64, h-screen) COM CATEGORIAS */}
      <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between shadow-2xl z-20">
        <div className="space-y-5">
          {/* Header Secretaria */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-black">
              👑
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-black uppercase tracking-wider text-white truncate">
                ERP ESCOLAR
              </h2>
              <p className="text-[10px] text-slate-400 truncate">Diretoria & Secretaria</p>
            </div>
          </div>

          {/* Perfil Admin */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{usuarioLogado?.nome || 'Diretor Geral'}</p>
              <span className="text-[9px] font-mono text-blue-400 block">ADMINISTRADOR</span>
            </div>
          </div>

          {/* Menus Categorizados */}
          <nav className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin pr-1">
            {menuCategories.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block px-2">
                  {cat.categoria}
                </span>
                {cat.itens.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTabChange && onTabChange(item.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center font-mono">
          Combat-Pass ERP • v2.6
        </div>
      </aside>

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL À DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        <PortalNavBar
          currentPortal="admin"
          currentInterface="escolar"
          onInterfaceChange={onInterfaceChange}
          variant="escolar"
          extraActions={headerActions}
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header do Módulo Ativo */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-white">{title}</h1>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-blue-300 text-xs font-mono">
              MÓDULO: {activeTab.toUpperCase()}
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
