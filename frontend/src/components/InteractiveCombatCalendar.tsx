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
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [academiaFiltro, setAcademiaFiltro] = useState<string>('TODAS');
  const [modalidadeFiltro, setModalidadeFiltro] = useState<string>('TODAS');
  const [academiasDisponiveis, setAcademiasDisponiveis] = useState<any[]>([]);
  const [aulasPorDia, setAulasPorDia] = useState<Record<string, ClassScheduleItem[]>>({});
  const [loading, setLoading] = useState(true);

  // Modal / Gaveta do Dia Selecionado
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  // Ações em andamento
  const [processandoAcao, setProcessandoAcao] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  // Motivo de cancelamento pelo professor
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [showModalCancelarAula, setShowModalCancelarAula] = useState(false);
  const [aulaParaCancelar, setAulaParaCancelar] = useState<ClassScheduleItem | null>(null);

  useEffect(() => {
    studentApi.getAcademies()
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

  // Ação: Aluno realiza Check-in no Horário Específico
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

  // Ação: Aluno cancela Check-in (se ainda não aceito pelo professor)
  const handleCancelarCheckin = async (checkinId: string) => {
    if (!effectiveAlunoId) return;
    if (!confirm('Deseja realmente cancelar seu check-in nesta aula? Sua vaga e crédito do Combat-Pass serão liberados.')) return;

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

  // Ação: Professor/Admin cancela aula (fica riscada para todos)
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

  // Ação: Professor/Admin reativa aula
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

  // Ação: Professor/Admin marca presença de aluno no horário
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

  return (
    <div className="space-y-4">
      {/* CABEÇALHO DO CALENDÁRIO COM SELETOR DE MÊS & FILTROS MULTI-ACADEMIA COMBAT-PASS */}
      <div
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        className="border rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>📅</span>
                <span>Grade Oficial Multi-Academias & Calendário Combat-Pass</span>
              </h3>
              <span
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderColor: 'var(--color-primary-border)' }}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
              >
                {userRole === 'ALUNO' ? 'Passe Unificado do Atleta' : 'Gestão CT Parceiro / Hub'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {userRole === 'ALUNO'
                ? 'Filtre por Centro de Treinamento ou Modalidade, escolha o horário da aula para dar check-in e cancele enquanto pendente.'
                : 'Gerencie horários da rede, confirme presenças de alunos agendados e cancele aulas quando necessário (aparece riscado).'}
            </p>
          </div>

          {/* Seletor Mês & Ano */}
          <div className="flex items-center gap-2 bg-[#1A1A1E] border border-zinc-700/80 rounded-xl p-1 shrink-0">
            <button
              onClick={() => {
                if (mesAtual === 1) {
                  setMesAtual(12);
                  setAnoAtual(a => a - 1);
                } else {
                  setMesAtual(m => m - 1);
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              ← Anterior
            </button>

            <span className="px-3 py-1 text-xs font-black text-white uppercase tracking-wider">
              {mesesNomes[mesAtual - 1]} / {anoAtual}
            </span>

            <button
              onClick={() => {
                if (mesAtual === 12) {
                  setMesAtual(1);
                  setAnoAtual(a => a + 1);
                } else {
                  setMesAtual(m => m + 1);
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Próximo →
            </button>
          </div>
        </div>

        {/* BARRA DE FILTROS: CT CREDENCIADO E MODALIDADE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800/80">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
              🏟️ Filtrar por Centro de Treinamento (CT Parceiro):
            </label>
            <select
              value={academiaFiltro}
              onChange={(e) => setAcademiaFiltro(e.target.value)}
              className="w-full bg-[#121215] border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-red-500"
            >
              <option value="TODAS">🌐 Todas as Academias Credenciadas Combat-Pass</option>
              {academiasDisponiveis.length > 0 ? (
                academiasDisponiveis.map((ac) => (
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
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
              🥊 Filtrar por Modalidade Marcial:
            </label>
            <select
              value={modalidadeFiltro}
              onChange={(e) => setModalidadeFiltro(e.target.value)}
              className="w-full bg-[#121215] border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-red-500"
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
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{sucessoMsg}</span>
        </div>
      )}

      {erroMsg && (
        <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-400 font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{erroMsg}</span>
        </div>
      )}

      {/* GRADE DO CALENDÁRIO */}
      <div
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        className="border rounded-2xl p-3 sm:p-5 shadow-2xl space-y-3"
      >
        {/* Dias da Semana (Header) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-wider">
          <div style={{ color: 'var(--color-primary)' }}>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-zinc-500 text-xs">
            Carregando grade multi-academias do Combat-Pass...
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Células vazias antes do primeiro dia */}
            {Array.from({ length: primeiroDiaSemana }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="min-h-[115px] sm:min-h-[145px] rounded-xl bg-zinc-900/20 border border-zinc-900/40"
              />
            ))}

            {/* Células de cada dia do mês */}
            {Array.from({ length: totalDiasNoMes }).map((_, idx) => {
              const diaNum = idx + 1;
              const dataIso = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
              const aulasDoDia = aulasPorDia[dataIso] || [];
              const ehHoje = dataIso === hojeIso;
              const estaSelecionado = diaSelecionado === dataIso;

              const meuCheckinNoDia = aulasDoDia.find(a => Boolean(a.meuCheckin));
              const totalAlunosDia = aulasDoDia.reduce((acc, a) => acc + a.totalAgendados, 0);
              const totalLeadsDia = aulasDoDia.reduce((acc, a) => acc + a.totalAulasExp, 0);

              return (
                <div
                  key={`day-${diaNum}`}
                  onClick={() => {
                    setDiaSelecionado(dataIso);
                  }}
                  className={`min-h-[120px] sm:min-h-[160px] p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition group relative cursor-pointer overflow-hidden ${
                    estaSelecionado
                      ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/40 ring-1 ring-red-500'
                      : meuCheckinNoDia
                      ? 'bg-[#18181E] border-amber-500/50 hover:border-amber-400'
                      : ehHoje
                      ? 'bg-[#1C1C22] border-red-500/80 hover:border-red-400'
                      : aulasDoDia.length > 0
                      ? 'bg-[#141416] border-zinc-800/80 hover:border-zinc-700'
                      : 'bg-zinc-900/30 border-zinc-900 text-zinc-600'
                  }`}
                >
                  {/* Topo da Célula: Dia & Badges */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-black ${
                        estaSelecionado ? 'text-white' : ehHoje ? 'text-red-400' : 'text-zinc-300'
                      }`}
                    >
                      {diaNum}
                    </span>

                    <div className="flex items-center gap-1">
                      {ehHoje && (
                        <span
                          style={{ backgroundColor: 'var(--color-primary)' }}
                          className="text-[8px] font-black uppercase text-white px-1 py-0.2 rounded"
                        >
                          Hoje
                        </span>
                      )}
                      {meuCheckinNoDia && (
                        <span
                          className={`text-[8px] font-black uppercase px-1 py-0.2 rounded ${
                            meuCheckinNoDia.meuCheckin?.status === 'PRESENTE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {meuCheckinNoDia.meuCheckin?.status === 'PRESENTE' ? '✓ OK' : '⏳ Pend.'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Miolo da Célula: Horários de aula compactos */}
                  <div className="my-1 space-y-1 w-full overflow-hidden">
                    {aulasDoDia.slice(0, 4).map(aula => {
                      const temMeuCheckin = Boolean(aula.meuCheckin);
                      return (
                        <div
                          key={aula.id}
                          className={`text-[9px] sm:text-[10px] leading-tight px-1 py-0.5 rounded truncate font-bold flex items-center justify-between ${
                            aula.cancelada
                              ? 'line-through text-zinc-500 bg-zinc-900/60'
                              : temMeuCheckin
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-zinc-900/80 text-zinc-300 hover:text-white'
                          }`}
                          title={`${aula.horarioFormatado} • ${aula.modalidade} (${aula.academiaNome || 'CT Borü'}) - ${
                            aula.cancelada
                              ? `Cancelada: ${aula.motivoCancelamento || 'Pelo professor'}`
                              : aula.lotado
                              ? 'Turma Lotada'
                              : 'Há Vagas'
                          }`}
                        >
                          <span className={`truncate ${aula.cancelada ? 'line-through text-zinc-500' : ''}`}>
                            {aula.horarioCurto} {aula.modalidade.slice(0, 4)} • {aula.professorNome.split(' ')[0]}
                          </span>

                          {aula.cancelada ? (
                            <span className="text-[7px] text-red-400 no-underline font-normal uppercase shrink-0 ml-1">
                              Canc.
                            </span>
                          ) : aula.lotado ? (
                            <span className="text-[7px] text-red-400 font-normal shrink-0 ml-1">Lotado</span>
                          ) : (
                            <span className="text-[7px] text-emerald-400 font-normal shrink-0 ml-1">Vagas</span>
                          )}
                        </div>
                      );
                    })}

                    {aulasDoDia.length > 4 && (
                      <span className="text-[8px] text-zinc-400 block text-right font-bold">
                        +{aulasDoDia.length - 4} horário(s)
                      </span>
                    )}
                  </div>

                  {/* Rodapé da Célula: Contadores de Alunos Agendados & Aulas Exp */}
                  <div className="pt-1 border-t border-zinc-800/60 flex items-center justify-between text-[8px] sm:text-[9px] text-zinc-400">
                    <span title="Alunos agendados / presentes neste dia">
                      👥 {totalAlunosDia}
                    </span>
                    {totalLeadsDia > 0 && (
                      <span className="text-amber-400 font-bold" title="Aulas experimentais agendadas">
                        🎯 {totalLeadsDia}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LEGENDA DO CALENDÁRIO */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>[HÁ VAGAS] Vagas Abertas</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>[LOTADO] Capacidade Máxima</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="line-through text-zinc-500 font-bold">18h Felipe</span>
            <span>Aula Cancelada pelo Professor / CT</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Seu Check-in Pendente / Agendado</span>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DRAWER / MODAL DO DIA SELECIONADO                        */}
      {/* ======================================================== */}
      {diaSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141416] border border-zinc-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#18181B] via-[#141416] to-[#121214] border-b border-zinc-800 flex items-center justify-between">
              <div>
                <span style={{ color: 'var(--color-primary)' }} className="text-[10px] font-black uppercase tracking-wider">
                  Grade Combat-Pass • Check-in & Presenças
                </span>
                <h3 className="text-lg font-black text-white">
                  Dia {new Date(`${diaSelecionado}T12:00:00Z`).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </h3>
              </div>
              <button
                onClick={() => setDiaSelecionado(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo: Lista de aulas do dia */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {aulasDoDiaSelecionado.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs bg-zinc-900/30 rounded-2xl border border-zinc-800">
                  Nenhuma aula programada para este filtro/dia.
                </div>
              ) : (
                <div className="space-y-3">
                  {aulasDoDiaSelecionado.map(aula => {
                    const isMinhaAula = Boolean(aula.meuCheckin);
                    const pendenteAceite = aula.meuCheckin?.status === 'AGENDADO';
                    const presencaAceita = aula.meuCheckin?.status === 'PRESENTE';

                    return (
                      <div
                        key={aula.id}
                        className={`border rounded-2xl p-4 sm:p-5 space-y-3 transition shadow-lg ${
                          aula.cancelada
                            ? 'bg-zinc-950/60 border-zinc-800/60 opacity-60'
                            : isMinhaAula
                            ? 'bg-gradient-to-r from-amber-950/20 via-[#1A1A1E] to-[#141416] border-amber-500/50'
                            : 'bg-[#1A1A1E]/80 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {/* Topo do Card da Aula */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-base font-black ${
                                  aula.cancelada ? 'line-through text-zinc-500' : 'text-white'
                                }`}
                              >
                                ⏰ {aula.horario} • {aula.titulo}
                              </span>

                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                                🏟️ {aula.academiaNome || 'CT Borü (Matriz)'}
                              </span>

                              {aula.cancelada ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-950/80 text-red-400 border border-red-500/40">
                                  Aula Cancelada
                                </span>
                              ) : aula.lotado ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-950 text-red-400 border border-red-500/40">
                                  [LOTADO]
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                                  [HÁ VAGAS]
                                </span>
                              )}
                            </div>

                            <span className="text-xs text-zinc-400 block">
                              Mestre: <strong className="text-zinc-200">{aula.professorNome}</strong> • Modalidade: <strong className="text-zinc-200">{aula.modalidade}</strong> • Lotação: {aula.totalAgendados}/{aula.capacidade} alunos
                            </span>
                          </div>

                          {/* Se for Professor/Admin: Botão de Cancelar Aula */}
                          {(userRole === 'ADMIN' || userRole === 'PROFESSOR') && (
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              {aula.cancelada ? (
                                <button
                                  onClick={() => handleReativarAula(aula.id)}
                                  disabled={processandoAcao}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1"
                                >
                                  <span>🔄 Reativar Aula</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setAulaParaCancelar(aula);
                                    setShowModalCancelarAula(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-400 hover:text-white text-xs font-bold transition flex items-center gap-1"
                                >
                                  <span>🚫 Cancelar Aula (Riscar)</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {aula.cancelada && aula.motivoCancelamento && (
                          <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-red-300 italic">
                            Aviso do CT: "{aula.motivoCancelamento}"
                          </div>
                        )}

                        {/* Seção ALUNO: Ações de Check-in e Cancelar Check-in */}
                        {userRole === 'ALUNO' && !aula.cancelada && (
                          <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {isMinhaAula ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 ${
                                    presencaAceita
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                  }`}
                                >
                                  <span>{presencaAceita ? '✓' : '⏳'}</span>
                                  <span>
                                    {presencaAceita
                                      ? 'Presença Confirmada pelo Professor no Tatame!'
                                      : 'Check-in Realizado (Aguardando Professor)'}
                                  </span>
                                </span>

                                {pendenteAceite && aula.meuCheckin && (
                                  <button
                                    onClick={() => handleCancelarCheckin(aula.meuCheckin!.id)}
                                    disabled={processandoAcao}
                                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-900/60 text-zinc-300 hover:text-red-300 border border-zinc-700 hover:border-red-500/50 text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
                                  >
                                    <span>❌</span>
                                    <span>Cancelar meu Check-in</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleFazerCheckin(aula)}
                                disabled={processandoAcao || aula.lotado}
                                style={!aula.lotado ? { backgroundColor: 'var(--color-primary)' } : undefined}
                                className={`py-2.5 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg ${
                                  aula.lotado
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'hover:opacity-90 text-white'
                                }`}
                              >
                                <span>🥊</span>
                                <span>
                                  {aula.lotado ? 'Turma Lotada' : `Dar Check-in às ${aula.horarioCurto} (${aula.modalidade})`}
                                </span>
                              </button>
                            )}

                            <span className="text-[11px] text-zinc-400">
                              Capacidade: <strong>{aula.totalAgendados} de {aula.capacidade} alunos</strong>
                            </span>
                          </div>
                        )}

                        {/* Seção PROFESSOR/ADMIN: Lista de Alunos Agendados & Aulas Exp */}
                        {(userRole === 'ADMIN' || userRole === 'PROFESSOR') && (
                          <div className="space-y-3 pt-2 border-t border-zinc-800">
                            <div>
                              <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-2">
                                <span>👥 Alunos que deram Check-in ({aula.alunosAgendados.length}):</span>
                                <span className="text-[11px] text-zinc-500">Clique para validar presença e repasse</span>
                              </div>

                              {aula.alunosAgendados.length === 0 ? (
                                <p className="text-xs text-zinc-500 italic">Nenhum aluno agendado ainda.</p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {aula.alunosAgendados.map(al => (
                                    <div
                                      key={al.id}
                                      className="bg-black/40 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
                                    >
                                      <div>
                                        <div className="text-xs font-bold text-white">{al.nome}</div>
                                        <span className="text-[10px] text-zinc-400">
                                          {al.prajied || 'Iniciante'} • Passe {al.tierPasse || 'GOLD'}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => handleMarcarPresencaAluno(aula.id, al.id, 'PRESENTE')}
                                          disabled={processandoAcao}
                                          className={`px-2 py-1 rounded text-[10px] font-black transition ${
                                            al.status === 'PRESENTE'
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30'
                                          }`}
                                        >
                                          ✓ Presente
                                        </button>

                                        <button
                                          onClick={() => handleMarcarPresencaAluno(aula.id, al.id, 'FALTA')}
                                          disabled={processandoAcao}
                                          className={`px-2 py-1 rounded text-[10px] font-black transition ${
                                            al.status === 'FALTA'
                                              ? 'bg-red-600 text-white'
                                              : 'bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30'
                                          }`}
                                        >
                                          ✗ Falta
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {aula.leadsExp.length > 0 && (
                              <div className="pt-2 border-t border-zinc-800/80">
                                <span className="text-xs font-bold text-amber-400 block mb-2">
                                  🎯 Aulas Experimentais Agendadas ({aula.leadsExp.length}):
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {aula.leadsExp.map(lead => (
                                    <div
                                      key={lead.id}
                                      className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between"
                                    >
                                      <div>
                                        <div className="text-xs font-bold text-white">{lead.nome}</div>
                                        <span className="text-[10px] text-amber-400/80 font-mono">
                                          {lead.telefone}
                                        </span>
                                      </div>
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                                        Experimental
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA O PROFESSOR CANCELAR AULA (RISCAR) */}
      {showModalCancelarAula && aulaParaCancelar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleConfirmarCancelarAula}
            className="bg-[#141416] border border-red-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span>🚫 Cancelar Aula do Tatame</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowModalCancelarAula(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Ao cancelar o treino de <strong>{aulaParaCancelar.horarioFormatado}</strong> ({aulaParaCancelar.academiaNome || 'CT'}) em {aulaParaCancelar.dataIso}, ele aparecerá <strong className="line-through text-red-400">riscado</strong> no calendário de todos os alunos.
            </p>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Motivo do Cancelamento (Opcional)
              </label>
              <input
                type="text"
                value={motivoCancelamento}
                onChange={e => setMotivoCancelamento(e.target.value)}
                placeholder="Ex: Manutenção do tatame ou seminário externo."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModalCancelarAula(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={processandoAcao}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-950/40 disabled:opacity-50"
              >
                {processandoAcao ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
