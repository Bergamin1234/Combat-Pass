import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useLayoutEngine,
  JourneyLayoutToolbar,
  TeacherPresetId
} from '../config/layoutEngine';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { InteractiveCombatCalendar } from '../components/InteractiveCombatCalendar';
import { TeacherCommissionsTab } from '../components/TeacherCommissionsTab';
import { adminApi } from '../services/api';

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
  strikingGrade?: number;
  grapplingGrade?: number;
  frequenciaNum?: number;
}

export const TeacherPortalPage: React.FC<TeacherPortalPageProps> = ({ embedded = false }) => {
  const { preferences, setJourneyPreset } = useLayoutEngine();
  const activePreset = preferences.layoutPreset.teacher;
  const teacherArch =
    activePreset === 'tatame_fast'
      ? 'school'
      : activePreset === 'technical_perf'
      ? 'hud'
      : activePreset === 'partner_portal'
      ? 'executive'
      : 'classic';
  const [showLayoutCustomDrawer, setShowLayoutCustomDrawer] = useState(false);

  // Controle de Autenticação Obrigatória do Professor (CPF: 1 | Senha: 1)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem('combat_hub_teacher_auth'));
  });
  const [teacherUser, setTeacherUser] = useState<any>(() => {
    try {
      const saved = sessionStorage.getItem('combat_hub_teacher_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginCpf, setLoginCpf] = useState('1');
  const [loginSenha, setLoginSenha] = useState('1');
  const [loginErro, setLoginErro] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeNavTab, setActiveNavTab] = useState<string>(
    preferences.defaultTabByJourney.teacher || 'aula_atual'
  );
  const [selectedHorario, setSelectedHorario] = useState('19:00');
  const [selectedModalidade, setSelectedModalidade] = useState('Muay Thai Geral');
  const [selectedUnidade, setSelectedUnidade] = useState('CT Borü Matriz (Credenciada)');
  const [aulaCancelada, setAulaCancelada] = useState(false);
  const [limiteVagas, setLimiteVagas] = useState(20);

  const [roster, setRoster] = useState<RosterStudent[]>([
    {
      id: 'al-1',
      nome: 'Ítalo Rafael Silva Bergamin',
      academiaOrigem: 'Passe Unificado Gold · CT Borü',
      graduacao: 'Prajied Azul // Liga Prata',
      xp: 4820,
      assiduidade30d: '95%',
      frequenciaNum: 95,
      strikingGrade: 9.8,
      grapplingGrade: 8.5,
      statusChamada: 'PRESENTE',
      observacaoTecnica: 'Evolução técnica consistente no tatame'
    },
    {
      id: 'al-2',
      nome: 'Marcus Miller Albuquerque',
      academiaOrigem: 'Alliance BJJ Jardins (Unidade 02)',
      graduacao: 'Faixa Roxa 1º Grau',
      xp: 3450,
      assiduidade30d: '88%',
      frequenciaNum: 88,
      strikingGrade: 7.2,
      grapplingGrade: 9.9,
      statusChamada: 'AGENDADO',
      observacaoTecnica: 'Foco em passagens de guarda e no-gi'
    },
    {
      id: 'al-3',
      nome: 'Beatriz Vasconcelos',
      academiaOrigem: 'Passe Silver · Nobre Arte Boxing',
      graduacao: 'Iniciante Nível II',
      xp: 1240,
      assiduidade30d: '75%',
      frequenciaNum: 75,
      strikingGrade: 8.4,
      grapplingGrade: 6.0,
      statusChamada: 'AGENDADO',
      observacaoTecnica: 'Excelente coordenação motora no footwork'
    },
    {
      id: 'al-4',
      nome: 'Rodrigo Fontana Mendes',
      academiaOrigem: 'Passe Black Ilimitado',
      graduacao: 'Kru Intermediário',
      xp: 2910,
      assiduidade30d: '90%',
      frequenciaNum: 90,
      strikingGrade: 9.1,
      grapplingGrade: 7.8,
      statusChamada: 'PRESENTE',
      observacaoTecnica: 'Condicionamento físico de alto rendimento'
    }
  ]);

  const [walkinNome, setWalkinNome] = useState('');
  const [bonusAlunoId, setBonusAlunoId] = useState('al-1');
  const [bonusPoints, setBonusPoints] = useState(50);
  const [bonusMotivo, setBonusMotivo] = useState('Destaque Técnico & Sparring Limpo');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const totalConfirmadosOuAgendados = roster.filter(r => r.statusChamada !== 'FALTA').length;

  // Lógica de Login do Professor (suporte oficial a CPF 1 / Senha 1 ou API)
  const handleTeacherLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginErro('');
    const cpfVal = loginCpf.trim();
    const senhaVal = loginSenha.trim();

    if (!cpfVal || !senhaVal) {
      setLoginErro('Por favor preencha seu CPF e Senha de Docente.');
      return;
    }

    // Suporte prioritário às credenciais de teste solicitadas: CPF 1 / SENHA 1
    if (cpfVal === '1' && senhaVal === '1') {
      const user = {
        id: 'prof-1',
        nome: 'Prof. Mestre Felipe Borü',
        cpf: '1',
        cargo: 'PROFESSOR',
        modalidade: 'Muay Thai & Striking',
        graduacao: 'Kru Yai // Faixa Preta',
        unidade: 'CT Borü Matriz (Credenciada)'
      };
      sessionStorage.setItem('combat_hub_teacher_auth', JSON.stringify(user));
      setTeacherUser(user);
      setIsLoggedIn(true);
      setFeedbackMsg('🥋 Seja bem-vindo, Prof. Mestre Felipe Borü! Acesso liberado ao tatame.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await adminApi.login({
        emailOuUsuario: cpfVal,
        senha: senhaVal
      });
      const user = res.data?.usuario || {
        id: 'prof-api',
        nome: res.data?.usuario?.nome || 'Professor Credenciado',
        cpf: cpfVal,
        cargo: 'PROFESSOR'
      };
      sessionStorage.setItem('combat_hub_teacher_auth', JSON.stringify(user));
      setTeacherUser(user);
      setIsLoggedIn(true);
      setFeedbackMsg(`🥋 Acesso autenticado com sucesso! Docente: ${user.nome}`);
    } catch (err: any) {
      // Se a API recusar, mas o usuário digitou 1 e 1
      if (cpfVal === '1' && senhaVal === '1') {
        const fallbackUser = {
          id: 'prof-1',
          nome: 'Prof. Mestre Titular',
          cpf: '1',
          cargo: 'PROFESSOR'
        };
        sessionStorage.setItem('combat_hub_teacher_auth', JSON.stringify(fallbackUser));
        setTeacherUser(fallbackUser);
        setIsLoggedIn(true);
      } else {
        setLoginErro(
          err.response?.data?.erro ||
          'Credenciais não localizadas. Dica de teste rápido: use CPF: 1 e Senha: 1.'
        );
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleTeacherLogout = () => {
    sessionStorage.removeItem('combat_hub_teacher_auth');
    setIsLoggedIn(false);
    setTeacherUser(null);
    setFeedbackMsg('Sessão de docente encerrada com sucesso.');
  };

  const handleMarcarStatus = (studentId: string, novoStatus: 'PRESENTE' | 'FALTA') => {
    setRoster(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const status = s.statusChamada === novoStatus ? 'AGENDADO' : novoStatus;
          return { ...s, statusChamada: status };
        }
        return s;
      })
    );
  };

  const handleToggleCancelarAula = () => {
    const proximo = !aulaCancelada;
    setAulaCancelada(proximo);
    setFeedbackMsg(
      proximo
        ? '🚫 Aula cancelada! Ela aparecerá riscada no calendário de todos os alunos da rede.'
        : '🟢 Aula reativada na grade oficial com sucesso!'
    );
  };

  const handleAdicionarWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinNome.trim()) return;
    const novo: RosterStudent = {
      id: `walkin-${Date.now()}`,
      nome: walkinNome.trim(),
      academiaOrigem: 'Check-in Avulso / Walk-in Presencial',
      graduacao: 'Iniciante / Visitante',
      xp: 50,
      assiduidade30d: '100%',
      frequenciaNum: 100,
      strikingGrade: 8.0,
      grapplingGrade: 7.0,
      statusChamada: 'PRESENTE',
      observacaoTecnica: 'Entrada avulsa validada na recepção'
    };
    setRoster(prev => [novo, ...prev]);
    setWalkinNome('');
    setFeedbackMsg(`✓ Aluno avulso "${novo.nome}" registrado com presença no tatame!`);
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
      `🏅 +${bonusPoints} XP & Combat Points creditados para ${target?.nome || 'o atleta'} (${bonusMotivo})!`
    );
  };

  const handleQuickXP = (studentId: string, points: number, motivo: string) => {
    setRoster(prev =>
      prev.map(r => (r.id === studentId ? { ...r, xp: r.xp + points } : r))
    );
    const target = roster.find(r => r.id === studentId);
    setFeedbackMsg(`⚡ +${points} XP concedidos para ${target?.nome}! (${motivo})`);
  };

  // =========================================================================
  // SE O PROFESSOR NÃO ESTIVER AUTENTICADO: RENDERIZA A TELA DE LOGIN DO PROFESSOR
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-background)',
          color: 'var(--text-foreground)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
          {/* Header Superior da Tela de Login */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <Link
              to="/"
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--text-muted-foreground)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              ← Voltar ao Hub Principal
            </Link>
            <ThemeSwitcher compact />
          </div>

          {/* Card Principal de Autenticação */}
          <div
            style={{
              padding: '2rem',
              borderRadius: '24px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  margin: '0 auto 0.75rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                🥋
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                ACESSO RESTRITO · CORPO DOCENTE
              </div>
              <h1 style={{ margin: '0.35rem 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 900 }}>
                Portal do Professor
              </h1>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted-foreground)' }}>
                Informe seu CPF e senha de mestre para acessar a chamada, grade e comissões.
              </p>
            </div>

            {/* Destaque das Credenciais de Teste Solicitadas */}
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--color-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  🔑 CREDENCIAIS DE ACESSO RÁPIDO:
                </span>
                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--status-available-bg)', color: 'var(--status-available)', fontWeight: 800 }}>
                  HOMOLOGADO
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-foreground)', fontWeight: 800 }}>
                CPF: <strong style={{ color: 'var(--color-primary)' }}>1</strong> &nbsp;·&nbsp; Senha: <strong style={{ color: 'var(--color-primary)' }}>1</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginCpf('1');
                  setLoginSenha('1');
                  handleTeacherLogin();
                }}
                style={{
                  marginTop: '0.2rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                ⚡ Preencher e Entrar Agora com 1 Clique
              </button>
            </div>

            {loginErro && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'var(--status-full-bg)',
                  border: '1px solid var(--status-full-border)',
                  color: 'var(--status-full)',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}
              >
                {loginErro}
              </div>
            )}

            <form onSubmit={handleTeacherLogin} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 900, color: 'var(--text-muted-foreground)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                  CPF do Professor
                </label>
                <input
                  type="text"
                  required
                  value={loginCpf}
                  onChange={e => setLoginCpf(e.target.value)}
                  placeholder="Digite seu CPF ou 1"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 900, color: 'var(--text-muted-foreground)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  required
                  value={loginSenha}
                  onChange={e => setLoginSenha(e.target.value)}
                  placeholder="Digite sua senha ou 1"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '12px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-primary-foreground)',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  cursor: loginLoading ? 'wait' : 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                {loginLoading ? 'Validando Acesso...' : '🥋 Entrar no Tatame como Professor'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // QUANDO O PROFESSOR ESTÁ AUTENTICADO: RENDERIZA O PORTAL COM OS 4 LAYOUTS
  // =========================================================================
  const teacherLayoutOptions: Array<{ id: TeacherPresetId; icon: string; short: string; name: string; tag: string }> = [
    { id: 'tatame_fast', icon: '🎓', short: '1. Escolar', name: 'Layout 1: Diário Escolar', tag: 'Sidebar 26px' },
    { id: 'technical_perf', icon: '📊', short: '2. Mesa HUD', name: 'Layout 2: Mesa Técnica', tag: 'Split 50/50' },
    { id: 'partner_portal', icon: '🏛️', short: '3. B2B 0px', name: 'Layout 3: Dossiê B2B', tag: 'Matriz 0px' },
    { id: 'classic_teacher', icon: '⚡', short: '4. Super-App', name: 'Layout 4: Touch Tatame', tag: 'Hero Touch' }
  ];

  return (
    <div
      data-layout-arch={teacherArch}
      style={{
        minHeight: embedded ? 'auto' : '100vh',
        background: teacherArch === 'school' ? 'var(--bg-surface-muted, var(--bg-background))' : 'var(--bg-background)',
        color: 'var(--text-foreground)',
        padding: embedded ? '0' : '1.25rem 1rem 4rem',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: activePreset === 'classic_teacher' ? '980px' : '1540px', width: '100%', margin: '0 auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        {/* TOP CHROME POLIMÓRFICO POR ARQUITETURA (EM LAYOUT 1 FICA TUDO NA SIDEBAR ESQUERDA) */}
        {!embedded && activePreset === 'technical_perf' && (
          <header
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '6px',
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
              borderLeft: '6px solid var(--color-primary)',
              boxShadow: '0 0 0 1px var(--color-primary-border), 0 12px 26px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '6px',
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 900
                  }}
                >
                  📊
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.64rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
                    SYS://MESA_TECNICA_DOCENTE · AVALIAÇÃO AO VIVO
                  </div>
                  <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-foreground)' }}>
                    {teacherUser?.nome || 'Prof. Mestre Titular'} — <span style={{ color: 'var(--color-primary)' }}>{selectedHorario} {selectedModalidade}</span>
                  </h1>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <ThemeSwitcher compact />
                <button
                  type="button"
                  onClick={() => setShowLayoutCustomDrawer(v => !v)}
                  style={{
                    padding: '0.42rem 0.75rem',
                    borderRadius: '4px',
                    background: showLayoutCustomDrawer ? 'var(--color-primary)' : 'var(--bg-surface-2)',
                    color: showLayoutCustomDrawer ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Ordenar & Loading
                </button>
                <Link to="/admin" style={{ padding: '0.42rem 0.75rem', borderRadius: '4px', background: 'var(--bg-background)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontSize: '0.7rem', fontWeight: 900, textDecoration: 'none' }}>
                  👑 Admin
                </Link>
                <Link to="/" style={{ padding: '0.42rem 0.75rem', borderRadius: '4px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none' }}>
                  🏛️ Hub
                </Link>
                <button type="button" onClick={handleTeacherLogout} style={{ padding: '0.42rem 0.75rem', borderRadius: '4px', background: 'var(--status-full-bg)', color: 'var(--status-full)', border: '1px solid var(--status-full-border)', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>
                  ✕ SAIR
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.6rem', borderTop: '1px dashed var(--border-subtle)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {teacherLayoutOptions.map(opt => {
                  const isCurrent = activePreset === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setJourneyPreset('teacher', opt.id);
                        setFeedbackMsg(`✓ Interface ativa: ${opt.name}`);
                      }}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        background: isCurrent ? 'var(--color-primary)' : 'var(--bg-background)',
                        color: isCurrent ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                        border: isCurrent ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {opt.icon} {opt.short.toUpperCase()} {isCurrent ? '● ATIVO' : ''}
                    </button>
                  );
                })}
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 900 }}>
                TATAME: {totalConfirmadosOuAgendados}/{limiteVagas} ATLETAS · STRIKING + GRAPPLING RADAR
              </span>
            </div>
          </header>
        )}

        {!embedded && activePreset === 'partner_portal' && (
          <header
            style={{
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
              borderTop: '6px solid var(--color-primary)',
              borderBottom: '3px solid var(--text-foreground)',
              borderRadius: '0px',
              padding: '1rem 1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.64rem', fontWeight: 900, letterSpacing: '0.14em', color: 'var(--color-primary)' }}>
                  COMBAT-PASS B2B · PORTAL DO INSTRUTOR PARCEIRO & REPASSES
                </div>
                <h1 style={{ margin: '0.2rem 0 0', fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-foreground)' }}>
                  {teacherUser?.nome || 'Prof. Mestre Titular'} — CPF {teacherUser?.cpf || '1'}
                </h1>
                <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted-foreground)', marginTop: '0.18rem' }}>
                  TURMA: <strong>{selectedHorario} ({selectedModalidade})</strong> | UNIDADE: <strong>{selectedUnidade}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <ThemeSwitcher compact />
                <button type="button" onClick={() => setShowLayoutCustomDrawer(v => !v)} style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: showLayoutCustomDrawer ? 'var(--color-primary)' : 'var(--bg-background)', color: showLayoutCustomDrawer ? 'var(--text-primary-foreground)' : 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer' }}>
                  CONFIG. BLOCOS
                </button>
                <Link to="/admin" style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: 'var(--bg-background)', color: 'var(--color-primary)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase' }}>
                  ERP ADMIN
                </Link>
                <Link to="/" style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase' }}>
                  HUB PRINCIPAL
                </Link>
                <button type="button" onClick={handleTeacherLogout} style={{ padding: '0.45rem 0.75rem', borderRadius: '0px', background: 'var(--bg-surface-2)', color: 'var(--status-full)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}>
                  ENCERRAR SESSÃO
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.7rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted-foreground)' }}>
                ARQUITETURA DA INTERFACE DOCENTE:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', border: '1px solid var(--border-subtle)' }}>
                {teacherLayoutOptions.map(opt => {
                  const isCurrent = activePreset === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setJourneyPreset('teacher', opt.id);
                        setFeedbackMsg(`✓ Interface ativa: ${opt.name}`);
                      }}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '0px',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        background: isCurrent ? 'var(--color-primary)' : 'var(--bg-background)',
                        color: isCurrent ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                        border: 'none',
                        borderRight: '1px solid var(--border-subtle)'
                      }}
                    >
                      {opt.short}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>
        )}

        {!embedded && activePreset === 'classic_teacher' && (
          <header
            style={{
              borderRadius: '22px',
              background: 'var(--color-gradient)',
              color: 'var(--text-primary-foreground)',
              padding: '1.35rem 1.5rem',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.95rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  className="arch-keep-shape"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}
                >
                  🥋
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.08em' }}>
                    ⚡ SUPER-APP TATAME TOUCH · CHAMADA EM 1 TOQUE
                  </div>
                  <h1 style={{ margin: '0.1rem 0 0', fontSize: '1.4rem', fontWeight: 900 }}>
                    {teacherUser?.nome || 'Prof. Mestre Titular'}
                  </h1>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, opacity: 0.92 }}>
                    Turma: {selectedHorario} · {selectedModalidade} ({totalConfirmadosOuAgendados}/{limiteVagas} inscritos)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <ThemeSwitcher compact />
                <button type="button" onClick={() => setShowLayoutCustomDrawer(v => !v)} style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(0,0,0,0.28)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.35)', fontSize: '0.74rem', fontWeight: 900, cursor: 'pointer' }}>
                  ⚙️ Customizar
                </button>
                <Link to="/admin" style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(255,255,255,0.22)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.35)', fontSize: '0.74rem', fontWeight: 900, textDecoration: 'none' }}>
                  👑 Admin
                </Link>
                <Link to="/" style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.74rem', fontWeight: 900, textDecoration: 'none' }}>
                  🏛️ Hub
                </Link>
                <button type="button" onClick={handleTeacherLogout} style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(0,0,0,0.35)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.74rem', fontWeight: 900, cursor: 'pointer' }}>
                  🚪 Sair
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '0.5rem' }}>
              {teacherLayoutOptions.map(opt => {
                const isCurrent = activePreset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setJourneyPreset('teacher', opt.id);
                      setFeedbackMsg(`✓ Interface ativa: ${opt.name}`);
                    }}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: isCurrent ? '#FFFFFF' : 'rgba(0,0,0,0.24)',
                      color: isCurrent ? '#111114' : '#FFFFFF',
                      border: isCurrent ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.28)',
                      fontSize: '0.74rem',
                      fontWeight: 900
                    }}
                  >
                    <div>{opt.icon} {opt.short}</div>
                    <div style={{ fontSize: '0.62rem', opacity: 0.78 }}>{isCurrent ? '✓ Ativo agora' : opt.tag}</div>
                  </button>
                );
              })}
            </div>
          </header>
        )}

        {/* Toolbar Expansível Sob Demanda (Sem poluir os 4 layouts com barra repetida no topo) */}
        {showLayoutCustomDrawer && <JourneyLayoutToolbar journey="teacher" compact />}

        {feedbackMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: activePreset === 'partner_portal' ? '0px' : '12px',
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

        {/* =========================================================================
            LAYOUT 1: SISTEMA ESCOLAR DOCENTE (SIDEBAR INTEGRADA DO TOPO AO RODAPÉ + PÍLULAS)
            ========================================================================= */}
        {activePreset === 'tatame_fast' && (
          <div className="responsive-portal-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(270px, 310px) 1fr', gap: '1.35rem', alignItems: 'start', width: '100%' }}>
            {/* Aba Lateral Escolar Completa */}
            <aside
              className="responsive-portal-aside"
              style={{
                position: 'sticky',
                top: '16px',
                borderRadius: '26px',
                background: 'var(--bg-surface-1)',
                border: '2px solid var(--border-subtle)',
                borderTop: '6px solid var(--color-primary)',
                padding: '1.2rem',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem'
              }}
            >
              {/* Cabeçalho do Diário Escolar + ThemeSwitcher */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  🎓 DIÁRIO ESCOLAR DOCENTE
                </div>
                <ThemeSwitcher compact />
              </div>

              {/* Troca de Interface dentro da Sidebar Escolar */}
              <div style={{ padding: '0.65rem', borderRadius: '20px', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  👁️ Alternar Interface (1 Clique):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                  {teacherLayoutOptions.map(opt => {
                    const isCurrent = activePreset === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setJourneyPreset('teacher', opt.id);
                          setFeedbackMsg(`✓ Interface ativa: ${opt.name}`);
                        }}
                        style={{
                          padding: '0.38rem 0.5rem',
                          borderRadius: '999px',
                          fontSize: '0.66rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          background: isCurrent ? 'var(--color-primary)' : 'var(--bg-surface-1)',
                          color: isCurrent ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                          border: isCurrent ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                        }}
                      >
                        {opt.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '22px', background: 'var(--bg-surface-2)', border: '2px solid var(--color-primary-border)', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', margin: '0 auto 0.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>
                  🥋
                </div>
                <div style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  PROFESSOR CREDENCIADO
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-foreground)', marginTop: '0.2rem' }}>
                  {teacherUser?.nome || 'Prof. Mestre Titular'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', marginTop: '0.1rem' }}>
                  Turma: <strong style={{ color: 'var(--color-primary)' }}>{selectedHorario} ({selectedModalidade})</strong>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--status-available)', fontWeight: 800, marginTop: '0.35rem' }}>
                  ● {totalConfirmadosOuAgendados}/{limiteVagas} alunos matriculados
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.64rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase', marginBottom: '0.4rem', paddingLeft: '0.3rem' }}>
                  📂 Módulos do Diário Escolar
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {[
                    { id: 'aula_atual', icon: '📝', label: 'Chamada & Diário do Dia' },
                    { id: 'grade_horarios', icon: '📅', label: 'Horários & Calendário' },
                    { id: 'comissoes', icon: '💵', label: 'Comissões & Aulas Dadas' },
                    { id: 'avaliacao_xp', icon: '🏅', label: 'Mérito Marcial & Bônus' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveNavTab(tab.id)}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '999px',
                        border: activeNavTab === tab.id ? '2px solid var(--color-primary)' : '1px solid transparent',
                        background: activeNavTab === tab.id ? 'var(--color-primary)' : 'var(--bg-background)',
                        color: activeNavTab === tab.id ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Registro Rápido de Walk-in no Menu */}
              <form onSubmit={handleAdicionarWalkin} style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.64rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>
                  + Adicionar Aluno Avulso
                </span>
                <input
                  type="text"
                  placeholder="Nome do Aluno..."
                  value={walkinNome}
                  onChange={e => setWalkinNome(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '999px',
                    background: 'var(--bg-background)',
                    color: 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem',
                    borderRadius: '999px',
                    background: 'var(--color-primary)',
                    color: 'var(--text-primary-foreground)',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  Confirmar Entrada Avulsa
                </button>
              </form>

              {/* Atalhos de Rodapé da Barra Lateral Escolar */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setShowLayoutCustomDrawer(v => !v)}
                  style={{
                    padding: '0.45rem 0.6rem',
                    borderRadius: '999px',
                    background: showLayoutCustomDrawer ? 'var(--color-primary)' : 'var(--bg-background)',
                    color: showLayoutCustomDrawer ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Ordenar
                </button>
                <Link to="/admin" style={{ padding: '0.45rem 0.6rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontSize: '0.68rem', fontWeight: 900, textDecoration: 'none', textAlign: 'center' }}>
                  👑 Admin
                </Link>
                <Link to="/" style={{ padding: '0.45rem 0.6rem', borderRadius: '999px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.68rem', fontWeight: 900, textDecoration: 'none', textAlign: 'center' }}>
                  🏠 Site
                </Link>
                <button
                  type="button"
                  onClick={handleTeacherLogout}
                  style={{
                    padding: '0.45rem 0.6rem',
                    borderRadius: '999px',
                    background: 'var(--status-full-bg)',
                    color: 'var(--status-full)',
                    border: '1px solid var(--status-full-border)',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  🚪 Sair
                </button>
              </div>
            </aside>

            {/* Conteúdo do Diário Escolar */}
            <main style={{ minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              {/* Cabeçalho da Caderneta Escolar (Layout 1) */}
              <div style={{ padding: '1rem 1.35rem', borderRadius: '26px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderTop: '4px solid var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    🎓 CADERNETA ACADÊMICA DO DOCENTE · LAYOUT 1 (SISTEMA ESCOLAR)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '0.15rem' }}>
                    Controle de Diário, Frequência & Mérito Marcial
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.4rem 0.85rem', borderRadius: '999px', background: 'var(--status-available-bg)', color: 'var(--status-available)', fontSize: '0.72rem', fontWeight: 900 }}>
                    ✓ {roster.filter(s => s.statusChamada === 'PRESENTE').length} Presentes
                  </span>
                  <span style={{ padding: '0.4rem 0.85rem', borderRadius: '999px', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.72rem', fontWeight: 900 }}>
                    👥 {totalConfirmadosOuAgendados}/{limiteVagas} Vagas
                  </span>
                </div>
              </div>

              {/* Card Escolar da Turma */}
              <section style={{ padding: '1.5rem', borderRadius: '26px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.66rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      DIÁRIO DE CLASSE · TURMA PRESENCIAL
                    </span>
                    <h2 style={{ margin: '0.2rem 0', fontSize: '1.45rem', fontWeight: 900, textDecoration: aulaCancelada ? 'line-through' : 'none' }}>
                      {selectedHorario} — {selectedModalidade}
                    </h2>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted-foreground)' }}>
                      Local: <strong>{selectedUnidade}</strong> · Ocupação: <strong>{totalConfirmadosOuAgendados} de {limiteVagas} alunos</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleToggleCancelarAula}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        background: aulaCancelada ? 'var(--status-available)' : 'var(--status-full-bg)',
                        color: aulaCancelada ? '#fff' : 'var(--status-full)',
                        border: '1px solid var(--status-full)',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {aulaCancelada ? '🟢 Reativar Aula' : '🚫 Cancelar (Riscar) Aula'}
                    </button>
                  </div>
                </div>

                {/* Caderneta de Chamada Escolar com Retratos Redondos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {roster.map(st => {
                    const isPresent = st.statusChamada === 'PRESENTE';
                    const isAbsent = st.statusChamada === 'FALTA';

                    return (
                      <div
                        key={st.id}
                        style={{
                          padding: '0.9rem 1.25rem',
                          borderRadius: '999px',
                          background: isPresent ? 'var(--status-available-bg)' : isAbsent ? 'var(--status-full-bg)' : 'var(--bg-background)',
                          border: isPresent ? '1px solid var(--status-available-border)' : isAbsent ? '1px solid var(--status-full-border)' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                            {st.nome.slice(0, 1)}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 900 }}>{st.nome}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)' }}>
                              {st.graduacao} · Frequência Escolar: <strong style={{ color: 'var(--color-primary)' }}>{st.assiduidade30d}</strong>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.45rem' }}>
                          <button
                            type="button"
                            onClick={() => handleMarcarStatus(st.id, 'PRESENTE')}
                            style={{
                              padding: '0.45rem 0.9rem',
                              borderRadius: '999px',
                              background: isPresent ? 'var(--status-available)' : 'var(--bg-surface-1)',
                              color: isPresent ? '#fff' : 'var(--status-available)',
                              border: '1px solid var(--status-available-border)',
                              fontSize: '0.74rem',
                              fontWeight: 900,
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Presente
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarcarStatus(st.id, 'FALTA')}
                            style={{
                              padding: '0.45rem 0.85rem',
                              borderRadius: '999px',
                              background: isAbsent ? 'var(--status-full)' : 'var(--bg-surface-1)',
                              color: isAbsent ? '#fff' : 'var(--status-full)',
                              border: '1px solid var(--status-full-border)',
                              fontSize: '0.74rem',
                              fontWeight: 900,
                              cursor: 'pointer'
                            }}
                          >
                            ✕ Falta
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Calendário & Grade de Horários */}
              <section style={{ padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-surface-1)', border: '2px solid var(--border-subtle)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 900 }}>📅 Grade Oficial de Aulas & Horários</h3>
                <InteractiveCombatCalendar userRole="PROFESSOR" />
              </section>

              {/* Comissões & Mérito Marcial */}
              <section style={{ padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-surface-1)', border: '2px solid var(--border-subtle)' }}>
                <TeacherCommissionsTab />
              </section>
            </main>
          </div>
        )}

        {/* =========================================================================
            LAYOUT 2: MESA TÉCNICA & PERFORMANCE (SPLIT-SCREEN 50/50 COM RADAR DE NOTAS E SCORES)
            ========================================================================= */}
        {activePreset === 'technical_perf' && (
          <div className="responsive-hud-split" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '1.25rem', width: '100%', alignItems: 'start' }}>
            {/* Coluna 1: Painel Tático de Chamada & Avaliação Técnica dos Alunos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <section style={{ padding: '1.35rem', borderRadius: '6px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
                      MESA TÉCNICA // MONITORAMENTO DE DESEMPENHO
                    </span>
                    <h3 style={{ margin: '0.2rem 0', fontSize: '1.25rem', fontWeight: 900 }}>
                      Avaliação em Tempo Real ({selectedHorario})
                    </h3>
                  </div>
                  <span style={{ padding: '0.25rem 0.65rem', borderRadius: '8px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', fontSize: '0.72rem', fontWeight: 900 }}>
                    {totalConfirmadosOuAgendados} Atletas no Radar
                  </span>
                </div>

                {/* Lista de Atletas com Barras de Nota Técnica (Striking e Grappling) */}
                <div style={{ display: 'grid', gap: '0.85rem' }}>
                  {roster.map(st => (
                    <div
                      key={st.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'var(--bg-background)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{st.nome}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>{st.graduacao} · XP: {st.xp}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleMarcarStatus(st.id, 'PRESENTE')}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              background: st.statusChamada === 'PRESENTE' ? 'var(--status-available)' : 'var(--bg-surface-2)',
                              color: st.statusChamada === 'PRESENTE' ? '#fff' : 'var(--status-available)',
                              border: '1px solid var(--status-available-border)',
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Presença
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarcarStatus(st.id, 'FALTA')}
                            style={{
                              padding: '0.35rem 0.7rem',
                              borderRadius: '8px',
                              background: st.statusChamada === 'FALTA' ? 'var(--status-full)' : 'var(--bg-surface-2)',
                              color: st.statusChamada === 'FALTA' ? '#fff' : 'var(--status-full)',
                              border: '1px solid var(--status-full-border)',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            ✕ Falta
                          </button>
                        </div>
                      </div>

                      {/* Radar de Competências Técnicas do Aluno */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 900 }}>
                            <span>Striking & Postura</span>
                            <span style={{ color: 'var(--color-primary)' }}>{st.strikingGrade}/10</span>
                          </div>
                          <div style={{ height: '6px', background: 'var(--bg-surface-2)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${(st.strikingGrade || 7) * 10}%`, height: '100%', background: 'var(--color-primary)' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 900 }}>
                            <span>Grappling & Solo</span>
                            <span style={{ color: 'var(--color-accent)' }}>{st.grapplingGrade}/10</span>
                          </div>
                          <div style={{ height: '6px', background: 'var(--bg-surface-2)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${(st.grapplingGrade || 7) * 10}%`, height: '100%', background: 'var(--color-accent)' }} />
                          </div>
                        </div>
                      </div>

                      {/* Botões Rápidos de Mérito Esportivo */}
                      <div style={{ display: 'flex', gap: '0.35rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleQuickXP(st.id, 25, 'Sparring Técnico Limpo')}
                          style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.66rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          ⚡ +25 XP Sparring
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickXP(st.id, 50, 'Destaque Técnico do Treino')}
                          style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', background: 'var(--bg-surface-2)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontSize: '0.66rem', fontWeight: 900, cursor: 'pointer' }}
                        >
                          🏅 +50 XP Destaque
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickXP(st.id, 100, 'MVP da Turma')}
                          style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', border: 'none', fontSize: '0.66rem', fontWeight: 900, cursor: 'pointer' }}
                        >
                          👑 +100 XP MVP
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Conceder XP com Justificativa Técnica */}
              <section style={{ padding: '1.35rem', borderRadius: '16px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1rem', fontWeight: 900 }}>🏅 Bonificação de Mérito Marcial Detalhada</h4>
                <form onSubmit={handleConcederBonus} style={{ display: 'grid', gap: '0.65rem' }}>
                  <select
                    value={bonusAlunoId}
                    onChange={e => setBonusAlunoId(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '8px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                  >
                    {roster.map(r => (
                      <option key={r.id} value={r.id}>{r.nome} ({r.graduacao})</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={bonusMotivo}
                    onChange={e => setBonusMotivo(e.target.value)}
                    placeholder="Motivo da bonificação técnica..."
                    style={{ padding: '0.55rem', borderRadius: '8px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                  />
                  <button type="submit" style={{ padding: '0.6rem', borderRadius: '8px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', border: 'none', fontWeight: 900, fontSize: '0.78rem', cursor: 'pointer' }}>
                    Creditar +{bonusPoints} XP ao Aluno
                  </button>
                </form>
              </section>
            </div>

            {/* Coluna 2: Calendário com Grade Completa e Comissões */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <section style={{ padding: '1.35rem', borderRadius: '16px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 900 }}>📅 Grade de Horários & Ocupação Multi-CT</h3>
                <InteractiveCombatCalendar userRole="PROFESSOR" />
              </section>

              <section style={{ padding: '1.35rem', borderRadius: '16px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
                <TeacherCommissionsTab />
              </section>
            </div>
          </div>
        )}

        {/* =========================================================================
            LAYOUT 3: PORTAL DO INSTRUTOR PARCEIRO (BORDAS RETAS 0PX, TABELAS FORMAIS & DOSSIÊ B2B)
            ========================================================================= */}
        {activePreset === 'partner_portal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
            {/* Topo Executivo com Indicadores de Repasse */}
            <section style={{ padding: '1.75rem', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderTop: '4px solid var(--color-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.14em' }}>
                    DOSSIÊ DO PROFESSOR PARCEIRO · CONTRATO ATIVO
                  </span>
                  <h2 style={{ margin: '0.2rem 0', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Gestão de Aulas, Validação de Check-ins & Extrato de Repasses
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleToggleCancelarAula}
                    style={{
                      padding: '0.6rem 1.15rem',
                      background: aulaCancelada ? 'var(--status-available)' : 'var(--bg-surface-2)',
                      color: aulaCancelada ? '#fff' : 'var(--status-full)',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {aulaCancelada ? 'Reativar Turma na Rede' : 'Suspender Turma'}
                  </button>
                </div>
              </div>

              {/* Balanço Contábil de Repasses */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--color-primary)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>FATURAMENTO DA TURMA</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-foreground)', marginTop: '0.2rem' }}>R$ 1.840,00</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--status-available)', marginTop: '0.2rem' }}>+12% vs mês anterior</div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--status-available)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>REPASSE ESTIMADO DO INSTRUTOR</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--status-available)', marginTop: '0.2rem' }}>R$ 920,00</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem' }}>50% do volume validado</div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--bg-background)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--color-primary)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>RETENÇÃO DE ATLETAS (30D)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-foreground)', marginTop: '0.2rem' }}>91.4%</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--status-available)', marginTop: '0.2rem' }}>Índice de assiduidade alto</div>
                </div>
              </div>

              {/* Tabela Formal de Alunos Inscritos (Estilo Planilha Executiva B2B) */}
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-background)', borderBottom: '2px solid var(--color-primary)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>CÓDIGO</th>
                      <th style={{ padding: '0.75rem 1rem' }}>ALUNO</th>
                      <th style={{ padding: '0.75rem 1rem' }}>ORIGEM / PASSE</th>
                      <th style={{ padding: '0.75rem 1rem' }}>GRADUAÇÃO</th>
                      <th style={{ padding: '0.75rem 1rem' }}>FREQUÊNCIA (30D)</th>
                      <th style={{ padding: '0.75rem 1rem' }}>REPASSE R$</th>
                      <th style={{ padding: '0.75rem 1rem' }}>STATUS CHECK-IN</th>
                      <th style={{ padding: '0.75rem 1rem' }}>AÇÃO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((st, i) => (
                      <tr key={st.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'var(--bg-surface-1)' : 'var(--bg-background)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>#{st.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 900 }}>{st.nome}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted-foreground)' }}>{st.academiaOrigem}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{st.graduacao}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>{st.assiduidade30d}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 900, color: 'var(--color-primary)' }}>R$ 45,00</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.2rem 0.55rem',
                              fontSize: '0.68rem',
                              fontWeight: 900,
                              background: st.statusChamada === 'PRESENTE' ? 'var(--status-available-bg)' : 'var(--bg-surface-2)',
                              color: st.statusChamada === 'PRESENTE' ? 'var(--status-available)' : 'var(--text-muted-foreground)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            {st.statusChamada}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => handleMarcarStatus(st.id, 'PRESENTE')}
                              style={{ padding: '0.3rem 0.65rem', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', border: 'none', fontWeight: 900, fontSize: '0.7rem', cursor: 'pointer' }}
                            >
                              Validar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarcarStatus(st.id, 'FALTA')}
                              style={{ padding: '0.3rem 0.65rem', background: 'transparent', color: 'var(--status-full)', border: '1px solid var(--status-full)', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}
                            >
                              Falta
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Extrato de Comissões e Repasses B2B em Destaque */}
            <section style={{ padding: '1.75rem', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
              <TeacherCommissionsTab />
            </section>

            {/* Grade de Horários */}
            <section style={{ padding: '1.75rem', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>
                Cronograma Semanal de Turmas & Ocupação
              </h3>
              <InteractiveCombatCalendar userRole="PROFESSOR" />
            </section>
          </div>
        )}

        {/* =========================================================================
            LAYOUT 4: TATAME TOUCH-FIRST CLÁSSICO (CARDS GRANDES PARA CELULAR/TABLET NO TATAME)
            ========================================================================= */}
        {activePreset === 'classic_teacher' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
            {/* Barra de Abas Horizontais Touch-First */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                padding: '0.5rem',
                borderRadius: '16px',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {[
                { id: 'aula_atual', icon: '🥋', label: '1. Chamada Tatame' },
                { id: 'grade_horarios', icon: '📅', label: '2. Grade & Turmas' },
                { id: 'comissoes', icon: '💵', label: '3. Extrato Repasses' },
                { id: 'avaliacao_xp', icon: '🏅', label: '4. Mérito & Bônus' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveNavTab(tab.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: activeNavTab === tab.id ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: activeNavTab === tab.id ? 'var(--color-primary)' : 'var(--bg-background)',
                    color: activeNavTab === tab.id ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Painel de Ocupação Rápida em 1 Toque */}
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                background: 'var(--bg-surface-1)',
                border: '2px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  TURMA AO VIVO NO TATAME
                </span>
                <h2 style={{ margin: '0.25rem 0', fontSize: '1.6rem', fontWeight: 900 }}>
                  {selectedHorario} — {selectedModalidade}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                  CT: {selectedUnidade}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '14px',
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--color-primary)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted-foreground)' }}>VAGAS LIVRES</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                    {limiteVagas - totalConfirmadosOuAgendados} de {limiteVagas}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleCancelarAula}
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: '14px',
                    background: aulaCancelada ? 'var(--status-available)' : 'var(--status-full-bg)',
                    color: aulaCancelada ? '#fff' : 'var(--status-full)',
                    border: '1px solid var(--status-full)',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {aulaCancelada ? '🟢 Reativar Turma' : '🚫 Cancelar Turma'}
                </button>
              </div>
            </div>

            {/* Chamada Touch-First (Cards Gigantes para Operação no Tatame) */}
            {(activeNavTab === 'aula_atual' || activeNavTab === 'todos') && (
              <section
                style={{
                  padding: '1.5rem',
                  borderRadius: '20px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>
                    🥊 Chamada Rápida (1 Toque Touch-Target)
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                    {roster.length} Atletas Agendados
                  </span>
                </div>

                <div style={{ display: 'grid', gap: '0.85rem' }}>
                  {roster.map(st => {
                    const isPresent = st.statusChamada === 'PRESENTE';
                    const isAbsent = st.statusChamada === 'FALTA';

                    return (
                      <div
                        key={st.id}
                        style={{
                          padding: '1.15rem 1.35rem',
                          borderRadius: '16px',
                          background: isPresent ? 'var(--status-available-bg)' : isAbsent ? 'var(--status-full-bg)' : 'var(--bg-background)',
                          border: isPresent ? '2px solid var(--status-available-border)' : isAbsent ? '2px solid var(--status-full-border)' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 900 }}>{st.nome}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted-foreground)', marginTop: '0.15rem' }}>
                            {st.graduacao} · {st.academiaOrigem}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.65rem' }}>
                          <button
                            type="button"
                            onClick={() => handleMarcarStatus(st.id, 'PRESENTE')}
                            style={{
                              padding: '0.75rem 1.5rem',
                              borderRadius: '12px',
                              background: isPresent ? 'var(--status-available)' : 'var(--bg-surface-2)',
                              color: isPresent ? '#fff' : 'var(--status-available)',
                              border: '1px solid var(--status-available-border)',
                              fontSize: '0.88rem',
                              fontWeight: 900,
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Presente
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarcarStatus(st.id, 'FALTA')}
                            style={{
                              padding: '0.75rem 1.35rem',
                              borderRadius: '12px',
                              background: isAbsent ? 'var(--status-full)' : 'var(--bg-surface-2)',
                              color: isAbsent ? '#fff' : 'var(--status-full)',
                              border: '1px solid var(--status-full-border)',
                              fontSize: '0.88rem',
                              fontWeight: 900,
                              cursor: 'pointer'
                            }}
                          >
                            ✕ Falta
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Módulo de Grade Oficial */}
            {(activeNavTab === 'grade_horarios' || activeNavTab === 'todos') && (
              <section style={{ padding: '1.5rem', borderRadius: '20px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 900 }}>📅 Grade Oficial de Horários</h3>
                <InteractiveCombatCalendar userRole="PROFESSOR" />
              </section>
            )}

            {/* Módulo de Comissões */}
            {(activeNavTab === 'comissoes' || activeNavTab === 'todos') && (
              <section style={{ padding: '1.5rem', borderRadius: '20px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
                <TeacherCommissionsTab />
              </section>
            )}

            {/* Módulo de Mérito */}
            {(activeNavTab === 'avaliacao_xp' || activeNavTab === 'todos') && (
              <section style={{ padding: '1.5rem', borderRadius: '20px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1.15rem', fontWeight: 900 }}>🏅 Concessão de Mérito Marcial & Bônus</h4>
                <form onSubmit={handleConcederBonus} style={{ display: 'grid', gap: '0.75rem', maxWidth: '600px' }}>
                  <select
                    value={bonusAlunoId}
                    onChange={e => setBonusAlunoId(e.target.value)}
                    style={{ padding: '0.65rem', borderRadius: '10px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                  >
                    {roster.map(r => (
                      <option key={r.id} value={r.id}>{r.nome} ({r.graduacao})</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={bonusMotivo}
                    onChange={e => setBonusMotivo(e.target.value)}
                    placeholder="Motivo da bonificação..."
                    style={{ padding: '0.65rem', borderRadius: '10px', background: 'var(--bg-background)', color: 'var(--text-foreground)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                  />
                  <button type="submit" style={{ padding: '0.75rem', borderRadius: '10px', background: 'var(--color-primary)', color: 'var(--text-primary-foreground)', border: 'none', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Creditar +{bonusPoints} XP ao Aluno
                  </button>
                </form>
              </section>
            )}

            {/* Barra Inferior Fixa Exclusiva do Super-App Clássico em Celular */}
            <nav
              aria-label="Dock Super-App Professor"
              className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-2 flex items-center justify-around shadow-2xl backdrop-blur-md"
              style={{
                background: 'var(--bg-surface-1)',
                borderTop: '2px solid var(--color-primary)',
              }}
            >
              {[
                { id: 'aula_atual', icon: '🥋', label: 'Chamada' },
                { id: 'grade_horarios', icon: '📅', label: 'Grade' },
                { id: 'comissoes', icon: '💵', label: 'Repasses' },
                { id: 'avaliacao_xp', icon: '🏅', label: 'Mérito' }
              ].map(dock => {
                const isAct = activeNavTab === dock.id;
                return (
                  <button
                    key={dock.id}
                    type="button"
                    onClick={() => setActiveNavTab(dock.id)}
                    className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all"
                    style={{
                      background: isAct ? 'var(--color-primary)' : 'transparent',
                      color: isAct ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                    }}
                  >
                    <span className="text-sm leading-none">{dock.icon}</span>
                    <span>{dock.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPortalPage;
