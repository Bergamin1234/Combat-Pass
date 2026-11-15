import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';

interface Student360ModalProps {
  studentId: string;
  onClose: () => void;
  onRefreshStudentList?: () => void;
}

export const Student360Modal: React.FC<Student360ModalProps> = ({
  studentId,
  onClose,
  onRefreshStudentList
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'geral' | 'contratos' | 'financeiro' | 'pontos' | 'graduacoes' | 'loja'>('geral');

  // Modal Novo Contrato Longo (Combat-Pass)
  const [showNovoContrato, setShowNovoContrato] = useState(false);
  const [tipoDuracao, setTipoDuracao] = useState<'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'>('TRIMESTRAL');
  const [tierPasse, setTierPasse] = useState<'SILVER' | 'GOLD' | 'BLACK'>('GOLD');
  const [duracaoMeses, setDuracaoMeses] = useState(3);
  const [valorTotalContrato, setValorTotalContrato] = useState('750.00');
  const [nomePlanoContrato, setNomePlanoContrato] = useState('Combat-Pass Gold • Trimestral (3 Meses)');
  const [salvandoContrato, setSalvandoContrato] = useState(false);

  // Modal Nova Graduação Multi-Modalidade
  const [showNovaGraduacao, setShowNovaGraduacao] = useState(false);
  const [novaGraduacaoNome, setNovaGraduacaoNome] = useState('');
  const [modalidadeGrad, setModalidadeGrad] = useState('Muay Thai');
  const [academiaGrad, setAcademiaGrad] = useState('CT Borü (Matriz)');
  const [examinador, setExaminador] = useState('Mestre Felipe Borü');
  const [notasExame, setNotasExame] = useState('');
  const [salvandoGrad, setSalvandoGrad] = useState(false);

  // Mensagens
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  const carregar360 = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStudent360(studentId);
      setData(res.data);
      if (res.data?.aluno?.modalidade) {
        setModalidadeGrad(res.data.aluno.modalidade);
      }
      if (res.data?.aluno?.academiaOrigem) {
        setAcademiaGrad(res.data.aluno.academiaOrigem);
      }
    } catch (err) {
      console.error('Erro ao carregar Visão 360 do Aluno:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      carregar360();
    }
  }, [studentId]);

  const atualizarContratoDefaults = (tipo: 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL', tier: 'SILVER' | 'GOLD' | 'BLACK') => {
    const meses = tipo === 'TRIMESTRAL' ? 3 : tipo === 'SEMESTRAL' ? 6 : 12;
    const baseMensal = tier === 'SILVER' ? 189 : tier === 'GOLD' ? 250 : 349;
    const desconto = tipo === 'TRIMESTRAL' ? 1 : tipo === 'SEMESTRAL' ? 0.92 : 0.84;
    const total = Math.round(baseMensal * meses * desconto);

    setTipoDuracao(tipo);
    setTierPasse(tier);
    setDuracaoMeses(meses);
    setValorTotalContrato(total.toFixed(2));
    setNomePlanoContrato(`Combat-Pass ${tier} • ${tipo === 'TRIMESTRAL' ? 'Trimestral (3m)' : tipo === 'SEMESTRAL' ? 'Semestral (6m)' : 'Anual Black (12m)'}`);
  };

  const handleSalvarContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoContrato(true);
    setErroMsg('');

    try {
      await adminApi.createStudentContract(studentId, {
        nome_plano: nomePlanoContrato,
        tier_passe: tierPasse,
        tipo_duracao: tipoDuracao,
        duracao_meses: duracaoMeses,
        valor_total: parseFloat(valorTotalContrato.replace(',', '.')) || 0,
        data_inicio: new Date().toISOString()
      });

      setShowNovoContrato(false);
      setSucessoMsg('Contrato Combat-Pass ativado com sucesso e bônus de Combat Points creditado!');
      setTimeout(() => setSucessoMsg(''), 4000);
      await carregar360();
      onRefreshStudentList?.();
    } catch (err: any) {
      setErroMsg(err.response?.data?.erro || 'Erro ao registrar contrato.');
    } finally {
      setSalvandoContrato(false);
    }
  };

  const handleSalvarGraduacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaGraduacaoNome.trim()) return;
    setSalvandoGrad(true);
    setErroMsg('');

    try {
      await adminApi.registerGraduation(studentId, {
        modalidade: modalidadeGrad,
        academiaNome: academiaGrad,
        graduacao_anterior: data?.aluno?.prajied || data?.aluno?.graduacao || 'Iniciante',
        nova_graduacao: novaGraduacaoNome.trim(),
        professorNome: examinador,
        notas_exame: notasExame.trim() || undefined,
        data_graduacao: new Date().toISOString()
      });

      setShowNovaGraduacao(false);
      setNovaGraduacaoNome('');
      setNotasExame('');
      setSucessoMsg('Graduação oficializada no Passaporte Combat-Pass (+50 XP & +25 Points)!');
      setTimeout(() => setSucessoMsg(''), 4000);
      await carregar360();
      onRefreshStudentList?.();
    } catch (err: any) {
      setErroMsg(err.response?.data?.erro || 'Erro ao registrar exame de graduação.');
    } finally {
      setSalvandoGrad(false);
    }
  };

  const handleConfirmarEntrega = async (resgateId: string) => {
    try {
      await adminApi.deliverStoreRedemption(resgateId, 'Recepção Combat-Pass');
      setSucessoMsg('Entrega física do item confirmada!');
      setTimeout(() => setSucessoMsg(''), 3000);
      await carregar360();
    } catch (err) {
      console.error('Erro ao entregar resgate:', err);
    }
  };

  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-[#141416] border border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center space-y-3">
          <div className="text-xl animate-spin">🥊</div>
          <div className="text-sm font-bold text-white">Carregando Visão 360° Combat-Pass...</div>
        </div>
      </div>
    );
  }

  const { aluno, metricas, contratos, mensalidades, extratoPontos, resgatesLoja, historicoGraduacoes } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141416] border border-zinc-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* HEADER MODAL */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-[#18181B] to-[#141416] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-xl font-black text-red-500">
              {aluno.nome.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-white">{aluno.nome}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PASSE {aluno.tierPasse || 'GOLD'}
                </span>
                {aluno.prajied && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {aluno.prajied}
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-400">
                CPF: {aluno.cpf || 'Não cadastrado'} • {aluno.telefone || 'Sem telefone'} • Plano: {aluno.plano} • CT Base: {aluno.academiaOrigem || 'CT Borü (Matriz)'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {sucessoMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
            <span>✓</span>
            <span>{sucessoMsg}</span>
          </div>
        )}

        {/* NAVEGAÇÃO ENTRE AS ABAS 360 */}
        <div className="px-6 pt-3 flex gap-2 border-b border-zinc-800 overflow-x-auto scrollbar-none">
          {[
            { id: 'geral', label: 'Visão Geral', icon: '👤' },
            { id: 'contratos', label: `Passes & Contratos (${contratos.length})`, icon: '📄' },
            { id: 'financeiro', label: `Financeiro (${mensalidades.length})`, icon: '💳' },
            { id: 'pontos', label: `Combat Points (${aluno.spendable_points} pts)`, icon: '🪙' },
            { id: 'graduacoes', label: `Graduações (${historicoGraduacoes.length})`, icon: '🥋' },
            { id: 'loja', label: `Resgates Loja (${resgatesLoja.length})`, icon: '🛍️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAbaAtiva(tab.id as any)}
              className={`pb-3 px-3 text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                abaAtiva === tab.id
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTEÚDO SCROLLÁVEL */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ABA 1: VISÃO GERAL */}
          {abaAtiva === 'geral' && (
            <div className="space-y-6">
              {/* Metricas rápidas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Check-ins na Rede</span>
                  <div className="text-xl font-black text-white">{metricas.totalPresencas}</div>
                </div>
                <div className="bg-zinc-900/60 border border-amber-500/20 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Combat Points</span>
                  <div className="text-xl font-black text-amber-300">{aluno.spendable_points} pts</div>
                </div>
                <div className="bg-zinc-900/60 border border-red-500/20 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-400">XP Vitalício</span>
                  <div className="text-xl font-black text-white">{aluno.total_xp} XP</div>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Passes Longos</span>
                  <div className="text-xl font-black text-emerald-400">{contratos.length}</div>
                </div>
              </div>

              {/* Informações cadastrais detalhadas */}
              <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Passaporte do Atleta • Rede Combat-Pass
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Modalidade Principal</span>
                    <span className="font-bold text-white">{aluno.modalidade || 'Multi-Modalidade'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Graduação / Faixa / Prajied Atual</span>
                    <span className="font-bold text-white">{aluno.prajied || 'Iniciante'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">CT Base de Origem</span>
                    <span className="font-bold text-white">{aluno.academiaOrigem || 'CT Borü (Matriz)'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Contrato Digital Assinado?</span>
                    <span className={`font-bold ${aluno.has_signed_contract ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {aluno.has_signed_contract ? '✓ Assinado Digitalmente' : 'Pendente de Assinatura'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: CONTRATOS LONGOS */}
          {abaAtiva === 'contratos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">Passes Unificados & Contratos (3, 6, 12 Meses)</h4>
                  <p className="text-xs text-zinc-400">
                    Adesão a passes longos concede acesso multi-CT e bônus instantâneo de Combat Points.
                  </p>
                </div>
                <button
                  onClick={() => setShowNovoContrato(true)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black text-white uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-red-950/40"
                >
                  <span>+</span>
                  <span>Emitir Passe/Contrato</span>
                </button>
              </div>

              {contratos.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-2xl border border-zinc-800">
                  Nenhum contrato longo ativo. O atleta está atualmente no modelo mensal avulso.
                </div>
              ) : (
                <div className="space-y-3">
                  {contratos.map((c: any) => (
                    <div
                      key={c.id}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{c.nome_plano}</span>
                          {c.tier_passe && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {c.tier_passe}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {c.status}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-400 block">
                          Período: {new Date(c.data_inicio).toLocaleDateString('pt-BR')} até{' '}
                          {new Date(c.data_fim).toLocaleDateString('pt-BR')} ({c.duracao_meses} meses)
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-emerald-400">
                          R$ {c.valor_total.toFixed(2).replace('.', ',')}
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          Competência: R$ {c.valor_mensal_competencia.toFixed(2).replace('.', ',')}/mês
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 3: HISTÓRICO FINANCEIRO */}
          {abaAtiva === 'financeiro' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white">Mensalidades & Faturas Combat-Pass</h4>
              {mensalidades.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-2xl border border-zinc-800">
                  Nenhuma fatura registrada.
                </div>
              ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">
                        <th className="p-3">Vencimento</th>
                        <th className="p-3">Valor</th>
                        <th className="p-3">Data Pagamento</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {mensalidades.map((m: any) => (
                        <tr key={m.id} className="hover:bg-zinc-800/30">
                          <td className="p-3 font-mono text-zinc-300">
                            {new Date(m.dataVencimento).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-3 font-bold text-white">
                            R$ {m.valor.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="p-3 text-zinc-400">
                            {m.dataPagamento ? new Date(m.dataPagamento).toLocaleDateString('pt-BR') : '—'}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.status === 'PAGO'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ABA 4: PONTOS & EXTRATO */}
          {abaAtiva === 'pontos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">Extrato da Carteira Combat Points</h4>
                  <span className="text-xs text-zinc-400">
                    Saldo Atual: <strong className="text-amber-400">{aluno.spendable_points} Points</strong> • XP Vitalício: <strong className="text-white">{aluno.total_xp} XP</strong>
                  </span>
                </div>
              </div>

              {extratoPontos.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-2xl border border-zinc-800">
                  Nenhuma movimentação de pontos até o momento.
                </div>
              ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800">
                  {extratoPontos.map((item: any) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">{item.descricao}</div>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(item.criadoEm).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-black ${
                            item.points_delta >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {item.points_delta >= 0 ? `+${item.points_delta}` : item.points_delta} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 5: GRADUAÇÕES */}
          {abaAtiva === 'graduacoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">Histórico de Graduações Multi-Modalidade</h4>
                  <p className="text-xs text-zinc-400">
                    Ao registrar nova faixa/prajied em qualquer arte marcial, o atleta ganha +50 XP e +25 Points.
                  </p>
                </div>
                <button
                  onClick={() => setShowNovaGraduacao(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <span>🥋</span>
                  <span>Registrar Exame</span>
                </button>
              </div>

              {historicoGraduacoes.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-2xl border border-zinc-800">
                  Nenhuma graduação registrada ainda.
                </div>
              ) : (
                <div className="space-y-3">
                  {historicoGraduacoes.map((g: any) => (
                    <div
                      key={g.id}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-red-400">
                          {g.modalidade} {g.academiaNome ? `• ${g.academiaNome}` : ''}
                        </span>
                        <span className="text-zinc-500 font-mono">
                          {new Date(g.data_graduacao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="text-base font-black text-white">
                        {g.nova_graduacao}
                        {g.graduacao_anterior && (
                          <span className="text-xs text-zinc-500 font-normal ml-2">
                            (Anterior: {g.graduacao_anterior})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-zinc-800/80">
                        <span>Examinador: {g.professorNome}</span>
                        {g.notas_exame && <span className="italic">"{g.notas_exame}"</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 6: RESGATES DA LOJA */}
          {abaAtiva === 'loja' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white">Vouchers Resgatados na Loja Combat-Pass</h4>
              {resgatesLoja.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-2xl border border-zinc-800">
                  Nenhum item resgatado por este atleta.
                </div>
              ) : (
                <div className="space-y-3">
                  {resgatesLoja.map((r: any) => {
                    const pendente = r.status === 'PENDENTE_RETIRADA';
                    return (
                      <div
                        key={r.id}
                        className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={r.item?.imagem_url || 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=200&q=80'}
                            alt={r.item?.nome}
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{r.item?.nome}</div>
                            <span className="text-[11px] font-mono text-amber-300 font-black">
                              Voucher: {r.codigo_voucher}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              pendente
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {pendente ? 'Pendente Retirada' : 'Entregue'}
                          </span>

                          {pendente && (
                            <button
                              onClick={() => handleConfirmarEntrega(r.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider transition"
                            >
                              Dar Baixa
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL: NOVO CONTRATO LONGO COMBAT-PASS */}
        {showNovoContrato && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <form
              onSubmit={handleSalvarContrato}
              className="bg-[#141416] border border-zinc-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h4 className="text-sm font-black text-white">Emitir Passe / Contrato Fidelidade</h4>
                <button
                  type="button"
                  onClick={() => setShowNovoContrato(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {erroMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-400 font-bold">
                  {erroMsg}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Tier do Combat-Pass
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['SILVER', 'GOLD', 'BLACK'] as const).map(tier => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => atualizarContratoDefaults(tipoDuracao, tier)}
                        className={`py-2 px-2 rounded-xl text-xs font-black uppercase transition border ${
                          tierPasse === tier
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Duração de Fidelidade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['TRIMESTRAL', 'SEMESTRAL', 'ANUAL'] as const).map(tipo => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => atualizarContratoDefaults(tipo, tierPasse)}
                        className={`py-2 px-2 rounded-xl text-xs font-black uppercase transition border ${
                          tipoDuracao === tipo
                            ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        {tipo === 'TRIMESTRAL' ? '3 Meses' : tipo === 'SEMESTRAL' ? '6 Meses' : '12 Meses'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Valor Total do Contrato (R$)
                  </label>
                  <input
                    type="text"
                    value={valorTotalContrato}
                    onChange={e => setValorTotalContrato(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm font-black text-white focus:outline-none focus:border-red-500"
                    required
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Competência contábil: R${' '}
                    {((parseFloat(valorTotalContrato.replace(',', '.')) || 0) / duracaoMeses)
                      .toFixed(2)
                      .replace('.', ',')}{' '}
                    / mês
                  </span>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 font-bold flex items-center gap-2">
                  <span>🪙</span>
                  <span>
                    Bônus garantido:{' '}
                    <strong>
                      +{duracaoMeses >= 12 ? '300' : duracaoMeses >= 6 ? '120' : '50'} Combat Points
                    </strong>{' '}
                    creditados ao atleta!
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNovoContrato(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoContrato}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-950/40 disabled:opacity-50"
                >
                  {salvandoContrato ? 'Emitindo...' : 'Ativar Contrato'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: NOVA GRADUAÇÃO MULTI-MODALIDADE */}
        {showNovaGraduacao && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <form
              onSubmit={handleSalvarGraduacao}
              className="bg-[#141416] border border-zinc-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h4 className="text-sm font-black text-white">Registrar Exame de Graduação</h4>
                <button
                  type="button"
                  onClick={() => setShowNovaGraduacao(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {erroMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-400 font-bold">
                  {erroMsg}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Nova Graduação / Faixa / Prajied Conquistada *
                  </label>
                  <input
                    type="text"
                    value={novaGraduacaoNome}
                    onChange={e => setNovaGraduacaoNome(e.target.value)}
                    placeholder="Ex: Prajied Azul, Faixa Azul 2º Grau, Luva Prata..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Modalidade
                    </label>
                    <select
                      value={modalidadeGrad}
                      onChange={e => setModalidadeGrad(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Muay Thai">Muay Thai</option>
                      <option value="Jiu-Jitsu (BJJ)">Jiu-Jitsu (BJJ)</option>
                      <option value="Boxe Olímpico">Boxe Olímpico</option>
                      <option value="MMA & Wrestling">MMA & Wrestling</option>
                      <option value="Muay Thai Kids">Muay Thai Kids</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      CT Credenciado
                    </label>
                    <select
                      value={academiaGrad}
                      onChange={e => setAcademiaGrad(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="CT Borü (Matriz)">CT Borü (Matriz)</option>
                      <option value="Alliance / Tatame Sul BJJ">Alliance / Tatame Sul BJJ</option>
                      <option value="Arena Nobre Arte Boxing">Arena Nobre Arte Boxing</option>
                      <option value="Iron Cage MMA & Wrestling">Iron Cage MMA & Wrestling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Mestre / Professor Examinador
                  </label>
                  <input
                    type="text"
                    value={examinador}
                    onChange={e => setExaminador(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Observações / Notas do Exame
                  </label>
                  <textarea
                    value={notasExame}
                    onChange={e => setNotasExame(e.target.value)}
                    placeholder="Ex: Excelente técnica, defesa sólida e postura exemplar."
                    rows={2}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>O atleta receberá automaticamente +50 XP e +25 Combat Points!</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNovaGraduacao(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoGrad}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {salvandoGrad ? 'Registrando...' : 'Confirmar Graduação'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
