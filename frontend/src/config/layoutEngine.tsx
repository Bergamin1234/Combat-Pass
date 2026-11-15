import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES_LIST, applyPlatformTheme, getCurrentPlatformTheme } from './themeConfig';

export type JourneyKey = 'landing' | 'student' | 'teacher' | 'admin';

export type LandingPresetId = 'marketplace' | 'corporate' | 'tatame' | 'classic';
export type StudentPresetId = 'tatame_express' | 'gamified_journey' | 'agenda_control' | 'complete_tabs';
export type TeacherPresetId = 'tatame_fast' | 'technical_perf' | 'partner_portal';
export type AdminPresetId = 'executive' | 'operational_360' | 'customizer_studio' | 'complete_erp';
export type LoadingStyleId = 'skeleton' | 'minimal_bar' | 'combat_pulse' | 'step_progress';

export interface OrderedNavItem {
  id: string;
  label: string;
  icon: string;
  routeOrTab: string;
  visible: boolean;
  badge?: string;
}

export interface OrderedSectionItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  visible: boolean;
}

export interface LayoutPreferencesSchema {
  activePaletteId: string;
  layoutPreset: {
    landing: LandingPresetId;
    student: StudentPresetId;
    teacher: TeacherPresetId;
    admin: AdminPresetId;
  };
  loadingStyle: LoadingStyleId;
  defaultEntryPage: 'landing' | 'academias' | 'grade' | 'planos' | 'portal' | 'professor' | 'admin';
  defaultTabByJourney: {
    landing: string;
    student: string;
    teacher: string;
    admin: string;
  };
  routeOrder: Record<JourneyKey, OrderedNavItem[]>;
  sectionOrder: Record<JourneyKey, OrderedSectionItem[]>;
  updatedAt: string;
}

export const DEFAULT_LAYOUT_PREFERENCES: LayoutPreferencesSchema = {
  activePaletteId: getCurrentPlatformTheme() || 'neutral-dark',
  layoutPreset: {
    landing: 'marketplace',
    student: 'tatame_express',
    teacher: 'tatame_fast',
    admin: 'executive'
  },
  loadingStyle: 'combat_pulse',
  defaultEntryPage: 'landing',
  defaultTabByJourney: {
    landing: 'marketplace',
    student: 'treinos',
    teacher: 'aula_atual',
    admin: 'alunos'
  },
  routeOrder: {
    landing: [
      { id: 'nav_hub', label: 'Vitrine de Academias', icon: '🏛️', routeOrTab: '#academias', visible: true },
      { id: 'nav_grade', label: 'Grade Oficial ao Vivo', icon: '📅', routeOrTab: '#grade', visible: true },
      { id: 'nav_passes', label: 'Passes Unificados', icon: '🎫', routeOrTab: '#passes', visible: true },
      { id: 'nav_recompensas', label: 'Loja & Gamificação', icon: '🪙', routeOrTab: '#recompensas', visible: true },
      { id: 'nav_credenciar', label: 'Credenciar Academia', icon: '🤝', routeOrTab: '#credenciamento', visible: true },
      { id: 'nav_aluno', label: 'Portal do Aluno', icon: '🥊', routeOrTab: '/portal', visible: true },
      { id: 'nav_prof', label: 'Acesso Professor', icon: '🥋', routeOrTab: '/professor', visible: true },
      { id: 'nav_admin', label: 'ERP Admin & Studio', icon: '👑', routeOrTab: '/admin', visible: true }
    ],
    student: [
      { id: 'treinos', label: 'Início & Check-in', icon: '🥊', routeOrTab: 'treinos', visible: true },
      { id: 'frequencia', label: 'Grade de Horários & %', icon: '📅', routeOrTab: 'frequencia', visible: true },
      { id: 'conquistas', label: 'Minha Evolução & XP', icon: '🏆', routeOrTab: 'conquistas', visible: true },
      { id: 'recompensas', label: 'Loja de Points', icon: '🪙', routeOrTab: 'recompensas', visible: true },
      { id: 'contratos', label: 'Meus Contratos', icon: '📄', routeOrTab: 'contratos', visible: true },
      { id: 'financeiro', label: 'Meu Passe & Plano', icon: '💳', routeOrTab: 'financeiro', visible: true },
      { id: 'torneios', label: 'Torneios & Brackets', icon: '🏅', routeOrTab: 'torneios', visible: true },
      { id: 'ranking', label: 'Ranking Global', icon: '🌍', routeOrTab: 'ranking', visible: true },
      { id: 'desempenho', label: 'Analytics Ao Vivo', icon: '📊', routeOrTab: 'desempenho', visible: true },
      { id: 'avisos', label: 'Mural de Avisos', icon: '📢', routeOrTab: 'avisos', visible: true },
      { id: 'mercado', label: 'Mercado do CT', icon: '🛍️', routeOrTab: 'mercado', visible: true }
    ],
    teacher: [
      { id: 'aula_atual', label: 'Aula Atual / Chamada', icon: '⚡', routeOrTab: 'aula_atual', visible: true },
      { id: 'grade_semanal', label: 'Minha Grade & Vagas', icon: '📅', routeOrTab: 'grade_semanal', visible: true },
      { id: 'comissoes', label: 'Minhas Comissões', icon: '💵', routeOrTab: 'comissoes', visible: true },
      { id: 'desempenho_alunos', label: 'Desempenho & XP Bônus', icon: '🏅', routeOrTab: 'desempenho_alunos', visible: true }
    ],
    admin: [
      { id: 'aparencia_layouts', label: 'Aparência & Layouts', icon: '🎨', routeOrTab: 'aparencia_layouts', visible: true },
      { id: 'alunos', label: 'Visão 360 Alunos', icon: '👥', routeOrTab: 'alunos', visible: true },
      { id: 'chamada_diaria', label: 'Grade & Check-ins', icon: '✅', routeOrTab: 'chamada_diaria', visible: true },
      { id: 'financeiro_gestao', label: 'Contratos & Financeiro', icon: '💰', routeOrTab: 'financeiro_gestao', visible: true },
      { id: 'caixa_diario', label: 'Caixa Diário (PDV)', icon: '💵', routeOrTab: 'caixa_diario', visible: true },
      { id: 'comissoes', label: 'Comissões Professores', icon: '🥋', routeOrTab: 'comissoes', visible: true },
      { id: 'ocupacao', label: 'Academias & Ocupação', icon: '🔥', routeOrTab: 'ocupacao', visible: true },
      { id: 'resgates_loja', label: 'Vouchers & Loja Points', icon: '🎟️', routeOrTab: 'resgates_loja', visible: true },
      { id: 'gamificacao', label: 'Gamificação & Ranks', icon: '🏆', routeOrTab: 'gamificacao', visible: true },
      { id: 'professores', label: 'Professores & Equipe', icon: '👑', routeOrTab: 'professores', visible: true },
      { id: 'agendamentos', label: 'Leads & Aulas Exp.', icon: '🎯', routeOrTab: 'agendamentos', visible: true },
      { id: 'loja', label: 'Estoque Físico', icon: '🛍️', routeOrTab: 'loja', visible: true },
      { id: 'avisos', label: 'Mural de Avisos', icon: '📢', routeOrTab: 'avisos', visible: true }
    ]
  },
  sectionOrder: {
    landing: [
      { id: 'hero', label: 'Hero & Proposta de Valor', description: 'Destaque principal com busca rápida ou manifesto corporativo', icon: '⚡', visible: true },
      { id: 'ct_search', label: 'Buscador & Vitrine de CTs Credenciados', description: 'Filtro por cidade, modalidade, horário e distância', icon: '🏛️', visible: true },
      { id: 'live_schedule', label: 'Grade Oficial de Aulas ao Vivo', description: 'Horários em tempo real com [HÁ VAGAS], [LOTADO] e aulas canceladas riscadas', icon: '📅', visible: true },
      { id: 'passes_plans', label: 'Comparativo de Passes Unificados', description: 'Planos Combat-Pass Silver, Gold, Black e Corporativo', icon: '🎫', visible: true },
      { id: 'rewards_showcase', label: 'Vitrine de Recompensas & Gamificação', description: 'Luvas, kimonos e equipamentos resgatáveis por Combat Points', icon: '🪙', visible: true },
      { id: 'testimonials', label: 'Indicadores de Autoridade & Depoimentos', description: 'Métricas da rede, mestres parceiros e atletas', icon: '🏆', visible: true },
      { id: 'accreditation', label: 'Credenciamento de Novas Academias & B2B', description: 'Formulário oficial para cadastrar novos centros de treinamento', icon: '🤝', visible: true }
    ],
    student: [
      { id: 'pass_status', label: 'Status do Passe Unificado & Graduação', description: 'Vigência do passe, créditos ativos e faixa/prajied atual', icon: '🎫', visible: true },
      { id: 'next_class_checkin', label: 'Card Principal de Check-in Expresso & Cancelamento', description: 'Próximo treino agendado, check-in por horário e botão Cancelar Vaga', icon: '🥊', visible: true },
      { id: 'gamification_streak', label: 'Missões, Streak & Evolução de XP', description: 'Sequência de treinos, nível atual e barra de progresso', icon: '🔥', visible: true },
      { id: 'reward_store_carousel', label: 'Carrossel da Loja de Recompensas (Points)', description: 'Itens disponíveis para resgate imediato com saldo de Combat Points', icon: '🪙', visible: true },
      { id: 'interactive_calendar', label: 'Grade Oficial & Calendário Interativo', description: 'Horários multi-academias com status de vagas e reserva rápida', icon: '📅', visible: true },
      { id: 'financial_summary', label: 'Resumo do Contrato & Histórico de Presenças', description: 'Transparência de faturas, termos assinados e frequência mensal', icon: '📊', visible: true }
    ],
    teacher: [
      { id: 'ongoing_class', label: 'Aula em Andamento & Contador de Vagas', description: 'Ocupação ao vivo [HÁ VAGAS]/[LOTADO], cancelar aula ou reativar', icon: '⏱️', visible: true },
      { id: 'touch_rollcall', label: 'Lista de Chamada Touch & Walk-in Check-in', description: 'Botões rápidos de 1 toque para Confirmar Presença, Falta ou Avulso', icon: '✅', visible: true },
      { id: 'bonus_merit', label: 'Concessão de XP Bônus & Pontos de Mérito', description: 'Premiar alunos destaque da turma ao final do treino', icon: '🏅', visible: true },
      { id: 'commissions_summary', label: 'Extrato Dinâmico de Comissões & Retenção', description: 'Ganhos por check-in validado, turma cheia e repasse por CT', icon: '💵', visible: true },
      { id: 'weekly_schedule', label: 'Grade Semanal Multi-CT do Instrutor', description: 'Visão comparativa de todas as turmas ministradas na rede', icon: '📅', visible: true }
    ],
    admin: [
      { id: 'kpi_Overview', label: 'KPIs Executivos & Repasses Multi-Academias', description: 'Receita bruta, repasse aos CTs, ticket médio, ativos vs inativos', icon: '📈', visible: true },
      { id: 'global_search_360', label: 'Busca Global Instantânea (Visão 360° do Aluno)', description: 'Pesquisa imediata abrindo dossiê completo de contratos, passes e pontos', icon: '🔍', visible: true },
      { id: 'live_grid_control', label: 'Controle da Grade Oficial & Cancelamento de Aulas', description: 'Editar horários, cancelar aulas (riscar) e monitorar lotação', icon: '📅', visible: true },
      { id: 'reception_cash_checkin', label: 'Recepção Expressa, Caixa Diário & Vouchers', description: 'Abertura/fechamento de caixa, baixa manual e entrega de prêmios', icon: '💵', visible: true },
      { id: 'active_module_view', label: 'Módulo Operacional Selecionado', description: 'Conteúdo completo da aba ativa do ERP Administrativo', icon: '⚙️', visible: true }
    ]
  },
  updatedAt: new Date().toISOString()
};

export const JOURNEY_LABELS: Record<JourneyKey, string> = {
  landing: 'Página Principal (Hub Multi-Academias)',
  student: 'Área do Aluno (Portal do Praticante)',
  teacher: 'Acesso do Professor / Instrutor',
  admin: 'Acesso do Administrador (ERP & Studio)'
};

export const PRESET_META_BY_JOURNEY: Record<
  JourneyKey,
  Array<{ id: string; title: string; badge: string; icon: string; desc: string }>
> = {
  landing: [
    { id: 'marketplace', title: 'Layout A: Marketplace', badge: 'Intuitivo / Busca', icon: '🏛️', desc: 'Busca inteligente de CTs, filtros de modalidade, mapa e comparativo de passes' },
    { id: 'corporate', title: 'Layout B: Corporativo', badge: 'Formal / B2B', icon: '🏢', desc: 'Proposta executiva para empresas e redes, KPIs de autoridade e credenciamento' },
    { id: 'tatame', title: 'Layout C: Direto ao Tatame', badge: 'Operacional Ao Vivo', icon: '⚡', desc: 'Abre direto na Grade Oficial ao vivo com [HÁ VAGAS]/[LOTADO] e Check-in Expresso' },
    { id: 'classic', title: 'Layout Clássico HTML', badge: 'Original', icon: '📜', desc: 'Landing page institucional clássica do Centro de Combate' }
  ],
  student: [
    { id: 'tatame_express', title: 'Layout A: Tatame Express', badge: 'Zero Fricção', icon: '🥊', desc: 'Foco no próximo treino, Check-in Expresso em 1 clique e botão Cancelar Vaga pendente' },
    { id: 'gamified_journey', title: 'Layout B: Jornada & Evolução', badge: 'Gamificado', icon: '🏆', desc: 'Perfil atlético com XP, missões/streak, Loja de Recompensas por Points e graduação' },
    { id: 'agenda_control', title: 'Layout C: Agenda & Controle', badge: 'Split-View Formal', icon: '📅', desc: 'Visão dividida com Calendário Semanal/Mensal, histórico de presenças e faturas' },
    { id: 'complete_tabs', title: 'Modo Completo Multi-Abas', badge: 'Todas as Abas', icon: '🗂️', desc: 'Navegação clássica com todas as abas ordenáveis do Portal do Aluno' }
  ],
  teacher: [
    { id: 'tatame_fast', title: 'Layout A: Modo Tatame', badge: 'Touch-First', icon: '⚡', desc: 'Contador de vagas [HÁ VAGAS]/[LOTADO], chamada em 1 toque e Walk-in Check-in' },
    { id: 'technical_perf', title: 'Layout B: Gestão Técnica', badge: 'Profissional', icon: '📋', desc: 'Tabela técnica da turma, concessão de XP Bônus/Points de mérito e grade semanal' },
    { id: 'partner_portal', title: 'Layout C: Portal Parceiro', badge: 'Formal & Financeiro', icon: '💵', desc: 'Extrato detalhado de comissões dinâmicas por check-in, retenção e CTs' }
  ],
  admin: [
    { id: 'executive', title: 'Layout A: Executivo', badge: 'Diretoria', icon: '📊', desc: 'Sidebar elegante, KPIs consolidados de repasses e resumo de Fechamento de Caixa' },
    { id: 'operational_360', title: 'Layout B: Operacional 360°', badge: 'Alta Densidade', icon: '🔍', desc: 'Busca Global 360° fixa no topo, Grade Oficial editável e Caixa/Check-in lateral' },
    { id: 'customizer_studio', title: 'Layout C: Estúdio & Builder', badge: 'White-Label Studio', icon: '🎨', desc: 'Painel de controle + Live Preview multi-dispositivo (Paletas + Layouts + Ordem)' },
    { id: 'complete_erp', title: 'Modo ERP Completo', badge: 'Todos os Módulos', icon: '👑', desc: 'Acesso direto a todas as abas operacionais na ordem personalizada' }
  ]
};

export const LOADING_STYLE_META: Array<{ id: LoadingStyleId; title: string; icon: string }> = [
  { id: 'skeleton', title: 'Modelo A: Skeleton Estrutural Inteligente', icon: '🧱' },
  { id: 'minimal_bar', title: 'Modelo B: Corporativo & Minimalista', icon: '➖' },
  { id: 'combat_pulse', title: 'Modelo C: Combat Pulse / Arena', icon: '⚡' },
  { id: 'step_progress', title: 'Modelo D: Progressivo por Etapas', icon: '✅' }
];

const STORAGE_KEY = 'combat_pass_layout_preferences_v1';

interface LayoutEngineContextValue {
  preferences: LayoutPreferencesSchema;
  setPalette: (paletteId: string) => void;
  setJourneyPreset: <K extends JourneyKey>(journey: K, preset: LayoutPreferencesSchema['layoutPreset'][K]) => void;
  setLoadingStyle: (style: LoadingStyleId) => void;
  setDefaultEntryPage: (entry: LayoutPreferencesSchema['defaultEntryPage']) => void;
  setDefaultTabForJourney: (journey: JourneyKey, tabId: string) => void;
  moveRouteItem: (journey: JourneyKey, index: number, direction: 'up' | 'down') => void;
  toggleRouteVisibility: (journey: JourneyKey, itemId: string) => void;
  moveSectionItem: (journey: JourneyKey, index: number, direction: 'up' | 'down') => void;
  toggleSectionVisibility: (journey: JourneyKey, sectionId: string) => void;
  resetToDefaults: () => void;
  publishConfiguration: () => void;
  activeLoadingDemo: { active: boolean; message?: string; styleOverride?: LoadingStyleId };
  triggerLoadingPreview: (message?: string, durationMs?: number, styleOverride?: LoadingStyleId) => void;
  triggerLoadingDemo: (message?: string, styleOverride?: LoadingStyleId, durationMs?: number) => void;
  isStudioDrawerOpen: boolean;
  setIsStudioDrawerOpen: (open: boolean) => void;
}

const LayoutEngineContext = createContext<LayoutEngineContextValue | null>(null);

function mergeWithDefaults(saved: any): LayoutPreferencesSchema {
  if (!saved || typeof saved !== 'object') return DEFAULT_LAYOUT_PREFERENCES;
  return {
    ...DEFAULT_LAYOUT_PREFERENCES,
    ...saved,
    layoutPreset: {
      ...DEFAULT_LAYOUT_PREFERENCES.layoutPreset,
      ...(saved.layoutPreset || {})
    },
    defaultTabByJourney: {
      ...DEFAULT_LAYOUT_PREFERENCES.defaultTabByJourney,
      ...(saved.defaultTabByJourney || {})
    },
    routeOrder: {
      landing: Array.isArray(saved.routeOrder?.landing) ? saved.routeOrder.landing : DEFAULT_LAYOUT_PREFERENCES.routeOrder.landing,
      student: Array.isArray(saved.routeOrder?.student) ? saved.routeOrder.student : DEFAULT_LAYOUT_PREFERENCES.routeOrder.student,
      teacher: Array.isArray(saved.routeOrder?.teacher) ? saved.routeOrder.teacher : DEFAULT_LAYOUT_PREFERENCES.routeOrder.teacher,
      admin: Array.isArray(saved.routeOrder?.admin) ? saved.routeOrder.admin : DEFAULT_LAYOUT_PREFERENCES.routeOrder.admin
    },
    sectionOrder: {
      landing: Array.isArray(saved.sectionOrder?.landing) ? saved.sectionOrder.landing : DEFAULT_LAYOUT_PREFERENCES.sectionOrder.landing,
      student: Array.isArray(saved.sectionOrder?.student) ? saved.sectionOrder.student : DEFAULT_LAYOUT_PREFERENCES.sectionOrder.student,
      teacher: Array.isArray(saved.sectionOrder?.teacher) ? saved.sectionOrder.teacher : DEFAULT_LAYOUT_PREFERENCES.sectionOrder.teacher,
      admin: Array.isArray(saved.sectionOrder?.admin) ? saved.sectionOrder.admin : DEFAULT_LAYOUT_PREFERENCES.sectionOrder.admin
    }
  };
}

export const LayoutEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<LayoutPreferencesSchema>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return mergeWithDefaults(JSON.parse(raw));
      }
    } catch (e) {}
    return DEFAULT_LAYOUT_PREFERENCES;
  });

  const [activeLoadingDemo, setActiveLoadingDemo] = useState<{
    active: boolean;
    message?: string;
    styleOverride?: LoadingStyleId;
  }>({ active: false });

  const [isStudioDrawerOpen, setIsStudioDrawerOpen] = useState(false);

  // Sincroniza a paleta ativa com o motor CSS global
  useEffect(() => {
    const currentTheme = getCurrentPlatformTheme();
    if (currentTheme && currentTheme !== preferences.activePaletteId) {
      setPreferences(prev => ({ ...prev, activePaletteId: currentTheme }));
    } else {
      applyPlatformTheme(preferences.activePaletteId);
    }

    const onExternalThemeChange = (e: any) => {
      if (e.detail?.id) {
        setPreferences(prev => {
          if (prev.activePaletteId === e.detail.id) return prev;
          const next = { ...prev, activePaletteId: e.detail.id, updatedAt: new Date().toISOString() };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch (err) {}
          return next;
        });
      }
    };
    window.addEventListener('themeChanged', onExternalThemeChange);
    return () => window.removeEventListener('themeChanged', onExternalThemeChange);
  }, []);

  const persist = (updater: (prev: LayoutPreferencesSchema) => LayoutPreferencesSchema) => {
    setPreferences(prev => {
      const next = { ...updater(prev), updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const setPalette = (paletteId: string) => {
    applyPlatformTheme(paletteId);
    persist(prev => ({ ...prev, activePaletteId: paletteId }));
  };

  const setJourneyPreset = <K extends JourneyKey>(
    journey: K,
    preset: LayoutPreferencesSchema['layoutPreset'][K]
  ) => {
    persist(prev => ({
      ...prev,
      layoutPreset: {
        ...prev.layoutPreset,
        [journey]: preset
      }
    }));
  };

  const setLoadingStyle = (style: LoadingStyleId) => {
    persist(prev => ({ ...prev, loadingStyle: style }));
  };

  const setDefaultEntryPage = (entry: LayoutPreferencesSchema['defaultEntryPage']) => {
    persist(prev => ({ ...prev, defaultEntryPage: entry }));
  };

  const setDefaultTabForJourney = (journey: JourneyKey, tabId: string) => {
    persist(prev => ({
      ...prev,
      defaultTabByJourney: {
        ...prev.defaultTabByJourney,
        [journey]: tabId
      }
    }));
  };

  const moveRouteItem = (journey: JourneyKey, index: number, direction: 'up' | 'down') => {
    persist(prev => {
      const list = [...prev.routeOrder[journey]];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        routeOrder: {
          ...prev.routeOrder,
          [journey]: list
        }
      };
    });
  };

  const toggleRouteVisibility = (journey: JourneyKey, itemId: string) => {
    persist(prev => ({
      ...prev,
      routeOrder: {
        ...prev.routeOrder,
        [journey]: prev.routeOrder[journey].map(item =>
          item.id === itemId ? { ...item, visible: !item.visible } : item
        )
      }
    }));
  };

  const moveSectionItem = (journey: JourneyKey, index: number, direction: 'up' | 'down') => {
    persist(prev => {
      const list = [...prev.sectionOrder[journey]];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        sectionOrder: {
          ...prev.sectionOrder,
          [journey]: list
        }
      };
    });
  };

  const toggleSectionVisibility = (journey: JourneyKey, sectionId: string) => {
    persist(prev => ({
      ...prev,
      sectionOrder: {
        ...prev.sectionOrder,
        [journey]: prev.sectionOrder[journey].map(sec =>
          sec.id === sectionId ? { ...sec, visible: !sec.visible } : sec
        )
      }
    }));
  };

  const resetToDefaults = () => {
    const currentPalette = getCurrentPlatformTheme() || 'neutral-dark';
    const fresh = { ...DEFAULT_LAYOUT_PREFERENCES, activePaletteId: currentPalette, updatedAt: new Date().toISOString() };
    setPreferences(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {}
  };

  const publishConfiguration = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      window.dispatchEvent(new CustomEvent('combatPassLayoutPublished', { detail: preferences }));
    } catch (e) {}
  };

  const triggerLoadingPreview = (message?: string, durationMs = 1800, styleOverride?: LoadingStyleId) => {
    setActiveLoadingDemo({ active: true, message, styleOverride });
    setTimeout(() => {
      setActiveLoadingDemo({ active: false });
    }, durationMs);
  };

  const triggerLoadingDemo = (message?: string, styleOverride?: LoadingStyleId, durationMs = 1600) => {
    if (!message && durationMs <= 10) {
      setActiveLoadingDemo({ active: false });
      return;
    }
    triggerLoadingPreview(message, durationMs, styleOverride);
  };

  return (
    <LayoutEngineContext.Provider
      value={{
        preferences,
        setPalette,
        setJourneyPreset,
        setLoadingStyle,
        setDefaultEntryPage,
        setDefaultTabForJourney,
        moveRouteItem,
        toggleRouteVisibility,
        moveSectionItem,
        toggleSectionVisibility,
        resetToDefaults,
        publishConfiguration,
        activeLoadingDemo,
        triggerLoadingPreview,
        triggerLoadingDemo,
        isStudioDrawerOpen,
        setIsStudioDrawerOpen
      }}
    >
      {children}
    </LayoutEngineContext.Provider>
  );
};

export function useLayoutEngine() {
  const ctx = useContext(LayoutEngineContext);
  if (!ctx) {
    throw new Error('useLayoutEngine must be used within a LayoutEngineProvider');
  }
  return ctx;
}

// ============================================================================
// MOTOR DE RENDERIZAÇÃO DINÂMICA DE SEÇÕES (DynamicSectionRenderer)
// ============================================================================
interface DynamicSectionRendererProps {
  journey: JourneyKey;
  sectionsMap: Record<string, React.ReactNode>;
  className?: string;
}

export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({
  journey,
  sectionsMap,
  className = 'space-y-6'
}) => {
  const { preferences } = useLayoutEngine();
  const orderedList = preferences.sectionOrder[journey] || [];

  return (
    <div className={className}>
      {orderedList
        .filter(sec => sec.visible && sectionsMap[sec.id] !== undefined && sectionsMap[sec.id] !== null)
        .map(sec => (
          <div key={sec.id} data-section-id={sec.id} className="transition-all duration-300">
            {sectionsMap[sec.id]}
          </div>
        ))}
    </div>
  );
};

// ============================================================================
// MOTOR DE NAVEGAÇÃO DINÂMICA (DynamicNavBuilder)
// ============================================================================
interface DynamicNavBuilderProps {
  journey: JourneyKey;
  activeId?: string;
  onSelect: (routeOrTab: string, item: OrderedNavItem) => void;
  variant?: 'pills' | 'horizontal' | 'sidebar' | 'bottom_bar' | 'executive_tabs';
  badgeOverrides?: Record<string, string | number>;
  allowedIds?: string[];
}

export const DynamicNavBuilder: React.FC<DynamicNavBuilderProps> = ({
  journey,
  activeId,
  onSelect,
  variant = 'pills',
  badgeOverrides = {},
  allowedIds
}) => {
  const { preferences } = useLayoutEngine();
  const items = (preferences.routeOrder[journey] || []).filter(item => {
    if (!item.visible) return false;
    if (allowedIds && !allowedIds.includes(item.id) && !allowedIds.includes(item.routeOrTab)) return false;
    return true;
  });

  if (variant === 'bottom_bar') {
    return (
      <nav
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-foreground)'
        }}
        className="sm:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md border-t px-1.5 py-2 flex justify-around items-center z-[9990] overflow-x-auto scrollbar-thin"
      >
        {items.map(item => {
          const isActive = activeId === item.id || activeId === item.routeOrTab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.routeOrTab, item)}
              style={{
                color: isActive ? 'var(--color-primary)' : 'var(--text-muted-foreground)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent'
              }}
              className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition shrink-0"
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="truncate max-w-[68px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  if (variant === 'sidebar') {
    return (
      <aside
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)'
        }}
        className="w-full lg:w-64 shrink-0 border rounded-2xl p-3 space-y-1.5 self-start"
      >
        <div
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted-foreground)' }}
          className="px-3 py-2 border-b text-[10px] font-black uppercase tracking-widest flex items-center justify-between"
        >
          <span>Navegação Ordenada</span>
          <span>{items.length} módulos</span>
        </div>
        {items.map((item, idx) => {
          const isActive = activeId === item.id || activeId === item.routeOrTab;
          const badge = badgeOverrides[item.id] ?? item.badge;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.routeOrTab, item)}
              style={{
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                borderColor: isActive ? 'var(--color-primary)' : 'transparent'
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition border hover:opacity-90 text-left"
            >
              <span className="flex items-center gap-2.5 truncate">
                <span className="text-sm">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </span>
              <span className="flex items-center gap-1">
                {badge !== undefined && (
                  <span
                    style={{
                      backgroundColor: isActive ? 'var(--bg-surface)' : 'var(--color-primary-light)',
                      color: isActive ? 'var(--color-primary)' : 'var(--color-primary)'
                    }}
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-black"
                  >
                    {badge}
                  </span>
                )}
                {idx === 0 && (
                  <span className="text-[9px] opacity-75 font-mono" title="1ª Aba na Ordem">
                    #1
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
      {items.map(item => {
        const isActive = activeId === item.id || activeId === item.routeOrTab;
        const badge = badgeOverrides[item.id] ?? item.badge;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.routeOrTab, item)}
            style={{
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: isActive ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
              borderColor: isActive ? 'var(--color-primary)' : 'var(--border-subtle)'
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 border shadow-sm hover:opacity-95"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {badge !== undefined && (
              <span
                style={{
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'var(--color-primary-light)',
                  color: 'var(--color-primary)'
                }}
                className="px-1.5 py-0.2 rounded-full text-[10px] font-black ml-0.5"
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ============================================================================
// BARRA RÁPIDA DE TROCA DE ARQUITETURA / LAYOUT / ORDEM (EM QUALQUER TELA)
// ============================================================================
interface JourneyLayoutToolbarProps {
  journey: JourneyKey;
  title?: string;
  compact?: boolean;
}

export const JourneyLayoutToolbar: React.FC<JourneyLayoutToolbarProps> = ({
  journey,
  title,
  compact = false
}) => {
  const {
    preferences,
    setJourneyPreset,
    setLoadingStyle,
    triggerLoadingPreview,
    moveSectionItem,
    toggleSectionVisibility,
    moveRouteItem,
    toggleRouteVisibility,
    setDefaultTabForJourney,
    setPalette
  } = useLayoutEngine();

  const [showOrderModal, setShowOrderModal] = useState(false);

  const presetOptionsByJourney: Record<JourneyKey, Array<{ id: string; name: string; badge: string; desc: string }>> = {
    landing: [
      { id: 'marketplace', name: 'Layout A: Marketplace & Descoberta', badge: 'Intuitivo / Busca', desc: 'Busca inteligente de CTs, filtros de modalidade, mapa e comparativo de passes' },
      { id: 'corporate', name: 'Layout B: Corporativo & Institucional', badge: 'Formal / B2B', desc: 'Proposta executiva para empresas e redes, KPIs de autoridade e credenciamento' },
      { id: 'tatame', name: 'Layout C: Direto ao Tatame', badge: 'Operacional Ao Vivo', desc: 'Abre direto na Grade Oficial ao vivo com [HÁ VAGAS]/[LOTADO] e Check-in Expresso' },
      { id: 'classic', name: 'Layout Clássico (HTML Institucional)', badge: 'Original', desc: 'Landing page institucional clássica do Centro de Combate' }
    ],
    student: [
      { id: 'tatame_express', name: 'Layout A: Tatame Express', badge: 'Zero Fricção', desc: 'Foco no próximo treino, Check-in Expresso em 1 clique e botão Cancelar Vaga pendente' },
      { id: 'gamified_journey', name: 'Layout B: Jornada & Evolução', badge: 'Gamificado', desc: 'Perfil atlético com XP, missões/streak, Loja de Recompensas por Points e graduação' },
      { id: 'agenda_control', name: 'Layout C: Agenda & Controle', badge: 'Split-View Formal', desc: 'Visão dividida com Calendário Semanal/Mensal, histórico de presenças e faturas' },
      { id: 'complete_tabs', name: 'Modo Completo Multi-Abas', badge: 'Todas as Abas', desc: 'Navegação clássica com todas as abas ordenáveis do Portal do Aluno' }
    ],
    teacher: [
      { id: 'tatame_fast', name: 'Layout A: Modo Tatame / Chamada Rápida', badge: 'Touch-First', desc: 'Contador de vagas [HÁ VAGAS]/[LOTADO], chamada em 1 toque e Walk-in Check-in' },
      { id: 'technical_perf', name: 'Layout B: Gestão Técnica & Performance', badge: 'Profissional', desc: 'Tabela técnica da turma, concessão de XP Bônus/Points de mérito e grade semanal' },
      { id: 'partner_portal', name: 'Layout C: Portal do Instrutor Parceiro', badge: 'Formal & Financeiro', desc: 'Extrato detalhado de comissões dinâmicas por check-in, retenção e CTs' }
    ],
    admin: [
      { id: 'executive', name: 'Layout A: Executivo & Estratégico', badge: 'Diretoria', desc: 'Sidebar elegante, KPIs consolidados de repasses e resumo de Fechamento de Caixa' },
      { id: 'operational_360', name: 'Layout B: Operacional 360° & Recepção', badge: 'Alta Densidade', desc: 'Busca Global 360° fixa no topo, Grade Oficial editável e Caixa/Check-in lateral' },
      { id: 'customizer_studio', name: 'Layout C: Estúdio de Customização & Arquitetura', badge: 'White-Label Studio', desc: 'Painel de controle + Live Preview multi-dispositivo (Paletas + Layouts + Ordem)' },
      { id: 'complete_erp', name: 'Modo ERP Completo em Abas', badge: 'Todos os Módulos', desc: 'Acesso direto a todas as abas operacionais na ordem personalizada' }
    ]
  };

  const loadingOptions: Array<{ id: LoadingStyleId; name: string; icon: string }> = [
    { id: 'skeleton', name: 'A: Skeleton Inteligente', icon: '🧱' },
    { id: 'minimal_bar', name: 'B: Minimalista Formal', icon: '➖' },
    { id: 'combat_pulse', name: 'C: Combat Pulse Arena', icon: '⚡' },
    { id: 'step_progress', name: 'D: Etapas Transacionais', icon: '✅' }
  ];

  const currentPreset = preferences.layoutPreset[journey];
  const presets = presetOptionsByJourney[journey];

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-foreground)'
        }}
        className={`border rounded-2xl ${compact ? 'p-2.5' : 'p-3.5'} shadow-lg transition-all`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary-border)'
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5"
            >
              <span>🏗️</span>
              <span>{title || 'Arquitetura & Layout Ativo'}</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {presets.map(p => {
                const active = currentPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      triggerLoadingPreview(`Aplicando ${p.name}...`, 650);
                      setJourneyPreset(journey, p.id as any);
                    }}
                    style={{
                      backgroundColor: active ? 'var(--color-primary)' : 'var(--bg-surface-2)',
                      color: active ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                      borderColor: active ? 'var(--color-primary)' : 'var(--border-subtle)'
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border transition hover:scale-[1.01] flex items-center gap-1.5"
                    title={p.desc}
                  >
                    <span>{p.name}</span>
                    <span
                      style={{
                        backgroundColor: active ? 'var(--bg-surface)' : 'var(--color-primary-light)',
                        color: 'var(--color-primary)'
                      }}
                      className="hidden sm:inline px-1.5 py-0.2 rounded text-[9px] font-black uppercase"
                    >
                      {p.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowOrderModal(true)}
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary-border)'
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-black border transition hover:opacity-90 flex items-center gap-1.5"
            >
              <span>🔀</span>
              <span>Ordenar Páginas & Blocos</span>
            </button>

            <select
              value={preferences.loadingStyle}
              onChange={(e) => {
                const nextStyle = e.target.value as LoadingStyleId;
                setLoadingStyle(nextStyle);
                triggerLoadingPreview('Testando estilo de carregamento...', 1500, nextStyle);
              }}
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                borderColor: 'var(--border-subtle)'
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer"
              title="Escolher Modelo de Tela de Carregamento (Loading Screen)"
            >
              {loadingOptions.map(lo => (
                <option key={lo.id} value={lo.id}>
                  ⏳ Loading {lo.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MODAL VISUAL DE REORDENAÇÃO DE PÁGINAS/ABAS E BLOCOS/SEÇÕES */}
      {showOrderModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowOrderModal(false);
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-[99999] overflow-y-auto"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-foreground)'
            }}
            className="border rounded-2xl w-full max-w-4xl p-5 sm:p-6 shadow-2xl my-auto max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div
              style={{ borderColor: 'var(--border-subtle)' }}
              className="flex items-start justify-between gap-4 border-b pb-4"
            >
              <div>
                <span
                  style={{ color: 'var(--color-primary)' }}
                  className="text-[10px] font-black uppercase tracking-widest block"
                >
                  Page Builder & Dynamic Order Engine ({journey.toUpperCase()})
                </span>
                <h3 className="text-lg sm:text-xl font-black mt-0.5">
                  🔀 Ordenador de Navegação, Seções & Paletas Compatíveis
                </h3>
                <p style={{ color: 'var(--text-muted-foreground)' }} className="text-xs mt-0.5">
                  Defina qual página/aba vem primeiro, reordene os blocos internos e combine com qualquer paleta de cores sem perda de contraste.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                style={{
                  backgroundColor: 'var(--bg-surface-2)',
                  color: 'var(--text-foreground)'
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-black"
              >
                ✕ Fechar
              </button>
            </div>

            {/* SELETOR RÁPIDO DE PALETAS PARA VERIFICAR POLIMORFISMO */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface-muted)',
                borderColor: 'var(--border-subtle)'
              }}
              className="p-3.5 rounded-xl border space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider">
                  🎨 Paleta de Cores Ativa ({THEMES_LIST.length} Paletas Semânticas Disponíveis)
                </span>
                <span style={{ color: 'var(--color-primary)' }} className="text-[11px] font-bold">
                  100% Zero-Hardcode (Dark & Light)
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {THEMES_LIST.map(t => {
                  const isSelected = t.id === preferences.activePaletteId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPalette(t.id)}
                      style={{
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-surface)',
                        color: isSelected ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 flex items-center gap-2 transition"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/40"
                        style={{ backgroundColor: t.primary }}
                      />
                      <span>{t.name.split(' (')[0]}</span>
                      <span className="text-[9px] opacity-75 uppercase">({t.mode})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* COLUNA 1: ORDEM DAS PÁGINAS / ABAS NA NAVEGAÇÃO */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-muted)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black">1. Ordem das Páginas / Abas no Menu</h4>
                    <p style={{ color: 'var(--text-muted-foreground)' }} className="text-[11px]">
                      O primeiro item visível pode ser definido como tela inicial padrão.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {preferences.routeOrder[journey].map((item, idx) => {
                    const isDefault = preferences.defaultTabByJourney[journey] === item.routeOrTab || preferences.defaultTabByJourney[journey] === item.id;
                    return (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: isDefault ? 'var(--color-primary)' : 'var(--border-subtle)',
                          opacity: item.visible ? 1 : 0.55
                        }}
                        className="p-2.5 rounded-xl border flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            style={{
                              backgroundColor: 'var(--color-primary-light)',
                              color: 'var(--color-primary)'
                            }}
                            className="w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0"
                          >
                            {idx + 1}
                          </span>
                          <span className="text-sm">{item.icon}</span>
                          <div className="truncate">
                            <p className="text-xs font-bold truncate">{item.label}</p>
                            {isDefault && (
                              <span style={{ color: 'var(--color-primary)' }} className="text-[9px] font-black uppercase">
                                ★ Abre Primeiro (Padrão)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setDefaultTabForJourney(journey, item.routeOrTab)}
                            style={{
                              backgroundColor: isDefault ? 'var(--color-primary)' : 'var(--bg-surface-2)',
                              color: isDefault ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)'
                            }}
                            className="px-2 py-1 rounded text-[10px] font-black"
                            title="Definir como página/aba que abre primeiro"
                          >
                            ★ Inicial
                          </button>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveRouteItem(journey, idx, 'up')}
                            style={{ backgroundColor: 'var(--bg-surface-2)' }}
                            className="px-2 py-1 rounded text-xs font-black disabled:opacity-30"
                            title="Subir posição"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === preferences.routeOrder[journey].length - 1}
                            onClick={() => moveRouteItem(journey, idx, 'down')}
                            style={{ backgroundColor: 'var(--bg-surface-2)' }}
                            className="px-2 py-1 rounded text-xs font-black disabled:opacity-30"
                            title="Descer posição"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleRouteVisibility(journey, item.id)}
                            style={{ backgroundColor: 'var(--bg-surface-2)' }}
                            className="px-2 py-1 rounded text-xs font-bold"
                            title={item.visible ? 'Ocultar do menu' : 'Exibir no menu'}
                          >
                            {item.visible ? '👁️' : '🙈'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUNA 2: ORDEM E VISIBILIDADE DOS BLOCOS / WIDGETS INTERNOS */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-muted)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="border rounded-xl p-4 space-y-3"
              >
                <div>
                  <h4 className="text-sm font-black">2. Ordem dos Blocos & Widgets da Tela</h4>
                  <p style={{ color: 'var(--text-muted-foreground)' }} className="text-[11px]">
                    Reordene qual seção aparece no topo ou oculte widgets que não deseja exibir.
                  </p>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {preferences.sectionOrder[journey].map((sec, idx) => (
                    <div
                      key={sec.id}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        opacity: sec.visible ? 1 : 0.55
                      }}
                      className="p-2.5 rounded-xl border flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          style={{
                            backgroundColor: 'var(--color-primary-light)',
                            color: 'var(--color-primary)'
                          }}
                          className="w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0"
                        >
                          {idx + 1}
                        </span>
                        <span className="text-base">{sec.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{sec.label}</p>
                          <p style={{ color: 'var(--text-muted-foreground)' }} className="text-[10px] truncate">
                            {sec.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSectionItem(journey, idx, 'up')}
                          style={{ backgroundColor: 'var(--bg-surface-2)' }}
                          className="px-2 py-1 rounded text-xs font-black disabled:opacity-30"
                          title="Mover bloco para cima"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === preferences.sectionOrder[journey].length - 1}
                          onClick={() => moveSectionItem(journey, idx, 'down')}
                          style={{ backgroundColor: 'var(--bg-surface-2)' }}
                          className="px-2 py-1 rounded text-xs font-black disabled:opacity-30"
                          title="Mover bloco para baixo"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(journey, sec.id)}
                          style={{ backgroundColor: 'var(--bg-surface-2)' }}
                          className="px-2 py-1 rounded text-xs font-bold"
                          title={sec.visible ? 'Ocultar bloco' : 'Mostrar bloco'}
                        >
                          {sec.visible ? '👁️' : '🙈'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{ borderColor: 'var(--border-subtle)' }}
              className="pt-3 border-t flex items-center justify-between flex-wrap gap-2"
            >
              <span style={{ color: 'var(--text-muted-foreground)' }} className="text-xs">
                As alterações são aplicadas em tempo real e salvas automaticamente no seu perfil.
              </span>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)'
                }}
                className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg"
              >
                ✓ Concluir e Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
