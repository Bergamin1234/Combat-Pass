import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useLayoutEngine,
  LandingPresetId,
  DynamicNavBuilder
} from '../config/layoutEngine';
import { THEMES_LIST } from '../config/themeConfig';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { InteractiveCombatCalendar } from '../components/InteractiveCombatCalendar';
import { PublicQuickCheckinCard } from '../components/QuickCheckinWidget';
import { publicApi } from '../services/api';

interface PartnerCenter {
  id: string;
  nome: string;
  bairro: string;
  cidade: string;
  distancia: string;
  modalidades: string[];
  passeMinimo: 'SILVER' | 'GOLD' | 'BLACK';
  nota: string;
  avaliacoes: number;
  vagasHoje: number;
  statusHoje: 'DISPONIVEL' | 'ULTIMAS_VAGAS' | 'LOTADO';
  destaque: string;
  imagem: string;
  proximaAula: string;
  mestreResponsavel: string;
}

const DEFAULT_PARTNER_CTS: PartnerCenter[] = [
  {
    id: 'ct-boru-matriz',
    nome: 'CT Borü Centro de Combate (Unidade Matriz)',
    bairro: 'Centro / Arena',
    cidade: 'São Paulo - SP',
    distancia: '1.2 km',
    modalidades: ['Muay Thai', 'Boxe', 'Sparring Técnico', 'Clinch'],
    passeMinimo: 'SILVER',
    nota: '4.98',
    avaliacoes: 342,
    vagasHoje: 12,
    statusHoje: 'DISPONIVEL',
    destaque: 'Octógono Oficial & Mestres Federados',
    imagem: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    proximaAula: '19:00 · Muay Thai Geral',
    mestreResponsavel: 'Mestre Felipe Borü'
  },
  {
    id: 'ct-iron-bjj',
    nome: 'Iron Lotus Jiu-Jitsu & Grappling Hub',
    bairro: 'Jardins',
    cidade: 'São Paulo - SP',
    distancia: '2.4 km',
    modalidades: ['Jiu-Jitsu (Gi)', 'No-Gi Submission', 'Wrestling'],
    passeMinimo: 'GOLD',
    nota: '5.00',
    avaliacoes: 218,
    vagasHoje: 4,
    statusHoje: 'ULTIMAS_VAGAS',
    destaque: 'Tatame Olímpico & Turmas Competição',
    imagem: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80',
    proximaAula: '18:30 · Jiu-Jitsu Competição',
    mestreResponsavel: 'Prof. Ricardo Lotus'
  },
  {
    id: 'ct-apex-mma',
    nome: 'Apex Pro Fight & Performance Lab',
    bairro: 'Vila Olímpia',
    cidade: 'São Paulo - SP',
    distancia: '3.1 km',
    modalidades: ['MMA Pro', 'Muay Thai', 'Boxe Olímpico', 'Preparação Física'],
    passeMinimo: 'BLACK',
    nota: '4.95',
    avaliacoes: 189,
    vagasHoje: 9,
    statusHoje: 'DISPONIVEL',
    destaque: 'Cage Oficial & Bioimpedância',
    imagem: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    proximaAula: '20:00 · MMA & Wrestling',
    mestreResponsavel: 'Coach Rafael Apex'
  },
  {
    id: 'ct-krabi-thai',
    nome: 'Krabi Stadium Muay Thai & Kickboxing',
    bairro: 'Pinheiros',
    cidade: 'São Paulo - SP',
    distancia: '3.8 km',
    modalidades: ['Muay Thai Tradicional', 'Kickboxing K-1', 'Kids Martial'],
    passeMinimo: 'SILVER',
    nota: '4.89',
    avaliacoes: 156,
    vagasHoje: 0,
    statusHoje: 'LOTADO',
    destaque: 'Treino Tradicional Tailandês',
    imagem: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
    proximaAula: '19:30 · Kickboxing K-1 [LOTADO]',
    mestreResponsavel: 'Kru Somchai / Equipe'
  },
  {
    id: 'ct-valhalla-boxe',
    nome: 'Valhalla Noble Art Boxing Club',
    bairro: 'Moema',
    cidade: 'São Paulo - SP',
    distancia: '4.5 km',
    modalidades: ['Boxe Olímpico', 'Boxe Executivo', 'Condicionamento'],
    passeMinimo: 'GOLD',
    nota: '4.94',
    avaliacoes: 274,
    vagasHoje: 7,
    statusHoje: 'DISPONIVEL',
    destaque: 'Ringue Oficial & Saco Inteligente',
    imagem: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    proximaAula: '18:00 · Boxe Nobre Arte',
    mestreResponsavel: 'Treinador Viktor'
  },
  {
    id: 'ct-bushido-dojo',
    nome: 'Bushido Kodokan Judo & Karatê Kyokushin',
    bairro: 'Liberdade',
    cidade: 'São Paulo - SP',
    distancia: '5.0 km',
    modalidades: ['Judô Kodokan', 'Karatê Kyokushin', 'Defesa Pessoal'],
    passeMinimo: 'SILVER',
    nota: '4.97',
    avaliacoes: 310,
    vagasHoje: 15,
    statusHoje: 'DISPONIVEL',
    destaque: 'Tradição Marcial & Formação de Faixas',
    imagem: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=80',
    proximaAula: '19:00 · Karatê Kyokushin',
    mestreResponsavel: 'Sensei Kenji Takeda'
  }
];

const REWARDS_SHOWCASE_ITEMS = [
  {
    id: 'rw-1',
    nome: 'Luva Oficial Combat-Pass Pro 14oz',
    categoria: 'Equipamento Oficial',
    pontos: 2400,
    icone: '🥊',
    estoque: 'Disponível em 18 CTs'
  },
  {
    id: 'rw-2',
    nome: 'Kimono Trançado Ultra-Light BJJ',
    categoria: 'Armadura de Tatame',
    pontos: 3800,
    icone: '🥋',
    estoque: 'Disponível em 12 CTs'
  },
  {
    id: 'rw-3',
    nome: 'Bandagem Elástica 5m + Protetor Bucal',
    categoria: 'Kit Proteção',
    pontos: 650,
    icone: '🩹',
    estoque: 'Retirada Imediata na Recepção'
  },
  {
    id: 'rw-4',
    nome: 'Prajied / Faixa Bordada Personalizada',
    categoria: 'Graduação & Honra',
    pontos: 1200,
    icone: '🏅',
    estoque: 'Sob Encomenda Oficial'
  }
];

export const LandingHubPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    preferences,
    setJourneyPreset,
    setPalette,
    setLoadingStyle,
    moveSectionItem,
    toggleSectionVisibility,
    moveRouteItem,
    toggleRouteVisibility,
    triggerLoadingDemo
  } = useLayoutEngine();

  const activePreset = preferences.layoutPreset.landing;

  // Painel Visual "Central de Escolha do Cliente" (Showroom / Launchpad)
  const [showExperienceHub, setShowExperienceHub] = useState(false);
  const [showOrderBuilderModal, setShowOrderBuilderModal] = useState(false);

  // Estados Layout A (Marketplace Split-Screen App)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState('TODAS');
  const [selectedPassFilter, setSelectedPassFilter] = useState('TODOS');
  const [selectedCity, setSelectedCity] = useState('São Paulo - SP');
  const [selectedCenter, setSelectedCenter] = useState<PartnerCenter>(DEFAULT_PARTNER_CTS[0]);
  const [marketplaceRightTab, setMarketplaceRightTab] = useState<'radar' | 'checkin' | 'passes'>('radar');

  // Estados Layout B (Corporativo & Institucional B2B)
  const [corpEcosystemTab, setCorpEcosystemTab] = useState<'empresas' | 'academias' | 'atletas'>('empresas');
  const [credenciamentoForm, setCredenciamentoForm] = useState({
    nomeAcademia: '',
    cidadeBairro: '',
    modalidades: '',
    cnpjOuResponsavel: '',
    whatsapp: ''
  });
  const [credenciamentoStatus, setCredenciamentoStatus] = useState('');

  // Estados Layout C (Arena Tatame HUD / Command Center)
  const [arenaClock, setArenaClock] = useState<string>(new Date().toLocaleTimeString('pt-BR'));
  const [aulasHoje, setAulasHoje] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setArenaClock(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    publicApi
      .getTodayClasses()
      .then((res: any) => {
        if (Array.isArray(res?.data?.aulas)) setAulasHoje(res.data.aulas);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activePreset === 'classic') {
      document.body.classList.remove('react-active');
    } else {
      document.body.classList.add('react-active');
    }
  }, [activePreset]);

  const filteredCenters = DEFAULT_PARTNER_CTS.filter(ct => {
    const matchText =
      !searchQuery.trim() ||
      ct.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ct.bairro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ct.modalidades.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchModality =
      selectedModality === 'TODAS' ||
      ct.modalidades.some(m => m.toLowerCase().includes(selectedModality.toLowerCase()));
    const matchPass = selectedPassFilter === 'TODOS' || ct.passeMinimo === selectedPassFilter;
    return matchText && matchModality && matchPass;
  });

  const handleNavSelect = (routeOrTab: string) => {
    if (routeOrTab.startsWith('/')) {
      navigate(routeOrTab);
      return;
    }
    const cleanId = routeOrTab.replace('#', '');
    const el = document.getElementById(`landing-sec-${cleanId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectLayout = (presetId: LandingPresetId, label: string) => {
    triggerLoadingDemo(`Ativando arquitetura: ${label}...`, undefined, 600);
    setJourneyPreset('landing', presetId);
    setShowExperienceHub(false);
  };

  const handleCredenciarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credenciamentoForm.nomeAcademia || !credenciamentoForm.whatsapp) {
      setCredenciamentoStatus('Informe a Razão Social / Nome do CT e o WhatsApp comercial.');
      return;
    }
    triggerLoadingDemo('Enviando dossiê de credenciamento B2B...', 'step_progress', 1400);
    setCredenciamentoStatus(
      `✅ Proposta da unidade "${credenciamentoForm.nomeAcademia}" protocolada! Nosso time de expansão B2B entrará em contato.`
    );
    setCredenciamentoForm({
      nomeAcademia: '',
      cidadeBairro: '',
      modalidades: '',
      cnpjOuResponsavel: '',
      whatsapp: ''
    });
  };

  // ============================================================================
  // DOCK SUPERIOR GLOBAL DE EXPERIÊNCIA (VISÍVEL EM TODOS OS 4 LAYOUTS)
  // Permite escolher o layout com miniaturas visuais, trocar paleta, ordenar páginas
  // ou ir direto para qualquer módulo da versão anterior ou nova!
  // ============================================================================
  const renderGlobalExperienceDock = () => (
    <div
      style={{
        position: activePreset === 'classic' ? 'fixed' : 'sticky',
        top: activePreset === 'classic' ? '5.2rem' : '0',
        left: 0,
        right: 0,
        zIndex: 9990,
        background: 'var(--bg-surface-1)',
        borderBottom: '2px solid var(--color-primary)',
        boxShadow: 'var(--shadow-card)',
        padding: '0.55rem clamp(0.75rem, 2vw, 1.75rem)'
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}
      >
        {/* Seletor Direto dos 4 Layouts Completamente Diferentes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowExperienceHub(prev => !prev)}
            style={{
              padding: '0.48rem 0.9rem',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              color: 'var(--text-primary-foreground)',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <span>🎛️</span>
            <span>Escolher O Que Ver / Vitrine de Layouts</span>
          </button>

          {(
            [
              { id: 'marketplace', icon: '🗺️', label: '1. App Marketplace & Mapa' },
              { id: 'corporate', icon: '🏢', label: '2. Executivo & B2B Editorial' },
              { id: 'tatame', icon: '⚡', label: '3. Arena Tatame HUD (Ao Vivo)' },
              { id: 'classic', icon: '🏛️', label: '4. Site Clássico Original' }
            ] as Array<{ id: LandingPresetId; icon: string; label: string }>
          ).map(item => {
            const isCurrent = activePreset === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectLayout(item.id, item.label)}
                style={{
                  padding: '0.44rem 0.8rem',
                  borderRadius: '10px',
                  background: isCurrent ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                  color: 'var(--text-foreground)',
                  border: isCurrent
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--border-subtle)',
                  fontSize: '0.73rem',
                  fontWeight: isCurrent ? 900 : 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {isCurrent && (
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '999px',
                      background: 'var(--status-available)'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Atalhos Rápidos para Todos os Módulos (Antigos e Novos) + Ordenador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowOrderBuilderModal(true)}
            style={{
              padding: '0.42rem 0.75rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-2)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              fontSize: '0.72rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            🔀 Ordenar Menu & Seções
          </button>

          <button
            type="button"
            onClick={() => navigate('/portal?tab=torneios')}
            style={{
              padding: '0.42rem 0.7rem',
              borderRadius: '8px',
              background: 'var(--bg-background)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🏆 Torneios
          </button>

          <button
            type="button"
            onClick={() => navigate('/portal?tab=ranking')}
            style={{
              padding: '0.42rem 0.7rem',
              borderRadius: '8px',
              background: 'var(--bg-background)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🌍 Ranking
          </button>

          <button
            type="button"
            onClick={() => navigate('/portal?tab=desempenho')}
            style={{
              padding: '0.42rem 0.7rem',
              borderRadius: '8px',
              background: 'var(--bg-background)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            📊 Stats
          </button>

          <button
            type="button"
            onClick={() => navigate('/portal')}
            style={{
              padding: '0.42rem 0.75rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-2)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            🥊 Aluno
          </button>

          <button
            type="button"
            onClick={() => navigate('/professor')}
            style={{
              padding: '0.42rem 0.75rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-2)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            🥋 Professor
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin')}
            style={{
              padding: '0.42rem 0.75rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-2)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              fontSize: '0.72rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            👑 Admin
          </button>

          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MODAL SHOWROOM INTERATIVO: "CENTRAL DE ESCOLHA VISUAL DO CLIENTE"
  // Exibe miniaturas arquiteturais desenhadas (Wireframes Vivos) de cada layout,
  // escolha de páginas/módulos e troca de paleta em tempo real.
  // ============================================================================
  const renderExperienceHubModal = () => {
    if (!showExperienceHub) return null;

    return (
      <div
        onClick={e => {
          if (e.target === e.currentTarget) setShowExperienceHub(false);
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            background: 'var(--bg-surface-1)',
            color: 'var(--text-foreground)',
            border: '2px solid var(--color-primary)',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-card)',
            maxHeight: '92vh',
            overflowY: 'auto'
          }}
        >
          {/* Cabeçalho do Hub de Escolha */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-primary)'
                }}
              >
                🎛️ CENTRAL DE ESCOLHA VISUAL · ARQUITETURAS & JORNADAS COMBAT-PASS
              </span>
              <h2
                style={{
                  margin: '0.25rem 0',
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.9rem)',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase'
                }}
              >
                O Que Você Deseja Visualizar Agora?
              </h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted-foreground)' }}>
                Escolha abaixo um dos <strong>4 Layouts Completamente Diferentes</strong> para a Página Inicial, navegue diretamente para qualquer módulo do sistema ou altere a paleta de cores ativa.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowExperienceHub(false)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              ✕ Fechar Vitrine
            </button>
          </div>

          {/* 4 CARDS COM MINIATURAS VISUAIS (WIREFRAMES DIFERENTES) DOS 4 LAYOUTS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(275px, 1fr))',
              gap: '1.1rem',
              marginBottom: '1.75rem'
            }}
          >
            {/* Card 1: App Marketplace & Mapa Split-View */}
            <div
              onClick={() => handleSelectLayout('marketplace', 'App Marketplace & Mapa Split-View')}
              style={{
                padding: '1.15rem',
                borderRadius: '18px',
                background:
                  activePreset === 'marketplace' ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                border:
                  activePreset === 'marketplace'
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                {/* Miniatura Visual Desenhada: Split-Screen App */}
                <div
                  style={{
                    height: '110px',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.55rem',
                    marginBottom: '0.85rem',
                    display: 'grid',
                    gridTemplateColumns: '1.6fr 1fr',
                    gap: '0.45rem'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div
                      style={{
                        height: '16px',
                        borderRadius: '999px',
                        background: 'var(--color-primary)',
                        opacity: 0.85
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', flex: 1 }}>
                      <div style={{ borderRadius: '6px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }} />
                      <div style={{ borderRadius: '6px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }} />
                    </div>
                  </div>
                  <div
                    style={{
                      borderRadius: '8px',
                      background: 'var(--bg-surface-2)',
                      border: '1px dashed var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}
                  >
                    🗺️
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)'
                  }}
                >
                  ARQUITETURA 1 · ESTILO APP / GYMPASS / AIRBNB
                </span>
                <h3 style={{ margin: '0.2rem 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 900 }}>
                  🗺️ Marketplace Split-Screen & Radar
                </h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                  Tela dividida estilo aplicativo: barra de categorias em ícones no topo, catálogo visual de academias à esquerda e Radar Interativo / Check-in fixo à direita.
                </p>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  background:
                    activePreset === 'marketplace' ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                  color:
                    activePreset === 'marketplace'
                      ? 'var(--text-primary-foreground)'
                      : 'var(--text-foreground)',
                  border: '1px solid var(--color-primary)',
                  fontSize: '0.76rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                {activePreset === 'marketplace' ? '✓ Layout Ativo Agora' : 'Ativar Layout 1 →'}
              </button>
            </div>

            {/* Card 2: Corporativo & Editorial B2B */}
            <div
              onClick={() => handleSelectLayout('corporate', 'Corporativo & Editorial B2B')}
              style={{
                padding: '1.15rem',
                borderRadius: '18px',
                background:
                  activePreset === 'corporate' ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                border:
                  activePreset === 'corporate'
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                {/* Miniatura Visual Desenhada: Editorial B2B */}
                <div
                  style={{
                    height: '110px',
                    borderRadius: '4px',
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.55rem',
                    marginBottom: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.4rem', flex: 1 }}>
                    <div style={{ borderRight: '1px solid var(--border-subtle)', paddingRight: '0.4rem' }}>
                      <div style={{ width: '75%', height: '10px', background: 'var(--text-foreground)', marginBottom: '6px' }} />
                      <div style={{ width: '95%', height: '6px', background: 'var(--text-muted-foreground)', opacity: 0.5, marginBottom: '4px' }} />
                      <div style={{ width: '60%', height: '14px', background: 'var(--color-primary)', marginTop: '8px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ flex: 1, background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }} />
                      <div style={{ flex: 1, background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }} />
                    </div>
                  </div>
                  <div style={{ height: '18px', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', paddingTop: '4px' }}>
                    <div style={{ background: 'var(--bg-surface-2)' }} />
                    <div style={{ background: 'var(--bg-surface-2)' }} />
                    <div style={{ background: 'var(--bg-surface-2)' }} />
                    <div style={{ background: 'var(--bg-surface-2)' }} />
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)'
                  }}
                >
                  ARQUITETURA 2 · ESTILO STRIPE / ENTERPRISE B2B
                </span>
                <h3 style={{ margin: '0.2rem 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 900 }}>
                  🏢 Portal Executivo, RH & Redes B2B
                </h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                  Design editorial de linhas retas e divisórias formais: manifesto corporativo, matriz comparativa auditável de planos e dossiê de credenciamento de redes.
                </p>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  background:
                    activePreset === 'corporate' ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                  color:
                    activePreset === 'corporate'
                      ? 'var(--text-primary-foreground)'
                      : 'var(--text-foreground)',
                  border: '1px solid var(--color-primary)',
                  fontSize: '0.76rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                {activePreset === 'corporate' ? '✓ Layout Ativo Agora' : 'Ativar Layout 2 →'}
              </button>
            </div>

            {/* Card 3: Arena Tatame HUD (Command Center) */}
            <div
              onClick={() => handleSelectLayout('tatame', 'Arena Tatame HUD (Command Center)')}
              style={{
                padding: '1.15rem',
                borderRadius: '18px',
                background:
                  activePreset === 'tatame' ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                border:
                  activePreset === 'tatame'
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                {/* Miniatura Visual Desenhada: HUD Esportivo 3 Colunas */}
                <div
                  style={{
                    height: '110px',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-1)',
                    border: '2px solid var(--color-primary)',
                    padding: '0.45rem',
                    marginBottom: '0.85rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.6fr 1fr',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ borderRadius: '6px', background: 'var(--bg-surface-2)', padding: '4px', fontSize: '0.6rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                    ⚡ CHECK-IN
                  </div>
                  <div style={{ borderRadius: '6px', background: 'var(--bg-background)', border: '1px solid var(--status-available)', padding: '4px', fontSize: '0.6rem', fontWeight: 900, color: 'var(--status-available)' }}>
                    📅 GRADE AO VIVO
                  </div>
                  <div style={{ borderRadius: '6px', background: 'var(--bg-surface-2)', padding: '4px', fontSize: '0.6rem', fontWeight: 900, color: 'var(--color-accent)' }}>
                    🏆 RANKING
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)'
                  }}
                >
                  ARQUITETURA 3 · ESTILO UFC FIGHT PASS / HUD TÁTICO
                </span>
                <h3 style={{ margin: '0.2rem 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 900 }}>
                  ⚡ Arena Command Center (Ao Vivo)
                </h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                  Painel de controle esportivo em 3 colunas simultâneas sem rolagem longa: Placar ao vivo no topo, Check-in Expresso à esquerda, Grade no centro e Torneios/Ranking à direita.
                </p>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  background:
                    activePreset === 'tatame' ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                  color:
                    activePreset === 'tatame'
                      ? 'var(--text-primary-foreground)'
                      : 'var(--text-foreground)',
                  border: '1px solid var(--color-primary)',
                  fontSize: '0.76rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                {activePreset === 'tatame' ? '✓ Layout Ativo Agora' : 'Ativar Layout 3 →'}
              </button>
            </div>

            {/* Card 4: Site Institucional Clássico Original */}
            <div
              onClick={() => handleSelectLayout('classic', 'Site Clássico Original')}
              style={{
                padding: '1.15rem',
                borderRadius: '18px',
                background:
                  activePreset === 'classic' ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                border:
                  activePreset === 'classic'
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                {/* Miniatura Visual Desenhada: Clássico Hero + Foto */}
                <div
                  style={{
                    height: '110px',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.55rem',
                    marginBottom: '0.85rem',
                    display: 'grid',
                    gridTemplateColumns: '1.3fr 1fr',
                    gap: '0.45rem',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ height: '12px', width: '90%', background: 'var(--color-primary)', borderRadius: '4px', marginBottom: '6px' }} />
                    <div style={{ height: '8px', width: '70%', background: 'var(--text-foreground)', borderRadius: '4px', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ height: '16px', width: '45%', background: 'var(--color-primary)', borderRadius: '4px' }} />
                      <div style={{ height: '16px', width: '45%', background: 'var(--bg-surface-2)', borderRadius: '4px' }} />
                    </div>
                  </div>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}
                  >
                    🥊
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)'
                  }}
                >
                  ARQUITETURA 4 · LANDING PAGE ORIGINAL COMPLETA
                </span>
                <h3 style={{ margin: '0.2rem 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 900 }}>
                  🏛️ Site Institucional Clássico
                </h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                  A versão institucional clássica completa do Centro de Combate com Estrutura 180m², Modalidades, Corpo Docente, Galeria, FAQ e Destaques Competitivos.
                </p>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  background:
                    activePreset === 'classic' ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                  color:
                    activePreset === 'classic'
                      ? 'var(--text-primary-foreground)'
                      : 'var(--text-foreground)',
                  border: '1px solid var(--color-primary)',
                  fontSize: '0.76rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                {activePreset === 'classic' ? '✓ Layout Ativo Agora' : 'Ativar Layout 4 →'}
              </button>
            </div>
          </div>

          {/* ACESSO RÁPIDO A TODAS AS PÁGINAS E JORNADAS DO SISTEMA */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: '16px',
              background: 'var(--bg-background)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem'
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                marginBottom: '0.75rem'
              }}
            >
              🚀 Ir Direto Para Qualquer Página ou Portal do Ecossistema:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                gap: '0.6rem'
              }}
            >
              {[
                { label: '🥊 Portal do Aluno', desc: 'Check-in, Frequência & XP', route: '/portal' },
                { label: '🥋 Portal do Professor', desc: 'Chamada 1-Toque & Comissões', route: '/professor' },
                { label: '👑 ERP Admin & Studio', desc: 'Caixa, Visão 360 & Layouts', route: '/admin' },
                { label: '🏆 Torneios & Brackets', desc: 'Chaves e Copas Oficiais', route: '/portal?tab=torneios' },
                { label: '🌍 Ranking Global', desc: 'Leaderboard MMR de Atletas', route: '/portal?tab=ranking' },
                { label: '📊 Estatísticas Ao Vivo', desc: 'Performance & Assiduidade', route: '/portal?tab=desempenho' },
                { label: '🪙 Loja de Points', desc: 'Resgatar Luvas e Kimonos', route: '/portal?tab=recompensas' },
                { label: '🔥 Aula Experimental', desc: 'Agendar Primeiro Treino', route: '/agendar' }
              ].map((dest, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setShowExperienceHub(false);
                    navigate(dest.route);
                  }}
                  style={{
                    padding: '0.7rem 0.85rem',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-foreground)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{dest.label}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)', marginTop: '2px' }}>
                    {dest.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SELETOR RÁPIDO DAS 14 PALETAS DE CORES */}
          <div
            style={{
              padding: '1rem 1.15rem',
              borderRadius: '16px',
              background: 'var(--bg-background)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                marginBottom: '0.65rem'
              }}
            >
              🎨 Testar Qualquer Uma das 14 Paletas de Cores Existentes no Layout Escolhido:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {THEMES_LIST.map(t => {
                const isSelected = preferences.activePaletteId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPalette(t.id)}
                    style={{
                      padding: '0.38rem 0.7rem',
                      borderRadius: '999px',
                      background: isSelected ? 'var(--bg-surface-2)' : 'var(--bg-surface-1)',
                      border: isSelected
                        ? '2px solid var(--color-primary)'
                        : '1px solid var(--border-subtle)',
                      color: 'var(--text-foreground)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '999px',
                        background: t.preview[0],
                        border: `2px solid ${t.preview[1] || '#fff'}`
                      }}
                    />
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MODAL ORDENADOR DE PÁGINAS (MENU) & BLOCOS (SEÇÕES)
  // ============================================================================
  const renderOrderBuilderModal = () => {
    if (!showOrderBuilderModal) return null;

    return (
      <div
        onClick={e => {
          if (e.target === e.currentTarget) setShowOrderBuilderModal(false);
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '960px',
            background: 'var(--bg-surface-1)',
            color: 'var(--text-foreground)',
            border: '2px solid var(--color-primary)',
            borderRadius: '22px',
            padding: '1.5rem',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
                🔀 Ordenador Dinâmico de Páginas (Menu) e Seções da Tela
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted-foreground)' }}>
                Defina qual item vem primeiro na barra de navegação e a ordem/visibilidade dos blocos internos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOrderBuilderModal(false)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              ✓ Concluir
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {/* Coluna 1: Ordem dos Itens de Navegação */}
            <div>
              <h4 style={{ margin: '0 0 0.65rem 0', fontSize: '0.86rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                1. Ordem das Páginas no Menu
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {preferences.routeOrder.landing.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      opacity: item.visible ? 1 : 0.45
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                      #{idx + 1} · {item.icon} {item.label}
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        onClick={() => moveRouteItem('landing', idx, 'up')}
                        style={{ padding: '0.2rem 0.45rem', borderRadius: '6px', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveRouteItem('landing', idx, 'down')}
                        style={{ padding: '0.2rem 0.45rem', borderRadius: '6px', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleRouteVisibility('landing', item.id)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          background: item.visible ? 'var(--status-available-bg)' : 'var(--bg-surface-2)',
                          color: item.visible ? 'var(--status-available)' : 'var(--text-muted-foreground)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          cursor: 'pointer'
                        }}
                      >
                        {item.visible ? 'Visível' : 'Oculto'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna 2: Ordem das Seções da Página */}
            <div>
              <h4 style={{ margin: '0 0 0.65rem 0', fontSize: '0.86rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                2. Ordem dos Blocos da Página
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {preferences.sectionOrder.landing.map((sec, idx) => (
                  <div
                    key={sec.id}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      opacity: sec.visible ? 1 : 0.45
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                      #{idx + 1} · {sec.icon} {sec.label}
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        onClick={() => moveSectionItem('landing', idx, 'up')}
                        style={{ padding: '0.2rem 0.45rem', borderRadius: '6px', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSectionItem('landing', idx, 'down')}
                        style={{ padding: '0.2rem 0.45rem', borderRadius: '6px', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSectionVisibility('landing', sec.id)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          background: sec.visible ? 'var(--status-available-bg)' : 'var(--bg-surface-2)',
                          color: sec.visible ? 'var(--status-available)' : 'var(--text-muted-foreground)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          cursor: 'pointer'
                        }}
                      >
                        {sec.visible ? 'Visível' : 'Oculto'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // SE O USUÁRIO ESTIVER NO LAYOUT 4 ("CLASSIC" - HTML ORIGINAL DO INDEX.HTML)
  // ============================================================================
  if (activePreset === 'classic') {
    return (
      <>
        {renderGlobalExperienceDock()}
        {renderExperienceHubModal()}
        {renderOrderBuilderModal()}
      </>
    );
  }

  // ============================================================================
  // LAYOUT 1: "MARKETPLACE SPLIT-SCREEN & RADAR" (ESTILO AIRBNB / GYMPASS APP)
  // Arquitetura 100% diferente:
  // - Top Bar estilo App de Busca com pílula central arredondada
  // - Barra de Categorias Marcial em Ícones Horizontais
  // - Split-View de Tela Cheia: Catálogo Fotográfico à Esquerda (60%) + Painel Fixo
  //   de Radar / Mapa / Check-in Expresso / Passes à Direita (40%)
  // ============================================================================
  if (activePreset === 'marketplace') {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text-foreground)' }}>
        {renderGlobalExperienceDock()}
        {renderExperienceHubModal()}
        {renderOrderBuilderModal()}

        {/* App Sub-Header com Pílula de Busca Central (Estilo Airbnb / Wellhub) */}
        <div
          style={{
            background: 'var(--bg-surface-1)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0.85rem clamp(1rem, 2.5vw, 2rem)'
          }}
        >
          <div
            style={{
              maxWidth: '1600px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '999px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem'
                }}
              >
                🗺️
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                  combat<span style={{ color: 'var(--color-primary)' }}>pass</span>.explore
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)' }}>
                  Marketplace Multi-Academias & Reserva Instantânea
                </div>
              </div>
            </div>

            {/* Pílula Central de Busca Inteligente */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.45rem 0.35rem 1rem',
                borderRadius: '999px',
                background: 'var(--bg-background)',
                border: '2px solid var(--border-subtle)',
                flex: '1',
                maxWidth: '640px',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar CT, bairro (ex: Jardins, Pinheiros) ou arte marcial..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-foreground)',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              />
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '999px',
                  background: 'var(--bg-surface-2)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}
              >
                <option value="São Paulo - SP">📍 São Paulo</option>
                <option value="Campinas - SP">📍 Campinas</option>
                <option value="Rio de Janeiro - RJ">📍 Rio de Janeiro</option>
              </select>
              <button
                type="button"
                onClick={() => setMarketplaceRightTab('checkin')}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Check-in Rápido
              </button>
            </div>

            {/* Filtro de Categoria de Passe */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {(['TODOS', 'SILVER', 'GOLD', 'BLACK'] as const).map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedPassFilter(tier)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '999px',
                    background:
                      selectedPassFilter === tier ? 'var(--color-primary)' : 'var(--bg-surface-2)',
                    color:
                      selectedPassFilter === tier
                        ? 'var(--text-primary-foreground)'
                        : 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  {tier === 'TODOS' ? '🎫 Todos Passes' : tier}
                </button>
              ))}
            </div>
          </div>

          {/* Barra de Ícones de Categorias Estilo Airbnb */}
          <div
            style={{
              maxWidth: '1600px',
              margin: '0.75rem auto 0',
              paddingTop: '0.65rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              overflowX: 'auto'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'TODAS', icon: '🔥', label: 'Em Alta Hoje' },
                { id: 'Muay Thai', icon: '🥊', label: 'Muay Thai' },
                { id: 'Jiu-Jitsu', icon: '🥋', label: 'Jiu-Jitsu BJJ' },
                { id: 'Boxe', icon: '🥊', label: 'Boxe Nobre' },
                { id: 'MMA', icon: '⛓️', label: 'MMA & Cage' },
                { id: 'Judô', icon: '⛩️', label: 'Judô & Karatê' }
              ].map(cat => {
                const active = selectedModality === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedModality(cat.id)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '12px',
                      background: active ? 'var(--bg-surface-2)' : 'transparent',
                      borderBottom: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                      color: active ? 'var(--color-primary)' : 'var(--text-muted-foreground)',
                      fontSize: '0.76rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ fontSize: '1.05rem' }}>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted-foreground)', fontWeight: 700, whiteSpace: 'nowrap' }}>
              Mostrando <strong>{filteredCenters.length} CTs credenciados</strong> em {selectedCity}
            </div>
          </div>
        </div>

        {/* CORPO SPLIT-VIEW: CATÁLOGO DE CARDS COM FOTOS (ESQUERDA) + PAINEL INTERATIVO FIXO (DIREITA) */}
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '1.25rem clamp(1rem, 2.5vw, 2rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start'
          }}
        >
          {/* COLUNA ESQUERDA (CATÁLOGO VISUAL DE ACADEMIAS + LOJA DE POINTS) */}
          <div style={{ gridColumn: 'span 1' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '1.1rem',
                marginBottom: '1.75rem'
              }}
            >
              {filteredCenters.map(ct => {
                const isSelected = selectedCenter.id === ct.id;
                return (
                  <div
                    key={ct.id}
                    onClick={() => {
                      setSelectedCenter(ct);
                      setMarketplaceRightTab('radar');
                    }}
                    style={{
                      borderRadius: '18px',
                      overflow: 'hidden',
                      background: 'var(--bg-surface-1)',
                      border: isSelected
                        ? '2px solid var(--color-primary)'
                        : '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <div>
                      {/* Foto do CT com Badges Flutuantes */}
                      <div style={{ position: 'relative', height: '155px', overflow: 'hidden' }}>
                        <img
                          src={ct.imagem}
                          alt={ct.nome}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.6rem',
                            left: '0.6rem',
                            padding: '0.22rem 0.6rem',
                            borderRadius: '999px',
                            background: 'var(--bg-surface-1)',
                            color: 'var(--color-primary)',
                            border: '1px solid var(--color-primary)',
                            fontSize: '0.66rem',
                            fontWeight: 900
                          }}
                        >
                          PASSE {ct.passeMinimo}+
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.6rem',
                            right: '0.6rem',
                            padding: '0.22rem 0.55rem',
                            borderRadius: '999px',
                            background: 'var(--bg-surface-1)',
                            color: 'var(--text-foreground)',
                            fontSize: '0.68rem',
                            fontWeight: 900
                          }}
                        >
                          ★ {ct.nota} ({ct.avaliacoes})
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '0.5rem',
                            left: '0.6rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            background:
                              ct.statusHoje === 'LOTADO'
                                ? 'var(--status-full)'
                                : 'var(--status-available)',
                            color: 'var(--text-primary-foreground)',
                            fontSize: '0.65rem',
                            fontWeight: 900
                          }}
                        >
                          {ct.statusHoje === 'LOTADO'
                            ? '🔴 LOTADO HOJE'
                            : `🟢 HÁ ${ct.vagasHoje} VAGAS HOJE`}
                        </div>
                      </div>

                      {/* Corpo do Card */}
                      <div style={{ padding: '0.95rem 1rem' }}>
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: 'var(--text-muted-foreground)',
                            marginBottom: '0.2rem'
                          }}
                        >
                          📍 {ct.bairro} · {ct.distancia} de você
                        </div>
                        <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '0.96rem', fontWeight: 900 }}>
                          {ct.nome}
                        </h3>
                        <div
                          style={{
                            fontSize: '0.73rem',
                            color: 'var(--color-primary)',
                            fontWeight: 800,
                            marginBottom: '0.55rem'
                          }}
                        >
                          ⏰ Próx. Turma: {ct.proximaAula}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {ct.modalidades.map(m => (
                            <span
                              key={m}
                              style={{
                                padding: '0.15rem 0.45rem',
                                borderRadius: '6px',
                                background: 'var(--bg-background)',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '0.65rem',
                                fontWeight: 700
                              }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '0.65rem 1rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--bg-background)'
                      }}
                    >
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                        {ct.mestreResponsavel}
                      </span>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          navigate('/portal');
                        }}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          background: 'var(--color-primary)',
                          color: 'var(--text-primary-foreground)',
                          border: 'none',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          cursor: 'pointer'
                        }}
                      >
                        Reservar Vaga →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Faixa Compacta da Loja de Points dentro do Marketplace */}
            <div
              style={{
                padding: '1.15rem',
                borderRadius: '18px',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.66rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    RECOMPENSAS DO MARKETPLACE
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>
                    🪙 Troque seus Check-ins por Equipamentos Oficiais
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/portal?tab=recompensas')}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-2)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  Abrir Loja →
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                {REWARDS_SHOWCASE_ITEMS.map(rw => (
                  <div
                    key={rw.id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{rw.icone}</span>
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800 }}>{rw.nome}</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                        🪙 {rw.pontos} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA FIXA (STICKY): RADAR DO CT SELECIONADO + GRADE DO DIA + CHECK-IN EXPRESSO */}
          <div
            style={{
              position: 'sticky',
              top: '4.5rem',
              borderRadius: '20px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden'
            }}
          >
            {/* Abas do Painel Lateral Direito */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-background)'
              }}
            >
              {(
                [
                  { id: 'radar', label: '🗺️ Radar & Grade da Unidade' },
                  { id: 'checkin', label: '⚡ Check-in Expresso' },
                  { id: 'passes', label: '🎫 Comparar Passes' }
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMarketplaceRightTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 0.5rem',
                    border: 'none',
                    borderBottom:
                      marketplaceRightTab === tab.id
                        ? '3px solid var(--color-primary)'
                        : '3px solid transparent',
                    background:
                      marketplaceRightTab === tab.id ? 'var(--bg-surface-1)' : 'transparent',
                    color:
                      marketplaceRightTab === tab.id
                        ? 'var(--color-primary)'
                        : 'var(--text-muted-foreground)',
                    fontSize: '0.74rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '1.25rem' }}>
              {marketplaceRightTab === 'radar' && (
                <div>
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                        UNIDADE SELECIONADA NO MAPA
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--status-available)' }}>
                        📍 {selectedCenter.distancia}
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 900 }}>
                      {selectedCenter.nome}
                    </h3>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted-foreground)', marginBottom: '0.75rem' }}>
                      {selectedCenter.destaque} · Responsável: {selectedCenter.mestreResponsavel}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => navigate('/portal')}
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          borderRadius: '8px',
                          background: 'var(--color-primary)',
                          color: 'var(--text-primary-foreground)',
                          border: 'none',
                          fontSize: '0.74rem',
                          fontWeight: 900,
                          cursor: 'pointer'
                        }}
                      >
                        🥊 Agendar Horário Aqui
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/agendar')}
                        style={{
                          padding: '0.55rem 0.85rem',
                          borderRadius: '8px',
                          background: 'var(--bg-surface-2)',
                          color: 'var(--text-foreground)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        🔥 Aula Exp.
                      </button>
                    </div>
                  </div>

                  {/* Calendário Oficial Embutido no Painel Direito */}
                  <InteractiveCombatCalendar userRole="ALUNO" />
                </div>
              )}

              {marketplaceRightTab === 'checkin' && <PublicQuickCheckinCard />}

              {marketplaceRightTab === 'passes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { tier: 'SILVER', price: 'R$ 189/mês', desc: '12 check-ins/mês · Unidades Silver' },
                    { tier: 'GOLD PRO', price: 'R$ 269/mês', desc: 'Check-in diário · Unidades Silver & Gold + 1.5x Points' },
                    { tier: 'BLACK UNLIMITED', price: 'R$ 389/mês', desc: 'Acesso 100% da rede + Sparring Labs + 2x Points' }
                  ].map(p => (
                    <div
                      key={p.tier}
                      style={{
                        padding: '0.95rem',
                        borderRadius: '12px',
                        background: 'var(--bg-background)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                          Combat-Pass {p.tier}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>{p.desc}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>{p.price}</div>
                        <button
                          type="button"
                          onClick={() => navigate('/checkout')}
                          style={{
                            marginTop: '4px',
                            padding: '0.28rem 0.65rem',
                            borderRadius: '6px',
                            background: 'var(--color-primary)',
                            color: 'var(--text-primary-foreground)',
                            border: 'none',
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            cursor: 'pointer'
                          }}
                        >
                          Assinar →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // LAYOUT 2: "CORPORATIVO & EDITORIAL B2B" (ESTILO STRIPE / ENTERPRISE / REDES)
  // Arquitetura 100% diferente:
  // - Geometria ortogonal executiva (cantos retos/sharp 4px, divisórias 1px)
  // - Manifesto Assimétrico em Colunas Verticais + Tabela de Governança e Compliance
  // - Matriz Comparativa de Planos Corporativos/Individuais em Tabela Formal
  // - Dossiê de Credenciamento B2B para Academias e RH de Empresas
  // ============================================================================
  if (activePreset === 'corporate') {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text-foreground)' }}>
        {renderGlobalExperienceDock()}
        {renderExperienceHubModal()}
        {renderOrderBuilderModal()}

        <div
          style={{
            maxWidth: '1360px',
            margin: '2rem auto',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {/* Cabeçalho Executivo Formal */}
          <div
            style={{
              padding: '1.25rem 2rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span
                style={{
                  padding: '0.3rem 0.65rem',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  letterSpacing: '0.14em'
                }}
              >
                COMBAT-PASS ENTERPRISE
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-foreground)', fontWeight: 600 }}>
                Infraestrutura B2B de Benefícios Corporativos & Gestão Multi-Unidades
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Acessar Console ERP →
              </button>
              <button
                type="button"
                onClick={() => handleNavSelect('#credenciamento')}
                style={{
                  padding: '0.5rem 1.15rem',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Credenciar Empresa / Academia
              </button>
            </div>
          </div>

          {/* Manifesto Editorial Assimétrico em 2 Colunas com Divisória Vertical */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div
              style={{
                padding: '3rem 2.5rem',
                borderRight: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem'
                }}
              >
                01 // GOVERNANÇA, SAÚDE CORPORATIVA & ALTA PERFORMANCE
              </div>
              <h1
                style={{
                  margin: '0 0 1.25rem 0',
                  fontSize: 'clamp(2rem, 3.4vw, 3rem)',
                  fontWeight: 900,
                  lineHeight: 1.06,
                  letterSpacing: '-0.02em'
                }}
              >
                Unificamos Benefícios Corporativos, Redes de CTs e ERP Financeiro Auditável.
              </h1>
              <p
                style={{
                  margin: '0 0 2rem 0',
                  fontSize: '0.96rem',
                  color: 'var(--text-muted-foreground)',
                  lineHeight: 1.7
                }}
              >
                Para departamentos de RH, oferecemos redução comprovada de estresse e absenteísmo através de artes marciais supervisionadas. Para redes de academias e dojos, entregamos ocupação de horários ociosos, repasse automático por check-in validado e controle completo de caixa e comissões.
              </p>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  style={{
                    padding: '0.85rem 1.5rem',
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    cursor: 'pointer'
                  }}
                >
                  Contratar Plano Corporativo / Individual
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/portal')}
                  style={{
                    padding: '0.85rem 1.5rem',
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Portal do Colaborador / Aluno →
                </button>
              </div>
            </div>

            {/* Coluna Direita: Dossiê em Abas Executivas */}
            <div style={{ padding: '2.5rem', background: 'var(--bg-background)' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.5rem'
                }}
              >
                {(
                  [
                    { id: 'empresas', label: 'PARA EMPRESAS (RH)' },
                    { id: 'academias', label: 'PARA REDES DE CTs' },
                    { id: 'atletas', label: 'PARA PRATICANTES' }
                  ] as const
                ).map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCorpEcosystemTab(tab.id)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      border: 'none',
                      background:
                        corpEcosystemTab === tab.id ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                      color:
                        corpEcosystemTab === tab.id
                          ? 'var(--text-primary-foreground)'
                          : 'var(--text-muted-foreground)',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      letterSpacing: '0.06em',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {corpEcosystemTab === 'empresas' && (
                <div>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.2rem', fontWeight: 900 }}>
                    Relatórios de Frequência, Subsídio Flexível & Fatura Única B2B
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted-foreground)', lineHeight: 1.65 }}>
                    Gerencie elegibilidade de colaboradores por CPF, acompanhe indicadores mensais de utilização de passes e receba faturamento corporativo consolidado com nota fiscal única.
                  </p>
                </div>
              )}

              {corpEcosystemTab === 'academias' && (
                <div>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.2rem', fontWeight: 900 }}>
                    Repasse Automático por Check-in & ERP Multi-Unidades Incluso
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted-foreground)', lineHeight: 1.65 }}>
                    Cada presença validada pelo professor gera crédito imediato no extrato da unidade parceira. Inclui módulo de Caixa Diário, Comissões Dinâmicas e Visão 360° de Alunos.
                  </p>
                </div>
              )}

              {corpEcosystemTab === 'atletas' && (
                <div>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.2rem', fontWeight: 900 }}>
                    Passe Unificado em 42+ Unidades com Graduação & Loja de Points
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted-foreground)', lineHeight: 1.65 }}>
                    Acesso livre a Muay Thai, Jiu-Jitsu, Boxe, Judô e MMA. Seu histórico de presenças conta para exames oficiais de faixa/Prajied e gera pontos trocáveis na recepção.
                  </p>
                </div>
              )}

              {/* Tabela de Indicadores Auditados */}
              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {[
                  { k: 'UNIDADES CREDENCIADAS', v: '42 Centros' },
                  { k: 'CHECK-INS AUDITADOS/MÊS', v: '18.400+' },
                  { k: 'TAXA DE RETENÇÃO ANUAL', v: '94.8%' },
                  { k: 'MODALIDADES COBERTAS', v: '14 Artes Marciais' }
                ].map((m, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1rem',
                      borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
                      borderRight: i % 2 === 0 ? '1px solid var(--border-subtle)' : 'none',
                      background: 'var(--bg-surface-1)'
                    }}
                  >
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--text-muted-foreground)' }}>
                      {m.k}
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-primary)', marginTop: '4px' }}>
                      {m.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Matriz Formal de Planos Corporativos e Individuais (Tabela Estruturada) */}
          <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
              02 // MATRIZ COMPARATIVA DE PASSES & CONTRATOS CORPORATIVOS
            </div>
            <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.5rem', fontWeight: 900 }}>
              Tabela Oficial de Assinaturas e Cobertura de Rede
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem'
                }}
              >
                <thead>
                  <tr style={{ background: 'var(--bg-background)', textAlign: 'left' }}>
                    <th style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>Critério / Cobertura</th>
                    <th style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>SILVER PASS (R$ 189)</th>
                    <th style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--color-primary)' }}>GOLD PRO (R$ 269)</th>
                    <th style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>BLACK UNLIMITED (R$ 389)</th>
                    <th style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>ENTERPRISE B2B (Sob Medida)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Franquia Mensal de Treinos', '12 Check-ins / mês', '30 Check-ins / mês (Diário)', 'Ilimitado (Inclusive 2x/dia)', 'Customizado por Colaborador'],
                    ['Unidades Credenciadas Aceitas', 'Rede Silver (22 CTs)', 'Redes Silver + Gold (35 CTs)', '100% da Rede + Labs (42 CTs)', 'Rede Completa Nacional'],
                    ['Cancelamento de Vaga Pendente', '✓ Sem multa antes da chamada', '✓ Sem multa antes da chamada', '✓ Prioridade + Sem multa', '✓ Gestão Flexível RH'],
                    ['Acúmulo de Combat Points', '1.0x Pontos por Treino', '1.5x Pontos por Treino', '2.0x Pontos + Convidado VIP', 'Relatório ESG & Engajamento']
                  ].map((row, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>{row[0]}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted-foreground)' }}>{row[1]}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-foreground)' }}>{row[2]}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted-foreground)' }}>{row[3]}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-primary)', fontWeight: 800 }}>{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Seção Formal de Credenciamento de Novas Academias & Empresas */}
          <div id="landing-sec-credenciamento" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  03 // EXPANSÃO DE REDE & CREDENCIAMENTO OFICIAL
                </div>
                <h2 style={{ margin: '0 0 0.65rem 0', fontSize: '1.45rem', fontWeight: 900 }}>
                  Protocolo de Credenciamento de CTs & Empresas Parceiras
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted-foreground)', lineHeight: 1.65 }}>
                  Submeta os dados da sua academia ou empresa para homologação técnica e liberação do painel administrativo multi-unidades.
                </p>
              </div>

              <form onSubmit={handleCredenciarSubmit} style={{ display: 'grid', gap: '0.75rem', padding: '1.5rem', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Razão Social / Nome do CT *"
                    value={credenciamentoForm.nomeAcademia}
                    onChange={e => setCredenciamentoForm({ ...credenciamentoForm, nomeAcademia: e.target.value })}
                    style={{ padding: '0.65rem', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Cidade / UF"
                    value={credenciamentoForm.cidadeBairro}
                    onChange={e => setCredenciamentoForm({ ...credenciamentoForm, cidadeBairro: e.target.value })}
                    style={{ padding: '0.65rem', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="CNPJ ou Responsável Técnico"
                    value={credenciamentoForm.cnpjOuResponsavel}
                    onChange={e => setCredenciamentoForm({ ...credenciamentoForm, cnpjOuResponsavel: e.target.value })}
                    style={{ padding: '0.65rem', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp Corporativo *"
                    value={credenciamentoForm.whatsapp}
                    onChange={e => setCredenciamentoForm({ ...credenciamentoForm, whatsapp: e.target.value })}
                    style={{ padding: '0.65rem', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                  />
                </div>
                {credenciamentoStatus && (
                  <div style={{ padding: '0.5rem', background: 'var(--status-available-bg)', color: 'var(--status-available)', fontSize: '0.76rem', fontWeight: 800 }}>
                    {credenciamentoStatus}
                  </div>
                )}
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem',
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer'
                  }}
                >
                  Protocolar Credenciamento B2B →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // LAYOUT 3: "ARENA TATAME HUD / COMMAND CENTER" (ESTILO UFC FIGHT PASS / AO VIVO)
  // Arquitetura 100% diferente:
  // - Painel Tático Esportivo de Alta Densidade em 3 Colunas Simultâneas (Bento HUD)
  // - Placar Eletrônico Superior com Relógio de Round Ao Vivo e Status dos Tatames
  // - Coluna Esquerda: Check-in Expresso Sem Fricção + Atalhos de Portais
  // - Coluna Central: Grade Oficial de Horários ao Vivo ([HÁ VAGAS] / [LOTADO])
  // - Coluna Direita: Os 3 Pilares Competitivos (Torneios, Ranking, Stats) + Loja Points
  // ============================================================================
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-foreground)' }}>
      {renderGlobalExperienceDock()}
      {renderExperienceHubModal()}
      {renderOrderBuilderModal()}

      <div style={{ maxWidth: '1640px', margin: '0 auto', padding: '1rem clamp(0.75rem, 2vw, 1.75rem)' }}>
        {/* PLACAR ELETRÔNICO DE ARENA (SCOREBOARD HUD SUPERIOR) */}
        <div
          style={{
            padding: '0.9rem 1.35rem',
            marginBottom: '1.15rem',
            borderRadius: '16px',
            background: 'var(--bg-surface-1)',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-glow)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.95rem',
                letterSpacing: '0.08em'
              }}
            >
              ⚡ ARENA LIVE HUD · {arenaClock}
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                CENTRAL DE OPERAÇÕES DE TATAME & CHECK-IN IMEDIATO
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                Selecione seu horário na grade central, bata seu ponto expresso à esquerda ou acesse o ranking competitivo à direita
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--status-available-bg)',
                border: '1px solid var(--status-available-border)',
                color: 'var(--status-available)',
                fontSize: '0.72rem',
                fontWeight: 900
              }}
            >
              🟢 5 TATAMES COM VAGAS AGORA
            </span>
            <span
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--status-full-bg)',
                border: '1px solid var(--status-full-border)',
                color: 'var(--status-full)',
                fontSize: '0.72rem',
                fontWeight: 900
              }}
            >
              🔴 1 TURMA LOTADA
            </span>
          </div>
        </div>

        {/* GRID TÁTICO EM 3 COLUNAS SIMULTÂNEAS (COMMAND CENTER) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '1.15rem',
            alignItems: 'start'
          }}
        >
          {/* COLUNA 1 (ESQUERDA): CHECK-IN EXPRESSO + PORTAIS OPERACIONAIS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <PublicQuickCheckinCard />

            <div
              style={{
                padding: '1.15rem',
                borderRadius: '18px',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                ⚡ TERMINAIS DE ACESSO DIRETO
              </div>
              <button
                type="button"
                onClick={() => navigate('/portal')}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>🥊 Entrar no Portal do Aluno</span>
                <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/professor')}
                style={{
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--bg-background)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>🥋 Terminal de Chamada do Professor</span>
                <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/agendar')}
                style={{
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--bg-background)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>🔥 Agendar Aula Experimental Gratuita</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* COLUNA 2 (CENTRAL): GRADE OFICIAL DE HORÁRIOS AO VIVO */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '20px',
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <InteractiveCombatCalendar userRole="ALUNO" />
          </div>

          {/* COLUNA 3 (DIREITA): OS 3 PILARES COMPETITIVOS + DROPS DA LOJA DE POINTS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1.15rem',
                borderRadius: '18px',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem'
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                🏆 CIRCUITO COMPETITIVO & ANALYTICS
              </div>

              {[
                {
                  icon: '🏆',
                  title: 'Próximos Torneios & Brackets',
                  sub: 'Inscrições abertas para chaves oficiais',
                  route: '/portal?tab=torneios'
                },
                {
                  icon: '🌍',
                  title: 'Ranking Global MMR',
                  sub: 'Leaderboard oficial por divisão e faixa',
                  route: '/portal?tab=ranking'
                },
                {
                  icon: '📊',
                  title: 'Estatísticas de Desempenho',
                  sub: 'Assiduidade, vitórias e evolução semanal',
                  route: '/portal?tab=desempenho'
                }
              ].map((c, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(c.route)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '12px',
                    background: 'var(--bg-background)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.45rem' }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 900 }}>{c.title}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)' }}>{c.sub}</div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 900 }}>→</span>
                </div>
              ))}
            </div>

            {/* Vitrine Compacta de Recompensas no HUD */}
            <div
              style={{
                padding: '1.15rem',
                borderRadius: '18px',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  🪙 LOJA DE COMBAT POINTS
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/portal?tab=recompensas')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  Resgatar →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {REWARDS_SHOWCASE_ITEMS.slice(0, 3).map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.65rem 0.8rem',
                      borderRadius: '10px',
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.76rem', fontWeight: 800 }}>
                      {item.icone} {item.nome}
                    </span>
                    <strong style={{ fontSize: '0.74rem', color: 'var(--color-primary)' }}>
                      {item.pontos} pts
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHubPage;
