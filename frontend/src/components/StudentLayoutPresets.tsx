import React from 'react';
import {
  useLayoutEngine,
  DynamicSectionRenderer
} from '../config/layoutEngine';
import { LoggedQuickCheckinBanner } from './QuickCheckinWidget';
import { InteractiveCombatCalendar } from './InteractiveCombatCalendar';
import { StudentGamificationTab } from './StudentGamificationTab';
import { StudentRewardStoreTab } from './StudentRewardStoreTab';
import { MyContractsTab } from './ContractModalAndTab';

export interface StudentLayoutPresetsViewProps {
  alunoLogado: any;
  aulas: any[];
  gamificacao?: any;
  onCheckinSuccess: () => void;
  onSelectTab: (tabId: string) => void;
}

export const StudentLayoutPresetsView: React.FC<StudentLayoutPresetsViewProps> = ({
  alunoLogado,
  aulas,
  gamificacao,
  onCheckinSuccess,
  onSelectTab
}) => {
  const { preferences } = useLayoutEngine();
  const activePreset = preferences.layoutPreset.student;

  const xpTotal = Number(alunoLogado?.xp || 0);
  const pointsSaldo = Number(alunoLogado?.points || Math.floor(xpTotal * 1.2) || 450);
  const nivelAtual = Math.max(1, Math.floor(xpTotal / 100) + 1);
  const progressoNivel = xpTotal % 100;
  const graduacaoAtual = alunoLogado?.graduacao || 'Prajied Branco / Faixa Branca';
  const planoAtual = alunoLogado?.plano || 'Passe Unificado Gold (Todos os Horários)';

  // Widgets Modulares Reordenáveis da Área do Aluno
  const sectionsMap: Record<string, React.ReactNode> = {
    // 1. WIDGET DE CHECK-IN RÁPIDO & PRÓXIMO TREINO (COM BOTÃO DE CANCELAR VAGA PENDENTE)
    next_class_checkin: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: activePreset === 'tatame_express' ? '1.35rem' : '1.15rem',
          borderRadius: '18px',
          background: 'var(--bg-surface-1)',
          border:
            activePreset === 'tatame_express'
              ? '2px solid var(--color-primary)'
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
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-primary)'
            }}
          >
            ⚡ AÇÃO RÁPIDA DE TATAME · RESERVA & CANCELAMENTO DE VAGA PENDENTE
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--status-available)',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              background: 'var(--status-available-bg)',
              border: '1px solid var(--status-available-border)'
            }}
          >
            ✓ Passe Ativo em Rede
          </span>
        </div>

        <LoggedQuickCheckinBanner
          aluno={alunoLogado}
          onCheckinSuccess={onCheckinSuccess}
        />
      </div>
    ),

    // 2. RESUMO DO PASSE UNIFICADO & CRÉDITOS
    pass_status: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: '18px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.9rem'
        }}
      >
        <div
          style={{
            padding: '0.95rem',
            borderRadius: '14px',
            background: 'var(--bg-background)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted-foreground)' }}>
            🎫 PASSE UNIFICADO ATIVO
          </div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 900,
              color: 'var(--color-primary)',
              marginTop: '0.25rem'
            }}
          >
            {planoAtual}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--status-available)', marginTop: '0.2rem' }}>
            ● Matrícula Regularizada
          </div>
        </div>

        <div
          style={{
            padding: '0.95rem',
            borderRadius: '14px',
            background: 'var(--bg-background)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted-foreground)' }}>
            🥋 GRADUAÇÃO OFICIAL
          </div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 900,
              color: 'var(--text-foreground)',
              marginTop: '0.25rem'
            }}
          >
            {graduacaoAtual}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)', marginTop: '0.2rem' }}>
            Nível {nivelAtual} ({xpTotal} XP acumulado)
          </div>
        </div>

        <div
          style={{
            padding: '0.95rem',
            borderRadius: '14px',
            background: 'var(--bg-background)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted-foreground)' }}>
            🪙 SALDO NA LOJA DE RECOMPENSAS
          </div>
          <div
            style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              color: 'var(--color-accent)',
              marginTop: '0.25rem'
            }}
          >
            {pointsSaldo} Combat Points
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('recompensas')}
            style={{
              marginTop: '0.35rem',
              background: 'transparent',
              border: 'none',
              padding: 0,
              color: 'var(--color-primary)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Resgatar equipamentos →
          </button>
        </div>
      </div>
    ),

    // 3. CALENDÁRIO INTERATIVO & GRADE DE HORÁRIOS
    interactive_calendar: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: '18px',
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
            gap: '0.5rem',
            marginBottom: '0.9rem'
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
              GRADE INTERATIVA POR HORÁRIO · [HÁ VAGAS] / [LOTADO] / CANCELAR PENDENTE
            </span>
            <h3 style={{ margin: '0.15rem 0 0 0', fontSize: '1.15rem', color: 'var(--text-foreground)' }}>
              📅 Calendário Oficial de Aulas & Presenças
            </h3>
          </div>
        </div>

        <InteractiveCombatCalendar
          userRole="ALUNO"
          alunoId={alunoLogado?.id}
          alunoLogado={alunoLogado}
          onRefreshExternal={onCheckinSuccess}
        />
      </div>
    ),

    // 4. PROGRESSO DE NÍVEL, XP & GRADUAÇÃO (GAMIFICADO)
    gamification_streak: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: '18px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Header Gamificado extra quando em Layout B */}
        {activePreset === 'gamified_journey' && (
          <div
            style={{
              padding: '1.1rem',
              marginBottom: '1rem',
              borderRadius: '14px',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--color-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                🏆 PERFIL DE ATLETA COMBAT-PASS · NÍVEL {nivelAtual}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                {alunoLogado?.nome} · {graduacaoAtual}
              </div>
            </div>
            <div style={{ minWidth: '220px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginBottom: '0.3rem'
                }}
              >
                <span style={{ color: 'var(--text-muted-foreground)' }}>Progresso Próx. Nível</span>
                <span style={{ color: 'var(--color-primary)' }}>{progressoNivel}/100 XP</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '999px',
                  background: 'var(--bg-background)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: `${progressoNivel}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <StudentGamificationTab
          alunoId={alunoLogado?.id}
          alunoNome={alunoLogado?.nome || 'Guerreiro(a)'}
          gamificacaoData={gamificacao}
          onRefresh={onCheckinSuccess}
          isCombatHub={true}
        />
      </div>
    ),

    // 5. LOJA DE RECOMPENSAS POR POINTS
    reward_store_carousel: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: '18px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <StudentRewardStoreTab
          alunoId={alunoLogado?.id}
          alunoNome={alunoLogado?.nome}
        />
      </div>
    ),

    // 6. CONTRATOS, FATURAS & HISTÓRICO FINANCEIRO
    financial_summary: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: '18px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <MyContractsTab aluno={alunoLogado} />
      </div>
    )
  };

  // Layout C ("Agenda & Controle" - Split-View Formal): destaca calendário e controle lado a lado no topo
  return (
    <div>
      {activePreset === 'agenda_control' && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.85rem 1.15rem',
            borderRadius: '14px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--color-primary)' }}>
            📅 Layout C · Agenda & Controle Executivo (Split-View Formal)
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted-foreground)' }}>
            Seus blocos continuam 100% reordenáveis no botão "Ordenar Menu & Seções" acima.
          </span>
        </div>
      )}

      <DynamicSectionRenderer journey="student" sectionsMap={sectionsMap} />
    </div>
  );
};
