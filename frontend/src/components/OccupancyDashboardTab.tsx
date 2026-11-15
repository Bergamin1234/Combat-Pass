import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';

interface TurmaOcupacao {
  id: string;
  horario: string;
  modalidade: string;
  academiaNome?: string;
  professorNome?: string;
  capacidade: number;
  matriculados: number;
  mediaPresenca: number;
  status: 'OCIOSA' | 'IDEAL' | 'LOTADA_PICO';
}

export const OccupancyDashboardTab: React.FC = () => {
  const [turmas, setTurmas] = useState<TurmaOcupacao[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroAcademia, setFiltroAcademia] = useState<string>('TODAS');
  const [loading, setLoading] = useState(true);

  const carregarOcupacao = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOccupancyDashboard(
        filtroAcademia !== 'TODAS' ? { academia: filtroAcademia } : undefined
      ).catch(() => ({ data: [] }));
      if (Array.isArray(res.data)) {
        setTurmas(res.data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados de ocupação:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarOcupacao();
  }, [filtroAcademia]);

  const totalCapacidade = turmas.reduce((acc, t) => acc + t.capacidade, 0);
  const totalMatriculados = turmas.reduce((acc, t) => acc + t.matriculados, 0);
  const taxaOcupacaoGeral = totalCapacidade > 0 ? (totalMatriculados / totalCapacidade) * 100 : 0;

  const turmasPico = turmas.filter(t => t.status === 'LOTADA_PICO').length;
  const turmasIdeais = turmas.filter(t => t.status === 'IDEAL').length;
  const turmasOciosas = turmas.filter(t => t.status === 'OCIOSA').length;

  const turmasFiltradas = turmas.filter(t => {
    const matchStatus = filtroStatus === 'TODOS' || t.status === filtroStatus;
    return matchStatus;
  });

  return (
    <div className="space-y-6">
      <div
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border p-5 rounded-2xl"
      >
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>🔥</span>
            <span>Dashboard de Ocupação Real Multi-Academias (Combat-Pass)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Monitore a lotação em tempo real dos CTs credenciados, identifique horários de pico e turmas com vagas abertas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtroAcademia}
            onChange={e => setFiltroAcademia(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-xs font-bold text-white px-3 py-2 rounded-xl outline-none"
          >
            <option value="TODAS">🏟️ Todos os CTs Credenciados</option>
            <option value="ct-boru-matriz">CT Borü (Matriz)</option>
            <option value="tatame-sul-bjj">Alliance / Tatame Sul BJJ</option>
            <option value="arena-nobre-arte">Arena Nobre Arte Boxing</option>
            <option value="iron-cage-mma">Iron Cage MMA & Wrestling</option>
          </select>

          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-xs font-bold text-white px-3 py-2 rounded-xl outline-none"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="LOTADA_PICO">🔥 Horários de Pico (&gt;85%)</option>
            <option value="IDEAL">✅ Ocupação Ideal (40-85%)</option>
            <option value="OCIOSA">⚡ Turmas Ociosas (&lt;40%)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#141416] border border-zinc-800 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Taxa Média de Ocupação</span>
          <div className="text-2xl font-black text-white">
            {taxaOcupacaoGeral.toFixed(1)}%
          </div>
          <span className="text-[10px] text-zinc-500">
            {totalMatriculados} vagas reservadas de {totalCapacidade} hoje
          </span>
        </div>

        <div className="bg-[#141416] border border-red-500/20 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-red-400">Turmas em Pico / Lotadas</span>
          <div className="text-2xl font-black text-red-400">
            {turmasPico}
          </div>
          <span className="text-[10px] text-zinc-500">Capacidade acima de 85%</span>
        </div>

        <div className="bg-[#141416] border border-emerald-500/20 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Turmas em Faixa Ideal</span>
          <div className="text-2xl font-black text-emerald-400">
            {turmasIdeais}
          </div>
          <span className="text-[10px] text-zinc-500">Entre 40% e 85% de vagas</span>
        </div>

        <div className="bg-[#141416] border border-amber-500/20 p-4 rounded-xl space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-amber-400">Turmas com Vagas Amplas</span>
          <div className="text-2xl font-black text-amber-400">
            {turmasOciosas}
          </div>
          <span className="text-[10px] text-zinc-500">Disponíveis para check-in imediato</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Relação de Horários & Turmas de Hoje</h3>
          <span className="text-xs text-zinc-400">{turmasFiltradas.length} turma(s) listada(s)</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Mapeando ocupação real dos CTs...</div>
        ) : turmasFiltradas.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs bg-[#141416] rounded-2xl border border-zinc-800">
            Nenhuma turma encontrada para hoje com os filtros selecionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turmasFiltradas.map(turma => {
              const percOcupacao = (turma.matriculados / turma.capacidade) * 100;
              const isPico = turma.status === 'LOTADA_PICO';
              const isOciosa = turma.status === 'OCIOSA';

              return (
                <div
                  key={turma.id}
                  className={`bg-[#141416] border rounded-2xl p-5 space-y-4 transition shadow-lg ${
                    isPico
                      ? 'border-red-500/40 hover:border-red-500/70'
                      : isOciosa
                      ? 'border-amber-500/30 hover:border-amber-500/60'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono font-bold text-zinc-400">
                        ⏰ {turma.horario} {turma.professorNome ? `• ${turma.professorNome}` : ''}
                      </div>
                      <h4 className="text-base font-black text-white mt-0.5">
                        {turma.modalidade}
                      </h4>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isPico
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                          : isOciosa
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isPico ? '🔥 Lotada' : isOciosa ? '⚡ Há Vagas' : '✅ Ideal'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-400">Ocupação Real</span>
                      <span
                        className={
                          isPico ? 'text-red-400' : isOciosa ? 'text-amber-400' : 'text-emerald-400'
                        }
                      >
                        {percOcupacao.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPico
                            ? 'bg-gradient-to-r from-red-600 to-rose-400'
                            : isOciosa
                            ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, percOcupacao)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-center text-xs">
                    <div className="bg-zinc-900/60 p-2 rounded-xl">
                      <span className="text-[10px] text-zinc-500 block">Capacidade</span>
                      <span className="font-bold text-white">{turma.capacidade}</span>
                    </div>
                    <div className="bg-zinc-900/60 p-2 rounded-xl">
                      <span className="text-[10px] text-zinc-500 block">Agendados</span>
                      <span className="font-bold text-zinc-200">{turma.matriculados}</span>
                    </div>
                    <div className="bg-zinc-900/60 p-2 rounded-xl">
                      <span className="text-[10px] text-zinc-500 block">Vagas Livres</span>
                      <span className="font-bold text-emerald-400">{Math.max(0, turma.capacidade - turma.matriculados)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
