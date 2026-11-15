import React, { useState, useEffect } from 'react';
import {
  useLayoutEngine,
  JourneyKey,
  LoadingStyleId
} from '../config/layoutEngine';

export interface LoadingScreenRendererProps {
  journey?: JourneyKey;
  styleOverride?: LoadingStyleId;
  message?: string;
  subMessage?: string;
  compact?: boolean;
  steps?: string[];
  onClose?: () => void;
}

const DEFAULT_CONTEXTUAL_MESSAGES: Record<JourneyKey, string[]> = {
  landing: [
    'Localizando centros de treinamento credenciados...',
    'Sincronizando grade oficial de horários ao vivo...',
    'Verificando disponibilidade de vagas nos tatames...',
    'Carregando vitrine de passes unificados Combat-Pass...'
  ],
  student: [
    'Validando seu Passe Unificado Combat-Pass...',
    'Sincronizando trilha de evolução, XP e graduação...',
    'Carregando agendamentos e status de vagas de hoje...',
    'Atualizando saldo de Combat Points na Loja...'
  ],
  teacher: [
    'Carregando lista de chamada e ocupação do tatame...',
    'Sincronizando histórico técnico e frequência da turma...',
    'Calculando extrato dinâmico de comissões e repasses...',
    'Verificando check-ins pendentes de validação...'
  ],
  admin: [
    'Consolidando KPIs financeiros e repasses multi-academias...',
    'Sincronizando Visão 360° de alunos e matrículas...',
    'Auditando fechamento de caixa diário e vouchers...',
    'Carregando motor de layouts e paletas semânticas...'
  ]
};

const DEFAULT_TRANSACTION_STEPS = [
  '1. Verificando créditos e validade do Passe Unificado',
  '2. Consultando limite de lotação e reservando vaga no tatame',
  '3. Sincronizando check-in com a recepção da academia parceira',
  '4. Gerando comprovante e contabilizando +10 XP na jornada'
];

export const LoadingScreenRenderer: React.FC<LoadingScreenRendererProps> = ({
  journey = 'student',
  styleOverride,
  message,
  subMessage,
  compact = false,
  steps = DEFAULT_TRANSACTION_STEPS,
  onClose
}) => {
  const { preferences } = useLayoutEngine();
  const activeStyle: LoadingStyleId = styleOverride || preferences.loadingStyle || 'combat_pulse';
  const orderedSections = preferences.sectionOrder[journey]?.filter(s => s.visible) || [];

  const [msgIndex, setMsgIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(1);
  const [barProgress, setBarProgress] = useState(28);

  const contextualPool = DEFAULT_CONTEXTUAL_MESSAGES[journey] || DEFAULT_CONTEXTUAL_MESSAGES.student;
  const activeMessage = message || contextualPool[msgIndex % contextualPool.length];

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % contextualPool.length);
    }, 950);

    const stepTimer = setInterval(() => {
      setActiveStepIndex(prev => (prev < steps.length ? prev + 1 : 1));
    }, 680);

    const barTimer = setInterval(() => {
      setBarProgress(prev => (prev >= 94 ? 32 : prev + 18));
    }, 420);

    return () => {
      clearInterval(msgTimer);
      clearInterval(stepTimer);
      clearInterval(barTimer);
    };
  }, [contextualPool.length, steps.length]);

  // ============================================================================
  // MODELO A — "SKELETON ESTRUTURAL INTELIGENTE" (Alta Performance / SaaS)
  // ============================================================================
  if (activeStyle === 'skeleton') {
    return (
      <div
        style={{
          width: '100%',
          padding: compact ? '1.25rem' : '2rem',
          background: 'var(--bg-background)',
          color: 'var(--text-foreground)',
          borderRadius: compact ? '16px' : '20px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <style>{`
          @keyframes combatSkeletonPulse {
            0% { opacity: 0.45; transform: translateX(-2%); }
            50% { opacity: 0.92; transform: translateX(0%); }
            100% { opacity: 0.45; transform: translateX(-2%); }
          }
        `}</style>

        {/* Top Header Skeleton */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            paddingBottom: '0.9rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                animation: 'combatSkeletonPulse 1.5s ease-in-out infinite'
              }}
            />
            <div>
              <div
                style={{
                  width: '180px',
                  height: '12px',
                  borderRadius: '6px',
                  background: 'var(--color-primary)',
                  opacity: 0.35,
                  marginBottom: '6px'
                }}
              />
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted-foreground)'
                }}
              >
                {activeMessage}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: 'var(--bg-surface-2)',
                color: 'var(--color-primary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              Skeleton Dinâmico ({orderedSections.length} blocos na sua ordem)
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'var(--bg-surface-2)',
                  color: 'var(--text-foreground)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Ordered Section Skeletons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {orderedSections.slice(0, compact ? 3 : 5).map((sec, idx) => (
            <div
              key={sec.id}
              style={{
                padding: compact ? '0.85rem 1rem' : '1.1rem 1.25rem',
                borderRadius: '14px',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                animation: `combatSkeletonPulse ${1.3 + idx * 0.15}s ease-in-out infinite`
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem' }}>{sec.icon}</span>
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      color: 'var(--text-foreground)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    #{idx + 1} · {sec.label}
                  </span>
                </div>
                <div
                  style={{
                    width: '68px',
                    height: '18px',
                    borderRadius: '999px',
                    background: 'var(--bg-surface-muted)',
                    border: '1px solid var(--border-subtle)'
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: idx % 2 === 0 ? '2fr 1fr 1fr' : '1fr 1fr',
                  gap: '0.65rem'
                }}
              >
                <div
                  style={{
                    height: compact ? '38px' : '54px',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-muted)',
                    border: '1px solid var(--border-subtle)'
                  }}
                />
                <div
                  style={{
                    height: compact ? '38px' : '54px',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)'
                  }}
                />
                {idx % 2 === 0 && (
                  <div
                    style={{
                      height: compact ? '38px' : '54px',
                      borderRadius: '10px',
                      background: 'var(--bg-surface-muted)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // MODELO B — "CORPORATIVO & MINIMALISTA" (Formal / Discreto)
  // ============================================================================
  if (activeStyle === 'minimal_bar') {
    return (
      <div
        style={{
          width: '100%',
          minHeight: compact ? '180px' : '260px',
          padding: compact ? '1.5rem' : '2.5rem',
          background: 'var(--bg-background)',
          color: 'var(--text-foreground)',
          borderRadius: compact ? '16px' : '20px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        {/* Barra de progresso superior ultrafina (3px) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--bg-surface-2)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${barProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
              transition: 'width 0.35s ease'
            }}
          />
        </div>

        {/* Logotipo central discreto */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.15rem',
              color: 'var(--color-primary)',
              letterSpacing: '0.06em'
            }}
          >
            CP
          </span>
        </div>

        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--text-muted-foreground)',
            marginBottom: '0.35rem'
          }}
        >
          COMBAT-PASS ENTERPRISE NETWORK
        </div>

        <div
          style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            color: 'var(--text-foreground)',
            maxWidth: '440px',
            marginBottom: '0.35rem'
          }}
        >
          {activeMessage}
        </div>

        {subMessage && (
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted-foreground)' }}>
            {subMessage}
          </div>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              marginTop: '1rem',
              background: 'var(--bg-surface-1)',
              color: 'var(--text-muted-foreground)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Fechar Preview
          </button>
        )}
      </div>
    );
  }

  // ============================================================================
  // MODELO D — "PROGRESSIVO POR ETAPAS" (Operacional / Transacional)
  // ============================================================================
  if (activeStyle === 'step_progress') {
    return (
      <div
        style={{
          width: '100%',
          padding: compact ? '1.35rem' : '2rem',
          background: 'var(--bg-surface-1)',
          color: 'var(--text-foreground)',
          borderRadius: compact ? '16px' : '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          maxWidth: compact ? '100%' : '580px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-primary)'
              }}
            >
              PROCESSAMENTO TRANSACIONAL EM ETAPAS
            </span>
            <h4
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '1.05rem',
                fontWeight: 900,
                color: 'var(--text-foreground)'
              }}
            >
              {message || 'Executando Operação Combat-Pass'}
            </h4>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'var(--bg-surface-2)',
                color: 'var(--text-foreground)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Checklist animado em tempo real */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {steps.map((stepText, idx) => {
            const isDone = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  background: isCurrent
                    ? 'var(--bg-surface-2)'
                    : isDone
                    ? 'var(--status-available-bg)'
                    : 'var(--bg-background)',
                  border: isCurrent
                    ? '1px solid var(--color-primary)'
                    : isDone
                    ? '1px solid var(--status-available-border)'
                    : '1px solid var(--border-subtle)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    flexShrink: 0,
                    background: isDone
                      ? 'var(--status-available)'
                      : isCurrent
                      ? 'var(--color-primary)'
                      : 'var(--bg-surface-muted)',
                    color: isDone || isCurrent
                      ? 'var(--text-primary-foreground)'
                      : 'var(--text-muted-foreground)'
                  }}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: isCurrent || isDone ? 800 : 600,
                      color: isDone
                        ? 'var(--status-available)'
                        : isCurrent
                        ? 'var(--text-foreground)'
                        : 'var(--text-muted-foreground)'
                    }}
                  >
                    {stepText}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isDone
                      ? 'var(--status-available)'
                      : isCurrent
                      ? 'var(--color-primary)'
                      : 'var(--text-muted-foreground)'
                  }}
                >
                  {isDone ? 'Concluído' : isCurrent ? 'Em curso...' : 'Aguardando'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================================
  // MODELO C — "COMBAT PULSE / ARENA" (Imersivo & Gamificado) [Default]
  // ============================================================================
  return (
    <div
      style={{
        width: '100%',
        padding: compact ? '1.5rem' : '2.5rem',
        background: 'var(--bg-surface-1)',
        color: 'var(--text-foreground)',
        borderRadius: compact ? '16px' : '22px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes combatOctagonRotate {
          0% { transform: rotate(0deg) scale(0.96); }
          50% { transform: rotate(180deg) scale(1.04); }
          100% { transform: rotate(360deg) scale(0.96); }
        }
        @keyframes combatRingPulse {
          0%, 100% { opacity: 0.35; transform: scale(0.92); }
          50% { opacity: 0.95; transform: scale(1.06); }
        }
      `}</style>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-surface-2)',
            color: 'var(--text-foreground)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0.3rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      )}

      {/* Indicador geométrico SVG (Octógono / Cronômetro de Round) */}
      <div
        style={{
          position: 'relative',
          width: compact ? '84px' : '104px',
          height: compact ? '84px' : '104px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.15rem'
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            animation: 'combatOctagonRotate 6s linear infinite'
          }}
        >
          <polygon
            points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3.5"
            strokeDasharray="18 8"
          />
          <polygon
            points="34,14 66,14 86,34 86,66 66,86 34,86 14,66 14,34"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            opacity="0.7"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            width: compact ? '46px' : '56px',
            height: compact ? '46px' : '56px',
            borderRadius: '14px',
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: compact ? '1.35rem' : '1.65rem',
            boxShadow: 'var(--shadow-glow)',
            animation: 'combatRingPulse 1.6s ease-in-out infinite'
          }}
        >
          🥊
        </div>
      </div>

      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--color-primary)',
          marginBottom: '0.35rem'
        }}
      >
        COMBAT PULSE · ROUND ATIVO
      </div>

      <div
        style={{
          fontSize: compact ? '0.95rem' : '1.08rem',
          fontWeight: 800,
          color: 'var(--text-foreground)',
          maxWidth: '480px',
          marginBottom: '0.45rem'
        }}
      >
        {activeMessage}
      </div>

      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted-foreground)',
          marginBottom: '1rem'
        }}
      >
        {subMessage || 'Sincronização em tempo real com a rede de academias Combat-Pass'}
      </div>

      {/* Barra de pulso inferior */}
      <div
        style={{
          width: '220px',
          height: '5px',
          borderRadius: '999px',
          background: 'var(--bg-surface-muted)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            width: `${barProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
            transition: 'width 0.35s ease'
          }}
        />
      </div>
    </div>
  );
};

export const GlobalLoadingOverlay: React.FC = () => {
  const { activeLoadingDemo, triggerLoadingDemo } = useLayoutEngine();

  if (!activeLoadingDemo.active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div style={{ width: '100%', maxWidth: '680px' }}>
        <LoadingScreenRenderer
          styleOverride={activeLoadingDemo.styleOverride}
          message={activeLoadingDemo.message}
          onClose={() => triggerLoadingDemo('', undefined, 1)}
        />
      </div>
    </div>
  );
};
