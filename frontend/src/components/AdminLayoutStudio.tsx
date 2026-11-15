import React, { useState } from 'react';
import {
  useLayoutEngine,
  JourneyKey,
  JOURNEY_LABELS,
  PRESET_META_BY_JOURNEY,
  LOADING_STYLE_META,
  DynamicSectionRenderer,
  DynamicNavBuilder
} from '../config/layoutEngine';
import { THEMES_LIST } from '../config/themeConfig';
import { LoadingScreenRenderer } from './LoadingEngine';
import { CashRegisterTab } from './CashRegisterTab';
import { TeacherCommissionsTab } from './TeacherCommissionsTab';
import { OccupancyDashboardTab } from './OccupancyDashboardTab';
import { AdminStoreRedemptionsTab } from './AdminStoreRedemptionsTab';
import { InteractiveCombatCalendar } from './InteractiveCombatCalendar';

export interface AdminLayoutStudioProps {
  usuarioLogado: any;
  alunos: any[];
  onOpenStudent360: (alunoId: string) => void;
  onSelectAdminTab: (tabId: string) => void;
}

export const AdminLayoutStudio: React.FC<AdminLayoutStudioProps> = ({
  usuarioLogado,
  alunos,
  onOpenStudent360,
  onSelectAdminTab
}) => {
  const {
    preferences,
    setPalette,
    setJourneyPreset,
    setLoadingStyle,
    setDefaultEntryPage,
    moveRouteItem,
    toggleRouteVisibility,
    moveSectionItem,
    toggleSectionVisibility,
    resetToDefaults,
    triggerLoadingDemo
  } = useLayoutEngine();

  const activeAdminPreset = preferences.layoutPreset.admin;

  // Estados do Estúdio de Customização & Live Preview (Layout C)
  const [studioTargetJourney, setStudioTargetJourney] = useState<JourneyKey>('landing');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'journey' | 'loading'>('journey');
  const [publishFeedback, setPublishFeedback] = useState('');

  // Estado da Busca Global Instantânea (Visão 360 do Aluno - Layout B)
  const [globalSearch360, setGlobalSearch360] = useState('');

  // Estado da Sidebar Executiva Recolhível (Layout A)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filteredStudents360 = (alunos || [])
    .filter(a => {
      if (!globalSearch360.trim()) return true;
      const q = globalSearch360.toLowerCase();
      return (
        a.nome?.toLowerCase().includes(q) ||
        a.cpf?.includes(q) ||
        a.plano?.toLowerCase().includes(q) ||
        a.prajied?.toLowerCase().includes(q)
      );
    })
    .slice(0, 6);

  const handlePublishConfig = () => {
    triggerLoadingDemo(
      'Publicando arquitetura de layouts, paleta semântica e ordem de páginas...',
      'step_progress',
      1500
    );
    setPublishFeedback(
      `✅ Configuração publicada com sucesso às ${new Date().toLocaleTimeString('pt-BR')}! Todas as jornadas sincronizadas.`
    );
  };

  // ============================================================================
  // DEFINIÇÃO DAS 6 SEÇÕES MODULARES REORDENÁVEIS DO ADMINISTRADOR
  // ============================================================================
  const sectionsMap: Record<string, React.ReactNode> = {
    // 1. ESTÚDIO DE CUSTOMIZAÇÃO, PALETAS & ORDENADOR COM LIVE PREVIEW (SPLIT-SCREEN)
    active_module_view: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border:
            activeAdminPreset === 'customizer_studio'
              ? '2px solid var(--color-primary)'
              : '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {/* Top Bar do Estúdio */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-primary)'
              }}
            >
              🎨 MOTOR WHITE-LABEL · POLIMORFISMO VISUAL (LAYOUT ≠ PALETA)
            </span>
            <h2
              style={{
                margin: '0.2rem 0 0 0',
                fontSize: '1.35rem',
                fontWeight: 900,
                color: 'var(--text-foreground)'
              }}
            >
              Estúdio de Customização, Paletas Semânticas & Ordenador Dinâmico
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={resetToDefaults}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-muted-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ↺ Restaurar Padrão
            </button>
            <button
              type="button"
              onClick={handlePublishConfig}
              style={{
                padding: '0.55rem 1.2rem',
                borderRadius: '10px',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              🚀 Publicar Configuração
            </button>
          </div>
        </div>

        {publishFeedback && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.7rem 1rem',
              borderRadius: '10px',
              background: 'var(--status-available-bg)',
              border: '1px solid var(--status-available-border)',
              color: 'var(--status-available)',
              fontSize: '0.8rem',
              fontWeight: 800
            }}
          >
            {publishFeedback}
          </div>
        )}

        {/* SPLIT-SCREEN: PAINEL DE CONTROLE (ESQUERDA) + LIVE PREVIEW INTERATIVO (DIREITA) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start'
          }}
        >
          {/* COLUNA ESQUERDA: CONTROLES DE PALETA, ARQUÉTIPO, ROTA INICIAL & ORDEM */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'var(--bg-background)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}
          >
            {/* 1. Seletor das 14 Paletas de Cores Existentes */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.55rem'
                }}
              >
                <label
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)'
                  }}
                >
                  1. Paleta de Cores Ativa ({THEMES_LIST.length} Paletas Cadastradas)
                </label>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)' }}>
                  Contraste WCAG AA+
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
                  gap: '0.45rem',
                  maxHeight: '210px',
                  overflowY: 'auto',
                  paddingRight: '0.25rem'
                }}
              >
                {THEMES_LIST.map(theme => {
                  const isSelected = preferences.activePaletteId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setPalette(theme.id)}
                      style={{
                        padding: '0.48rem 0.6rem',
                        borderRadius: '10px',
                        background: isSelected ? 'var(--bg-surface-2)' : 'var(--bg-surface-1)',
                        border: isSelected
                          ? '2px solid var(--color-primary)'
                          : '1px solid var(--border-subtle)',
                        color: 'var(--text-foreground)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '999px',
                          background: theme.preview[0],
                          border: `2px solid ${theme.preview[1] || '#fff'}`,
                          flexShrink: 0
                        }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {theme.name}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted-foreground)' }}>
                          {theme.mode === 'light' ? '☀️ Claro' : '🌙 Escuro'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Seletor de Jornada Alvo + Layout Estrutural */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  marginBottom: '0.5rem'
                }}
              >
                2. Escolha a Jornada para Configurar Layout & Ordem
              </label>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {(['landing', 'student', 'teacher', 'admin'] as JourneyKey[]).map(jKey => (
                  <button
                    key={jKey}
                    type="button"
                    onClick={() => {
                      setStudioTargetJourney(jKey);
                      setPreviewMode('journey');
                    }}
                    style={{
                      flex: 1,
                      minWidth: '110px',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      border:
                        studioTargetJourney === jKey
                          ? '1px solid var(--color-primary)'
                          : '1px solid var(--border-subtle)',
                      background:
                        studioTargetJourney === jKey
                          ? 'var(--color-primary)'
                          : 'var(--bg-surface-1)',
                      color:
                        studioTargetJourney === jKey
                          ? 'var(--text-primary-foreground)'
                          : 'var(--text-foreground)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {jKey === 'landing'
                      ? '🏛️ Home'
                      : jKey === 'student'
                      ? '🥊 Aluno'
                      : jKey === 'teacher'
                      ? '🥋 Professor'
                      : '👑 Admin'}
                  </button>
                ))}
              </div>

              {/* Presets da Jornada Selecionada */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                {PRESET_META_BY_JOURNEY[studioTargetJourney].map(preset => {
                  const isCurr = preferences.layoutPreset[studioTargetJourney] === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setJourneyPreset(studioTargetJourney, preset.id as any)}
                      style={{
                        padding: '0.6rem 0.7rem',
                        borderRadius: '10px',
                        background: isCurr ? 'var(--bg-surface-2)' : 'var(--bg-surface-1)',
                        border: isCurr
                          ? '2px solid var(--color-primary)'
                          : '1px solid var(--border-subtle)',
                        color: 'var(--text-foreground)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', fontWeight: 900 }}>
                        {preset.icon} {preset.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.64rem',
                          color: 'var(--color-primary)',
                          fontWeight: 800,
                          marginTop: '2px'
                        }}
                      >
                        {preset.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Seletor de Estilo de Carregamento (Loading Screen) & Rota Inicial */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted-foreground)',
                    marginBottom: '0.3rem'
                  }}
                >
                  ⏳ Tela de Loading Global
                </label>
                <select
                  value={preferences.loadingStyle}
                  onChange={e => {
                    setLoadingStyle(e.target.value as any);
                    setPreviewMode('loading');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-1)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}
                >
                  {LOADING_STYLE_META.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.icon} {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted-foreground)',
                    marginBottom: '0.3rem'
                  }}
                >
                  🚀 Página Inicial Padrão
                </label>
                <select
                  value={preferences.defaultEntryPage}
                  onChange={e => setDefaultEntryPage(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-1)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}
                >
                  <option value="landing">Home Multi-Academias</option>
                  <option value="grade">Direto na Grade ao Vivo</option>
                  <option value="portal">Direto no Portal do Aluno</option>
                  <option value="professor">Direto no Portal Professor</option>
                  <option value="admin">Direto no ERP Admin</option>
                </select>
              </div>
            </div>

            {/* 4. Ordenador Rápido de Seções e Menus da Jornada Alvo */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}
            >
              {/* Ordem do Menu */}
              <div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    marginBottom: '0.4rem'
                  }}
                >
                  🧭 Ordem do Menu ({studioTargetJourney})
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    maxHeight: '190px',
                    overflowY: 'auto'
                  }}
                >
                  {preferences.routeOrder[studioTargetJourney].map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.38rem 0.5rem',
                        borderRadius: '8px',
                        background: 'var(--bg-surface-1)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: item.visible ? 1 : 0.45,
                        fontSize: '0.7rem'
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>
                        {idx + 1}. {item.icon} {item.label}
                      </span>
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button
                          type="button"
                          onClick={() => moveRouteItem(studioTargetJourney, idx, 'up')}
                          style={{
                            background: 'var(--bg-surface-2)',
                            color: 'var(--text-foreground)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.1rem 0.3rem',
                            fontSize: '0.65rem',
                            cursor: 'pointer'
                          }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveRouteItem(studioTargetJourney, idx, 'down')}
                          style={{
                            background: 'var(--bg-surface-2)',
                            color: 'var(--text-foreground)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.1rem 0.3rem',
                            fontSize: '0.65rem',
                            cursor: 'pointer'
                          }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleRouteVisibility(studioTargetJourney, item.id)}
                          style={{
                            background: item.visible
                              ? 'var(--status-available-bg)'
                              : 'var(--bg-surface-2)',
                            color: item.visible
                              ? 'var(--status-available)'
                              : 'var(--text-muted-foreground)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.1rem 0.3rem',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {item.visible ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordem das Seções */}
              <div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    marginBottom: '0.4rem'
                  }}
                >
                  🧱 Ordem dos Blocos ({studioTargetJourney})
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    maxHeight: '190px',
                    overflowY: 'auto'
                  }}
                >
                  {preferences.sectionOrder[studioTargetJourney].map((sec, idx) => (
                    <div
                      key={sec.id}
                      style={{
                        padding: '0.38rem 0.5rem',
                        borderRadius: '8px',
                        background: 'var(--bg-surface-1)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: sec.visible ? 1 : 0.45,
                        fontSize: '0.7rem'
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>
                        #{idx + 1} {sec.icon} {sec.label}
                      </span>
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button
                          type="button"
                          onClick={() => moveSectionItem(studioTargetJourney, idx, 'up')}
                          style={{
                            background: 'var(--bg-surface-2)',
                            color: 'var(--text-foreground)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.1rem 0.3rem',
                            fontSize: '0.65rem',
                            cursor: 'pointer'
                          }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSectionItem(studioTargetJourney, idx, 'down')}
                          style={{
                            background: 'var(--bg-surface-2)',
                            color: 'var(--text-foreground)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.1rem 0.3rem',
                            fontSize: '0.65rem',
                            cursor: 'pointer'
                          }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(studioTargetJourney, sec.id)}
                          style={{
                            background: sec.visible
                              ? 'var(--status-available-bg)'
                              : 'var(--bg-surface-2)',
                            color: sec.visible
                              ? 'var(--status-available)'
                              : 'var(--text-muted-foreground)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '0.1rem 0.3rem',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {sec.visible ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: LIVE PREVIEW INTERATIVO (DESKTOP / TABLET / MOBILE) */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'var(--bg-background)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem'
            }}
          >
            {/* Controles do Simulador Live Preview */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)'
                  }}
                >
                  🖥️ LIVE PREVIEW EM TEMPO REAL:
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-muted-foreground)'
                  }}
                >
                  {JOURNEY_LABELS[studioTargetJourney]}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {(['desktop', 'tablet', 'mobile'] as const).map(dev => (
                  <button
                    key={dev}
                    type="button"
                    onClick={() => setPreviewDevice(dev)}
                    style={{
                      padding: '0.32rem 0.65rem',
                      borderRadius: '8px',
                      background:
                        previewDevice === dev ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                      color:
                        previewDevice === dev
                          ? 'var(--text-primary-foreground)'
                          : 'var(--text-foreground)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {dev === 'desktop' ? '🖥️ Desktop' : dev === 'tablet' ? '📱 Tablet' : '📲 Mobile'}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setPreviewMode(prev => (prev === 'journey' ? 'loading' : 'journey'))
                  }
                  style={{
                    padding: '0.32rem 0.65rem',
                    borderRadius: '8px',
                    background:
                      previewMode === 'loading' ? 'var(--color-accent)' : 'var(--bg-surface-1)',
                    color:
                      previewMode === 'loading'
                        ? 'var(--text-primary-foreground)'
                        : 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  {previewMode === 'loading' ? '⚡ Ver Tela da Jornada' : '⏳ Testar Loading'}
                </button>
              </div>
            </div>

            {/* Viewport Simulado Responsivo */}
            <div
              style={{
                width:
                  previewDevice === 'mobile'
                    ? '360px'
                    : previewDevice === 'tablet'
                    ? '540px'
                    : '100%',
                maxWidth: '100%',
                margin: '0 auto',
                padding: '1rem',
                borderRadius: '16px',
                background: 'var(--bg-surface-1)',
                border: '2px solid var(--border-subtle)',
                transition: 'width 0.3s ease'
              }}
            >
              {previewMode === 'loading' ? (
                <LoadingScreenRenderer journey={studioTargetJourney} compact />
              ) : (
                <div>
                  {/* Mini Header Simulado da Jornada */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '0.65rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.45rem',
                          borderRadius: '6px',
                          background: 'var(--color-primary)',
                          color: 'var(--text-primary-foreground)',
                          fontSize: '0.65rem',
                          fontWeight: 900
                        }}
                      >
                        CP
                      </span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 900 }}>
                        {JOURNEY_LABELS[studioTargetJourney]}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        color: 'var(--color-primary)'
                      }}
                    >
                      Preset: {preferences.layoutPreset[studioTargetJourney]}
                    </span>
                  </div>

                  {/* Mini Menu Ordenado em Tempo Real */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.3rem',
                      overflowX: 'auto',
                      paddingBottom: '0.5rem',
                      marginBottom: '0.65rem',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    {preferences.routeOrder[studioTargetJourney]
                      .filter(r => r.visible)
                      .map((r, i) => (
                        <span
                          key={r.id}
                          style={{
                            padding: '0.25rem 0.55rem',
                            borderRadius: '999px',
                            background: i === 0 ? 'var(--color-primary)' : 'var(--bg-surface-2)',
                            color:
                              i === 0 ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {r.icon} {r.label}
                        </span>
                      ))}
                  </div>

                  {/* Blocos da Jornada na Ordem Exata Configurada */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {preferences.sectionOrder[studioTargetJourney]
                      .filter(s => s.visible)
                      .map((sec, idx) => (
                        <div
                          key={sec.id}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            background: idx === 0 ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                            border:
                              idx === 0
                                ? '1px solid var(--color-primary)'
                                : '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.74rem', fontWeight: 900 }}>
                              #{idx + 1} · {sec.icon} {sec.label}
                            </div>
                            <div
                              style={{
                                fontSize: '0.64rem',
                                color: 'var(--text-muted-foreground)'
                              }}
                            >
                              {sec.description}
                            </div>
                          </div>
                          <span
                            style={{
                              padding: '0.18rem 0.45rem',
                              borderRadius: '6px',
                              background: 'var(--status-available-bg)',
                              color: 'var(--status-available)',
                              fontSize: '0.6rem',
                              fontWeight: 900
                            }}
                          >
                            VISÍVEL
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),

    // 2. KPIs EXECUTIVOS MULTI-ACADEMIAS (RECEITA, REPASSES, TICKET MÉDIO, CHURN)
    kpi_Overview: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-primary)'
              }}
            >
              📊 GOVERNANÇA & INDICADORES CONSOLIDADOS MULTI-ACADEMIAS
            </span>
            <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem', color: 'var(--text-foreground)' }}>
              Resumo Executivo da Rede Combat-Pass
            </h3>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '0.9rem'
          }}
        >
          {[
            {
              title: 'Receita Bruta Consolidada',
              val: `R$ ${((alunos?.length || 18) * 245).toLocaleString('pt-BR')},00`,
              sub: '+14.2% vs mês anterior',
              status: 'available'
            },
            {
              title: 'Repasses CTs Parceiros',
              val: `R$ ${((alunos?.length || 18) * 140).toLocaleString('pt-BR')},00`,
              sub: 'Por check-in validado em tatame',
              status: 'primary'
            },
            {
              title: 'Ticket Médio Unificado',
              val: 'R$ 245,00',
              sub: 'Passes Silver, Gold & Black',
              status: 'primary'
            },
            {
              title: 'Taxa de Retenção (Anti-Churn)',
              val: '95.4%',
              sub: 'Inadimplência abaixo de 4.6%',
              status: 'available'
            }
          ].map((card, i) => (
            <div
              key={i}
              style={{
                padding: '1.1rem',
                borderRadius: '14px',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted-foreground)'
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color:
                    card.status === 'available'
                      ? 'var(--status-available)'
                      : 'var(--color-primary)',
                  margin: '0.3rem 0'
                }}
              >
                {card.val}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>
                {card.sub}
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    // 3. BUSCA GLOBAL INSTANTÂNEA (VISÃO 360° DO ALUNO) & GRADE DE RECEPÇÃO
    global_search_360: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border:
            activeAdminPreset === 'operational_360'
              ? '2px solid var(--color-primary)'
              : '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--color-primary)'
              }}
            >
              🔍 RECEPÇÃO & OPERAÇÃO 360° · BUSCA GLOBAL INSTANTÂNEA
            </span>
            <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem', color: 'var(--text-foreground)' }}>
              Visão 360° do Praticante (Contratos, Presenças, Graduações, Vouchers & Pontos)
            </h3>
          </div>

          <input
            type="text"
            value={globalSearch360}
            onChange={e => setGlobalSearch360(e.target.value)}
            placeholder="🔎 Digite Nome, CPF, Graduação ou Passe para abrir a Ficha 360°..."
            style={{
              minWidth: '320px',
              flex: 1,
              maxWidth: '460px',
              padding: '0.65rem 0.95rem',
              borderRadius: '12px',
              background: 'var(--bg-background)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--color-primary)',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          />
        </div>

        {/* Lista Rápida de Alunos para Abertura 1-Clique da Visão 360 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '0.75rem',
            marginBottom: activeAdminPreset === 'operational_360' ? '1.25rem' : '0'
          }}
        >
          {filteredStudents360.map(al => (
            <div
              key={al.id}
              onClick={() => onOpenStudent360(al.id)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                  {al.nome}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)' }}>
                  {al.plano || 'Passe Unificado'} · {al.prajied || 'Branco'}
                </div>
              </div>
              <span
                style={{
                  padding: '0.28rem 0.55rem',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  fontSize: '0.68rem',
                  fontWeight: 900
                }}
              >
                360° →
              </span>
            </div>
          ))}
        </div>

        {activeAdminPreset === 'operational_360' && (
          <div style={{ marginTop: '1rem' }}>
            <InteractiveCombatCalendar userRole="ADMIN" usuarioLogado={usuarioLogado} />
          </div>
        )}
      </section>
    ),

    // 4. FECHAMENTO DE CAIXA DIÁRIO & PDV
    reception_cash_checkin: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <CashRegisterTab usuarioLogado={usuarioLogado} />
      </section>
    ),

    // 5. REPASSES DE ACADEMIAS & COMISSÕES DE PROFESSORES
    live_grid_control: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <TeacherCommissionsTab />
      </section>
    ),

    // 6. MAPA DE OCUPAÇÃO & RESGATES DE VOUCHERS DA LOJA DE POINTS
    occupancy_redemptions: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <div>
          <OccupancyDashboardTab />
        </div>
        <div>
          <AdminStoreRedemptionsTab usuarioLogado={usuarioLogado} />
        </div>
      </section>
    )
  };

  // Layout A ("Executivo & Estratégico") inclui Sidebar Executiva Recolhível ao lado do conteúdo
  if (activeAdminPreset === 'executive') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: sidebarCollapsed ? '64px 1fr' : '240px 1fr',
          gap: '1.25rem',
          alignItems: 'start',
          marginBottom: '1.5rem'
        }}
      >
        <aside
          style={{
            padding: '0.85rem',
            borderRadius: '18px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            position: 'sticky',
            top: '1rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            {!sidebarCollapsed && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)'
                }}
              >
                📊 Menu Executivo
              </span>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(prev => !prev)}
              style={{
                background: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '0.25rem 0.45rem',
                fontSize: '0.7rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          {!sidebarCollapsed && (
            <DynamicNavBuilder
              journey="admin"
              onSelect={tab => onSelectAdminTab(tab)}
              variant="sidebar"
            />
          )}
        </aside>

        <div style={{ minWidth: 0 }}>
          <DynamicSectionRenderer journey="admin" sectionsMap={sectionsMap} />
        </div>
      </div>
    );
  }

  return <DynamicSectionRenderer journey="admin" sectionsMap={sectionsMap} />;
};
