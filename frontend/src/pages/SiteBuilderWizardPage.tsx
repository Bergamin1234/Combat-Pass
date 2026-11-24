import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { THEMES_LIST } from '../config/themeConfig';
import { InterfaceOption } from '../config/layoutEngine';
import {
  useSiteBuilder,
  SiteBuilderSections,
  SiteBuilderPortals,
} from '../config/siteBuilderConfig';

interface InterfaceCardMeta {
  id: InterfaceOption;
  icon: string;
  nome: string;
  subtitulo: string;
  badge: string;
}

const INTERFACE_OPTIONS: InterfaceCardMeta[] = [
  {
    id: 'escolar',
    icon: '📚',
    nome: 'Painel Escolar / Sidebar',
    subtitulo: 'Menu lateral organizado por módulos, visual limpo e intuitivo.',
    badge: 'Mais Popular',
  },
  {
    id: 'mesa_hud',
    icon: '🖥️',
    nome: 'Mesa Executiva HUD',
    subtitulo: 'Cards de métricas em destaque com foco em operação rápida.',
    badge: 'Executivo',
  },
  {
    id: 'b2b_0px',
    icon: '🏢',
    nome: 'Corporativo B2B (0px)',
    subtitulo: 'Linhas retas, alta densidade de dados e leitura empresarial.',
    badge: 'Empresarial',
  },
  {
    id: 'super_app',
    icon: '📱',
    nome: 'Super App Moderno',
    subtitulo: 'Experiência fluida estilo aplicativo mobile-first.',
    badge: 'Mobile-First',
  },
  {
    id: 'split_screen',
    icon: '🌓',
    nome: 'Split-Screen 40/60',
    subtitulo: 'Coluna esquerda fixa de comando e conteúdo rolável à direita.',
    badge: 'Produtividade',
  },
  {
    id: 'command_center',
    icon: '⚡',
    nome: 'Command Center',
    subtitulo: 'Centro de controle tático em grade única sem perda de foco.',
    badge: 'Alta Gestão',
  },
  {
    id: 'floating_island',
    icon: '🏝️',
    nome: 'Floating Island',
    subtitulo: 'Tela ultra limpa com barra flutuante moderna.',
    badge: 'Minimalista',
  },
  {
    id: 'zen_focus',
    icon: '🧘',
    nome: 'Zen Focus',
    subtitulo: 'Zero distrações, ideal para leitura focada e elegância.',
    badge: 'Clean',
  },
];

const ACADEMY_PRESETS = [
  { nome: 'CT BORÜ CENTRO DE COMBATE', slogan: 'Artes Marciais, Disciplina & Alta Performance' },
  { nome: 'ARENA IRON STRIKING', slogan: 'Muay Thai, Boxe & Preparação Física de Elite' },
  { nome: 'INSTITUTO GRAPPLING PRO', slogan: 'Jiu-Jitsu Brasileiro, Defesa Pessoal & Formação' },
  { nome: 'ACADEMIA NOVA ERA FIGHT', slogan: 'Saúde, Condicionamento e Combate para Toda Família' },
];

type PreviewScreen = 'site' | 'admin' | 'atendimento' | 'aluno';

interface WizardStepDef {
  id: string;
  fase: number;
  faseLabel: string;
  titulo: string;
  descricao: string;
  autoPreview: PreviewScreen;
}

const WIZARD_STEPS: WizardStepDef[] = [
  {
    id: 'marca',
    fase: 1,
    faseLabel: 'Fase 1 • Identidade',
    titulo: 'Qual é o nome da sua academia?',
    descricao: 'Personalize o nome e o slogan que aparecerão no topo do site e nos portais.',
    autoPreview: 'site',
  },
  {
    id: 'cor',
    fase: 1,
    faseLabel: 'Fase 1 • Identidade',
    titulo: 'Qual paleta de cores representa sua marca?',
    descricao: 'Clique em uma cor para transformar instantaneamente o visual de toda a plataforma.',
    autoPreview: 'site',
  },
  {
    id: 'sec_hub',
    fase: 2,
    faseLabel: 'Fase 2 • Site Principal',
    titulo: 'Adicionar Hub de acesso rápido na área principal?',
    descricao: 'Exibe cartões diretos de Unidades, Check-in, Planos e Portais logo na entrada.',
    autoPreview: 'site',
  },
  {
    id: 'sec_galeria',
    fase: 2,
    faseLabel: 'Fase 2 • Site Principal',
    titulo: 'Mostrar Galeria de Fotos & Estrutura do CT?',
    descricao: 'Destaca o tatame, ringue, sacos de pancada e ambiente climatizado para encantar visitantes.',
    autoPreview: 'site',
  },
  {
    id: 'sec_horarios',
    fase: 2,
    faseLabel: 'Fase 2 • Site Principal',
    titulo: 'Mostrar Grade de Horários Ao Vivo no site?',
    descricao: 'Permite que alunos e interessados consultem turmas, vagas e horários em tempo real.',
    autoPreview: 'site',
  },
  {
    id: 'sec_modalidades',
    fase: 2,
    faseLabel: 'Fase 2 • Site Principal',
    titulo: 'Mostrar Modalidades & Corpo Docente (Professores)?',
    descricao: 'Apresenta cada arte marcial oferecida e o currículo oficial dos mestres.',
    autoPreview: 'site',
  },
  {
    id: 'sec_planos',
    fase: 2,
    faseLabel: 'Fase 2 • Site Principal',
    titulo: 'Mostrar Tabela de Planos & Valores abertos no site?',
    descricao: 'Exibe planos mensais com botão de matrícula direta (ou oculta para atendimento sob consulta).',
    autoPreview: 'site',
  },
  {
    id: 'sec_experimental',
    fase: 2,
    faseLabel: 'Fase 2 • Site Principal',
    titulo: 'Ativar Agendamento Experimental & Check-in Rápido?',
    descricao: 'Capta leads qualificados automaticamente e permite check-in expresso na entrada.',
    autoPreview: 'site',
  },
  {
    id: 'sec_faq',
    fase: 2,
    faseLabel: 'Fase 2 • Site Principal',
    titulo: 'Mostrar Dúvidas Frequentes (FAQ) & Localização?',
    descricao: 'Responde objeções comuns de novos alunos e facilita chegar à sua unidade.',
    autoPreview: 'site',
  },
  {
    id: 'portal_aluno',
    fase: 3,
    faseLabel: 'Fase 3 • Portais & Perfis',
    titulo: 'Ativar Área Exclusiva do Aluno (/portal)?',
    descricao: 'Portal com login por CPF para frequência, check-in, contrato digital e status financeiro.',
    autoPreview: 'aluno',
  },
  {
    id: 'portal_gamificacao',
    fase: 3,
    faseLabel: 'Fase 3 • Portais & Perfis',
    titulo: 'Ativar Gamificação, Ranking, Torneios & Loja de Points?',
    descricao: 'Aumenta a retenção dos alunos com XP, medalhas, ranking da academia e recompensas.',
    autoPreview: 'aluno',
  },
  {
    id: 'portal_professor',
    fase: 3,
    faseLabel: 'Fase 3 • Portais & Perfis',
    titulo: 'Ativar Portal do Professor (/professor)?',
    descricao: 'Área focada no tatame para lista de chamada, avaliação técnica e extrato de comissões.',
    autoPreview: 'admin',
  },
  {
    id: 'portal_atendente',
    fase: 3,
    faseLabel: 'Fase 3 • Portais & Perfis',
    titulo: 'Ativar Acesso Restrito para Atendentes (/atendimento)?',
    descricao: 'Mesmo sistema do Admin, porém limitado a matrículas, gestão de alunos e check-ins (sem financeiro).',
    autoPreview: 'atendimento',
  },
  {
    id: 'iface_landing',
    fase: 4,
    faseLabel: 'Fase 4 • Interfaces',
    titulo: 'Qual interface você prefere para o Site Principal?',
    descricao: 'Escolha a estrutura visual da página inicial que seus clientes verão ao acessar o site.',
    autoPreview: 'site',
  },
  {
    id: 'iface_admin',
    fase: 4,
    faseLabel: 'Fase 4 • Interfaces',
    titulo: 'Montar Área do Administrador: qual interface escolher?',
    descricao: 'Defina o estilo de painel que você e sua gestão usarão no dia a dia.',
    autoPreview: 'admin',
  },
  {
    id: 'iface_student',
    fase: 4,
    faseLabel: 'Fase 4 • Interfaces',
    titulo: 'Qual interface para a Área do Aluno?',
    descricao: 'Escolha a experiência visual do portal que seus alunos abrirão no celular ou computador.',
    autoPreview: 'aluno',
  },
  {
    id: 'resumo',
    fase: 5,
    faseLabel: 'Fase 5 • Entrega Ao Vivo',
    titulo: 'Seu site e sistema Combat-Pass estão prontos!',
    descricao: 'Revise tudo o que você montou e clique para abrir seu site ou painel já configurado.',
    autoPreview: 'site',
  },
];

export default function SiteBuilderWizardPage() {
  const navigate = useNavigate();
  const {
    config,
    updateConfig,
    updateSection,
    updatePortal,
    updateInterface,
    selectTheme,
    markCompleted,
    resetBuilder,
  } = useSiteBuilder();

  const [stepIdx, setStepIdx] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [previewScreen, setPreviewScreen] = useState<PreviewScreen>('site');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const currentStep = WIZARD_STEPS[stepIdx];
  const progressPct = Math.round(((stepIdx + 1) / WIZARD_STEPS.length) * 100);

  useEffect(() => {
    if (currentStep?.autoPreview) {
      setPreviewScreen(currentStep.autoPreview);
    }
    if (currentStep?.id === 'resumo') {
      markCompleted();
    }
  }, [stepIdx]);

  const goNext = () => {
    if (stepIdx < WIZARD_STEPS.length - 1) {
      setStepIdx((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (stepIdx > 0) {
      setStepIdx((prev) => prev - 1);
    }
  };

  const handleBinaryChoice = (
    kind: 'section' | 'portal',
    key: keyof SiteBuilderSections | keyof SiteBuilderPortals,
    value: boolean
  ) => {
    if (kind === 'section') {
      updateSection(key as keyof SiteBuilderSections, value);
    } else {
      updatePortal(key as keyof SiteBuilderPortals, value);
    }
    if (autoAdvance) {
      setTimeout(() => goNext(), 220);
    }
  };

  const handleInterfaceChoice = (
    journey: 'landing' | 'admin' | 'student',
    opt: InterfaceOption
  ) => {
    updateInterface(journey, opt);
    if (autoAdvance) {
      setTimeout(() => goNext(), 260);
    }
  };

  const handleExportConfigJson = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `combat-pass-blueprint-${config.academyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderYesNoCards = (
    currentValue: boolean,
    onSelect: (val: boolean) => void,
    yesTitle: string,
    yesDesc: string,
    noTitle: string,
    noDesc: string
  ) => (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onSelect(true)}
        className="w-full text-left p-4 rounded-2xl transition-all cursor-pointer flex items-start gap-3.5 group"
        style={{
          background: currentValue ? 'var(--color-primary-light)' : 'var(--bg-background)',
          border: currentValue
            ? '2px solid var(--color-primary)'
            : '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 font-black"
          style={{
            background: currentValue ? 'var(--color-primary)' : 'var(--bg-surface-2)',
            color: currentValue ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
          }}
        >
          ✓
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-black" style={{ color: 'var(--text-foreground)' }}>
              {yesTitle}
            </span>
            {currentValue && (
              <span
                className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                }}
              >
                Ativado
              </span>
            )}
          </div>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted-foreground)' }}>
            {yesDesc}
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelect(false)}
        className="w-full text-left p-4 rounded-2xl transition-all cursor-pointer flex items-start gap-3.5 group"
        style={{
          background: !currentValue ? 'var(--bg-surface-2)' : 'var(--bg-background)',
          border: !currentValue
            ? '2px solid var(--text-muted-foreground)'
            : '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 font-black"
          style={{
            background: !currentValue ? 'var(--text-muted-foreground)' : 'var(--bg-surface-2)',
            color: !currentValue ? 'var(--bg-background)' : 'var(--text-muted-foreground)',
          }}
        >
          —
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-black" style={{ color: 'var(--text-foreground)' }}>
              {noTitle}
            </span>
            {!currentValue && (
              <span
                className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--bg-surface-1)',
                  color: 'var(--text-muted-foreground)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Oculto
              </span>
            )}
          </div>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted-foreground)' }}>
            {noDesc}
          </p>
        </div>
      </button>
    </div>
  );

  const renderInterfaceGrid = (
    selected: InterfaceOption,
    onSelect: (opt: InterfaceOption) => void
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
      {INTERFACE_OPTIONS.map((item) => {
        const isSel = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="text-left p-3.5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between gap-2"
            style={{
              background: isSel ? 'var(--color-primary-light)' : 'var(--bg-background)',
              border: isSel ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xl">{item.icon}</span>
              <span
                className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: isSel ? 'var(--color-primary)' : 'var(--bg-surface-2)',
                  color: isSel ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                }}
              >
                {isSel ? '✓ Selecionado' : item.badge}
              </span>
            </div>
            <div>
              <div className="text-xs font-black" style={{ color: 'var(--text-foreground)' }}>
                {item.nome}
              </div>
              <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted-foreground)' }}>
                {item.subtitulo}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderStepBody = () => {
    switch (currentStep.id) {
      case 'marca':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-foreground)' }}>
                  Nome da Academia / CT
                </label>
                <input
                  type="text"
                  value={config.academyName}
                  onChange={(e) => updateConfig({ academyName: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm font-bold outline-none"
                  style={{
                    background: 'var(--bg-background)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-foreground)',
                  }}
                  placeholder="Ex: CT Iron Combat"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted-foreground)' }}>
                  Slogan / Subtítulo de Apresentação
                </label>
                <input
                  type="text"
                  value={config.academySlogan}
                  onChange={(e) => updateConfig({ academySlogan: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-xs font-semibold outline-none"
                  style={{
                    background: 'var(--bg-background)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-foreground)',
                  }}
                  placeholder="Ex: Artes Marciais & Alta Performance"
                />
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted-foreground)' }}>
                ⚡ Ou escolha um exemplo pronto em 1 clique:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {ACADEMY_PRESETS.map((p) => (
                  <button
                    key={p.nome}
                    type="button"
                    onClick={() => updateConfig({ academyName: p.nome, academySlogan: p.slogan })}
                    className="text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between"
                    style={{
                      background: config.academyName === p.nome ? 'var(--color-primary-light)' : 'var(--bg-background)',
                      border: config.academyName === p.nome ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      color: 'var(--text-foreground)',
                    }}
                  >
                    <span className="truncate">{p.nome}</span>
                    <span className="text-[10px] opacity-60">Usar →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cor':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
            {THEMES_LIST.map((theme) => {
              const isSel = config.themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    selectTheme(theme.id);
                    if (autoAdvance) setTimeout(() => goNext(), 260);
                  }}
                  className="p-3 rounded-2xl text-left transition cursor-pointer flex items-center gap-3"
                  style={{
                    background: isSel ? 'var(--color-primary-light)' : 'var(--bg-background)',
                    border: isSel ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  }}
                >
                  <span
                    className="w-9 h-9 rounded-xl shrink-0 border border-white/30 shadow-md flex items-center justify-center text-xs font-black text-white"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {isSel ? '✓' : ''}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-black truncate" style={{ color: 'var(--text-foreground)' }}>
                      {theme.name.split(' (')[0]}
                    </div>
                    <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted-foreground)' }}>
                      {theme.mode === 'dark' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'sec_hub':
        return renderYesNoCards(
          config.sections.showHub,
          (v) => handleBinaryChoice('section', 'showHub', v),
          'Sim, adicionar Hub na área principal',
          'Mostra o Hub de acesso rápido com cartões de Unidades, Planos, Check-in e Portais logo no topo.',
          'Não, manter página institucional direta',
          'Remove o bloco de Hub da entrada e foca em uma apresentação institucional limpa.'
        );

      case 'sec_galeria':
        return renderYesNoCards(
          config.sections.showGaleria,
          (v) => handleBinaryChoice('section', 'showGaleria', v),
          'Sim, mostrar Galeria & Estrutura do CT',
          'Exibe fotos reais do espaço, tatames, equipamentos e ambiente de treino.',
          'Não mostrar Galeria agora',
          'Oculta a galeria de fotos da página inicial (pode ser ativada depois).'
        );

      case 'sec_horarios':
        return renderYesNoCards(
          config.sections.showHorarios,
          (v) => handleBinaryChoice('section', 'showHorarios', v),
          'Sim, mostrar Grade de Horários Ao Vivo',
          'Exibe o calendário interativo de aulas com vagas disponíveis em tempo real.',
          'Não mostrar Grade de Horários',
          'Oculta o calendário público da página inicial.'
        );

      case 'sec_modalidades':
        return renderYesNoCards(
          config.sections.showModalidades,
          (v) => handleBinaryChoice('section', 'showModalidades', v),
          'Sim, mostrar Modalidades & Professores',
          'Apresenta todas as artes marciais e a equipe de mestres da academia.',
          'Não mostrar esta seção',
          'Mantém a página mais enxuta sem a vitrine de modalidades e professores.'
        );

      case 'sec_planos':
        return renderYesNoCards(
          config.sections.showPlanos,
          (v) => handleBinaryChoice('section', 'showPlanos', v),
          'Sim, mostrar Planos & Valores no site',
          'Apresenta os planos com valores transparentes e botão de matrícula online.',
          'Não mostrar valores (somente WhatsApp)',
          'Oculta a tabela de preços para negociação direta com a equipe comercial.'
        );

      case 'sec_experimental':
        return renderYesNoCards(
          config.sections.showExperimental,
          (v) => handleBinaryChoice('section', 'showExperimental', v),
          'Sim, ativar Aula Experimental & Check-in Rápido',
          'Inclui captação automática de aulas experimentais e check-in expresso por CPF.',
          'Não ativar na página inicial',
          'Mantém o site apenas informativo sem widgets de agendamento/check-in.'
        );

      case 'sec_faq':
        return renderYesNoCards(
          config.sections.showFaq,
          (v) => handleBinaryChoice('section', 'showFaq', v),
          'Sim, mostrar FAQ & Localização',
          'Exibe perguntas frequentes e endereço/mapa para facilitar a primeira visita.',
          'Não, usar rodapé minimalista',
          'Deixa o encerramento da página mais curto e direto.'
        );

      case 'portal_aluno':
        return renderYesNoCards(
          config.portals.enableStudentPortal,
          (v) => handleBinaryChoice('portal', 'enableStudentPortal', v),
          'Sim, ativar Área do Aluno (/portal)',
          'Cada aluno acessa com CPF e senha para acompanhar treinos, frequência e mensalidade.',
          'Não ativar Área do Aluno',
          'Oculta o botão de Área do Aluno na navegação principal.'
        );

      case 'portal_gamificacao':
        return renderYesNoCards(
          config.portals.enableGamification,
          (v) => handleBinaryChoice('portal', 'enableGamification', v),
          'Sim, ativar Gamificação, Ranking & Torneios',
          'Sistema completo de XP, medalhas, ranking do CT e loja de recompensas em Points.',
          'Não, manter Portal Essencial',
          'Foca apenas em frequência, grade de aulas e controle financeiro do aluno.'
        );

      case 'portal_professor':
        return renderYesNoCards(
          config.portals.enableTeacherPortal,
          (v) => handleBinaryChoice('portal', 'enableTeacherPortal', v),
          'Sim, ativar Portal do Professor (/professor)',
          'Professores fazem chamada no tatame, avaliam alunos e consultam comissões.',
          'Não ativar Portal do Professor',
          'Concentra toda a operação somente no painel administrativo.'
        );

      case 'portal_atendente':
        return renderYesNoCards(
          config.portals.enableAttendantPortal,
          (v) => handleBinaryChoice('portal', 'enableAttendantPortal', v),
          'Sim, ativar Acesso de Atendentes (/atendimento)',
          'Recepcionistas usam o mesmo sistema, mas restrito a matrículas, alunos e check-ins (sem financeiro).',
          'Não ativar perfil de Atendimento',
          'Mantém apenas o acesso de Administrador Master.'
        );

      case 'iface_landing':
        return renderInterfaceGrid(config.interfaces.landing, (opt) =>
          handleInterfaceChoice('landing', opt)
        );

      case 'iface_admin':
        return renderInterfaceGrid(config.interfaces.admin, (opt) =>
          handleInterfaceChoice('admin', opt)
        );

      case 'iface_student':
        return renderInterfaceGrid(config.interfaces.student, (opt) =>
          handleInterfaceChoice('student', opt)
        );

      case 'resumo': {
        const activeSectionsCount = Object.values(config.sections).filter(Boolean).length;
        const activePortalsCount = Object.values(config.portals).filter(Boolean).length + 1; // +1 Admin
        return (
          <div className="space-y-4">
            <div
              className="p-4 rounded-2xl space-y-2.5"
              style={{
                background: 'var(--bg-background)',
                border: '1px solid var(--color-primary-border)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                  📋 Blueprint Montado Pelo Cliente
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  100% Configurado
                </span>
              </div>
              <div className="text-sm font-black" style={{ color: 'var(--text-foreground)' }}>
                {config.academyName}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]" style={{ color: 'var(--text-muted-foreground)' }}>
                <div>
                  Blocos na Home: <strong style={{ color: 'var(--text-foreground)' }}>{activeSectionsCount}/7 ativos</strong>
                </div>
                <div>
                  Portais Ativos: <strong style={{ color: 'var(--text-foreground)' }}>{activePortalsCount} acessos</strong>
                </div>
                <div>
                  Interface Site: <strong style={{ color: 'var(--color-primary)' }}>{config.interfaces.landing}</strong>
                </div>
                <div>
                  Interface Admin: <strong style={{ color: 'var(--color-primary)' }}>{config.interfaces.admin}</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  border: 'none',
                }}
              >
                🚀 Abrir Meu Site Montado
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer"
                style={{
                  background: 'var(--bg-background)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                👑 Abrir Painel Admin
              </button>
              {config.portals.enableAttendantPortal && (
                <button
                  type="button"
                  onClick={() => navigate('/atendimento')}
                  className="py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer"
                  style={{
                    background: 'rgba(6, 182, 212, 0.14)',
                    color: '#22d3ee',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                  }}
                >
                  🎧 Abrir Atendimento
                </button>
              )}
              {config.portals.enableStudentPortal && (
                <button
                  type="button"
                  onClick={() => navigate('/portal')}
                  className="py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer"
                  style={{
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  🥊 Abrir Portal Aluno
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                type="button"
                onClick={handleExportConfigJson}
                className="px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer"
                style={{
                  background: 'var(--bg-background)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                📥 Exportar Proposta (.JSON)
              </button>
              <button
                type="button"
                onClick={() => {
                  resetBuilder();
                  setStepIdx(0);
                }}
                className="px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer text-red-400"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(239,68,68,0.35)',
                }}
              >
                🔄 Nova Apresentação
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // =========================================================================
  // PREVIEW AO VIVO INTERATIVO (REAGE EM TEMPO REAL A CADA CLIQUE DO CLIENTE)
  // =========================================================================
  const renderLivePreview = () => {
    const activeIface =
      previewScreen === 'admin' || previewScreen === 'atendimento'
        ? config.interfaces.admin
        : previewScreen === 'aluno'
        ? config.interfaces.student
        : config.interfaces.landing;

    const isSplitOrSidebar = ['escolar', 'split_screen', 'command_center'].includes(activeIface);
    const isB2B = activeIface === 'b2b_0px';
    const cardRadius = isB2B ? '2px' : activeIface === 'super_app' ? '22px' : '14px';

    if (previewScreen === 'admin' || previewScreen === 'atendimento') {
      const isAtend = previewScreen === 'atendimento';
      const menuItems = isAtend
        ? [
            '👥 Alunos & Matrícula',
            '🎯 Leads & Experimentais',
            '✅ Check-ins & Chamada',
            '📅 Grade & Horários',
            '🔥 Ocupação de Turmas',
            '🎟️ Vouchers Recepção',
            '📢 Mural de Avisos',
          ]
        : [
            '👥 Alunos (Visão 360)',
            '✅ Chamada & Frequência',
            '💰 Gestão Financeira',
            '💵 Caixa Diário (PDV)',
            '🥋 Comissões Professores',
            '🔥 Ocupação de Turmas',
            '🎯 Leads & Aulas Exp.',
            '👑 Professores & Equipe',
            '🎨 Estúdio & Layouts',
          ];

      return (
        <div
          className="h-full flex flex-col overflow-hidden"
          style={{ background: 'var(--bg-background)', color: 'var(--text-foreground)' }}
        >
          {/* Barra superior do Painel */}
          <div
            className="px-4 py-3 flex items-center justify-between border-b shrink-0"
            style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-8 h-8 flex items-center justify-center text-sm font-black shrink-0"
                style={{
                  borderRadius: cardRadius,
                  background: isAtend ? '#0891b2' : 'var(--color-primary)',
                  color: '#fff',
                }}
              >
                {isAtend ? '🎧' : '👑'}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-black truncate">{config.academyName}</div>
                <div className="text-[10px] font-bold" style={{ color: isAtend ? '#22d3ee' : 'var(--color-primary)' }}>
                  {isAtend
                    ? 'PAINEL DE ATENDIMENTO (SEM FINANCEIRO)'
                    : `PAINEL ADMIN ERP • INTERFACE: ${activeIface.toUpperCase()}`}
                </div>
              </div>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 uppercase"
              style={{
                borderRadius: cardRadius,
                background: isAtend ? '#0891b2' : 'var(--color-primary)',
                color: '#fff',
              }}
            >
              + Nova Matrícula
            </span>
          </div>

          <div className={`flex-1 flex overflow-hidden ${isSplitOrSidebar ? 'flex-row' : 'flex-col'}`}>
            {/* Menu lateral ou horizontal conforme a interface escolhida */}
            {isSplitOrSidebar ? (
              <div
                className="w-44 p-3 border-r space-y-1.5 overflow-y-auto shrink-0"
                style={{
                  background: activeIface === 'split_screen' ? 'rgba(49, 46, 129, 0.25)' : 'var(--bg-surface-1)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="text-[9px] font-black uppercase tracking-wider opacity-60 px-2 pb-1">
                  {isAtend ? 'Acesso Restrito' : 'Menu Principal'}
                </div>
                {menuItems.map((m, i) => (
                  <div
                    key={m}
                    className="px-2.5 py-1.5 text-[11px] font-bold truncate"
                    style={{
                      borderRadius: cardRadius,
                      background: i === 0 ? (isAtend ? 'rgba(6,182,212,0.2)' : 'var(--color-primary-light)') : 'transparent',
                      color: i === 0 ? (isAtend ? '#22d3ee' : 'var(--color-primary)') : 'var(--text-foreground)',
                      border: i === 0 ? `1px solid ${isAtend ? '#06b6d4' : 'var(--color-primary)'}` : '1px solid transparent',
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="px-3 py-2 border-b flex items-center gap-1.5 overflow-x-auto shrink-0"
                style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)' }}
              >
                {menuItems.map((m, i) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 text-[10px] font-bold whitespace-nowrap"
                    style={{
                      borderRadius: cardRadius,
                      background: i === 0 ? (isAtend ? '#0891b2' : 'var(--color-primary)') : 'var(--bg-background)',
                      color: i === 0 ? '#fff' : 'var(--text-muted-foreground)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}

            {/* Corpo do Painel Preview */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { l: 'Alunos Ativos', v: '148', c: 'var(--color-primary)' },
                  { l: 'Check-ins Hoje', v: '42', c: '#10b981' },
                  { l: isAtend ? 'Leads Exp.' : 'Receita Mês', v: isAtend ? '9' : 'R$ 24.800', c: '#f59e0b' },
                ].map((k) => (
                  <div
                    key={k.l}
                    className="p-3"
                    style={{
                      borderRadius: cardRadius,
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="text-[9px] font-bold uppercase opacity-70">{k.l}</div>
                    <div className="text-lg font-black mt-0.5" style={{ color: k.c }}>
                      {k.v}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="p-3.5 space-y-2"
                style={{
                  borderRadius: cardRadius,
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="text-xs font-black">
                  {isAtend ? '🎧 Fila de Atendimento, Matrículas & Check-ins' : '👥 Gestão de Alunos & Operação'}
                </div>
                {['Lucas Almeida • Muay Thai 3x • Check-in OK', 'Mariana Silva • Aula Experimental • Matricular', 'Rafael Costa • Jiu-Jitsu • Em Dia'].map((row) => (
                  <div
                    key={row}
                    className="px-3 py-2 text-[11px] flex items-center justify-between"
                    style={{
                      borderRadius: cardRadius,
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span className="font-semibold truncate">{row}</span>
                    <span className="text-[10px] font-black" style={{ color: 'var(--color-primary)' }}>
                      Abrir →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (previewScreen === 'aluno') {
      return (
        <div
          className="h-full flex flex-col overflow-y-auto p-4 space-y-3"
          style={{ background: 'var(--bg-background)', color: 'var(--text-foreground)' }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{
              borderRadius: cardRadius,
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--color-primary-border)',
            }}
          >
            <div>
              <span className="text-[10px] font-black uppercase" style={{ color: 'var(--color-primary)' }}>
                🥊 Portal do Aluno • Interface {config.interfaces.student.toUpperCase()}
              </span>
              <div className="text-sm font-black mt-0.5">Olá, Guerreiro! • {config.academyName}</div>
            </div>
            <span
              className="px-2.5 py-1 text-[10px] font-black"
              style={{
                borderRadius: cardRadius,
                background: config.portals.enableStudentPortal ? '#10b981' : '#ef4444',
                color: '#fff',
              }}
            >
              {config.portals.enableStudentPortal ? 'Portal Ativo' : 'Portal Desativado'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div
              className="p-3.5"
              style={{ borderRadius: cardRadius, background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-black">✅ Check-in de Treino</div>
              <p className="text-[10px] opacity-70 mt-1">Reserve sua vaga no tatame em 1 clique.</p>
            </div>
            <div
              className="p-3.5"
              style={{ borderRadius: cardRadius, background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-black">📅 Minha Frequência</div>
              <p className="text-[10px] opacity-70 mt-1">Acompanhe presenças e graduação.</p>
            </div>
            {config.portals.enableGamification && (
              <>
                <div
                  className="p-3.5"
                  style={{ borderRadius: cardRadius, background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)' }}
                >
                  <div className="text-xs font-black" style={{ color: 'var(--color-primary)' }}>
                    🏆 Gamificação & Ranking
                  </div>
                  <p className="text-[10px] opacity-80 mt-1">Nível 12 • 1.450 XP • Top 3 do CT</p>
                </div>
                <div
                  className="p-3.5"
                  style={{ borderRadius: cardRadius, background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)' }}
                >
                  <div className="text-xs font-black" style={{ color: 'var(--color-primary)' }}>
                    🪙 Loja de Points & Torneios
                  </div>
                  <p className="text-[10px] opacity-80 mt-1">Troque pontos por luvas, kimonos e chaves.</p>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    // PREVIEW DO SITE PRINCIPAL (HOME)
    return (
      <div
        className="h-full overflow-y-auto"
        style={{ background: 'var(--bg-background)', color: 'var(--text-foreground)' }}
      >
        {/* Topbar do Site */}
        <div
          className="px-4 py-3 border-b flex items-center justify-between gap-2 sticky top-0 z-10 backdrop-blur-md"
          style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-7 h-7 flex items-center justify-center text-xs font-black shrink-0"
              style={{ borderRadius: cardRadius, background: 'var(--color-primary)', color: '#fff' }}
            >
              🥊
            </span>
            <span className="text-xs font-black truncate">{config.academyName}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {config.portals.enableStudentPortal && (
              <span className="text-[9px] font-bold px-2 py-1 rounded-md border" style={{ borderColor: 'var(--border-subtle)' }}>
                Aluno
              </span>
            )}
            {config.portals.enableTeacherPortal && (
              <span className="text-[9px] font-bold px-2 py-1 rounded-md border" style={{ borderColor: 'var(--border-subtle)' }}>
                Professor
              </span>
            )}
            {config.portals.enableAttendantPortal && (
              <span className="text-[9px] font-bold px-2 py-1 rounded-md border border-cyan-500/40 text-cyan-400">
                Atendimento
              </span>
            )}
            <span
              className="text-[9px] font-black px-2 py-1 rounded-md"
              style={{ background: 'var(--color-primary)', color: 'var(--text-primary-foreground)' }}
            >
              Admin
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3.5">
          {/* Hero */}
          <div
            className="p-5 relative overflow-hidden"
            style={{
              borderRadius: cardRadius,
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--color-primary-border)',
            }}
          >
            <span
              className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-2"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              Interface: {config.interfaces.landing.toUpperCase()}
            </span>
            <h2 className="text-lg font-black leading-tight">{config.academyName}</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted-foreground)' }}>
              {config.academySlogan}
            </p>
            {config.sections.showExperimental && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span
                  className="px-3 py-1.5 text-[10px] font-black uppercase"
                  style={{
                    borderRadius: cardRadius,
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                  }}
                >
                  🔥 Agendar Aula Experimental
                </span>
                <span
                  className="px-3 py-1.5 text-[10px] font-bold border"
                  style={{ borderRadius: cardRadius, borderColor: 'var(--border-subtle)' }}
                >
                  ⚡ Check-in Rápido
                </span>
              </div>
            )}
          </div>

          {/* Bloco 1: Hub na Área Principal */}
          {config.sections.showHub && (
            <div
              className="p-3.5 space-y-2"
              style={{
                borderRadius: cardRadius,
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                🧭 Hub de Acesso Rápido na Área Principal
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['📍 Unidades', '💳 Planos', '🥋 Portais'].map((item) => (
                  <div
                    key={item}
                    className="p-2 text-center text-[10px] font-bold"
                    style={{
                      borderRadius: cardRadius,
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bloco 2: Galeria */}
          {config.sections.showGaleria && (
            <div
              className="p-3.5 space-y-2"
              style={{
                borderRadius: cardRadius,
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-[11px] font-black">📸 Galeria de Fotos & Estrutura do CT</div>
              <div className="grid grid-cols-3 gap-2">
                {['Tatame Olímpico', 'Ringue & Sacos', 'Climatização'].map((foto) => (
                  <div
                    key={foto}
                    className="h-14 flex items-center justify-center text-[10px] font-bold text-center px-1"
                    style={{
                      borderRadius: cardRadius,
                      background: 'var(--color-primary-light)',
                      border: '1px solid var(--color-primary-border)',
                    }}
                  >
                    {foto}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bloco 3: Grade de Horários */}
          {config.sections.showHorarios && (
            <div
              className="p-3.5 flex items-center justify-between"
              style={{
                borderRadius: cardRadius,
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div className="text-[11px] font-black">📅 Grade de Horários Ao Vivo</div>
                <div className="text-[10px] opacity-70">Seg a Sáb • Manhã, Tarde e Noite • Vagas em tempo real</div>
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
                Ao Vivo
              </span>
            </div>
          )}

          {/* Bloco 4: Modalidades & Professores */}
          {config.sections.showModalidades && (
            <div
              className="p-3.5 space-y-1.5"
              style={{
                borderRadius: cardRadius,
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-[11px] font-black">🥋 Modalidades & Corpo Docente</div>
              <div className="flex flex-wrap gap-1.5">
                {['Muay Thai', 'Jiu-Jitsu', 'Boxe', 'MMA', 'Kids'].map((mod) => (
                  <span
                    key={mod}
                    className="px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      borderRadius: cardRadius,
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bloco 5: Planos & Preços */}
          {config.sections.showPlanos && (
            <div
              className="p-3.5 space-y-2"
              style={{
                borderRadius: cardRadius,
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-[11px] font-black">💳 Tabela de Planos & Matrícula</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { n: '2x Semana', p: 'R$ 130' },
                  { n: '3x Semana', p: 'R$ 160' },
                  { n: 'Ilimitado', p: 'R$ 240' },
                ].map((pl) => (
                  <div
                    key={pl.n}
                    className="p-2"
                    style={{
                      borderRadius: cardRadius,
                      background: 'var(--bg-background)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="text-[10px] font-bold">{pl.n}</div>
                    <div className="text-xs font-black" style={{ color: 'var(--color-primary)' }}>
                      {pl.p}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bloco 6: FAQ & Localização */}
          {config.sections.showFaq && (
            <div
              className="p-3 text-[10px] flex items-center justify-between"
              style={{
                borderRadius: cardRadius,
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted-foreground)',
              }}
            >
              <span>❓ Perguntas Frequentes (FAQ) • 📍 Mapa & Localização da Unidade</span>
              <span className="font-bold">Ativo ✓</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col font-sans"
      style={{ background: 'var(--bg-background)', color: 'var(--text-foreground)' }}
    >
      {/* CABEÇALHO FORMAL DO CONSTRUTOR */}
      <header
        className="px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 backdrop-blur-md"
        style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black shadow"
            style={{ background: 'var(--color-primary)', color: 'var(--text-primary-foreground)' }}
          >
            ✨
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
              COMBAT-PASS • APRESENTAÇÃO INTERATIVA PARA CLIENTES
            </div>
            <h1 className="text-sm sm:text-base font-black leading-tight">
              Construtor Guiado Passo a Passo (1 Opção por Vez)
            </h1>
          </div>
        </div>

        {/* Barra de Fases */}
        <div className="hidden xl:flex items-center gap-1.5">
          {[
            { n: 1, l: '1. Marca & Cor', idx: 0 },
            { n: 2, l: '2. Site Principal', idx: 2 },
            { n: 3, l: '3. Portais', idx: 9 },
            { n: 4, l: '4. Interfaces', idx: 13 },
            { n: 5, l: '5. Entrega', idx: 16 },
          ].map((f) => {
            const ativo = currentStep.fase === f.n;
            const concluido = currentStep.fase > f.n;
            return (
              <button
                key={f.n}
                type="button"
                onClick={() => setStepIdx(f.idx)}
                className="px-2.5 py-1 rounded-full text-[11px] font-black transition cursor-pointer"
                style={{
                  background: ativo
                    ? 'var(--color-primary)'
                    : concluido
                    ? 'var(--color-primary-light)'
                    : 'var(--bg-background)',
                  color: ativo
                    ? 'var(--text-primary-foreground)'
                    : concluido
                    ? 'var(--color-primary)'
                    : 'var(--text-muted-foreground)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {concluido ? '✓ ' : ''}
                {f.l}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold cursor-pointer px-2.5 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="accent-red-600"
            />
            <span>Avanço em 1 clique</span>
          </label>
          <Link
            to="/"
            className="px-3 py-1.5 rounded-xl text-xs font-bold border transition"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-foreground)' }}
          >
            🌐 Ver Site
          </Link>
        </div>
      </header>

      {/* CORPO SPLIT-SCREEN: ESQUERDA (ASSISTENTE 1 OPÇÃO POR VEZ) | DIREITA (PREVIEW AO VIVO) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-6 max-w-[1520px] w-full mx-auto">
        {/* COLUNA ESQUERDA: ASSISTENTE GUIADO */}
        <section
          className="lg:col-span-5 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-xl"
          style={{
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="space-y-5">
            {/* Progresso */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                <span style={{ color: 'var(--color-primary)' }}>{currentStep.faseLabel}</span>
                <span style={{ color: 'var(--text-muted-foreground)' }}>
                  Passo {stepIdx + 1} de {WIZARD_STEPS.length} ({progressPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-background)' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%`, background: 'var(--color-primary)' }}
                />
              </div>
            </div>

            {/* Pergunta Única da Etapa */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black leading-snug" style={{ color: 'var(--text-foreground)' }}>
                {currentStep.titulo}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted-foreground)' }}>
                {currentStep.descricao}
              </p>
            </div>

            {/* Opções de 1 Clique */}
            <div>{renderStepBody()}</div>
          </div>

          {/* Rodapé de Navegação Voltar / Avançar */}
          <div
            className="pt-4 border-t flex items-center justify-between gap-3"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <button
              type="button"
              disabled={stepIdx === 0}
              onClick={goPrev}
              className="px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-35"
              style={{
                background: 'var(--bg-background)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              ← Voltar
            </button>

            {stepIdx < WIZARD_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  border: 'none',
                }}
              >
                Próximo Passo →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md"
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                }}
              >
                🚀 Concluir & Abrir Site
              </button>
            )}
          </div>
        </section>

        {/* COLUNA DIREITA: PREVIEW AO VIVO EM TEMPO REAL */}
        <section
          className="lg:col-span-7 rounded-3xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-xl min-h-[560px]"
          style={{
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Controles do Preview */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'site' as const, label: '🌐 Site Principal' },
                { id: 'admin' as const, label: '👑 Admin' },
                { id: 'atendimento' as const, label: '🎧 Atendimento' },
                { id: 'aluno' as const, label: '🥊 Aluno' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPreviewScreen(t.id)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer"
                  style={{
                    background: previewScreen === t.id ? 'var(--color-primary)' : 'var(--bg-background)',
                    color: previewScreen === t.id ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ background: 'var(--bg-background)', borderColor: 'var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer"
                style={{
                  background: previewDevice === 'desktop' ? 'var(--bg-surface-1)' : 'transparent',
                  color: previewDevice === 'desktop' ? 'var(--text-foreground)' : 'var(--text-muted-foreground)',
                }}
              >
                🖥️ Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer"
                style={{
                  background: previewDevice === 'mobile' ? 'var(--bg-surface-1)' : 'transparent',
                  color: previewDevice === 'mobile' ? 'var(--text-foreground)' : 'var(--text-muted-foreground)',
                }}
              >
                📱 Celular
              </button>
            </div>
          </div>

          {/* Moldura do Navegador / Celular Ao Vivo */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div
              className="h-full max-h-[620px] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border"
              style={{
                width: previewDevice === 'mobile' ? '375px' : '100%',
                borderColor: 'var(--border-subtle)',
                background: 'var(--bg-background)',
              }}
            >
              {/* Barra de URL simulada */}
              <div
                className="px-3 py-2 border-b flex items-center gap-2 shrink-0"
                style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div
                  className="flex-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono truncate"
                  style={{ background: 'var(--bg-background)', color: 'var(--text-muted-foreground)' }}
                >
                  https://combatpass.app/{previewScreen === 'site' ? '' : previewScreen === 'aluno' ? 'portal' : previewScreen}
                </div>
                <span className="text-[9px] font-black text-emerald-400 uppercase">Ao Vivo</span>
              </div>

              <div className="flex-1 overflow-hidden">{renderLivePreview()}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
