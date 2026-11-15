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
    next_class_checkin: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: activePreset === 'tatame_express' ? '1.45rem' : '1.15rem',
          borderRadius: activePreset === 'agenda_control' ? '10px' : '18px',
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
            ⚡ CARTÃO DE EMBARQUE DE TATAME · RESERVA & CANCELAMENTO DE VAGA PENDENTE
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

    pass_status: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: activePreset === 'agenda_control' ? '10px' : '18px',
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
            borderRadius: '12px',
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
            borderRadius: '12px',
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
            borderRadius: '12px',
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

    interactive_calendar: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: activePreset === 'agenda_control' ? '10px' : '18px',
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

    gamification_streak: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: activePreset === 'agenda_control' ? '10px' : '18px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <StudentGamificationTab
          alunoId={alunoLogado?.id}
          alunoNome={alunoLogado?.nome || 'Guerreiro(a)'}
          gamificacaoData={gamificacao}
          onRefresh={onCheckinSuccess}
          isCombatHub={true}
        />
      </div>
    ),

    reward_store_carousel: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: activePreset === 'agenda_control' ? '10px' : '18px',
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

    financial_summary: (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '1.25rem',
          borderRadius: activePreset === 'agenda_control' ? '10px' : '18px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <MyContractsTab aluno={alunoLogado} />
      </div>
    )
  };

  // ============================================================================
  // ARQUITETURA 2: GAMIFIED JOURNEY (HUD DE ATLETA RPG / UFC FIGHT PASS)
  // ============================================================================
  if (activePreset === 'gamified_journey') {
    return (
      <div>
        {/* HUD SUPERIOR DE LUTADOR COM BRASÃO DE NÍVEL E BARRA DE XP */}
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '1.35rem',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--bg-surface-1) 0%, var(--bg-surface-2) 100%)',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                background: 'var(--color-primary)',
                color: 'var(--text-primary-foreground)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                boxShadow: 'var(--shadow-card)',
                flexShrink: 0
              }}
            >
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}>LVL</span>
              <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{nivelAtual}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.08em' }}>
                🏆 HUD GAMIFICADO · CARREIRA DO ATLETA
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-foreground)' }}>
                {alunoLogado?.nome}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted-foreground)', fontWeight: 700 }}>
                🥋 {graduacaoAtual} · 🪙 {pointsSaldo} Combat Points
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 900, marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-foreground)' }}>PROGRESSÃO DE XP PARA O NÍVEL {nivelAtual + 1}</span>
              <span style={{ color: 'var(--color-primary)' }}>{progressoNivel} / 100 XP</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '12px',
                borderRadius: '999px',
                background: 'var(--bg-background)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden'
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.45rem', fontSize: '0.68rem', color: 'var(--text-muted-foreground)' }}>
              <span>⚡ +10 XP por Check-in Confirmado</span>
              <span>🎁 Loja de Recompensas liberada abaixo</span>
            </div>
          </div>
        </div>

        <DynamicSectionRenderer journey="student" sectionsMap={sectionsMap} />
      </div>
    );
  }

  // ============================================================================
  // ARQUITETURA 3: AGENDA & CONTROLE EXECUTIVO (SPLIT-VIEW 2 COLUNAS FORMAL)
  // ============================================================================
  if (activePreset === 'agenda_control') {
    return (
      <div>
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
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
            📅 ARQUITETURA SPLIT-VIEW EXECUTIVA · AGENDA & CONTROLE FINANCEIRO LADO A LADO
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted-foreground)' }}>
            Visão em 2 colunas simultâneas (Calendário + Gestão de Contratos/Check-in)
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '1.15rem',
            alignItems: 'start'
          }}
        >
          <div>
            {sectionsMap.interactive_calendar}
            {sectionsMap.gamification_streak}
          </div>
          <div>
            {sectionsMap.next_class_checkin}
            {sectionsMap.pass_status}
            {sectionsMap.financial_summary}
            {sectionsMap.reward_store_carousel}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ARQUITETURA 1 (DEFAULT): EXPRESS TATAME (CARTÃO DE EMBARQUE DIRETO AO PONTO)
  // ============================================================================
  return (
    <div>
      <DynamicSectionRenderer journey="student" sectionsMap={sectionsMap} />
    </div>
  );
};
