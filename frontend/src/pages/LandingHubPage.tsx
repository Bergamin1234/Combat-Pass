import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useLayoutEngine,
  JourneyLayoutToolbar,
  LOADING_STYLE_META,
  LoadingStyleId,
  LandingPresetId
} from '../config/layoutEngine';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { InteractiveCombatCalendar } from '../components/InteractiveCombatCalendar';
import { PublicQuickCheckinCard } from '../components/QuickCheckinWidget';
import { publicApi, studentApi } from '../services/api';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { CompleteSiteModules } from '../components/CompleteSiteModules';

const FALLBACK_ACADEMIES = [
  {
    id: 'ct-boru',
    nome: 'CT Borü Centro de Combate (Unidade Credenciada)',
    cidade: 'São Paulo - SP',
    bairro: 'Centro / Arena',
    distancia: '1.2 km',
    modalidades: ['Muay Thai', 'Boxe', 'Sparring Técnico', 'Clinch'],
    rating: 4.9,
    vagasHoje: 12,
    tierMinimo: 'SILVER',
    imagem: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=700&auto=format&fit=crop&q=80',
    destaque: 'Octógono Oficial & Mestres Federados'
  },
  {
    id: 'ct-gracie-hub',
    nome: 'Alliance / Gracie Grappling Arena',
    cidade: 'São Paulo - SP',
    bairro: 'Jardins',
    distancia: '2.4 km',
    modalidades: ['Jiu-Jitsu (Gi)', 'No-Gi Submission', 'Judô', 'Defesa Pessoal'],
    rating: 4.9,
    vagasHoje: 8,
    tierMinimo: 'GOLD',
    imagem: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=700&auto=format&fit=crop&q=80',
    destaque: 'Tatame Olímpico 400m² Climatizado'
  },
  {
    id: 'ct-iron-boxing',
    nome: 'Iron Gloves Boxing & MMA Lab',
    cidade: 'São Paulo - SP',
    bairro: 'Vila Olímpia',
    distancia: '3.1 km',
    modalidades: ['Boxe Olímpico', 'MMA Pro', 'Wrestling', 'Condicionamento'],
    rating: 4.8,
    vagasHoje: 5,
    tierMinimo: 'SILVER',
    imagem: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&auto=format&fit=crop&q=80',
    destaque: 'Ringue Oficial & Preparação Física'
  },
  {
    id: 'ct-nak-muay',
    nome: 'Krabi Stadium Muay Thai & Kickboxing',
    cidade: 'São Paulo - SP',
    bairro: 'Pinheiros',
    distancia: '3.8 km',
    modalidades: ['Muay Thai Tradicional', 'Kickboxing K-1', 'Kids Marcial'],
    rating: 4.8,
    vagasHoje: 14,
    tierMinimo: 'SILVER',
    imagem: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=700&auto=format&fit=crop&q=80',
    destaque: 'Metodologia Tailandesa & Turmas Kids'
  }
];

const FALLBACK_REWARDS = [
  { id: 'r1', nome: 'Luva Oficial Combat-Pass 14oz Pro', categoria: 'EQUIPAMENTO', custoPoints: 1200, estoque: 8, icone: '🥊' },
  { id: 'r2', nome: 'Bandagem Elástica 5m (Par Oficial)', categoria: 'ACESSÓRIO', custoPoints: 280, estoque: 25, icone: '🩹' },
  { id: 'r3', nome: 'Kimono Trançado BJJ Ultra-Light', categoria: 'EQUIPAMENTO', custoPoints: 1850, estoque: 5, icone: '🥋' },
  { id: 'r4', nome: 'Upgrade 30 Dias Passe BLACK Ilimitado', categoria: 'PASSE', custoPoints: 650, estoque: 50, icone: '🎫' },
  { id: 'r5', nome: 'Caneleira Muay Thai Alta Densidade', categoria: 'EQUIPAMENTO', custoPoints: 950, estoque: 10, icone: '🛡️' },
  { id: 'r6', nome: 'Rashguard No-Gi Compressão Térmica', categoria: 'VESTUÁRIO', custoPoints: 520, estoque: 16, icone: '👕' }
];

const SCHOOL_SIDEBAR_SECTIONS = [
  { id: 'ALL', icon: '📚', label: 'Visão Completa (Todos os 12 Módulos)', badge: '100%' },
  { id: 'o_que_e_ct', icon: '🛡️', label: 'O Que É o CT & Academias', badge: 'Rede' },
  { id: 'competitivo', icon: '🏆', label: 'Torneios, Ranking & Stats', badge: 'Ao Vivo' },
  { id: 'modalidades', icon: '🥋', label: '8 Modalidades de Luta', badge: '8 Cursos' },
  { id: 'horarios', icon: '📅', label: 'Grade Semanal & Check-in', badge: 'Vagas' },
  { id: 'planos', icon: '🎫', label: 'Planos & Passes Unificados', badge: '4 Planos' },
  { id: 'estrutura', icon: '🏛️', label: 'Estrutura & Instalações', badge: '6 Áreas' },
  { id: 'professores', icon: '👨‍🏫', label: 'Corpo Docente & Mestres', badge: '4 Mestres' },
  { id: 'gamificacao', icon: '🥇', label: 'Pódio, 30 Medalhas & Loja', badge: 'XP' },
  { id: 'ecossistema', icon: '⚙️', label: 'Ecossistema de Módulos', badge: '6 Sistemas' },
  { id: 'galeria', icon: '📸', label: 'Galeria do Tatame', badge: '6 Fotos' },
  { id: 'faq', icon: '❓', label: 'Dúvidas Frequentes (FAQ)', badge: '6 Respostas' },
  { id: 'localizacao', icon: '📍', label: 'Localização, Mapa & Parceria', badge: 'GPS' }
];

export const LandingHubPage: React.FC = () => {
  const {
    preferences,
    setJourneyPreset,
    setLoadingStyle,
    triggerLoadingDemo
  } = useLayoutEngine();

  const activePreset = preferences.layoutPreset.landing;

  const [academies, setAcademies] = useState<any[]>(FALLBACK_ACADEMIES);
  const [rewardsCatalog, setRewardsCatalog] = useState<any[]>(FALLBACK_REWARDS);
  const [corporateTab, setCorporateTab] = useState<'empresas' | 'academias' | 'atletas'>('empresas');
  const [schoolSectionFilter, setSchoolSectionFilter] = useState<string>('ALL');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showExperienceLauncher, setShowExperienceLauncher] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    publicApi
      .getAcademies()
      .then(res => {
        if (mounted && Array.isArray(res.data) && res.data.length > 0) {
          setAcademies(res.data);
        }
      })
      .catch(() => {});

    studentApi
      .getRewardStoreItems()
      .then(res => {
        if (mounted && Array.isArray(res.data?.itens) && res.data.itens.length > 0) {
          setRewardsCatalog(res.data.itens);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // Controla a visibilidade do HTML original quando o Layout 4 ("classic") está ativo
  useEffect(() => {
    const origRoot = document.getElementById('original-landing-root');
    if (origRoot) {
      if (activePreset === 'classic') {
        origRoot.style.display = 'block';
        try {
          if ((window as any).lucide) {
            (window as any).lucide.createIcons();
          }
        } catch (e) {}
      } else {
        origRoot.style.display = 'none';
      }
    }
    return () => {
      if (origRoot) {
        origRoot.style.display = 'none';
      }
    };
  }, [activePreset]);

  const handleSelectLayout = (presetId: LandingPresetId, label: string) => {
    setJourneyPreset('landing', presetId);
    setShowExperienceLauncher(false);
    triggerLoadingDemo(`Ativando ${label}...`, undefined, 500);
  };

  // ============================================================================
  // BARRA GLOBAL DE EXPERIÊNCIA & ACESSO COMPLETO (NO TOPO DE TODOS OS 4 LAYOUTS)
  // ============================================================================
  const GlobalExperienceDock = (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: 'var(--bg-surface-1)',
        borderBottom: '2px solid var(--color-primary)',
        boxShadow: 'var(--shadow-card)',
        padding: '0.5rem 1rem'
      }}
    >
      <div
        style={{
          maxWidth: '1480px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem'
        }}
      >
        {/* Seletor Rápido dos 4 Layouts Completos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowExperienceLauncher(true)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '999px',
              border: '1px solid var(--color-primary)',
              background: 'var(--color-primary)',
              color: 'var(--text-primary-foreground)',
              fontSize: '0.73rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <span>🎛️</span>
            <span>Escolher Layout / O Que Ver</span>
          </button>

          {(
            [
              { id: 'marketplace', icon: '🎓', short: '1. Sistema Escolar (Aba Lateral)' },
              { id: 'corporate', icon: '🏛️', short: '2. Editorial & B2B' },
              { id: 'tatame', icon: '⚡', short: '3. Arena HUD 3 Colunas' },
              { id: 'classic', icon: '📜', short: '4. Clássico Original' }
            ] as Array<{ id: LandingPresetId; icon: string; short: string }>
          ).map(item => {
            const isActive = activePreset === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectLayout(item.id, item.short)}
                style={{
                  padding: '0.4rem 0.72rem',
                  borderRadius: '9px',
                  border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  background: isActive ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-foreground)',
                  fontSize: '0.72rem',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.short}</span>
              </button>
            );
          })}
        </div>

        {/* Todos os Acessos Diretos (Torneios, Ranking, Stats, Aluno, Professor, Admin, Cores) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <Link
            to="/portal?tab=torneios"
            style={{
              padding: '0.36rem 0.6rem',
              borderRadius: '8px',
              background: 'var(--bg-background)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            🏆 Torneios
          </Link>
          <Link
            to="/portal?tab=ranking"
            style={{
              padding: '0.36rem 0.6rem',
              borderRadius: '8px',
              background: 'var(--bg-background)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            🌍 Ranking
          </Link>
          <Link
            to="/portal?tab=desempenho"
            style={{
              padding: '0.36rem 0.6rem',
              borderRadius: '8px',
              background: 'var(--bg-background)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            📊 Stats
          </Link>
          <Link
            to="/portal"
            style={{
              padding: '0.36rem 0.65rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-2)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            🥊 Área do Aluno
          </Link>
          <Link
            to="/professor"
            style={{
              padding: '0.36rem 0.65rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-2)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            🥋 Professor
          </Link>
          <Link
            to="/admin"
            style={{
              padding: '0.36rem 0.65rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-2)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              fontSize: '0.7rem',
              fontWeight: 900,
              textDecoration: 'none'
            }}
          >
            👑 Admin
          </Link>
          <button
            type="button"
            onClick={() => setShowOrderModal(true)}
            style={{
              padding: '0.36rem 0.6rem',
              borderRadius: '8px',
              background: 'var(--bg-background)',
              color: 'var(--text-foreground)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🔀 Ordenar
          </button>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MODAL SHOWROOM VISUAL: ESCOLHER LAYOUT DO SITE OU DOS PORTAIS
  // ============================================================================
  const ExperienceShowroomModal = showExperienceLauncher && (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10005,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={() => setShowExperienceLauncher(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1180px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          background: 'var(--bg-surface-1)',
          border: '2px solid var(--color-primary)',
          padding: '1.75rem',
          color: 'var(--text-foreground)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              🎛️ CENTRAL DE ARQUITETURAS VISUAIS · TODAS AS FUNÇÕES EM DIFERENTES LAYOUTS
            </span>
            <h2 style={{ margin: '0.25rem 0', fontSize: '1.65rem', fontWeight: 900 }}>
              Escolha o Layout do Site Principal ou Acesse os Portais (Aluno, Professor, Admin)
            </h2>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted-foreground)' }}>
              Todos os 4 layouts possuem <strong>100% das informações e funções do 4º layout</strong> (8 Modalidades, Grade de Horários, Check-in, 4 Planos, 4 Professores, 6 Estruturas, Pódio/30 Conquistas, Ecossistema, Galeria, FAQ e Mapa), porém organizados em arquiteturas totalmente diferentes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowExperienceLauncher(false)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-2)',
              color: 'var(--text-foreground)',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            ✕ Fechar
          </button>
        </div>

        {/* 4 CARDS COM DESENHO ESTRUTURAL (MINI-WIREFRAME) DE CADA LAYOUT */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(255px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          {/* Card 1: Sistema Escolar (Aba Lateral) */}
          <div
            onClick={() => handleSelectLayout('marketplace', 'Layout 1: Sistema Escolar com Aba Lateral')}
            style={{
              cursor: 'pointer',
              padding: '1.15rem',
              borderRadius: '18px',
              background: activePreset === 'marketplace' ? 'var(--bg-surface-2)' : 'var(--bg-background)',
              border: activePreset === 'marketplace' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)' }}>
                  ABA LATERAL / SISTEMA ESCOLAR
                </span>
                {activePreset === 'marketplace' && <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)' }}>● ATIVO</span>}
              </div>
              <div style={{ height: '78px', borderRadius: '10px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', padding: '0.45rem', display: 'grid', gridTemplateColumns: '0.9fr 2.1fr', gap: '0.35rem', marginBottom: '0.75rem' }}>
                <div style={{ background: 'var(--color-primary)', opacity: 0.35, borderRadius: '6px' }} />
                <div style={{ display: 'grid', gap: '0.25rem' }}>
                  <div style={{ height: '14px', borderRadius: '4px', background: 'var(--bg-surface-2)' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                    <div style={{ borderRadius: '4px', background: 'var(--bg-surface-2)' }} />
                    <div style={{ borderRadius: '4px', background: 'var(--bg-surface-2)' }} />
                  </div>
                </div>
              </div>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.02rem', fontWeight: 900 }}>
                🎓 1. Sistema de Escola / Aba Lateral
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                Menu vertical fixo na esquerda (estilo sistema escolar/acadêmico) com filtro instantâneo por módulo ou visão completa de todas as 12 seções.
              </p>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>
              Ativar Arquitetura Escolar →
            </div>
          </div>

          {/* Card 2: Corporativo & Editorial B2B */}
          <div
            onClick={() => handleSelectLayout('corporate', 'Layout 2: Editorial & Corporativo B2B')}
            style={{
              cursor: 'pointer',
              padding: '1.15rem',
              borderRadius: '18px',
              background: activePreset === 'corporate' ? 'var(--bg-surface-2)' : 'var(--bg-background)',
              border: activePreset === 'corporate' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)' }}>
                  EDITORIAL / FORMAL B2B
                </span>
                {activePreset === 'corporate' && <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)' }}>● ATIVO</span>}
              </div>
              <div style={{ height: '78px', borderRadius: '4px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', padding: '0.45rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.3rem', height: '34px' }}>
                  <div style={{ background: 'var(--bg-surface-2)' }} />
                  <div style={{ background: 'var(--color-primary)', opacity: 0.25 }} />
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem' }}>
                  <div style={{ background: 'var(--bg-surface-2)' }} />
                  <div style={{ background: 'var(--bg-surface-2)' }} />
                  <div style={{ background: 'var(--bg-surface-2)' }} />
                  <div style={{ background: 'var(--bg-surface-2)' }} />
                </div>
              </div>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.02rem', fontWeight: 900 }}>
                🏛️ 2. Editorial & Corporativo B2B
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                Geometria ortogonal com bordas retas, abas executivas, matriz comparativa em tabela formal e todos os 12 módulos em estilo editorial.
              </p>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>
              Ativar Arquitetura Editorial →
            </div>
          </div>

          {/* Card 3: Arena Tatame HUD */}
          <div
            onClick={() => handleSelectLayout('tatame', 'Layout 3: Arena Tatame HUD')}
            style={{
              cursor: 'pointer',
              padding: '1.15rem',
              borderRadius: '18px',
              background: activePreset === 'tatame' ? 'var(--bg-surface-2)' : 'var(--bg-background)',
              border: activePreset === 'tatame' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)' }}>
                  HUD 3 COLUNAS / TATAME
                </span>
                {activePreset === 'tatame' && <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)' }}>● ATIVO</span>}
              </div>
              <div style={{ height: '78px', borderRadius: '10px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', padding: '0.45rem', display: 'grid', gridTemplateColumns: '1fr 1.6fr 1fr', gap: '0.3rem', marginBottom: '0.75rem' }}>
                <div style={{ borderRadius: '5px', background: 'var(--color-primary)', opacity: 0.3 }} />
                <div style={{ borderRadius: '5px', background: 'var(--bg-surface-2)' }} />
                <div style={{ borderRadius: '5px', background: 'var(--bg-surface-2)' }} />
              </div>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.02rem', fontWeight: 900 }}>
                ⚡ 3. Arena Tatame HUD
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                Placar eletrônico ao vivo no topo + 3 colunas operacionais (Check-in Expresso + Grade ao Vivo + Competitivo) + todas as 12 seções em HUD.
              </p>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>
              Ativar Arquitetura HUD →
            </div>
          </div>

          {/* Card 4: Site Clássico Original */}
          <div
            onClick={() => handleSelectLayout('classic', 'Layout 4: Site Clássico Original')}
            style={{
              cursor: 'pointer',
              padding: '1.15rem',
              borderRadius: '18px',
              background: activePreset === 'classic' ? 'var(--bg-surface-2)' : 'var(--bg-background)',
              border: activePreset === 'classic' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)' }}>
                  CLÁSSICO ORIGINAL (4º)
                </span>
                {activePreset === 'classic' && <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)' }}>● ATIVO</span>}
              </div>
              <div style={{ height: '78px', borderRadius: '10px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', padding: '0.45rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
                <div style={{ height: '32px', borderRadius: '5px', background: 'var(--color-primary)', opacity: 0.25 }} />
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem' }}>
                  <div style={{ borderRadius: '4px', background: 'var(--bg-surface-2)' }} />
                  <div style={{ borderRadius: '4px', background: 'var(--bg-surface-2)' }} />
                  <div style={{ borderRadius: '4px', background: 'var(--bg-surface-2)' }} />
                </div>
              </div>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.02rem', fontWeight: 900 }}>
                📜 4. Site Clássico Original
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>
                O site institucional original completo (Hero, Torneios, Ranking, Planos, Grade, Estrutura, Mestres, 8 Modalidades, Galeria, FAQ e Mapa).
              </p>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>
              Ativar Site Clássico →
            </div>
          </div>
        </div>

        {/* ACESSO DIRETO AOS PORTAIS (QUE TAMBÉM TÊM SEUS PRÓPRIOS LAYOUTS COM ABA LATERAL ESCOLAR, HUD, SPLIT-VIEW E ABAS) */}
        <div
          style={{
            padding: '1.15rem',
            borderRadius: '16px',
            background: 'var(--bg-background)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            🚀 PORTAIS DO SISTEMA (CADA PORTAL TAMBÉM POSSUI LAYOUT ESCOLAR COM ABA LATERAL, HUD, EXECUTIVO E CLÁSSICO)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.65rem' }}>
            {[
              { icon: '🥊', label: 'Portal do Aluno (4 Layouts)', to: '/portal' },
              { icon: '🥋', label: 'Portal do Professor (4 Layouts)', to: '/professor' },
              { icon: '👑', label: 'Painel Admin ERP (4 Layouts)', to: '/admin' },
              { icon: '🏆', label: 'Próximos Torneios', to: '/portal?tab=torneios' },
              { icon: '🌍', label: 'Ranking Global MMR', to: '/portal?tab=ranking' },
              { icon: '📊', label: 'Estatísticas & Analytics', to: '/portal?tab=desempenho' },
              { icon: '🔥', label: 'Aula Experimental', to: '/agendar' }
            ].map(link => (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  padding: '0.7rem 0.85rem',
                  borderRadius: '12px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-foreground)',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MODAL DO ORDENADOR DE PÁGINAS & BLOCOS
  // ============================================================================
  const OrderBuilderModal = showOrderModal && (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10006,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={() => setShowOrderModal(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '980px',
          maxHeight: '88vh',
          overflowY: 'auto',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '2px solid var(--color-primary)',
          padding: '1.5rem',
          color: 'var(--text-foreground)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>
              🔀 Ordenador Dinâmico de Páginas, Menus e Telas de Carregamento
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted-foreground)' }}>
              Defina a ordem dos itens de menu e o estilo de loading da plataforma.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              value={preferences.loadingStyle}
              onChange={e => {
                const st = e.target.value as LoadingStyleId;
                setLoadingStyle(st);
                triggerLoadingDemo('Testando estilo de carregamento...', st, 700);
              }}
              style={{
                padding: '0.45rem 0.7rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              {LOADING_STYLE_META.map(l => (
                <option key={l.id} value={l.id}>
                  {l.icon} {l.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowOrderModal(false)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ✕ Fechar
            </button>
          </div>
        </div>
        <JourneyLayoutToolbar journey="landing" />
      </div>
    </div>
  );

  // ============================================================================
  // LAYOUT 4: SITE CLÁSSICO ORIGINAL (HTML COMPLETO DE INDEX.HTML)
  // ============================================================================
  if (activePreset === 'classic') {
    return (
      <div style={{ position: 'relative', zIndex: 40 }}>
        {GlobalExperienceDock}
        {ExperienceShowroomModal}
        {OrderBuilderModal}
      </div>
    );
  }

  // ============================================================================
  // LAYOUT 1: ARQUITETURA SISTEMA ESCOLAR / ACADÊMICO COM ABA LATERAL FIXA
  // (Possui 100% das informações do 4º layout organizadas em um Portal Escolar com Sidebar)
  // ============================================================================
  if (activePreset === 'marketplace') {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text-foreground)', display: 'flex', flexDirection: 'column' }}>
        {GlobalExperienceDock}
        {ExperienceShowroomModal}
        {OrderBuilderModal}

        {/* CORPO EM 2 COLUNAS: ABA LATERAL ESCOLAR FIXA (ESQUERDA) + ÁREA ACADÊMICA COMPLETA (DIREITA) */}
        <div
          style={{
            maxWidth: '1520px',
            width: '100%',
            margin: '0 auto',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 295px) 1fr',
            gap: '1.25rem',
            alignItems: 'start',
            flex: 1
          }}
        >
          {/* ABA LATERAL FIXA (ESTILO SISTEMA DE ESCOLA / UNIVERSIDADE / LMS MARCIAL) */}
          <aside
            style={{
              position: 'sticky',
              top: '68px',
              maxHeight: 'calc(100vh - 84px)',
              overflowY: 'auto',
              borderRadius: '20px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)',
              padding: '1.15rem',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem'
            }}
          >
            {/* Identificação da Escola / Centro de Treinamento */}
            <div
              style={{
                padding: '0.9rem',
                borderRadius: '14px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <img
                src={ACADEMY_CONFIG.logoUrl}
                alt="Logo"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: '2px solid var(--color-primary)',
                  objectFit: 'contain',
                  background: 'var(--bg-background)',
                  padding: '2px'
                }}
              />
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  🎓 PORTAL ACADÊMICO MARCIAL
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                  CENTRO DE COMBATE
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--status-available)', fontWeight: 800 }}>
                  ● Período Letivo & Tatames Abertos
                </div>
              </div>
            </div>

            {/* Resumo Rápido de Indicadores da Escola */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', textAlign: 'center' }}>
              <div style={{ padding: '0.5rem 0.25rem', borderRadius: '10px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--color-primary)' }}>+500</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>Alunos</div>
              </div>
              <div style={{ padding: '0.5rem 0.25rem', borderRadius: '10px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-foreground)' }}>8</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>Cursos/Lutas</div>
              </div>
              <div style={{ padding: '0.5rem 0.25rem', borderRadius: '10px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--color-accent)' }}>180m²</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>Tatame</div>
              </div>
            </div>

            {/* Menu Vertical de Módulos (Estilo Sistema de Escola) */}
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem', paddingLeft: '0.3rem' }}>
                📂 Menu Curricular & Módulos do CT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {SCHOOL_SIDEBAR_SECTIONS.map(sec => {
                  const active = schoolSectionFilter === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setSchoolSectionFilter(sec.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        width: '100%',
                        padding: '0.62rem 0.75rem',
                        borderRadius: '10px',
                        border: active ? '1px solid var(--color-primary)' : '1px solid transparent',
                        borderLeft: active ? '4px solid var(--color-primary)' : '4px solid transparent',
                        background: active ? 'var(--color-primary-light)' : 'transparent',
                        color: active ? 'var(--color-primary)' : 'var(--text-foreground)',
                        fontSize: '0.76rem',
                        fontWeight: active ? 900 : 700,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span>{sec.icon}</span>
                        <span>{sec.label}</span>
                      </span>
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 900,
                          padding: '0.12rem 0.4rem',
                          borderRadius: '999px',
                          background: active ? 'var(--color-primary)' : 'var(--bg-background)',
                          color: active ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {sec.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Acesso Rápido à Secretaria / Portais */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gap: '0.45rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🔐 Secretaria & Portais Logados
              </div>
              <Link
                to="/portal"
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  fontWeight: 900,
                  fontSize: '0.76rem',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                🥊 Entrar no Portal do Aluno
              </Link>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <Link
                  to="/professor"
                  style={{
                    padding: '0.55rem',
                    borderRadius: '8px',
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  🥋 Docente
                </Link>
                <Link
                  to="/admin"
                  style={{
                    padding: '0.55rem',
                    borderRadius: '8px',
                    background: 'var(--bg-background)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  👑 Diretoria
                </Link>
              </div>
              <Link
                to="/agendar"
                style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-2)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontWeight: 900,
                  fontSize: '0.74rem',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                🔥 Agendar Aula Experimental
              </Link>
            </div>
          </aside>

          {/* PAINEL PRINCIPAL DIREITO (CONTEÚDO ACADÊMICO COMPLETO) */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
            {/* Banner Superior Acadêmico */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--bg-surface-1) 0%, var(--bg-surface-2) 100%)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.28rem 0.75rem', borderRadius: '999px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  🎓 LAYOUT 1 · SISTEMA ESCOLAR / PORTAL ACADÊMICO COM ABA LATERAL
                </div>
                <h1 style={{ margin: '0.65rem 0', fontSize: 'clamp(1.65rem, 3vw, 2.55rem)', fontWeight: 900, lineHeight: 1.08, textTransform: 'uppercase' }}>
                  Mais Que Um Treino, <span style={{ color: 'var(--color-primary)' }}>Uma Transformação</span>.
                </h1>
                <p style={{ margin: '0 0 1.1rem 0', fontSize: '0.88rem', color: 'var(--text-muted-foreground)', lineHeight: 1.55 }}>
                  Navegue pela aba lateral esquerda como em um sistema acadêmico ou visualize abaixo <strong>todas as 12 seções completas do Centro de Combate</strong>: 8 Modalidades, Grade de Horários, Check-in Expresso, 4 Planos, 4 Mestres, 6 Estruturas, Pódio/Conquistas, Galeria, FAQ e Mapa.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  <Link
                    to="/agendar"
                    style={{
                      padding: '0.8rem 1.35rem',
                      borderRadius: '12px',
                      background: 'var(--color-primary)',
                      color: 'var(--text-primary-foreground)',
                      fontWeight: 900,
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      textTransform: 'uppercase'
                    }}
                  >
                    🔥 Agendar Aula Gratuita
                  </Link>
                  {schoolSectionFilter !== 'ALL' && (
                    <button
                      type="button"
                      onClick={() => setSchoolSectionFilter('ALL')}
                      style={{
                        padding: '0.8rem 1.2rem',
                        borderRadius: '12px',
                        background: 'var(--bg-background)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-primary)',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      📚 Mostrar Todos os 12 Módulos Juntos
                    </button>
                  )}
                </div>
              </div>

              {/* Card de Matrícula & Check-in Rápido */}
              <div
                style={{
                  padding: '1.15rem',
                  borderRadius: '16px',
                  background: 'var(--bg-background)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                  ⚡ SECRETARIA DIGITAL · CHECK-IN EXPRESSO POR HORÁRIO
                </div>
                <PublicQuickCheckinCard />
              </div>
            </div>

            {/* TODOS OS 12 MÓDULOS COMPLETOS DO CENTRO DE COMBATE */}
            <CompleteSiteModules
              variant="school_sidebar"
              academies={academies}
              rewardsCatalog={rewardsCatalog}
              activeSectionFilter={schoolSectionFilter}
            />
          </main>
        </div>
      </div>
    );
  }

  // ============================================================================
  // LAYOUT 2: ARQUITETURA CORPORATIVA & EDITORIAL B2B (ESTILO STRIPE / ENTERPRISE)
  // (Geometria ortogonal, tabelas formais + TODOS os 12 módulos completos)
  // ============================================================================
  if (activePreset === 'corporate') {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text-foreground)', paddingBottom: '4rem' }}>
        {GlobalExperienceDock}
        {ExperienceShowroomModal}
        {OrderBuilderModal}

        {/* CABEÇALHO EXECUTIVO EM DUAS FAIXAS ORTOGONAIS */}
        <header style={{ background: 'var(--bg-surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0.9rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '4px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900
                }}
              >
                CP
              </div>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  CENTRO DE COMBATE · CORPORATE & INSTITUCIONAL
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)' }}>
                  Infraestrutura Unificada de Artes Marciais, Benefícios Corporativos, Graduações e ERP
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.15rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.76rem', fontWeight: 800 }}>
              <a href="#o-que-e-o-ct-react" style={{ color: 'var(--text-foreground)', textDecoration: 'none' }}>01. O CT & Rede</a>
              <a href="#modalidades-react" style={{ color: 'var(--text-foreground)', textDecoration: 'none' }}>02. 8 Modalidades</a>
              <a href="#horarios-react" style={{ color: 'var(--text-foreground)', textDecoration: 'none' }}>03. Horários</a>
              <a href="#planos-react" style={{ color: 'var(--text-foreground)', textDecoration: 'none' }}>04. Planos</a>
              <a href="#professores-react" style={{ color: 'var(--text-foreground)', textDecoration: 'none' }}>05. Mestres</a>
              <a href="#faq-react" style={{ color: 'var(--text-foreground)', textDecoration: 'none' }}>06. FAQ</a>
              <Link
                to="/agendar"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  textDecoration: 'none',
                  fontWeight: 900
                }}
              >
                AGENDAR VISITA / AULA →
              </Link>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
          {/* MANIFESTO ASSIMÉTRICO + ABAS EXECUTIVAS */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-1)'
            }}
          >
            <div style={{ padding: '2.25rem', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                ARQUITETURA 02 · EDITORIAL & CORPORATIVO B2B
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.75rem)', fontWeight: 900, lineHeight: 1.08, margin: '0 0 1rem 0', textTransform: 'uppercase' }}>
                Mais Que Um Treino, Uma Transformação Institucional.
              </h1>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted-foreground)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Todas as informações oficiais do Centro de Combate — 8 Modalidades, Corpo Docente, Grade de Horários, Planos, Estrutura Olímpica, Gamificação e ERP — apresentadas em layout executivo de alta precisão.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.15rem', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-primary)' }}>+500</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>ALUNOS ATIVOS</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900 }}>100%</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>MESTRES GRADUADOS</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900 }}>180m²</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>TATAME CLIMATIZADO</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--status-available)' }}>8</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>MODALIDADES</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '2.25rem', background: 'var(--bg-background)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                  {(
                    [
                      { id: 'empresas', label: '01. EMPRESAS & RH' },
                      { id: 'academias', label: '02. REDE DE CTS' },
                      { id: 'atletas', label: '03. PRATICANTES' }
                    ] as const
                  ).map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCorporateTab(tab.id)}
                      style={{
                        flex: 1,
                        padding: '0.75rem 0.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: corporateTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                        color: corporateTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted-foreground)',
                        fontWeight: 900,
                        fontSize: '0.72rem',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {corporateTab === 'empresas' && (
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 900 }}>
                      Saúde Corporativa, Redução de Estresse e Alta Performance
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted-foreground)', lineHeight: 1.6 }}>
                      Planos corporativos e aceitação integral de Wellhub (Gympass), TotalPass e Combat-Pass com relatórios de frequência auditáveis.
                    </p>
                  </div>
                )}
                {corporateTab === 'academias' && (
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 900 }}>
                      ERP Multi-Academias, Caixa Diário (PDV) & Comissões
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted-foreground)', lineHeight: 1.6 }}>
                      Controle de lotação por horário, contratos com assinatura eletrônica, fechamento de caixa e repasse automático por check-in.
                    </p>
                  </div>
                )}
                {corporateTab === 'atletas' && (
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 900 }}>
                      Do Iniciante Zero ao Atleta de Competição
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted-foreground)', lineHeight: 1.6 }}>
                      Metodologia gradual sem machucados, 8 artes marciais, trilha de 30 conquistas e Loja de Recompensas por Combat Points.
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                <Link to="/portal" style={{ padding: '0.7rem 1.15rem', borderRadius: '4px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontWeight: 900, fontSize: '0.76rem', textDecoration: 'none' }}>
                  ACESSAR PORTAL DO ALUNO →
                </Link>
                <Link to="/admin" style={{ padding: '0.7rem 1.15rem', borderRadius: '4px', background: 'var(--bg-surface-1)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontWeight: 800, fontSize: '0.76rem', textDecoration: 'none' }}>
                  ABRIR ERP ADMINISTRATIVO →
                </Link>
              </div>
            </div>
          </section>

          {/* TODOS OS 12 MÓDULOS COMPLETOS EM ESTILO EDITORIAL ORTOGONAL */}
          <CompleteSiteModules
            variant="corporate_editorial"
            academies={academies}
            rewardsCatalog={rewardsCatalog}
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // LAYOUT 3: ARENA TATAME HUD / COMMAND CENTER (3 COLUNAS + TODOS OS 12 MÓDULOS)
  // ============================================================================
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-foreground)', paddingBottom: '3rem' }}>
      {GlobalExperienceDock}
      {ExperienceShowroomModal}
      {OrderBuilderModal}

      {/* PLACAR ELETRÔNICO DE ARENA AO VIVO */}
      <div
        style={{
          background: 'var(--bg-surface-2)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.65rem 1.25rem'
        }}
      >
        <div
          style={{
            maxWidth: '1480px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                fontSize: '0.7rem',
                fontWeight: 900,
                letterSpacing: '0.08em'
              }}
            >
              🔴 LIVE TATAME HUD · COMMAND CENTER
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: 900, fontFamily: 'monospace' }}>
              ⏱️ {currentTime.toLocaleTimeString('pt-BR')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', fontSize: '0.74rem', fontWeight: 900 }}>
            <span style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', background: 'var(--status-available-bg)', color: 'var(--status-available)', border: '1px solid var(--status-available-border)' }}>
              🟢 +500 Alunos · 8 Modalidades · 180m² Tatame
            </span>
            <Link to="/agendar" style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', textDecoration: 'none' }}>
              🔥 Agendar Aula Experimental
            </Link>
          </div>
        </div>
      </div>

      {/* DECK OPERACIONAL EM 3 COLUNAS SIMULTÂNEAS NO TOPO */}
      <div
        style={{
          maxWidth: '1480px',
          margin: '1.15rem auto',
          padding: '0 1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem',
          alignItems: 'start'
        }}
      >
        {/* Coluna 1: Check-in Expresso */}
        <div
          style={{
            padding: '1.15rem',
            borderRadius: '14px',
            background: 'var(--bg-surface-1)',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            ⚡ TERMINAL DE ENTRADA · BATER PONTO DE PRESENÇA
          </div>
          <PublicQuickCheckinCard />
        </div>

        {/* Coluna 2: Calendário Ao Vivo */}
        <div
          style={{
            padding: '1.15rem',
            borderRadius: '14px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            📅 GRADE INTERATIVA EM TEMPO REAL ([HÁ VAGAS] / [LOTADO])
          </div>
          <InteractiveCombatCalendar userRole="ALUNO" />
        </div>

        {/* Coluna 3: Atalhos Competitivos & Portais */}
        <div
          style={{
            padding: '1.15rem',
            borderRadius: '14px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            🏆 TELEMETRIA & ACESSO RÁPIDO AOS MÓDULOS
          </div>
          {[
            { icon: '🏆', title: 'Próximos Torneios & Brackets', sub: 'Chaves oficiais abertas', to: '/portal?tab=torneios' },
            { icon: '🌍', title: 'Ranking Global de Atletas', sub: 'Leaderboard MMR ao vivo', to: '/portal?tab=ranking' },
            { icon: '📊', title: 'Estatísticas de Lutador', sub: 'Frequência & aproveitamento', to: '/portal?tab=desempenho' },
            { icon: '🥊', title: 'Portal Completo do Aluno', sub: 'Check-in, Contratos e 30 Conquistas', to: '/portal' },
            { icon: '🥋', title: 'Acesso do Professor', sub: 'Chamada de Tatame & Comissões', to: '/professor' },
            { icon: '👑', title: 'ERP Admin & Layout Studio', sub: 'Gestão 360, Caixa e Customizer', to: '/admin' }
          ].map(card => (
            <Link
              key={card.title}
              to={card.to}
              style={{
                padding: '0.7rem 0.85rem',
                borderRadius: '10px',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)',
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{card.icon}</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-foreground)' }}>{card.title}</div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted-foreground)' }}>{card.sub}</div>
                </div>
              </div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 900 }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* TODOS OS 12 MÓDULOS COMPLETOS ABAIXO EM ESTILO ARENA HUD */}
      <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '0 1rem' }}>
        <CompleteSiteModules
          variant="arena_hud"
          academies={academies}
          rewardsCatalog={rewardsCatalog}
        />
      </div>
    </div>
  );
};

export default LandingHubPage;
