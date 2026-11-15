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
  defaultViewMode?: 'grid' | 'agenda';
}

export const InteractiveCombatCalendar: React.FC<InteractiveCombatCalendarProps> = ({
  userRole,
  alunoId,
  alunoLogado,
  onCheckinChanged,
  onRefreshExternal,
  defaultViewMode = 'grid'
}) => {
  const effectiveAlunoId = alunoId || alunoLogado?.id;
  const notifyRefresh = () => {
    onCheckinChanged?.();
    onRefreshExternal?.();
  };

  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [academiaFiltro, setAcademiaFiltro] = useState<string>('TODAS');
  const [modalidadeFiltro, setModalidadeFiltro] = useState<string>('TODAS');
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>(defaultViewMode);
  const [academiasDisponiveis, setAcademiasDisponiveis] = useState<any[]>([]);
  const [aulasPorDia, setAulasPorDia] = useState<Record<string, ClassScheduleItem[]>>({});
  const [loading, setLoading] = useState(true);

  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
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

  const hojeIso = new Date().toISOString().split('T')[0];
  const primeiroDiaSemana = new Date(anoAtual, mesAtual - 1, 1).getDay();
  const totalDiasNoMes = new Date(anoAtual, mesAtual, 0).getDate();

  const aulasDoDiaSelecionado = diaSelecionado ? aulasPorDia[diaSelecionado] || [] : [];

  // Dias com aulas para o modo Agenda Horizontal
  const diasComAulas = Object.entries(aulasPorDia)
    .filter(([_, lista]) => Array.isArray(lista) && lista.length > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {/* BARRA DE CONTROLE DO CALENDÁRIO (TOTALMENTE RESPONSIVA E SEM QUEBRAS) */}
      <div
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                📅 Grade Oficial Multi-Academias & Lotação ao Vivo
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
                {userRole === 'ALUNO' ? 'Passe Unificado' : 'Gestão CT'}
              </span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted-foreground)', marginTop: '0.15rem' }}>
              Clique em qualquer dia para ver os horários detalhados, dar check-in ou verificar vagas.
            </div>
          </div>

          {/* Controles de Mês + Alternador Grade/Lista */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.22rem'
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                🗓️ Grade 7 Dias
              </button>
              <button
                type="button"
                onClick={() => setViewMode('agenda')}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: viewMode === 'agenda' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'agenda' ? 'var(--text-primary-foreground)' : 'var(--text-muted-foreground)',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                📋 Lista Compacta
              </button>
            </div>

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
                  padding: '0.3rem 0.55rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--bg-surface-1)',
                  color: 'var(--text-foreground)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ◀
              </button>
              <span
                style={{
                  padding: '0 0.5rem',
                  fontSize: '0.76rem',
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
                  padding: '0.3rem 0.55rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--bg-surface-1)',
                  color: 'var(--text-foreground)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* FILTROS DE ACADEMIA E MODALIDADE */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.64rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--text-muted-foreground)',
                marginBottom: '0.25rem'
              }}
            >
              🏟️ Filtrar Unidade / CT Credenciado:
            </label>
            <select
              value={academiaFiltro}
              onChange={e => setAcademiaFiltro(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-background)',
                color: 'var(--text-foreground)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <option value="TODAS">🌐 Todas as Unidades Credenciadas</option>
              {academiasDisponiveis.length > 0 ? (
                academiasDisponiveis.map(ac => (
                  <option key={ac.id || ac.slug} value={ac.slug || ac.nome}>
                    🥋 {ac.nome} ({ac.bairro || ac.cidade})
                  </option>
                ))
              ) : (
                <>
                  <option value="ct-boru-matriz">🥋 CT Borü (Matriz) — Zona Central</option>
                  <option value="tatame-sul-bjj">🥋 Alliance / Tatame Sul BJJ — Zona Sul</option>
                  <option value="arena-nobre-arte">🥊 Arena Nobre Arte Boxing — Embratel</option>
                  <option value="iron-cage-mma">🏆 Iron Cage MMA & Wrestling — Rio Madeira</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.64rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--text-muted-foreground)',
                marginBottom: '0.25rem'
              }}
            >
              🥊 Filtrar Modalidade Marcial:
            </label>
            <select
              value={modalidadeFiltro}
              onChange={e => setModalidadeFiltro(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-background)',
                color: 'var(--text-foreground)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <option value="TODAS">🔥 Todas as Modalidades (Muay Thai, BJJ, Boxe, MMA)</option>
              <option value="Muay Thai">🇹🇭 Muay Thai & Muay Thai Kids</option>
              <option value="Jiu-Jitsu">🥋 Jiu-Jitsu (Gi & No-Gi)</option>
              <option value="Boxe">🥊 Boxe Olímpico & Sparring</option>
              <option value="MMA">⛓️ MMA & Wrestling</option>
            </select>
          </div>
        </div>
      </div>

      {sucessoMsg && (
        <div
          style={{
            padding: '0.65rem 0.9rem',
            borderRadius: '10px',
            background: 'var(--status-available-bg)',
            border: '1px solid var(--status-available-border)',
            color: 'var(--status-available)',
            fontSize: '0.76rem',
            fontWeight: 800
          }}
        >
          ✓ {sucessoMsg}
        </div>
      )}

      {erroMsg && (
        <div
          style={{
            padding: '0.65rem 0.9rem',
            borderRadius: '10px',
            background: 'var(--status-full-bg)',
            border: '1px solid var(--status-full-border)',
            color: 'var(--status-full)',
            fontSize: '0.76rem',
            fontWeight: 800
          }}
        >
          ⚠️ {erroMsg}
        </div>
      )}

      {/* CORPO DO CALENDÁRIO */}
      <div
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '0.9rem',
          overflowX: 'auto'
        }}
      >
        {loading ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted-foreground)', fontSize: '0.8rem' }}>
            Carregando grade oficial de horários do mês...
          </div>
        ) : viewMode === 'agenda' ? (
          /* VISÃO EM LISTA HORIZONTAL / AGENDA COMPACTA (NUNCA ESPREME) */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {diasComAulas.slice(0, 12).map(([dataIso, lista]) => {
              const ehHoje = dataIso === hojeIso;
              return (
                <div
                  key={dataIso}
                  onClick={() => setDiaSelecionado(dataIso)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    background: 'var(--bg-background)',
                    border: ehHoje ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: ehHoje ? 'var(--color-primary)' : 'var(--text-foreground)' }}>
                      📆 Dia {dataIso.split('-')[2]}/{dataIso.split('-')[1]}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted-foreground)' }}>
                      {lista.length} turmas
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {lista.slice(0, 4).map(aula => (
                      <div
                        key={aula.id}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: '6px',
                          background: 'var(--bg-surface-1)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.7rem'
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 800,
                            color: aula.cancelada ? 'var(--text-muted-foreground)' : 'var(--text-foreground)',
                            textDecoration: aula.cancelada ? 'line-through' : 'none',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {aula.horarioCurto} · {aula.modalidade}
                        </span>
                        <span
                          style={{
                            fontSize: '0.6rem',
                            fontWeight: 900,
                            color: aula.cancelada
                              ? 'var(--status-full)'
                              : aula.lotado
                              ? 'var(--status-full)'
                              : 'var(--status-available)'
                          }}
                        >
                          {aula.cancelada ? 'CANC.' : aula.lotado ? '[LOTADO]' : '[VAGAS]'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VISÃO GRADE MENSAL DE 7 COLUNAS COM LARGURA MÍNIMA GARANTIDA (NUNCA AMASSA) */
          <div style={{ minWidth: '680px' }}>
            {/* Cabeçalho dos 7 Dias da Semana */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(92px, 1fr))',
                gap: '0.4rem',
                marginBottom: '0.45rem',
                textAlign: 'center',
                fontSize: '0.68rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--text-muted-foreground)'
              }}
            >
              <div style={{ color: 'var(--color-primary)' }}>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            {/* Células do Mês */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(92px, 1fr))',
                gap: '0.4rem'
              }}
            >
              {Array.from({ length: primeiroDiaSemana }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  style={{
                    minHeight: '88px',
                    borderRadius: '8px',
                    background: 'var(--bg-background)',
                    opacity: 0.35,
                    border: '1px dashed var(--border-subtle)'
                  }}
                />
              ))}

              {Array.from({ length: totalDiasNoMes }).map((_, idx) => {
                const diaNum = idx + 1;
                const dataIso = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
                const aulasDoDia = aulasPorDia[dataIso] || [];
                const ehHoje = dataIso === hojeIso;
                const estaSelecionado = diaSelecionado === dataIso;
                const meuCheckinNoDia = aulasDoDia.find(a => Boolean(a.meuCheckin));
                const totalAlunosDia = aulasDoDia.reduce((acc, a) => acc + a.totalAgendados, 0);

                return (
                  <div
                    key={`day-${diaNum}`}
                    onClick={() => setDiaSelecionado(dataIso)}
                    style={{
                      minHeight: '92px',
                      padding: '0.4rem',
                      borderRadius: '9px',
                      background: estaSelecionado ? 'var(--bg-surface-2)' : 'var(--bg-background)',
                      border: estaSelecionado
                        ? '2px solid var(--color-primary)'
                        : ehHoje
                        ? '2px solid var(--color-primary)'
                        : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.25rem',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Topo do Dia */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 900,
                          color: ehHoje || estaSelecionado ? 'var(--color-primary)' : 'var(--text-foreground)'
                        }}
                      >
                        {diaNum}
                      </span>
                      {ehHoje && (
                        <span
                          style={{
                            fontSize: '0.55rem',
                            fontWeight: 900,
                            padding: '0.08rem 0.3rem',
                            borderRadius: '4px',
                            background: 'var(--color-primary)',
                            color: 'var(--text-primary-foreground)',
                            textTransform: 'uppercase'
                          }}
                        >
                          Hoje
                        </span>
                      )}
                      {meuCheckinNoDia && !ehHoje && (
                        <span
                          style={{
                            fontSize: '0.55rem',
                            fontWeight: 900,
                            padding: '0.08rem 0.3rem',
                            borderRadius: '4px',
                            background: 'var(--status-available-bg)',
                            color: 'var(--status-available)'
                          }}
                        >
                          ✓ Check
                        </span>
                      )}
                    </div>

                    {/* Lista compacta de até 3 horários */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem' }}>
                      {aulasDoDia.slice(0, 3).map(aula => (
                        <div
                          key={aula.id}
                          style={{
                            fontSize: '0.6rem',
                            padding: '0.12rem 0.28rem',
                            borderRadius: '4px',
                            background: 'var(--bg-surface-1)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.2rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                          }}
                        >
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontWeight: 700,
                              color: aula.cancelada ? 'var(--text-muted-foreground)' : 'var(--text-foreground)',
                              textDecoration: aula.cancelada ? 'line-through' : 'none'
                            }}
                          >
                            {aula.horarioCurto} {aula.modalidade.slice(0, 5)}
                          </span>
                          <span
                            style={{
                              fontSize: '0.54rem',
                              fontWeight: 900,
                              color: aula.cancelada || aula.lotado ? 'var(--status-full)' : 'var(--status-available)'
                            }}
                          >
                            {aula.cancelada ? '✕' : aula.lotado ? 'LOT' : 'OK'}
                          </span>
                        </div>
                      ))}
                      {aulasDoDia.length > 3 && (
                        <span style={{ fontSize: '0.56rem', color: 'var(--text-muted-foreground)', fontWeight: 800, textAlign: 'right' }}>
                          +{aulasDoDia.length - 3} mais
                        </span>
                      )}
                    </div>

                    {/* Rodapé da célula */}
                    <div
                      style={{
                        fontSize: '0.58rem',
                        color: 'var(--text-muted-foreground)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '0.15rem'
                      }}
                    >
                      <span>👥 {totalAlunosDia}</span>
                      <span>{aulasDoDia.length}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legenda */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.68rem',
            color: 'var(--text-muted-foreground)'
          }}
        >
          <span>🟢 <strong style={{ color: 'var(--status-available)' }}>[OK / HÁ VAGAS]</strong> Turma com vagas</span>
          <span>🔴 <strong style={{ color: 'var(--status-full)' }}>[LOT / LOTADO]</strong> Capacidade máxima</span>
          <span>🚫 <span style={{ textDecoration: 'line-through' }}>18h Muay</span> Aula cancelada pelo professor</span>
        </div>
      </div>

      {/* MODAL DETALHADO DO DIA SELECIONADO */}
      {diaSelecionado && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10020,
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setDiaSelecionado(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '720px',
              maxHeight: '88vh',
              overflowY: 'auto',
              borderRadius: '20px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--color-primary)',
              padding: '1.5rem',
              color: 'var(--text-foreground)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  GRADE OFICIAL COMBAT-PASS · CHECK-IN POR HORÁRIO
                </span>
                <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.15rem', fontWeight: 900 }}>
                  Horários do Dia {diaSelecionado}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDiaSelecionado(null)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
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

            {aulasDoDiaSelecionado.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted-foreground)', fontSize: '0.82rem' }}>
                Nenhuma aula programada para este dia/filtro.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {aulasDoDiaSelecionado.map(aula => {
                  const isMinhaAula = Boolean(aula.meuCheckin);
                  const pendenteAceite = aula.meuCheckin?.status === 'AGENDADO';
                  const presencaAceita = aula.meuCheckin?.status === 'PRESENTE';

                  return (
                    <div
                      key={aula.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '14px',
                        background: 'var(--bg-background)',
                        border: isMinhaAula ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        opacity: aula.cancelada ? 0.65 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.95rem',
                                fontWeight: 900,
                                textDecoration: aula.cancelada ? 'line-through' : 'none'
                              }}
                            >
                              ⏰ {aula.horario} · {aula.titulo}
                            </span>
                            <span
                              style={{
                                fontSize: '0.64rem',
                                fontWeight: 900,
                                padding: '0.18rem 0.5rem',
                                borderRadius: '4px',
                                background: aula.cancelada || aula.lotado ? 'var(--status-full-bg)' : 'var(--status-available-bg)',
                                color: aula.cancelada || aula.lotado ? 'var(--status-full)' : 'var(--status-available)'
                              }}
                            >
                              {aula.cancelada ? 'AULA CANCELADA' : aula.lotado ? '[LOTADO]' : '[HÁ VAGAS]'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem' }}>
                            Mestre: <strong style={{ color: 'var(--text-foreground)' }}>{aula.professorNome}</strong> · Modalidade: <strong style={{ color: 'var(--text-foreground)' }}>{aula.modalidade}</strong> · Lotação: {aula.totalAgendados}/{aula.capacidade}
                          </div>
                        </div>

                        {(userRole === 'ADMIN' || userRole === 'PROFESSOR') && (
                          <div>
                            {aula.cancelada ? (
                              <button
                                type="button"
                                onClick={() => handleReativarAula(aula.id)}
                                disabled={processandoAcao}
                                style={{
                                  padding: '0.4rem 0.75rem',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: 'var(--status-available)',
                                  color: '#fff',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                🔄 Reativar Aula
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setAulaParaCancelar(aula);
                                  setShowModalCancelarAula(true);
                                }}
                                style={{
                                  padding: '0.4rem 0.75rem',
                                  borderRadius: '8px',
                                  border: '1px solid var(--status-full)',
                                  background: 'var(--status-full-bg)',
                                  color: 'var(--status-full)',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                🚫 Cancelar Aula (Riscar)
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {userRole === 'ALUNO' && !aula.cancelada && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                          {isMinhaAula ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 900, color: 'var(--status-available)' }}>
                                {presencaAceita ? '✓ Presença Confirmada pelo Professor!' : '⏳ Check-in Agendado (Aguardando Professor)'}
                              </span>
                              {pendenteAceite && aula.meuCheckin && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelarCheckin(aula.meuCheckin!.id)}
                                  disabled={processandoAcao}
                                  style={{
                                    padding: '0.35rem 0.7rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--status-full)',
                                    background: 'transparent',
                                    color: 'var(--status-full)',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  ❌ Cancelar Meu Check-in
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleFazerCheckin(aula)}
                              disabled={processandoAcao || aula.lotado}
                              style={{
                                padding: '0.5rem 0.95rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: aula.lotado ? 'var(--bg-surface-2)' : 'var(--color-primary)',
                                color: aula.lotado ? 'var(--text-muted-foreground)' : 'var(--text-primary-foreground)',
                                fontSize: '0.74rem',
                                fontWeight: 900,
                                cursor: aula.lotado ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {aula.lotado ? 'Turma Lotada' : `🥊 Dar Check-in às ${aula.horarioCurto}`}
                            </button>
                          )}
                        </div>
                      )}

                      {(userRole === 'ADMIN' || userRole === 'PROFESSOR') && aula.alunosAgendados.length > 0 && (
                        <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gap: '0.4rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted-foreground)' }}>
                            Alunos Agendados ({aula.alunosAgendados.length}):
                          </div>
                          {aula.alunosAgendados.map(al => (
                            <div
                              key={al.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.4rem 0.6rem',
                                borderRadius: '8px',
                                background: 'var(--bg-surface-1)',
                                border: '1px solid var(--border-subtle)'
                              }}
                            >
                              <span style={{ fontSize: '0.74rem', fontWeight: 800 }}>{al.nome}</span>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleMarcarPresencaAluno(aula.id, al.id, 'PRESENTE')}
                                  style={{
                                    padding: '0.25rem 0.55rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'var(--status-available)',
                                    color: '#fff',
                                    fontSize: '0.66rem',
                                    fontWeight: 900,
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✓ Presente
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMarcarPresencaAluno(aula.id, al.id, 'FALTA')}
                                  style={{
                                    padding: '0.25rem 0.55rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'var(--status-full)',
                                    color: '#fff',
                                    fontSize: '0.66rem',
                                    fontWeight: 900,
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✗ Falta
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CANCELAR AULA */}
      {showModalCancelarAula && aulaParaCancelar && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10025,
            background: 'rgba(0,0,0,0.82)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <form
            onSubmit={handleConfirmarCancelarAula}
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '18px',
              background: 'var(--bg-surface-1)',
              border: '2px solid var(--status-full)',
              padding: '1.35rem',
              color: 'var(--text-foreground)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>
              🚫 Cancelar Aula ({aulaParaCancelar.horarioFormatado})
            </h4>
            <input
              type="text"
              value={motivoCancelamento}
              onChange={e => setMotivoCancelamento(e.target.value)}
              placeholder="Motivo do cancelamento..."
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-background)',
                color: 'var(--text-foreground)',
                fontSize: '0.78rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowModalCancelarAula(false)}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-2)',
                  color: 'var(--text-foreground)',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={processandoAcao}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--status-full)',
                  color: '#fff',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
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
