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
  { id: 'ALL', icon: '📚', label: 'Quadro Geral (Todos os Módulos)', badge: '100%' },
  { id: 'modalidades', icon: '🎓', label: 'Grade Curricular (8 Disciplinas)', badge: 'Tabela' },
  { id: 'horarios', icon: '📅', label: 'Calendário Escolar & Chamada', badge: 'Ao Vivo' },
  { id: 'professores', icon: '👨‍🏫', label: 'Colegiado & Corpo Docente', badge: '4 Mestres' },
  { id: 'planos', icon: '💳', label: 'Secretaria: Guias de Matrícula', badge: '4 Bolsas' },
  { id: 'o_que_e_ct', icon: '📘', label: 'Regimento & Campus Credenciados', badge: 'Rede' },
  { id: 'estrutura', icon: '🏛️', label: 'Laboratórios & Quadro de Honra', badge: '6 Labs' },
  { id: 'faq', icon: '❓', label: 'Manual do Calouro (FAQ & Mapa)', badge: '6 Itens' }
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
    triggerLoadingDemo(`Ativando ${label}...`, undefined, 450);
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
          maxWidth: '1540px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.55rem'
        }}
      >
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
              gap: '0.35rem'
            }}
          >
            <span>🎛️</span>
            <span>Escolher Layout / O Que Ver</span>
          </button>

          {(
            [
              { id: 'marketplace', icon: '🎓', short: '1. Sistema Escolar (Menu Esquerdo + Tabelas)' },
              { id: 'corporate', icon: '🏛️', short: '2. Editorial B2B (Índice Direito + Matriz)' },
              { id: 'tatame', icon: '⚡', short: '3. Arena Fighter HUD (Polígonos + Stats RPG)' },
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
                  borderRadius: item.id === 'corporate' ? '0px' : '9px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <Link to="/portal?tab=torneios" style={{ padding: '0.36rem 0.6rem', borderRadius: '8px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
            🏆 Torneios
          </Link>
          <Link to="/portal?tab=ranking" style={{ padding: '0.36rem 0.6rem', borderRadius: '8px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
            🌍 Ranking
          </Link>
          <Link to="/portal?tab=desempenho" style={{ padding: '0.36rem 0.6rem', borderRadius: '8px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
            📊 Stats
          </Link>
          <Link to="/portal" style={{ padding: '0.36rem 0.65rem', borderRadius: '8px', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
            🥊 Área do Aluno
          </Link>
          <Link to="/professor" style={{ padding: '0.36rem 0.65rem', borderRadius: '8px', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
            🥋 Professor
          </Link>
          <Link to="/admin" style={{ padding: '0.36rem 0.65rem', borderRadius: '8px', background: 'var(--bg-surface-2)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontSize: '0.7rem', fontWeight: 900, textDecoration: 'none' }}>
            👑 Admin
          </Link>
          <button
            type="button"
            onClick={() => setShowOrderModal(true)}
            style={{ padding: '0.36rem 0.6rem', borderRadius: '8px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
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
        background: 'rgba(0,0,0,0.84)',
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
          maxWidth: '1220px',
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
              🎛️ VITRINE DE ARQUITETURAS RADICALMENTE DIFERENTES
            </span>
            <h2 style={{ margin: '0.25rem 0', fontSize: '1.6rem', fontWeight: 900 }}>
              4 Formas Completamente Diferentes de Apresentar o Sistema
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted-foreground)' }}>
              Cada opção muda <strong>o lado do menu, o formato dos blocos (tabelas, círculos, matrizes retas ou polígonos chanfrados), as imagens e os textos</strong>, mantendo 100% das informações e funções.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowExperienceLauncher(false)}
            style={{ padding: '0.5rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', fontWeight: 900, cursor: 'pointer' }}
          >
            ✕ Fechar
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            {
              id: 'marketplace' as LandingPresetId,
              tag: 'MENU ESQUERDO · TABELAS & CÍRCULOS',
              title: '🎓 1. Sistema Escolar / LMS Acadêmico',
              desc: 'Aba lateral esquerda estilo universidade + Grade Curricular das 8 lutas em tabela + retratos redondos dos mestres + boletos horizontais de matrícula.'
            },
            {
              id: 'corporate' as LandingPresetId,
              tag: 'ÍNDICE DIREITO · ZIG-ZAG & MATRIZ 0PX',
              title: '🏛️ 2. Revista Editorial & B2B',
              desc: 'Índice fixo no LADO DIREITO + blocos em Zig-Zag (Esquerda/Direita) + Dossiê Master-Detail das 8 modalidades + Tabela Comparativa completa de Planos.'
            },
            {
              id: 'tatame' as LandingPresetId,
              tag: 'POLÍGONOS CORTADOS · STATS RPG & BENTO',
              title: '⚡ 3. Arena Fighter HUD (Game Select)',
              desc: 'Calendário Largo 2/3 no topo + Seleção de Estilo de Luta com barras de Força/Velocidade/Cardio + Planos como Battle Pass Tiers e cards poligonais.'
            },
            {
              id: 'classic' as LandingPresetId,
              tag: 'LANDING PAGE CLÁSSICA ORIGINAL',
              title: '📜 4. Site Clássico Original',
              desc: 'O site institucional original completo de cima a baixo (Hero, Torneios, Ranking, Planos, Grade, Estrutura, Mestres, 8 Modalidades, Galeria, FAQ e Mapa).'
            }
          ].map(card => {
            const active = activePreset === card.id;
            return (
              <div
                key={card.id}
                onClick={() => handleSelectLayout(card.id, card.title)}
                style={{
                  cursor: 'pointer',
                  padding: '1.2rem',
                  borderRadius: card.id === 'corporate' ? '0px' : '18px',
                  background: active ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                  border: active ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '4px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)' }}>
                    {card.tag}
                  </span>
                  <h3 style={{ margin: '0.65rem 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 900 }}>{card.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)', lineHeight: 1.45 }}>{card.desc}</p>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                  {active ? '● Layout Ativo Agora' : 'Ativar Esta Arquitetura →'}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '1.1rem', borderRadius: '16px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            🚀 ACESSO DIRETO AOS PORTAIS (TAMBÉM COM 4 ARQUITETURAS DIFERENTES EM CADA PORTAL)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.6rem' }}>
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
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-foreground)',
                  textDecoration: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
            🔀 Ordenador Dinâmico de Páginas, Menus e Telas de Carregamento
          </h3>
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
              style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', fontWeight: 800, cursor: 'pointer' }}
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
  // LAYOUT 1: SISTEMA DE ESCOLA / UNIVERSIDADE MARCIAL (ABA LATERAL ESQUERDA + TABELAS ESCOLARES + ELEMENTOS REDONDOS)
  // ============================================================================
  if (activePreset === 'marketplace') {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text-foreground)', display: 'flex', flexDirection: 'column' }}>
        {GlobalExperienceDock}
        {ExperienceShowroomModal}
        {OrderBuilderModal}

        <div
          style={{
            maxWidth: '1540px',
            width: '100%',
            margin: '0 auto',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(270px, 305px) 1fr',
            gap: '1.35rem',
            alignItems: 'start',
            flex: 1
          }}
        >
          {/* ABA LATERAL ESQUERDA FIXA (ESTILO SISTEMA ESCOLAR / UNIVERSITÁRIO) */}
          <aside
            style={{
              position: 'sticky',
              top: '64px',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
              borderRadius: '26px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)',
              padding: '1.2rem',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem'
            }}
          >
            <div style={{ padding: '1rem', borderRadius: '20px', background: 'var(--bg-surface-2)', border: '1px solid var(--color-primary)', textAlign: 'center' }}>
              <img
                src={ACADEMY_CONFIG.logoUrl}
                alt="Brasão Escolar"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '3px solid var(--color-primary)',
                  objectFit: 'contain',
                  background: 'var(--bg-background)',
                  padding: '4px',
                  margin: '0 auto 0.5rem auto',
                  display: 'block'
                }}
              />
              <div style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🎓 SISTEMA ACADÊMICO MARCIAL
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 900, margin: '0.15rem 0' }}>
                ACADEMIA & ESCOLA DE LUTAS
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--status-available)', fontWeight: 800 }}>
                ● Semestre Letivo 2026 · Matrículas Abertas
              </div>
            </div>

            {/* Menu Escolar de Cadernos / Cátedras */}
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem', paddingLeft: '0.35rem' }}>
                📂 Cadernos & Módulos Escolares
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                        padding: '0.65rem 0.85rem',
                        borderRadius: '999px',
                        border: active ? '2px solid var(--color-primary)' : '1px solid transparent',
                        background: active ? 'var(--color-primary)' : 'var(--bg-background)',
                        color: active ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                        fontSize: '0.75rem',
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
                          fontSize: '0.58rem',
                          fontWeight: 900,
                          padding: '0.12rem 0.45rem',
                          borderRadius: '999px',
                          background: active ? 'var(--bg-background)' : 'var(--bg-surface-2)',
                          color: active ? 'var(--color-primary)' : 'var(--text-muted-foreground)'
                        }}
                      >
                        {sec.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chamada Digital na Própria Barra Escolar */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gap: '0.45rem' }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>
                🔐 Secretaria & Portais Acadêmicos
              </div>
              <Link to="/portal" style={{ padding: '0.65rem', borderRadius: '999px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontWeight: 900, fontSize: '0.75rem', textDecoration: 'none', textAlign: 'center' }}>
                🥊 Portal do Aluno (Boletim & XP)
              </Link>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <Link to="/professor" style={{ padding: '0.55rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontWeight: 800, fontSize: '0.7rem', textDecoration: 'none', textAlign: 'center' }}>
                  🥋 Docente
                </Link>
                <Link to="/admin" style={{ padding: '0.55rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontWeight: 900, fontSize: '0.7rem', textDecoration: 'none', textAlign: 'center' }}>
                  👑 Reitoria/ERP
                </Link>
              </div>
            </div>
          </aside>

          {/* ÁREA ACADÊMICA DIREITA */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
            {/* Cabeçalho Escolar Redondo com Imagem na Direita e Chamada Expresso */}
            <div
              style={{
                padding: '1.65rem',
                borderRadius: '26px',
                background: 'var(--bg-surface-1)',
                border: '2px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                gap: '1.5rem',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ padding: '0.28rem 0.85rem', borderRadius: '999px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.68rem', fontWeight: 900 }}>
                  🎓 ARQUITETURA 1 · SISTEMA ESCOLAR / UNIVERSIDADE DE ARTES MARCIAIS
                </span>
                <h1 style={{ margin: '0.6rem 0', fontSize: 'clamp(1.55rem, 2.8vw, 2.35rem)', fontWeight: 900, lineHeight: 1.12 }}>
                  Formação Marcial por <span style={{ color: 'var(--color-primary)' }}>Cátedras, Graus e Créditos Semanais</span>.
                </h1>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.84rem', color: 'var(--text-muted-foreground)', lineHeight: 1.55 }}>
                  Neste layout escolar, as 8 modalidades são apresentadas como uma <strong>Tabela de Grade Curricular com Ementas</strong>, os professores em <strong>Colegiado de Retratos Redondos</strong> e os planos como <strong>Guias de Matrícula Horizontais</strong>.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to="/agendar" style={{ padding: '0.7rem 1.35rem', borderRadius: '999px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontWeight: 900, fontSize: '0.78rem', textDecoration: 'none' }}>
                    📝 Solicitar Matrícula / Aula Experimental
                  </Link>
                  <Link to="/portal?tab=torneios" style={{ padding: '0.7rem 1.15rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontWeight: 800, fontSize: '0.78rem', textDecoration: 'none' }}>
                    🏆 Olimpíadas & Torneios
                  </Link>
                </div>
              </div>

              <div style={{ padding: '1.1rem', borderRadius: '22px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  📋 SECRETARIA ESCOLAR · REGISTRO DE PRESENÇA POR CPF
                </div>
                <PublicQuickCheckinCard />
              </div>
            </div>

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
  // LAYOUT 2: REVISTA EDITORIAL & DOSSIÊ B2B (CONTEÚDO À ESQUERDA + ÍNDICE FIXO À DIREITA + BORDAS RETAS 0PX)
  // ============================================================================
  if (activePreset === 'corporate') {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text-foreground)', paddingBottom: '4rem' }}>
        {GlobalExperienceDock}
        {ExperienceShowroomModal}
        {OrderBuilderModal}

        {/* TOPO EDITORIAL DE REVISTA EXECUTIVA */}
        <header style={{ background: 'var(--bg-surface-1)', borderBottom: '2px solid var(--text-foreground)' }}>
          <div style={{ maxWidth: '1540px', margin: '0 auto', padding: '1.1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.62rem', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                EDIÇÃO EXECUTIVA Nº 2026 · DOSSIÊ INSTITUCIONAL & B2B
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                THE COMBAT JOURNAL · INFRAESTRUTURA DE ALTA PERFORMANCE
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/agendar" style={{ padding: '0.6rem 1.2rem', borderRadius: '0px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontWeight: 900, fontSize: '0.75rem', textDecoration: 'none', textTransform: 'uppercase' }}>
                AGENDAR VISITA EXECUTIVA →
              </Link>
            </div>
          </div>
        </header>

        {/* CORPO ASSIMÉTRICO INVERTIDO: CONTEÚDO EDITORIAL NA ESQUERDA (1FR) + ÍNDICE FIXO NA DIREITA (300PX)! */}
        <div
          style={{
            maxWidth: '1540px',
            width: '100%',
            margin: '0 auto',
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr minmax(270px, 320px)',
            gap: '1.75rem',
            alignItems: 'start'
          }}
        >
          {/* COLUNA PRINCIPAL ESQUERDA: DOSSIÊS EM ZIG-ZAG E TABELAS MATRICIAIS */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', minWidth: 0 }}>
            <CompleteSiteModules
              variant="corporate_editorial"
              academies={academies}
              rewardsCatalog={rewardsCatalog}
            />
          </main>

          {/* COLUNA FIXA NA DIREITA (ÍNDICE EXECUTIVO + CHECK-IN TERMINAL NA DIREITA!) */}
          <aside
            style={{
              position: 'sticky',
              top: '64px',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
              borderTop: '4px solid var(--color-primary)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.62rem', fontWeight: 900, letterSpacing: '0.15em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                ÍNDICE LATERAL DIREITO · SUMÁRIO
              </div>
              <h3 style={{ margin: '0.2rem 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase' }}>
                Capítulos do Dossiê
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-subtle)' }}>
                {[
                  { href: '#o-que-e-o-ct-react', num: 'I', label: 'Tese Institucional & Rede' },
                  { href: '#modalidades-react', num: 'II', label: 'Portfólio Técnico (8 Lutas)' },
                  { href: '#planos-react', num: 'III', label: 'Matriz Comparativa Financeira' },
                  { href: '#horarios-react', num: 'IV', label: 'Cronograma & Lotação' },
                  { href: '#professores-react', num: 'V', label: 'Conselho de Mestres' },
                  { href: '#faq-react', num: 'VI', label: 'Infraestrutura & Governança' }
                ].map(item => (
                  <a
                    key={item.num}
                    href={item.href}
                    style={{
                      padding: '0.65rem 0.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-foreground)',
                      textDecoration: 'none',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span><strong style={{ color: 'var(--color-primary)', fontFamily: 'monospace', marginRight: '0.4rem' }}>{item.num}.</strong> {item.label}</span>
                    <span>↓</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Indicadores Auditados na Direita */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border-subtle)', background: 'var(--bg-background)' }}>
              <div style={{ padding: '0.75rem', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-primary)' }}>+500</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted-foreground)', fontWeight: 800 }}>MEMBROS ATIVOS</div>
              </div>
              <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>180m²</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted-foreground)', fontWeight: 800 }}>ÁREA OLÍMPICA</div>
              </div>
              <div style={{ padding: '0.75rem', borderRight: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>8</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted-foreground)', fontWeight: 800 }}>MODALIDADES</div>
              </div>
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--status-available)' }}>100%</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted-foreground)', fontWeight: 800 }}>CLIMATIZADO</div>
              </div>
            </div>

            {/* Check-in Terminal posicionado na Coluna Direita */}
            <div style={{ padding: '0.9rem', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                ⚡ VALIDAÇÃO DE ACESSO CORPORATIVO
              </div>
              <PublicQuickCheckinCard />
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ============================================================================
  // LAYOUT 3: ARENA FIGHTER HUD / OCTÓGONO CYBERPUNK (CALENDÁRIO LARGO 2/3 ESQUERDA + CHECK-IN 1/3 DIREITA + POLÍGONOS)
  // ============================================================================
  const hudClip = 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))';

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-foreground)', paddingBottom: '3rem' }}>
      {GlobalExperienceDock}
      {ExperienceShowroomModal}
      {OrderBuilderModal}

      {/* PLACAR ELETRÔNICO DE OCTÓGONO AO VIVO */}
      <div style={{ background: 'var(--bg-surface-2)', borderBottom: '2px solid var(--color-primary)', padding: '0.65rem 1.25rem' }}>
        <div style={{ maxWidth: '1540px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ padding: '0.25rem 0.75rem', clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace' }}>
              🔴 OCTAGON HUD // LIVE TELEMETRY
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: 900, fontFamily: 'monospace' }}>
              ⏱️ {currentTime.toLocaleTimeString('pt-BR')}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', fontSize: '0.74rem', fontWeight: 900 }}>
            <span style={{ padding: '0.25rem 0.65rem', background: 'var(--status-available-bg)', color: 'var(--status-available)', border: '1px solid var(--status-available-border)', fontFamily: 'monospace' }}>
              [STATUS: TATAMES OPERACIONAIS · +500 LUTADORES]
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1540px', margin: '1.25rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* DECK SUPERIOR ASSIMÉTRICO 2/3 + 1/3: CALENDÁRIO LARGO NA ESQUERDA (NUNCA QUEBRA!) + CHECK-IN & TELEMETRIA NA DIREITA */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start'
          }}
        >
          {/* Lado Esquerdo Largo: Calendário Ao Vivo */}
          <div
            style={{
              gridColumn: 'span 2',
              padding: '1.35rem',
              clipPath: hudClip,
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--color-primary)',
              boxShadow: 'var(--shadow-card)',
              minWidth: 0
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              📅 RADAR DE TURMAS EM TEMPO REAL // GRADE 7 DIAS & LISTA COMPACTA
            </div>
            <InteractiveCombatCalendar userRole="ALUNO" defaultViewMode="grid" />
          </div>

          {/* Lado Direito: Check-in Expresso + Atalhos de Arena */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1.25rem',
                clipPath: hudClip,
                background: 'var(--bg-surface-1)',
                border: '2px solid var(--color-primary)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                ⚡ TERMINAL DE ENTRADA // BATER PONTO NO TATAME
              </div>
              <PublicQuickCheckinCard />
            </div>

            <div
              style={{
                padding: '1.25rem',
                clipPath: hudClip,
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gap: '0.55rem'
              }}
            >
              <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                🎮 COMBAT SHORTCUTS // ACESSO DIRETO
              </div>
              {[
                { icon: '🏆', title: 'CHAVES DE TORNEIOS & BRACKETS', to: '/portal?tab=torneios' },
                { icon: '🌍', title: 'LEADERBOARD GLOBAL MMR', to: '/portal?tab=ranking' },
                { icon: '📊', title: 'TELEMETRIA & STATS DO LUTADOR', to: '/portal?tab=desempenho' },
                { icon: '🥊', title: 'ENTRAR NO PORTAL DO ALUNO', to: '/portal' },
                { icon: '👑', title: 'COMANDO ADMIN & ERP', to: '/admin' }
              ].map(item => (
                <Link
                  key={item.title}
                  to={item.to}
                  style={{
                    padding: '0.65rem 0.85rem',
                    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                    background: 'var(--bg-background)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-foreground)',
                    textDecoration: 'none',
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{item.icon} {item.title}</span>
                  <span style={{ color: 'var(--color-primary)' }}>▶</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* MÓDULOS DE COMBATE EM ESTILO GAME SELECT & BATTLE PASS */}
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
