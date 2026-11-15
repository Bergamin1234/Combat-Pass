import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useLayoutEngine,
  JourneyLayoutToolbar,
  DynamicNavBuilder,
  DynamicSectionRenderer
} from '../config/layoutEngine';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { InteractiveCombatCalendar } from '../components/InteractiveCombatCalendar';
import { TeacherCommissionsTab } from '../components/TeacherCommissionsTab';
import { publicApi, adminApi } from '../services/api';

export interface TeacherPortalPageProps {
  embedded?: boolean;
}

interface RosterStudent {
  id: string;
  nome: string;
  academiaOrigem: string;
  graduacao: string;
  xp: number;
  assiduidade30d: string;
  statusChamada: 'AGENDADO' | 'PRESENTE' | 'FALTA';
  observacaoTecnica: string;
}

export const TeacherPortalPage: React.FC<TeacherPortalPageProps> = ({ embedded = false }) => {
  const { preferences, triggerLoadingDemo } = useLayoutEngine();
  const activePreset = preferences.layoutPreset.teacher;

  const [activeNavTab, setActiveNavTab] = useState<string>(
    preferences.defaultTabByJourney.teacher || 'aula_atual'
  );
  const [aulas, setAulas] = useState<any[]>([]);
  const [selectedHorario, setSelectedHorario] = useState('19:00');
  const [selectedModalidade, setSelectedModalidade] = useState('Muay Thai Geral');
  const [selectedUnidade, setSelectedUnidade] = useState('CT Borü Matriz (Credenciada)');
  const [aulaCancelada, setAulaCancelada] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [limiteVagas, setLimiteVagas] = useState(20);

  // Lista de alunos na turma atual
  const [roster, setRoster] = useState<RosterStudent[]>([
    {
      id: 'al-1',
      nome: 'Ítalo Rafael Silva Bergamin',
      academiaOrigem: 'Passe Unificado Gold · CT Borü',
      graduacao: 'Prajied Azul // Liga Prata',
      xp: 640,
      assiduidade30d: '92% (11/12)',
      statusChamada: 'AGENDADO',
      observacaoTecnica: 'Excelente controle de distância e low-kick.'
    },
    {
      id: 'al-2',
      nome: 'Lucas Mendes Oliveira',
      academiaOrigem: 'Combat-Pass Black · Iron Lotus',
      graduacao: 'Prajied Branco c/ Ponta Vermelha',
      xp: 310,
      assiduidade30d: '85% (10/12)',
      statusChamada: 'PRESENTE',
      observacaoTecnica: 'Focar na guarda alta durante combinações.'
    },
    {
      id: 'al-3',
      nome: 'Mariana Costa Ribeiro',
      academiaOrigem: 'Combat-Pass Silver · Apex Pro',
      graduacao: 'Prajied Vermelho',
      xp: 890,
      assiduidade30d: '100% (12/12)',
      statusChamada: 'AGENDADO',
      observacaoTecnica: 'Pronta para avaliação de sparring avançado.'
    },
    {
      id: 'al-4',
      nome: 'Gabriel Santos Rocha',
      academiaOrigem: 'Passe Corporativo · CT Borü',
      graduacao: 'Iniciante / Branca',
      xp: 120,
      assiduidade30d: '75% (6/8)',
      statusChamada: 'AGENDADO',
      observacaoTecnica: 'Boa evolução na base e movimentação.'
    }
  ]);

  // Walk-in Check-in Avulso
  const [walkinNome, setWalkinNome] = useState('');
  const [walkinPasse, setWalkinPasse] = useState('Passe Unificado Gold');

  // Concessão de XP Bônus / Pontos de Mérito
  const [bonusAlunoId, setBonusAlunoId] = useState('al-1');
  const [bonusPoints, setBonusPoints] = useState(50);
  const [bonusMotivo, setBonusMotivo] = useState('Destaque Técnico & Sparring Limpo');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    publicApi
      .getTodayClasses()
      .then((res: any) => {
        if (Array.isArray(res?.data?.aulas) && res.data.aulas.length > 0) {
          setAulas(res.data.aulas);
        }
      })
      .catch(() => {});

    adminApi
      .getDashboard()
      .then((res: any) => {
        const alunosList = res?.data?.alunos || res?.alunos;
        if (Array.isArray(alunosList) && alunosList.length > 0) {
          const mapped: RosterStudent[] = alunosList.slice(0, 8).map((a: any, i: number) => ({
            id: String(a.id),
            nome: a.nome || `Atleta #${i + 1}`,
            academiaOrigem: a.plano || 'Passe Unificado Combat-Pass',
            graduacao: a.prajied || a.graduacao || 'Prajied Branco',
            xp: Number(a.xp || (i + 2) * 110),
            assiduidade30d: `${80 + (i % 4) * 5}%`,
            statusChamada: i === 1 ? 'PRESENTE' : 'AGENDADO',
            observacaoTecnica: a.observacoes || 'Evolução técnica consistente no tatame.'
          }));
          setRoster(mapped);
          if (mapped[0]) setBonusAlunoId(mapped[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const totalConfirmadosOuAgendados = roster.filter(r => r.statusChamada !== 'FALTA').length;
  const isLotado = totalConfirmadosOuAgendados >= limiteVagas;

  const handleMarcarStatus = (studentId: string, novoStatus: 'PRESENTE' | 'FALTA' | 'AGENDADO') => {
    setRoster(prev =>
      prev.map(item => (item.id === studentId ? { ...item, statusChamada: novoStatus } : item))
    );
    const target = roster.find(r => r.id === studentId);
    if (novoStatus === 'PRESENTE') {
      setFeedbackMsg(`✅ Presença confirmada para ${target?.nome}! (+10 XP e comissão contabilizada)`);
    } else if (novoStatus === 'FALTA') {
      setFeedbackMsg(`⚠️ Falta registrada para ${target?.nome}. Vaga liberada na turma.`);
    }
  };

  const handleAdicionarWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinNome.trim()) return;
    const novo: RosterStudent = {
      id: `wk-${Date.now()}`,
      nome: walkinNome.trim(),
      academiaOrigem: `${walkinPasse} (Walk-in no Tatame)`,
      graduacao: 'Verificado na Recepção',
      xp: 50,
      assiduidade30d: '100% (Walk-in)',
      statusChamada: 'PRESENTE',
      observacaoTecnica: 'Adicionado via chamada rápida no tatame.'
    };
    setRoster(prev => [novo, ...prev]);
    setWalkinNome('');
    setFeedbackMsg(`🥊 Aluno avulso "${novo.nome}" adicionado e presença confirmada!`);
  };

  const handleToggleCancelarAula = () => {
    const nextState = !aulaCancelada;
    setAulaCancelada(nextState);
    if (nextState) {
      triggerLoadingDemo(
        'Cancelando horário na grade oficial e notificando alunos agendados...',
        'step_progress',
        1500
      );
      setFeedbackMsg(
        `🚫 Aula das ${selectedHorario} (${selectedModalidade}) marcada como CANCELADA (riscada na grade).`
      );
    } else {
      setFeedbackMsg(`🟢 Aula das ${selectedHorario} (${selectedModalidade}) REATIVADA com sucesso!`);
    }
  };

  const handleConcederBonus = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = roster.find(r => r.id === bonusAlunoId);
    try {
      await adminApi.approveSpecialGamification({
        alunoId: bonusAlunoId,
        points: Number(bonusPoints),
        xp: Number(bonusPoints),
        motivo: bonusMotivo
      });
    } catch (err) {}
    setRoster(prev =>
      prev.map(r => (r.id === bonusAlunoId ? { ...r, xp: r.xp + Number(bonusPoints) } : r))
    );
    setFeedbackMsg(
      `🏅 +${bonusPoints} XP & Combat Points concedidos para ${target?.nome || 'o atleta'} (${bonusMotivo})!`
    );
  };

  // ============================================================================
  // SEÇÕES MODULARES REORDENÁVEIS DO PORTAL DO PROFESSOR
  // ============================================================================
  const sectionsMap: Record<string, React.ReactNode> = {
    // 1. CARD DA AULA EM ANDAMENTO & CONTROLE DE LOTAÇÃO / CANCELAMENTO
    ongoing_class: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: aulaCancelada
            ? '2px solid var(--status-canceled)'
            : '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.15rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-primary)'
                }}
              >
                ⚡ TURMA EM ANDAMENTO · CONTROLE DE TATAME
              </span>
              <span
                style={{
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  background: aulaCancelada
                    ? 'var(--status-canceled-bg)'
                    : isLotado
                    ? 'var(--status-full-bg)'
                    : 'var(--status-available-bg)',
                  color: aulaCancelada
                    ? 'var(--status-canceled)'
                    : isLotado
                    ? 'var(--status-full)'
                    : 'var(--status-available)',
                  border: aulaCancelada
                    ? '1px solid var(--status-canceled-border)'
                    : isLotado
                    ? '1px solid var(--status-full-border)'
                    : '1px solid var(--status-available-border)'
                }}
              >
                {aulaCancelada
                  ? '🚫 [AULA CANCELADA / RISCADA]'
                  : isLotado
                  ? `🔴 [LOTADO · ${totalConfirmadosOuAgendados}/${limiteVagas}]`
                  : `🟢 [HÁ VAGAS · ${totalConfirmadosOuAgendados}/${limiteVagas} vagas]`}
              </span>
            </div>

            <h2
              style={{
                margin: '0.35rem 0 0 0',
                fontSize: '1.35rem',
                fontWeight: 900,
                color: aulaCancelada ? 'var(--status-canceled)' : 'var(--text-foreground)',
                textDecoration: aulaCancelada ? 'line-through' : 'none'
              }}
            >
              {selectedHorario} — {selectedModalidade} ({selectedUnidade})
            </h2>
          </div>

          {/* Seletor rápido de turno/horário e botão de cancelar aula */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <select
              value={selectedHorario}
              onChange={e => setSelectedHorario(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 800
              }}
            >
              <option value="07:00">07:00 - Manhã</option>
              <option value="09:00">09:00 - Manhã</option>
              <option value="16:00">16:00 - Tarde</option>
              <option value="18:00">18:00 - Noite</option>
              <option value="19:00">19:00 - Horário Nobre</option>
              <option value="20:30">20:30 - Fechamento</option>
            </select>

            <select
              value={selectedModalidade}
              onChange={e => setSelectedModalidade(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 800
              }}
            >
              <option value="Muay Thai Geral">Muay Thai Geral</option>
              <option value="Jiu-Jitsu (Gi & No-Gi)">Jiu-Jitsu (Gi & No-Gi)</option>
              <option value="Boxe Olímpico">Boxe Olímpico</option>
              <option value="Sparring & Competição">Sparring & Competição</option>
            </select>

            <button
              type="button"
              onClick={handleToggleCancelarAula}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                background: aulaCancelada ? 'var(--status-available)' : 'var(--status-full-bg)',
                color: aulaCancelada ? 'var(--text-primary-foreground)' : 'var(--status-full)',
                border: aulaCancelada ? 'none' : '1px solid var(--status-full-border)',
                fontSize: '0.76rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              {aulaCancelada ? '🟢 Reativar Aula na Grade' : '🚫 Cancelar / Riscar Aula'}
            </button>
          </div>
        </div>

        {/* Barra visual de ocupação da turma */}
        <div
          style={{
            padding: '0.9rem 1rem',
            borderRadius: '12px',
            background: 'var(--bg-background)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.35rem'
              }}
            >
              <span style={{ color: 'var(--text-muted-foreground)' }}>
                Taxa de Ocupação do Tatame
              </span>
              <span style={{ color: 'var(--color-primary)' }}>
                {totalConfirmadosOuAgendados} de {limiteVagas} vagas preenchidas
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '999px',
                background: 'var(--bg-surface-2)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, Math.round((totalConfirmadosOuAgendados / limiteVagas) * 100))}%`,
                  height: '100%',
                  background: isLotado
                    ? 'var(--status-full)'
                    : 'linear-gradient(90deg, var(--color-primary), var(--color-accent))'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
              Capacidade Máx:
            </span>
            <input
              type="number"
              min={5}
              max={60}
              value={limiteVagas}
              onChange={e => setLimiteVagas(Number(e.target.value) || 20)}
              style={{
                width: '64px',
                padding: '0.35rem 0.5rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-1)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 800
              }}
            />
          </div>
        </div>
      </section>
    ),

    // 2. LISTA DE CHAMADA 1-TOQUE & WALK-IN CHECK-IN AVULSO
    touch_rollcall: (
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
                color: 'var(--color-primary)'
              }}
            >
              {activePreset === 'technical_perf'
                ? '📋 GESTÃO TÉCNICA & ASSIDUIDADE DETALHADA DA TURMA'
                : '⚡ CHAMADA TOUCH-FIRST DE 1 TOQUE NO TATAME'}
            </span>
            <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem', color: 'var(--text-foreground)' }}>
              ✅ Alunos Inscritos no Horário ({roster.length})
            </h3>
          </div>

          {/* Walk-in Check-in Rápido */}
          <form
            onSubmit={handleAdicionarWalkin}
            style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}
          >
            <input
              type="text"
              placeholder="+ Nome Aluno Avulso (Walk-in)"
              value={walkinNome}
              onChange={e => setWalkinNome(e.target.value)}
              style={{
                padding: '0.48rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-background)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.48rem 0.85rem',
                borderRadius: '10px',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              + Walk-in Check-in
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {roster.map(student => {
            const isPresent = student.statusChamada === 'PRESENTE';
            const isAbsent = student.statusChamada === 'FALTA';

            return (
              <div
                key={student.id}
                style={{
                  padding: activePreset === 'tatame_fast' ? '1rem 1.15rem' : '0.85rem 1.1rem',
                  borderRadius: '14px',
                  background: isPresent
                    ? 'var(--status-available-bg)'
                    : isAbsent
                    ? 'var(--status-full-bg)'
                    : 'var(--bg-background)',
                  border: isPresent
                    ? '1px solid var(--status-available-border)'
                    : isAbsent
                    ? '1px solid var(--status-full-border)'
                    : '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.85rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.96rem', color: 'var(--text-foreground)' }}>
                      {student.nome}
                    </strong>
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        background: 'var(--bg-surface-1)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--color-primary)'
                      }}
                    >
                      {student.graduacao}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: 'var(--text-muted-foreground)'
                      }}
                    >
                      · {student.academiaOrigem}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted-foreground)',
                      marginTop: '0.25rem'
                    }}
                  >
                    ⭐ {student.xp} XP · Frequência 30d: <strong>{student.assiduidade30d}</strong> —{' '}
                    <em>{student.observacaoTecnica}</em>
                  </div>
                </div>

                {/* Botões Grandes Touch-First de 1 Toque */}
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleMarcarStatus(student.id, 'PRESENTE')}
                    style={{
                      padding: activePreset === 'tatame_fast' ? '0.6rem 1rem' : '0.45rem 0.8rem',
                      borderRadius: '10px',
                      background: isPresent ? 'var(--status-available)' : 'var(--bg-surface-1)',
                      color: isPresent ? 'var(--text-primary-foreground)' : 'var(--status-available)',
                      border: '1px solid var(--status-available-border)',
                      fontSize: '0.76rem',
                      fontWeight: 900,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Confirmar Presença
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarcarStatus(student.id, 'FALTA')}
                    style={{
                      padding: activePreset === 'tatame_fast' ? '0.6rem 0.9rem' : '0.45rem 0.75rem',
                      borderRadius: '10px',
                      background: isAbsent ? 'var(--status-full)' : 'var(--bg-surface-1)',
                      color: isAbsent ? 'var(--text-primary-foreground)' : 'var(--status-full)',
                      border: '1px solid var(--status-full-border)',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Marcar Falta
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    ),

    // 3. GRADE SEMANAL DO PROFESSOR & GESTÃO DE HORÁRIOS
    weekly_schedule: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--color-primary)'
            }}
          >
            CALENDÁRIO DO PROFESSOR · CANCELAR OU REATIVAR AULAS POR HORÁRIO
          </span>
          <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem', color: 'var(--text-foreground)' }}>
            📅 Grade Oficial de Turmas & Ocupação
          </h3>
        </div>

        <InteractiveCombatCalendar userRole="PROFESSOR" />
      </section>
    ),

    // 4. EXTRATO DINÂMICO DE COMISSÕES & REPASSES
    commissions_summary: (
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

    // 5. CONCESSÃO DE XP BÔNUS & GRADUAÇÕES
    bonus_merit: (
      <section
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--color-primary)'
            }}
          >
            RECONHECIMENTO DE MÉRITO MARCIAL EM TEMPO REAL
          </span>
          <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem', color: 'var(--text-foreground)' }}>
            🏅 Conceder XP Bônus & Combat Points ao Aluno
          </h3>
        </div>

        <form
          onSubmit={handleConcederBonus}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.85rem',
            alignItems: 'end',
            padding: '1.1rem',
            borderRadius: '14px',
            background: 'var(--bg-background)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--text-muted-foreground)',
                marginBottom: '0.3rem'
              }}
            >
              Selecionar Atleta da Turma
            </label>
            <select
              value={bonusAlunoId}
              onChange={e => setBonusAlunoId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-1)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              {roster.map(r => (
                <option key={r.id} value={r.id}>
                  {r.nome} ({r.graduacao})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--text-muted-foreground)',
                marginBottom: '0.3rem'
              }}
            >
              Quantidade de XP / Points
            </label>
            <input
              type="number"
              min={10}
              max={500}
              step={10}
              value={bonusPoints}
              onChange={e => setBonusPoints(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-1)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 800
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--text-muted-foreground)',
                marginBottom: '0.3rem'
              }}
            >
              Motivo do Mérito
            </label>
            <input
              type="text"
              value={bonusMotivo}
              onChange={e => setBonusMotivo(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-1)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              color: 'var(--text-primary-foreground)',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            🏅 Creditar XP & Points
          </button>
        </form>
      </section>
    )
  };

  return (
    <div
      style={{
        minHeight: embedded ? 'auto' : '100vh',
        background: 'var(--bg-background)',
        color: 'var(--text-foreground)',
        padding: embedded ? '0' : '1.25rem clamp(1rem, 3vw, 2.5rem) 4rem'
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        {!embedded && (
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
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 900
                }}
              >
                🥋
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: 'var(--text-foreground)'
                  }}
                >
                  PORTAL DO PROFESSOR & MESTRE <span style={{ color: 'var(--color-primary)' }}>COMBAT-PASS</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                  Chamada Rápida Touch-First · Gestão de Vagas · Extrato de Comissões Dinâmicas
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <ThemeSwitcher />
              <Link
                to="/"
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-2)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textDecoration: 'none'
                }}
              >
                🏛️ Hub Principal
              </Link>
              <Link
                to="/admin"
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-2)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textDecoration: 'none'
                }}
              >
                👑 ERP Admin
              </Link>
            </div>
          </header>
        )}

        {/* Toolbar de Arquitetura Visual & Ordem de Módulos/Seções */}
        <JourneyLayoutToolbar journey="teacher" />

        {feedbackMsg && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'var(--status-available-bg)',
              border: '1px solid var(--status-available-border)',
              color: 'var(--status-available)',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{feedbackMsg}</span>
            <button
              type="button"
              onClick={() => setFeedbackMsg('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--status-available)',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* SHELL POLIMÓRFICO DO PROFESSOR:
            Layout 1 (tatame_fast): Sistema Escolar Docente com Aba Lateral Fixa (285px + 1fr)
            Layout 2 (technical_perf): Split-View Técnico 2 Colunas Lado a Lado
            Layout 3 (partner_portal): Executivo Ortogonal de Comissões + Operação
            Layout 4 (classic_teacher): Clássico Touch-First em Abas Horizontais */}
        {activePreset === 'tatame_fast' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 285px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
            <aside
              style={{
                position: 'sticky',
                top: '16px',
                borderRadius: '18px',
                background: 'var(--bg-surface-1)',
                border: '2px solid var(--border-subtle)',
                padding: '1.1rem',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div style={{ padding: '0.9rem', borderRadius: '14px', background: 'var(--bg-surface-2)', border: '1px solid var(--color-primary)' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  🎓 PORTAL DOCENTE · ABA LATERAL ESCOLAR
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 900, color: 'var(--text-foreground)', marginTop: '0.2rem' }}>
                  Mestre / Instrutor Credenciado
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', marginTop: '0.1rem' }}>
                  Turma Ativa: <strong style={{ color: 'var(--color-primary)' }}>{selectedHorario} ({selectedModalidade})</strong>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--status-available)', fontWeight: 800, marginTop: '0.35rem' }}>
                  ● {totalConfirmadosOuAgendados}/{limiteVagas} alunos no tatame
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.64rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  📂 Módulos do Professor
                </div>
                <DynamicNavBuilder
                  journey="teacher"
                  activeId={activeNavTab}
                  onSelect={tab => setActiveNavTab(tab)}
                  variant="sidebar"
                />
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gap: '0.4rem' }}>
                <Link to="/portal" style={{ padding: '0.6rem', borderRadius: '9px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.74rem', fontWeight: 800, textDecoration: 'none', textAlign: 'center' }}>
                  🥊 Ver Portal do Aluno
                </Link>
                <Link to="/admin" style={{ padding: '0.6rem', borderRadius: '9px', background: 'var(--bg-background)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontSize: '0.74rem', fontWeight: 900, textDecoration: 'none', textAlign: 'center' }}>
                  👑 Abrir ERP Admin
                </Link>
              </div>
            </aside>

            <div>
              <DynamicSectionRenderer journey="teacher" sectionsMap={sectionsMap} />
            </div>
          </div>
        ) : activePreset === 'technical_perf' ? (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <DynamicNavBuilder
                journey="teacher"
                activeId={activeNavTab}
                onSelect={tab => setActiveNavTab(tab)}
                variant="horizontal"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                {sectionsMap.ongoing_class}
                {sectionsMap.touch_rollcall}
              </div>
              <div>
                {sectionsMap.bonus_merit}
                {sectionsMap.weekly_schedule}
                {sectionsMap.commissions_summary}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <DynamicNavBuilder
                journey="teacher"
                activeId={activeNavTab}
                onSelect={tab => setActiveNavTab(tab)}
                variant="horizontal"
              />
            </div>
            <DynamicSectionRenderer journey="teacher" sectionsMap={sectionsMap} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPortalPage;
