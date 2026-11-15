import React, { useState, useEffect } from 'react';
import { studentApi, adminApi } from '../services/api';

export interface ClassScheduleItem {
  id: string;
  dataIso: string;
  dia: number;
  horario: string;
  horarioCurto: string;
  horarioFormatado: string;
  titulo: string;
  professorNome: string;
  modalidade: string;
  academiaId?: string;
  academiaNome?: string;
  regiao?: string;
  cancelada: boolean;
  motivoCancelamento?: string;
  capacidade: number;
  totalAgendados: number;
  totalAulasExp: number;
  haVagas: boolean;
  lotado: boolean;
  meuCheckin?: {
    id: string;
    status: 'AGENDADO' | 'PRESENTE' | 'FALTA' | 'DOENCA';
    data: string;
  } | null;
  alunosAgendados: Array<{
    id: string;
    nome: string;
    prajied?: string;
    telefone?: string;
    tierPasse?: string;
    status: string;
    presencaId?: string;
  }>;
  leadsExp: Array<{
    id: string;
    nome: string;
    telefone?: string;
    status: string;
  }>;
}

interface InteractiveCombatCalendarProps {
  userRole: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
  alunoId?: string;
  alunoNome?: string;
  alunoLogado?: any;
  usuarioLogado?: any;
  usuarioProfessor?: any;
  onCheckinChanged?: () => void;
  onRefreshExternal?: () => void;
  defaultViewMode?: 'grid' | 'agenda' | 'semana';
}

export const InteractiveCombatCalendar: React.FC<InteractiveCombatCalendarProps> = ({
  userRole,
  alunoId,
  alunoLogado,
  onCheckinChanged,
  onRefreshExternal
}) => {
  const effectiveAlunoId = alunoId || alunoLogado?.id;
  const notifyRefresh = () => {
    onCheckinChanged?.();
    onRefreshExternal?.();
  };

  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth() + 1);
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [academiaFiltro, setAcademiaFiltro] = useState<string>('TODAS');
  const [modalidadeFiltro, setModalidadeFiltro] = useState<string>('TODAS');
  const [academiasDisponiveis, setAcademiasDisponiveis] = useState<any[]>([]);
  const [aulasPorDia, setAulasPorDia] = useState<Record<string, ClassScheduleItem[]>>({});
  const [loading, setLoading] = useState(true);

  // Inicializa com a data de hoje formatada YYYY-MM-DD
  const hojeIso = hoje.toISOString().split('T')[0];
  const [diaSelecionado, setDiaSelecionado] = useState<string>(hojeIso);

  const [processandoAcao, setProcessandoAcao] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [showModalCancelarAula, setShowModalCancelarAula] = useState(false);
  const [aulaParaCancelar, setAulaParaCancelar] = useState<ClassScheduleItem | null>(null);

  useEffect(() => {
    studentApi
      .getAcademies()
      .then(res => {
        if (Array.isArray(res.data)) setAcademiasDisponiveis(res.data);
      })
      .catch(() => {});
  }, []);

  const carregarCalendario = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getMonthSchedule({
        mes: mesAtual,
        ano: anoAtual,
        alunoId: userRole === 'ALUNO' ? effectiveAlunoId : undefined,
        academia: academiaFiltro !== 'TODAS' ? academiaFiltro : undefined,
        modalidade: modalidadeFiltro !== 'TODAS' ? modalidadeFiltro : undefined
      });

      if (res.data?.aulasPorDia) {
        setAulasPorDia(res.data.aulasPorDia);
      }
    } catch (err) {
      console.error('Erro ao carregar calendário de aulas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCalendario();
  }, [mesAtual, anoAtual, effectiveAlunoId, academiaFiltro, modalidadeFiltro]);

  const handleFazerCheckin = async (aula: ClassScheduleItem) => {
    if (!effectiveAlunoId) return;
    setProcessandoAcao(true);
    setErroMsg('');

    try {
      const res = await studentApi.checkInBySchedule({
        alunoId: effectiveAlunoId,
        eventoId: aula.id
      });
      setSucessoMsg(res.data?.mensagem || 'Check-in realizado com sucesso! Presença agendada.');
      setTimeout(() => setSucessoMsg(''), 4000);
      await carregarCalendario();
      notifyRefresh();
    } catch (err: any) {
      setErroMsg(err.response?.data?.erro || 'Erro ao realizar check-in.');
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleCancelarCheckin = async (checkinId: string) => {
    if (!effectiveAlunoId) return;
    if (!confirm('Deseja realmente cancelar seu check-in nesta aula? Sua vaga e crédito serão liberados.')) return;

    setProcessandoAcao(true);
    setErroMsg('');

    try {
      const res = await studentApi.cancelCheckIn({
        checkinId,
        alunoId: effectiveAlunoId
      });
      setSucessoMsg(res.data?.mensagem || 'Check-in cancelado e vaga liberada!');
      setTimeout(() => setSucessoMsg(''), 4000);
      await carregarCalendario();
      notifyRefresh();
    } catch (err: any) {
      setErroMsg(err.response?.data?.erro || 'Erro ao cancelar check-in.');
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleConfirmarCancelarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aulaParaCancelar) return;

    setProcessandoAcao(true);
    try {
      await adminApi.cancelClass(aulaParaCancelar.id, motivoCancelamento.trim() || undefined);
      setShowModalCancelarAula(false);
      setMotivoCancelamento('');
      setAulaParaCancelar(null);
      setSucessoMsg('Aula cancelada! Ela aparecerá riscada no calendário de todos.');
      setTimeout(() => setSucessoMsg(''), 4000);
      await carregarCalendario();
    } catch (err) {
      setErroMsg('Erro ao cancelar aula.');
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleReativarAula = async (aulaId: string) => {
    setProcessandoAcao(true);
    try {
      await adminApi.reactivateClass(aulaId);
      setSucessoMsg('Aula reativada no calendário!');
      setTimeout(() => setSucessoMsg(''), 4000);
      await carregarCalendario();
    } catch (err) {
      setErroMsg('Erro ao reativar aula.');
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleMarcarPresencaAluno = async (eventoId: string, targetAlunoId: string, status: string) => {
    setProcessandoAcao(true);
    try {
      await adminApi.markClassAttendance(eventoId, {
        alunoId: targetAlunoId,
        status
      });
      setSucessoMsg(`Presença atualizada para ${status}!`);
      setTimeout(() => setSucessoMsg(''), 3000);
      await carregarCalendario();
    } catch (err) {
      setErroMsg('Erro ao atualizar presença do aluno.');
    } finally {
      setProcessandoAcao(false);
    }
  };

  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diasSemanaNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const totalDiasNoMes = new Date(anoAtual, mesAtual, 0).getDate();

  // Array ordenado de todos os dias do mês para a fita horizontal
  const diasDoMes = Array.from({ length: totalDiasNoMes }, (_, i) => {
    const diaNum = i + 1;
    const dataIso = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
    const dateObj = new Date(anoAtual, mesAtual - 1, diaNum);
    const diaSemana = diasSemanaNomes[dateObj.getDay()];
    const aulas = aulasPorDia[dataIso] || [];
    return {
      diaNum,
      dataIso,
      diaSemana,
      totalAulas: aulas.length,
      aulas,
      temVagas: aulas.some(a => !a.cancelada && !a.lotado),
      temCheckin: aulas.some(a => Boolean(a.meuCheckin))
    };
  });

  const aulasDoDiaAtivo = aulasPorDia[diaSelecionado] || [];
  const diaSelecionadoObj = diasDoMes.find(d => d.dataIso === diaSelecionado);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* 1. TOPO DE CONTROLE E FILTROS */}
      <div
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                📅 Grade Oficial de Aulas & Check-in ao Vivo
              </span>
              <span
                style={{
                  padding: '0.18rem 0.55rem',
                  borderRadius: '999px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary-border)',
                  fontSize: '0.64rem',
                  fontWeight: 900,
                  textTransform: 'uppercase'
                }}
              >
                {userRole === 'ALUNO' ? 'Passe Unificado' : 'Gestão de Turmas'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem' }}>
              Selecione o dia na fita interativa para ver todas as turmas, disponibilidade de vagas e bater presença.
            </div>
          </div>

          {/* Navegador de Mês */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--bg-background)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.25rem 0.4rem'
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (mesAtual === 1) {
                  setMesAtual(12);
                  setAnoAtual(a => a - 1);
                } else {
                  setMesAtual(m => m - 1);
                }
              }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--bg-surface-1)',
                color: 'var(--text-foreground)',
                fontSize: '0.75rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              ◀
            </button>
            <span
              style={{
                padding: '0 0.65rem',
                fontSize: '0.8rem',
                fontWeight: 900,
                color: 'var(--text-foreground)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              {mesesNomes[mesAtual - 1]} / {anoAtual}
            </span>
            <button
              type="button"
              onClick={() => {
                if (mesAtual === 12) {
                  setMesAtual(1);
                  setAnoAtual(a => a + 1);
                } else {
                  setMesAtual(m => m + 1);
                }
              }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--bg-surface-1)',
                color: 'var(--text-foreground)',
                fontSize: '0.75rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Filtros em Linha */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.66rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted-foreground)', marginBottom: '0.25rem' }}>
              🏟️ Unidade / Centro de Treinamento:
            </label>
            <select
              value={academiaFiltro}
              onChange={e => setAcademiaFiltro(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-background)',
                color: 'var(--text-foreground)',
                fontSize: '0.76rem',
                fontWeight: 700
              }}
            >
              <option value="TODAS">🌐 Todas as Unidades Credenciadas</option>
              {academiasDisponiveis.map(ac => (
                <option key={ac.id || ac.slug} value={ac.slug || ac.nome}>
                  🥋 {ac.nome} ({ac.bairro || ac.cidade})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.66rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted-foreground)', marginBottom: '0.25rem' }}>
              🥊 Modalidade Marcial:
            </label>
            <select
              value={modalidadeFiltro}
              onChange={e => setModalidadeFiltro(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-background)',
                color: 'var(--text-foreground)',
                fontSize: '0.76rem',
                fontWeight: 700
              }}
            >
              <option value="TODAS">🔥 Todas as Modalidades (Muay Thai, BJJ, Boxe, MMA)</option>
              <option value="Muay Thai">🇹🇭 Muay Thai & Muay Thai Kids</option>
              <option value="Jiu-Jitsu">🥋 Jiu-Jitsu (Gi & No-Gi)</option>
              <option value="Boxe">🥊 Boxe Clássico & Sparring</option>
              <option value="MMA">⛓️ MMA & Wrestling</option>
            </select>
          </div>
        </div>
      </div>

      {sucessoMsg && (
        <div style={{ padding: '0.65rem 1rem', borderRadius: '10px', background: 'var(--status-available-bg)', border: '1px solid var(--status-available-border)', color: 'var(--status-available)', fontSize: '0.78rem', fontWeight: 900 }}>
          ✓ {sucessoMsg}
        </div>
      )}

      {erroMsg && (
        <div style={{ padding: '0.65rem 1rem', borderRadius: '10px', background: 'var(--status-full-bg)', border: '1px solid var(--status-full-border)', color: 'var(--status-full)', fontSize: '0.78rem', fontWeight: 900 }}>
          ⚠️ {erroMsg}
        </div>
      )}

      {/* 2. FITA INTERATIVA HORIZONTAL DE DIAS DO MÊS (SELETOR NÍTIDO, MODERNO E SEM AMASSAR) */}
      <div
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted-foreground)', textTransform: 'uppercase' }}>
          <span>👉 Escolha o dia no calendário horizontal:</span>
          <span>● {totalDiasNoMes} Dias no Mês</span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'thin'
          }}
        >
          {diasDoMes.map(d => {
            const isSelected = d.dataIso === diaSelecionado;
            const isToday = d.dataIso === hojeIso;

            return (
              <button
                key={d.dataIso}
                type="button"
                onClick={() => setDiaSelecionado(d.dataIso)}
                style={{
                  minWidth: '64px',
                  padding: '0.65rem 0.4rem',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid var(--color-primary)' : isToday ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--color-primary)' : isToday ? 'var(--color-primary-light)' : 'var(--bg-background)',
                  color: isSelected ? 'var(--text-primary-foreground)' : 'var(--text-foreground)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.6 }}>
                  {d.diaSemana}
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1 }}>
                  {d.diaNum}
                </span>
                <span
                  style={{
                    fontSize: '0.58rem',
                    fontWeight: 900,
                    padding: '0.1rem 0.35rem',
                    borderRadius: '999px',
                    background: isSelected ? 'rgba(0,0,0,0.25)' : 'var(--bg-surface-2)',
                    color: isSelected ? 'inherit' : d.totalAulas > 0 ? 'var(--color-primary)' : 'var(--text-muted-foreground)'
                  }}
                >
                  {d.totalAulas > 0 ? `${d.totalAulas} aulas` : 'Sem aula'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PAINEL DE AULAS DO DIA SELECIONADO (CARDS ESTRUTURADOS, LEGÍVEIS E ESPAÇOSOS) */}
      <div
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              HORÁRIOS & CHECK-IN CONFIRMADO
            </span>
            <h3 style={{ margin: '0.15rem 0 0 0', fontSize: '1.25rem', fontWeight: 900 }}>
              Turmas do Dia {diaSelecionado.split('-')[2]} de {mesesNomes[Number(diaSelecionado.split('-')[1]) - 1]} ({diaSelecionadoObj?.diaSemana})
            </h3>
          </div>
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted-foreground)' }}>
            {aulasDoDiaAtivo.length} treino(s) agendado(s) neste dia
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted-foreground)', fontSize: '0.82rem' }}>
            Carregando horários do tatame...
          </div>
        ) : aulasDoDiaAtivo.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '12px', background: 'var(--bg-background)', border: '1px dashed var(--border-subtle)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>🥋</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
              Nenhum treino programado para este dia com os filtros atuais.
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem' }}>
              Experimente selecionar outro dia na fita acima ou mudar o filtro de unidade/modalidade.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
            {aulasDoDiaAtivo.map(aula => {
              const isMinhaAula = Boolean(aula.meuCheckin);
              const pendenteAceite = aula.meuCheckin?.status === 'AGENDADO';
              const presencaAceita = aula.meuCheckin?.status === 'PRESENTE';

              return (
                <div
                  key={aula.id}
                  style={{
                    padding: '1.15rem',
                    borderRadius: '14px',
                    background: 'var(--bg-background)',
                    border: isMinhaAula ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    opacity: aula.cancelada ? 0.6 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.85rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.45rem' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                        ⏰ {aula.horario}
                      </div>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: aula.cancelada
                            ? 'var(--status-full-bg)'
                            : aula.lotado
                            ? 'var(--status-full-bg)'
                            : 'var(--status-available-bg)',
                          color: aula.cancelada
                            ? 'var(--status-full)'
                            : aula.lotado
                            ? 'var(--status-full)'
                            : 'var(--status-available)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {aula.cancelada ? 'AULA CANCELADA' : aula.lotado ? '[LOTADO]' : '[HÁ VAGAS]'}
                      </span>
                    </div>

                    <h4
                      style={{
                        margin: '0 0 0.35rem 0',
                        fontSize: '1.02rem',
                        fontWeight: 900,
                        textDecoration: aula.cancelada ? 'line-through' : 'none'
                      }}
                    >
                      {aula.titulo || aula.modalidade}
                    </h4>

                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted-foreground)', display: 'grid', gap: '0.2rem' }}>
                      <div>
                        🏛️ <strong>{aula.academiaNome || 'Centro de Combate'}</strong>
                      </div>
                      <div>
                        🥋 Mestre: <strong style={{ color: 'var(--text-foreground)' }}>{aula.professorNome}</strong>
                      </div>
                      <div>
                        👥 Lotação: <strong>{aula.totalAgendados} de {aula.capacidade} alunos</strong>
                      </div>
                    </div>

                    {aula.cancelada && aula.motivoCancelamento && (
                      <div style={{ marginTop: '0.5rem', padding: '0.45rem 0.65rem', borderRadius: '8px', background: 'var(--status-full-bg)', color: 'var(--status-full)', fontSize: '0.72rem', fontStyle: 'italic' }}>
                        Aviso: "{aula.motivoCancelamento}"
                      </div>
                    )}
                  </div>

                  {/* Ações de Check-in */}
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {userRole === 'ALUNO' && !aula.cancelada && (
                      <div>
                        {isMinhaAula ? (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.74rem', fontWeight: 900, color: 'var(--status-available)' }}>
                              {presencaAceita ? '✓ Presença Confirmada!' : '⏳ Check-in Agendado'}
                            </span>
                            {pendenteAceite && aula.meuCheckin && (
                              <button
                                type="button"
                                onClick={() => handleCancelarCheckin(aula.meuCheckin!.id)}
                                disabled={processandoAcao}
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '6px',
                                  border: '1px solid var(--status-full)',
                                  background: 'transparent',
                                  color: 'var(--status-full)',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                Cancelar Vaga
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleFazerCheckin(aula)}
                            disabled={processandoAcao || aula.lotado}
                            style={{
                              width: '100%',
                              padding: '0.65rem',
                              borderRadius: '8px',
                              border: 'none',
                              background: aula.lotado ? 'var(--bg-surface-2)' : 'var(--color-primary)',
                              color: aula.lotado ? 'var(--text-muted-foreground)' : 'var(--text-primary-foreground)',
                              fontSize: '0.76rem',
                              fontWeight: 900,
                              cursor: aula.lotado ? 'not-allowed' : 'pointer',
                              textTransform: 'uppercase'
                            }}
                          >
                            {aula.lotado ? 'Turma Lotada' : '🥊 Bater Check-in Nesta Aula'}
                          </button>
                        )}
                      </div>
                    )}

                    {(userRole === 'ADMIN' || userRole === 'PROFESSOR') && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted-foreground)' }}>
                          {aula.alunosAgendados.length} aluno(s) agendado(s)
                        </span>
                        {aula.cancelada ? (
                          <button
                            type="button"
                            onClick={() => handleReativarAula(aula.id)}
                            disabled={processandoAcao}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              border: 'none',
                              background: 'var(--status-available)',
                              color: '#fff',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            🔄 Reativar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAulaParaCancelar(aula);
                              setShowModalCancelarAula(true);
                            }}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              border: '1px solid var(--status-full)',
                              background: 'var(--status-full-bg)',
                              color: 'var(--status-full)',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            🚫 Cancelar Aula
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL CANCELAR AULA */}
      {showModalCancelarAula && aulaParaCancelar && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10025, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <form
            onSubmit={handleConfirmarCancelarAula}
            style={{ width: '100%', maxWidth: '440px', borderRadius: '16px', background: 'var(--bg-surface-1)', border: '2px solid var(--status-full)', padding: '1.35rem', color: 'var(--text-foreground)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
          >
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>
              🚫 Cancelar Aula ({aulaParaCancelar.horarioFormatado})
            </h4>
            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted-foreground)' }}>
              Esta aula ficará riscada no calendário de todos os alunos da rede.
            </p>
            <input
              type="text"
              value={motivoCancelamento}
              onChange={e => setMotivoCancelamento(e.target.value)}
              placeholder="Motivo (ex: manutenção ou seminário externo)..."
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-background)', color: 'var(--text-foreground)', fontSize: '0.78rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowModalCancelarAula(false)}
                style={{ flex: 1, padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', color: 'var(--text-foreground)', fontWeight: 800, cursor: 'pointer' }}
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={processandoAcao}
                style={{ flex: 1, padding: '0.55rem', borderRadius: '8px', border: 'none', background: 'var(--status-full)', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
