import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useLayoutEngine,
  JourneyLayoutToolbar,
  DynamicNavBuilder,
  DynamicSectionRenderer
} from '../config/layoutEngine';
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
  vagasHoje: number;
  statusHoje: 'DISPONIVEL' | 'ULTIMAS_VAGAS' | 'LOTADO';
  destaque: string;
}

const DEFAULT_PARTNER_CTS: PartnerCenter[] = [
  {
    id: 'ct-boru-matriz',
    nome: 'CT Borü Centro de Combate (Unidade Credenciada)',
    bairro: 'Centro / Arena',
    cidade: 'São Paulo - SP',
    distancia: '1.2 km',
    modalidades: ['Muay Thai', 'Boxe', 'Sparring Técnico', 'Clinch'],
    passeMinimo: 'SILVER',
    nota: '4.9 ★',
    vagasHoje: 12,
    statusHoje: 'DISPONIVEL',
    destaque: 'Octógono Oficial & Mestres Federados'
  },
  {
    id: 'ct-iron-bjj',
    nome: 'Iron Lotus Jiu-Jitsu & Grappling Hub',
    bairro: 'Jardins',
    cidade: 'São Paulo - SP',
    distancia: '2.4 km',
    modalidades: ['Jiu-Jitsu (Gi)', 'No-Gi Submission', 'Wrestling'],
    passeMinimo: 'GOLD',
    nota: '5.0 ★',
    vagasHoje: 4,
    statusHoje: 'ULTIMAS_VAGAS',
    destaque: 'Tatame Olímpico & Turmas Competição'
  },
  {
    id: 'ct-apex-mma',
    nome: 'Apex Pro Fight & Performance Lab',
    bairro: 'Vila Olímpia',
    cidade: 'São Paulo - SP',
    distancia: '3.1 km',
    modalidades: ['MMA Pro', 'Muay Thai', 'Boxe Olímpico', 'Preparação Física'],
    passeMinimo: 'BLACK',
    nota: '4.9 ★',
    vagasHoje: 9,
    statusHoje: 'DISPONIVEL',
    destaque: 'Cage Oficial & Bioimpedância'
  },
  {
    id: 'ct-krabi-thai',
    nome: 'Krabi Stadium Muay Thai & Kickboxing',
    bairro: 'Pinheiros',
    cidade: 'São Paulo - SP',
    distancia: '3.8 km',
    modalidades: ['Muay Thai Tradicional', 'Kickboxing K-1', 'Kids Martial'],
    passeMinimo: 'SILVER',
    nota: '4.8 ★',
    vagasHoje: 0,
    statusHoje: 'LOTADO',
    destaque: 'Treino Tradicional Tailandês'
  },
  {
    id: 'ct-valhalla-boxe',
    nome: 'Valhalla Noble Art Boxing Club',
    bairro: 'Moema',
    cidade: 'São Paulo - SP',
    distancia: '4.5 km',
    modalidades: ['Boxe Olímpico', 'Boxe Executivo', 'Condicionamento'],
    passeMinimo: 'GOLD',
    nota: '4.9 ★',
    vagasHoje: 7,
    statusHoje: 'DISPONIVEL',
    destaque: 'Ringue Oficial & Saco Inteligente'
  },
  {
    id: 'ct-bushido-dojo',
    nome: 'Bushido Kodokan Judo & Karatê Kyokushin',
    bairro: 'Liberdade',
    cidade: 'São Paulo - SP',
    distancia: '5.0 km',
    modalidades: ['Judô Kodokan', 'Karatê Kyokushin', 'Defesa Pessoal'],
    passeMinimo: 'SILVER',
    nota: '4.9 ★',
    vagasHoje: 15,
    statusHoje: 'DISPONIVEL',
    destaque: 'Tradição Marcial & Formação de Faixas'
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
  const { preferences, setJourneyPreset, triggerLoadingDemo } = useLayoutEngine();
  const activePreset = preferences.layoutPreset.landing;

  // Estados de filtro do Marketplace (Layout A)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState('TODAS');
  const [selectedPassFilter, setSelectedPassFilter] = useState('TODOS');
  const [selectedCity, setSelectedCity] = useState('São Paulo - SP');
  const [selectedCenter, setSelectedCenter] = useState<PartnerCenter>(DEFAULT_PARTNER_CTS[0]);

  // Estados Corporativos (Layout B)
  const [corpEcosystemTab, setCorpEcosystemTab] = useState<'alunos' | 'academias' | 'empresas'>('alunos');
  const [credenciamentoForm, setCredenciamentoForm] = useState({
    nomeAcademia: '',
    cidadeBairro: '',
    modalidades: '',
    responsavel: '',
    whatsapp: ''
  });
  const [credenciamentoStatus, setCredenciamentoStatus] = useState('');

  // Estados da Grade ao Vivo
  const [aulasHoje, setAulasHoje] = useState<any[]>([]);

  useEffect(() => {
    publicApi
      .getTodayClasses()
      .then((res: any) => {
        if (Array.isArray(res?.data?.aulas)) setAulasHoje(res.data.aulas);
      })
      .catch(() => {});
  }, []);

  // Se o usuário selecionou o modo HTML Clássico original, exibimos uma barra flutuante
  // e liberamos o HTML estático do index.html
  useEffect(() => {
    if (activePreset === 'classic') {
      document.body.classList.remove('react-active');
    } else {
      document.body.classList.add('react-active');
    }
  }, [activePreset]);

  if (activePreset === 'classic') {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'var(--bg-surface-1)',
          color: 'var(--text-foreground)',
          border: '2px solid var(--color-primary)',
          borderRadius: '999px',
          padding: '0.65rem 1.25rem',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--color-primary)' }}>
          🏛️ Modo Landing Clássica Ativo
        </span>
        <button
          type="button"
          onClick={() => setJourneyPreset('landing', 'marketplace')}
          style={{
            background: 'var(--color-primary)',
            color: 'var(--text-primary-foreground)',
            border: 'none',
            borderRadius: '999px',
            padding: '0.4rem 0.9rem',
            fontSize: '0.75rem',
            fontWeight: 900,
            cursor: 'pointer'
          }}
        >
          ⚡ Voltar ao Hub Multi-Layout (A / B / C)
        </button>
      </div>
    );
  }

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

  const handleCredenciarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credenciamentoForm.nomeAcademia || !credenciamentoForm.whatsapp) {
      setCredenciamentoStatus('Preencha o nome do Centro de Treinamento e WhatsApp comercial.');
      return;
    }
    triggerLoadingDemo('Registrando solicitação de credenciamento B2B Combat-Pass...', 'step_progress', 1600);
    setCredenciamentoStatus(
      `✅ Solicitação do CT "${credenciamentoForm.nomeAcademia}" recebida! Nossa equipe de expansão entrará em contato.`
    );
    setCredenciamentoForm({
      nomeAcademia: '',
      cidadeBairro: '',
      modalidades: '',
      responsavel: '',
      whatsapp: ''
    });
  };

  // ============================================================================
  // DEFINIÇÃO DOS 7 BLOCOS MODULARES REORDENÁVEIS DA PÁGINA PRINCIPAL
  // ============================================================================
  const sectionsMap: Record<string, React.ReactNode> = {
    // 1. HERO SECTION (Polimórfica conforme Layout A, B ou C)
    hero: (
      <section
        id="landing-sec-hero"
        style={{
          marginBottom: '2rem',
          padding: activePreset === 'corporate' ? '2.5rem' : '2rem',
          borderRadius: '22px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Layout A: Marketplace & Descoberta */}
        {activePreset === 'marketplace' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1.1rem'
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                🏛️ Layout A · Marketplace & Descoberta Multi-Academias
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                  📍 Região Ativa:
                </span>
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  style={{
                    background: 'var(--bg-surface-2)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '0.38rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 800
                  }}
                >
                  <option value="São Paulo - SP">São Paulo - SP (Grande SP)</option>
                  <option value="Campinas - SP">Campinas & Região</option>
                  <option value="Rio de Janeiro - RJ">Rio de Janeiro - RJ</option>
                  <option value="Curitiba - PR">Curitiba - PR</option>
                </select>
              </div>
            </div>

            <h1
              style={{
                margin: '0 0 0.65rem 0',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)',
                fontWeight: 900,
                lineHeight: 1.08,
                color: 'var(--text-foreground)',
                textTransform: 'uppercase'
              }}
            >
              Um Único <span style={{ color: 'var(--color-primary)' }}>Passe de Combate</span>. Dezenas de Tatames, Ringues e Octógonos.
            </h1>

            <p
              style={{
                margin: '0 0 1.4rem 0',
                fontSize: '0.96rem',
                color: 'var(--text-muted-foreground)',
                maxWidth: '760px',
                lineHeight: 1.55
              }}
            >
              Encontre centros de treinamento credenciados por bairro, modalidade e horário ao vivo. Reserve sua vaga com 1 clique, acumule XP em qualquer academia parceira e troque por equipamentos oficiais.
            </p>

            {/* Barra de Busca Inteligente no Hero */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: '16px',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted-foreground)',
                    marginBottom: '0.3rem'
                  }}
                >
                  🔍 Buscar CT, Bairro ou Mestre
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Ex: Borü, Muay Thai, Jardins..."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-1)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted-foreground)',
                    marginBottom: '0.3rem'
                  }}
                >
                  🥊 Modalidade Marcial
                </label>
                <select
                  value={selectedModality}
                  onChange={e => setSelectedModality(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-1)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.84rem',
                    fontWeight: 700
                  }}
                >
                  <option value="TODAS">Todas as Modalidades</option>
                  <option value="Muay Thai">Muay Thai</option>
                  <option value="Jiu-Jitsu">Jiu-Jitsu (Gi & No-Gi)</option>
                  <option value="Boxe">Boxe Nobre Arte</option>
                  <option value="MMA">MMA & Wrestling</option>
                  <option value="Judô">Judô & Karatê</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted-foreground)',
                    marginBottom: '0.3rem'
                  }}
                >
                  🎫 Categoria do Passe
                </label>
                <select
                  value={selectedPassFilter}
                  onChange={e => setSelectedPassFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-1)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.84rem',
                    fontWeight: 700
                  }}
                >
                  <option value="TODOS">Todos os Passes (Silver / Gold / Black)</option>
                  <option value="SILVER">Acesso Silver</option>
                  <option value="GOLD">Acesso Gold</option>
                  <option value="BLACK">Acesso Black Pro</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => navigate('/portal')}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                >
                  ⚡ Check-in / Portal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Layout B: Corporativo & Institucional (Formal / B2B & Redes) */}
        {activePreset === 'corporate' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '0.9rem'
                }}
              >
                🏢 Layout B · Corporativo, Benefício Empresarial & Redes de CTs
              </div>

              <h1
                style={{
                  margin: '0 0 0.85rem 0',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: 'var(--text-foreground)'
                }}
              >
                Infraestrutura Unificada de <span style={{ color: 'var(--color-primary)' }}>Saúde Marcial Corporativa</span> e Gestão Multi-Unidades.
              </h1>

              <p
                style={{
                  margin: '0 0 1.4rem 0',
                  fontSize: '0.95rem',
                  color: 'var(--text-muted-foreground)',
                  lineHeight: 1.6
                }}
              >
                Conectamos empresas líderes, colaboradores e os mais respeitados Centros de Treinamento do país em uma plataforma auditável de passes corporativos, controle de presença em tempo real e repasse automático por check-in validado.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleNavSelect('#credenciamento')}
                  style={{
                    padding: '0.75rem 1.35rem',
                    borderRadius: '10px',
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    border: 'none',
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  🤝 Credenciar Academia ou Empresa
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  style={{
                    padding: '0.75rem 1.35rem',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-2)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  👑 Acessar ERP & Governança
                </button>
              </div>
            </div>

            {/* Painel de Abas do Ecossistema (Para Alunos / Para Academias / Para Empresas) */}
            <div
              style={{
                padding: '1.35rem',
                borderRadius: '16px',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  marginBottom: '1rem',
                  padding: '0.3rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {(['alunos', 'academias', 'empresas'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCorpEcosystemTab(tab)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: corpEcosystemTab === tab ? 'var(--color-primary)' : 'transparent',
                      color:
                        corpEcosystemTab === tab
                          ? 'var(--text-primary-foreground)'
                          : 'var(--text-muted-foreground)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {tab === 'alunos'
                      ? '🥊 Para Alunos'
                      : tab === 'academias'
                      ? '🏛️ Para CTs'
                      : '🏢 Para Empresas'}
                  </button>
                ))}
              </div>

              {corpEcosystemTab === 'alunos' && (
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--text-foreground)' }}>
                    Liberdade Multi-Modalidade Sem Fidelidade Engessada
                  </h3>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.1rem',
                      color: 'var(--text-muted-foreground)',
                      fontSize: '0.84rem',
                      lineHeight: 1.75
                    }}
                  >
                    <li>Treine Muay Thai, Jiu-Jitsu, Boxe e MMA com um único passe mensal.</li>
                    <li>Agende horários específicos com visão de vagas ao vivo e cancele se imprevistos ocorrerem.</li>
                    <li>Seu XP, nível e Combat Points valem em toda a rede credenciada.</li>
                  </ul>
                </div>
              )}

              {corpEcosystemTab === 'academias' && (
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--text-foreground)' }}>
                    Ocupação de Horários Ociosos + ERP Completo Incluso
                  </h3>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.1rem',
                      color: 'var(--text-muted-foreground)',
                      fontSize: '0.84rem',
                      lineHeight: 1.75
                    }}
                  >
                    <li>Receba repasse financeiro auditado por cada check-in validado no seu tatame.</li>
                    <li>Controle limite de vagas por turma, comissões de professores e fechamento de caixa diário.</li>
                    <li>Zero custo de implantação e página white-label customizável.</li>
                  </ul>
                </div>
              )}

              {corpEcosystemTab === 'empresas' && (
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--text-foreground)' }}>
                    Saúde Física, Disciplina e Redução de Estresse Corporativo
                  </h3>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.1rem',
                      color: 'var(--text-muted-foreground)',
                      fontSize: '0.84rem',
                      lineHeight: 1.75
                    }}
                  >
                    <li>Relatórios de engajamento e frequência corporativa em tempo real para o RH.</li>
                    <li>Subsídio flexível por colaborador ou pacote corporativo fechado.</li>
                    <li>Faturamento único via nota fiscal corporativa com compliance total.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Layout C: Direto ao Tatame (Foco Operacional & Conversão Rápida) */}
        {activePreset === 'tatame' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.28rem 0.75rem',
                  borderRadius: '999px',
                  background: 'var(--status-available-bg)',
                  border: '1px solid var(--status-available-border)',
                  color: 'var(--status-available)',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}
              >
                ⚡ Layout C · Direto ao Tatame (Operação Ao Vivo & Check-in Imediato)
              </span>
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.55rem, 2.8vw, 2.2rem)',
                  fontWeight: 900,
                  color: 'var(--text-foreground)',
                  textTransform: 'uppercase'
                }}
              >
                Grade Oficial ao Vivo & Check-in Expresso
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/portal')}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '10px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                🥊 Abrir Portal do Aluno
              </button>
              <button
                type="button"
                onClick={() => navigate('/professor')}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-2)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🥋 Chamada do Professor
              </button>
            </div>
          </div>
        )}
      </section>
    ),

    // 2. BUSCADOR & VITRINE DE CTs CREDENCIADOS
    ct_search: (
      <section
        id="landing-sec-academias"
        style={{
          marginBottom: '2rem',
          padding: '1.75rem',
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
            marginBottom: '1.25rem'
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
              REDE MULTI-ACADEMIAS COMBAT-PASS
            </span>
            <h2
              style={{
                margin: '0.2rem 0 0 0',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: 'var(--text-foreground)'
              }}
            >
              🏛️ Centros de Treinamento Credenciados ({filteredCenters.length})
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['TODAS', 'Muay Thai', 'Jiu-Jitsu', 'Boxe', 'MMA'].map(mod => (
              <button
                key={mod}
                type="button"
                onClick={() => setSelectedModality(mod)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '999px',
                  border:
                    selectedModality === mod
                      ? '1px solid var(--color-primary)'
                      : '1px solid var(--border-subtle)',
                  background:
                    selectedModality === mod ? 'var(--color-primary)' : 'var(--bg-surface-2)',
                  color:
                    selectedModality === mod
                      ? 'var(--text-primary-foreground)'
                      : 'var(--text-foreground)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {/* Grid de Cards dos CTs */}
          <div
            style={{
              gridColumn: 'span 2',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.9rem'
            }}
          >
            {filteredCenters.map(ct => {
              const isSelected = selectedCenter?.id === ct.id;
              const statusColor =
                ct.statusHoje === 'LOTADO'
                  ? 'var(--status-full)'
                  : ct.statusHoje === 'ULTIMAS_VAGAS'
                  ? 'var(--status-warning)'
                  : 'var(--status-available)';

              return (
                <div
                  key={ct.id}
                  onClick={() => setSelectedCenter(ct)}
                  style={{
                    padding: '1.15rem',
                    borderRadius: '16px',
                    background: isSelected ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                    border: isSelected
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: 'var(--bg-surface-1)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--color-primary)',
                          fontSize: '0.66rem',
                          fontWeight: 900
                        }}
                      >
                        PASSE {ct.passeMinimo}+
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: 'var(--text-muted-foreground)'
                        }}
                      >
                        📍 {ct.distancia} · {ct.nota}
                      </span>
                    </div>

                    <h3
                      style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.98rem',
                        fontWeight: 900,
                        color: 'var(--text-foreground)'
                      }}
                    >
                      {ct.nome}
                    </h3>
                    <div
                      style={{
                        fontSize: '0.76rem',
                        color: 'var(--text-muted-foreground)',
                        marginBottom: '0.6rem'
                      }}
                    >
                      {ct.bairro} · {ct.cidade}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {ct.modalidades.map(mod => (
                        <span
                          key={mod}
                          style={{
                            padding: '0.18rem 0.5rem',
                            borderRadius: '999px',
                            background: 'var(--bg-surface-1)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-foreground)',
                            fontSize: '0.68rem',
                            fontWeight: 700
                          }}
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: '0.65rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        color: statusColor
                      }}
                    >
                      {ct.statusHoje === 'LOTADO'
                        ? '🔴 [LOTADO HOJE]'
                        : `🟢 [HÁ VAGAS: ${ct.vagasHoje}]`}
                    </span>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        navigate('/portal');
                      }}
                      style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: '8px',
                        background: 'var(--color-primary)',
                        color: 'var(--text-primary-foreground)',
                        border: 'none',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        cursor: 'pointer'
                      }}
                    >
                      Reservar →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Painel Lateral de Mapa / Radar da Unidade Selecionada */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'var(--bg-background)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-primary)',
                  marginBottom: '0.35rem'
                }}
              >
                🗺️ RADAR DE UNIDADE CREDENCIADA
              </div>
              <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.08rem', color: 'var(--text-foreground)' }}>
                {selectedCenter.nome}
              </h3>
              <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.8rem', color: 'var(--text-muted-foreground)' }}>
                {selectedCenter.destaque} — {selectedCenter.bairro} ({selectedCenter.distancia})
              </p>

              {/* Representação visual de radar semântico */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '0.85rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.76rem',
                    marginBottom: '0.45rem'
                  }}
                >
                  <span style={{ color: 'var(--text-muted-foreground)' }}>Passe Aceito:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>
                    Combat-Pass {selectedCenter.passeMinimo}+
                  </strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.76rem',
                    marginBottom: '0.45rem'
                  }}
                >
                  <span style={{ color: 'var(--text-muted-foreground)' }}>Disponibilidade Hoje:</span>
                  <strong
                    style={{
                      color:
                        selectedCenter.statusHoje === 'LOTADO'
                          ? 'var(--status-full)'
                          : 'var(--status-available)'
                    }}
                  >
                    {selectedCenter.statusHoje === 'LOTADO'
                      ? '[LOTADO]'
                      : `[HÁ VAGAS · ${selectedCenter.vagasHoje} restantes]`}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                  <span style={{ color: 'var(--text-muted-foreground)' }}>Validação de Check-in:</span>
                  <strong style={{ color: 'var(--text-foreground)' }}>QR Code / CPF Expresso</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleNavSelect('#grade')}
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--color-primary)',
                fontSize: '0.78rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              📅 Ver Horários Oficial Desta Unidade
            </button>
          </div>
        </div>
      </section>
    ),

    // 3. GRADE OFICIAL DE AULAS AO VIVO + CHECK-IN EXPRESSO
    live_schedule: (
      <section
        id="landing-sec-grade"
        style={{
          marginBottom: '2rem',
          padding: '1.75rem',
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
            marginBottom: '1.25rem'
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
              STATUS EM TEMPO REAL · [HÁ VAGAS] / [LOTADO] / AULAS CANCELADAS RISCADAS
            </span>
            <h2
              style={{
                margin: '0.2rem 0 0 0',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: 'var(--text-foreground)'
              }}
            >
              📅 Grade Oficial de Horários & Check-in Expresso Sem Fricção
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/portal')}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              color: 'var(--text-primary-foreground)',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            🥊 Ir para Área Logada do Aluno →
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              activePreset === 'tatame'
                ? 'repeat(auto-fit, minmax(340px, 1fr))'
                : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start'
          }}
        >
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <InteractiveCombatCalendar userRole="ALUNO" />
          </div>

          <div>
            <PublicQuickCheckinCard />
          </div>
        </div>
      </section>
    ),

    // 4. COMPARATIVO DE PASSES UNIFICADOS (SILVER, GOLD, BLACK, CORPORATE)
    passes_plans: (
      <section
        id="landing-sec-passes"
        style={{
          marginBottom: '2rem',
          padding: '1.75rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-primary)'
            }}
          >
            ASSINATURA UNIFICADA MULTI-ACADEMIAS
          </span>
          <h2
            style={{
              margin: '0.2rem 0 0 0',
              fontSize: '1.4rem',
              fontWeight: 900,
              color: 'var(--text-foreground)'
            }}
          >
            🎫 Planos & Passes Combat-Pass
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem'
          }}
        >
          {[
            {
              id: 'SILVER',
              nome: 'Combat-Pass Silver',
              preco: 'R$ 189/mês',
              creditos: '12 Check-ins / mês',
              destaque: false,
              beneficios: [
                'Acesso às unidades Silver da rede',
                'Agendamento por horário específico',
                'Cancelamento livre antes da chamada',
                'Acumula +10 XP e Points por treino'
              ]
            },
            {
              id: 'GOLD',
              nome: 'Combat-Pass Gold Pro',
              preco: 'R$ 269/mês',
              creditos: 'Check-in Diário (Até 30/mês)',
              destaque: true,
              beneficios: [
                'Acesso total às unidades Silver & Gold',
                'Muay Thai, Jiu-Jitsu, Boxe e Wrestling',
                'Prioridade na fila de turmas concorridas',
                'Multiplicador 1.5x de Combat Points na Loja'
              ]
            },
            {
              id: 'BLACK',
              nome: 'Combat-Pass Black Unlimited',
              preco: 'R$ 389/mês',
              creditos: 'Ilimitado + Sparring & Performance Labs',
              destaque: false,
              beneficios: [
                'Acesso irrestrito a 100% dos CTs (Silver, Gold, Black)',
                'Acesso a seminários e treinos de competição',
                'Multiplicador 2x de Combat Points',
                '1 Convidado VIP gratuito por mês'
              ]
            }
          ].map(plan => (
            <div
              key={plan.id}
              style={{
                padding: '1.35rem',
                borderRadius: '16px',
                background: plan.destaque ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                border: plan.destaque
                  ? '2px solid var(--color-primary)'
                  : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                {plan.destaque && (
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      background: 'var(--color-primary)',
                      color: 'var(--text-primary-foreground)',
                      fontSize: '0.66rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem'
                    }}
                  >
                    ⭐ Mais Escolhido pelos Praticantes
                  </span>
                )}
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--text-foreground)' }}>
                  {plan.nome}
                </h3>
                <div
                  style={{
                    fontSize: '1.55rem',
                    fontWeight: 900,
                    color: 'var(--color-primary)',
                    marginBottom: '0.25rem'
                  }}
                >
                  {plan.preco}
                </div>
                <div
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    color: 'var(--text-muted-foreground)',
                    marginBottom: '0.85rem'
                  }}
                >
                  {plan.creditos}
                </div>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.1rem',
                    color: 'var(--text-foreground)',
                    fontSize: '0.8rem',
                    lineHeight: 1.7
                  }}
                >
                  {plan.beneficios.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => navigate('/portal')}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '10px',
                  background: plan.destaque ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                  color: plan.destaque ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                  border: plan.destaque ? 'none' : '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Ativar {plan.nome}
              </button>
            </div>
          ))}
        </div>
      </section>
    ),

    // 5. VITRINE DE RECOMPENSAS & GAMIFICAÇÃO
    rewards_showcase: (
      <section
        id="landing-sec-recompensas"
        style={{
          marginBottom: '2rem',
          padding: '1.75rem',
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
            marginBottom: '1.25rem'
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
              TREINE · GANHE XP · RESGATE EQUIPAMENTOS REAIS
            </span>
            <h2
              style={{
                margin: '0.2rem 0 0 0',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: 'var(--text-foreground)'
              }}
            >
              🪙 Vitrine da Loja de Recompensas por Combat Points
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/portal?tab=recompensas')}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              background: 'var(--bg-surface-2)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              fontSize: '0.78rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            Ver Catálogo Completo no Portal →
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.9rem'
          }}
        >
          {REWARDS_SHOWCASE_ITEMS.map(item => (
            <div
              key={item.id}
              style={{
                padding: '1.15rem',
                borderRadius: '14px',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem'
              }}
            >
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{item.icone}</div>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted-foreground)'
                  }}
                >
                  {item.categoria}
                </span>
                <h4 style={{ margin: '0.2rem 0', fontSize: '0.95rem', color: 'var(--text-foreground)' }}>
                  {item.nome}
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--status-available)', fontWeight: 700 }}>
                  ✓ {item.estoque}
                </div>
              </div>

              <div
                style={{
                  paddingTop: '0.6rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                  🪙 {item.pontos} pts
                </strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                  Voucher Digital
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    // 6. INDICADORES DE AUTORIDADE & DEPOIMENTOS
    testimonials: (
      <section
        id="landing-sec-testimonials"
        style={{
          marginBottom: '2rem',
          padding: '1.75rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.9rem',
            marginBottom: '1.25rem'
          }}
        >
          {[
            { label: 'CTs & Dojos Credenciados', val: '42 Unidades', icon: '🏛️' },
            { label: 'Check-ins Validados / Mês', val: '18.400+', icon: '⚡' },
            { label: 'Modalidades Marciais', val: '14 Artes', icon: '🥊' },
            { label: 'Índice de Retenção em Tatame', val: '94.8%', icon: '🏆' }
          ].map((kpi, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.1rem',
                borderRadius: '14px',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{kpi.icon}</div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-display)'
                }}
              >
                {kpi.val}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    // 7. FORMULÁRIO DE CREDENCIAMENTO DE ACADEMIAS & B2B
    accreditation: (
      <section
        id="landing-sec-credenciamento"
        style={{
          marginBottom: '2rem',
          padding: '1.75rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
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
              EXPANSÃO B2B & CREDENCIAMENTO DE PARCEIROS
            </span>
            <h2
              style={{
                margin: '0.25rem 0 0.65rem 0',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: 'var(--text-foreground)'
              }}
            >
              🤝 Credencie sua Academia ou Centro de Treinamento no Combat-Pass
            </h2>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted-foreground)', lineHeight: 1.6 }}>
              Aumente a ocupação das suas turmas, receba repasses automáticos por check-in e tenha acesso imediato ao ERP Multi-Academias com controle de grade, chamada digital, comissões de professores e loja de pontos.
            </p>
          </div>

          <form
            onSubmit={handleCredenciarSubmit}
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'var(--bg-background)',
              border: '1px solid var(--border-subtle)',
              display: 'grid',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <input
                type="text"
                placeholder="Nome da Academia / CT *"
                value={credenciamentoForm.nomeAcademia}
                onChange={e =>
                  setCredenciamentoForm({ ...credenciamentoForm, nomeAcademia: e.target.value })
                }
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-1)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}
              />
              <input
                type="text"
                placeholder="Cidade / Bairro"
                value={credenciamentoForm.cidadeBairro}
                onChange={e =>
                  setCredenciamentoForm({ ...credenciamentoForm, cidadeBairro: e.target.value })
                }
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-1)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <input
                type="text"
                placeholder="Modalidades (Ex: Muay Thai, BJJ)"
                value={credenciamentoForm.modalidades}
                onChange={e =>
                  setCredenciamentoForm({ ...credenciamentoForm, modalidades: e.target.value })
                }
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-1)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}
              />
              <input
                type="text"
                placeholder="WhatsApp Comercial *"
                value={credenciamentoForm.whatsapp}
                onChange={e =>
                  setCredenciamentoForm({ ...credenciamentoForm, whatsapp: e.target.value })
                }
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-1)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}
              />
            </div>

            {credenciamentoStatus && (
              <div
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: 'var(--status-available)',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  background: 'var(--status-available-bg)',
                  border: '1px solid var(--status-available-border)'
                }}
              >
                {credenciamentoStatus}
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: '0.7rem',
                borderRadius: '10px',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Solicitar Credenciamento Oficial →
            </button>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-background)',
        color: 'var(--text-foreground)',
        padding: '1.25rem clamp(1rem, 3vw, 2.5rem) 4rem'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Global do Hub Multi-Academias */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.9rem 1.25rem',
            marginBottom: '1rem',
            borderRadius: '18px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.1rem',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              CP
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: 'var(--text-foreground)'
                }}
              >
                COMBAT-PASS <span style={{ color: 'var(--color-primary)' }}>HUB</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                Ecossistema Multi-Academias · Passes Unificados & ERP
              </div>
            </div>
          </div>

          {/* Navegação Dinâmica Reordenável pelo Usuário */}
          <DynamicNavBuilder
            journey="landing"
            onSelect={handleNavSelect}
            variant="horizontal"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ThemeSwitcher />
          </div>
        </header>

        {/* Barra de Controle de Arquitetura Visual & Ordem de Páginas/Seções */}
        <JourneyLayoutToolbar journey="landing" />

        {/* Renderizador Dinâmico de Seções na Ordem Exata Configurada pelo Cliente */}
        <DynamicSectionRenderer journey="landing" sectionsMap={sectionsMap} />
      </div>
    </div>
  );
};

export default LandingHubPage;
