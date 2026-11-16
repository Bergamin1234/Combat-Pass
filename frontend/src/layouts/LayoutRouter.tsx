import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLayoutEngine, InterfaceOption, getInterfaceFromPreset } from '../config/layoutEngine';

// Importação dos 24 layouts estruturais isolados para os 4 primeiros paradigmas
// 1. ADMIN (4 arquivos isolados)
import { AdminEscolarLayout } from './admin/AdminEscolarLayout';
import { AdminMesaHudLayout } from './admin/AdminMesaHudLayout';
import { AdminB2B0pxLayout } from './admin/AdminB2B0pxLayout';
import { AdminSuperAppLayout } from './admin/AdminSuperAppLayout';

// 2. PROFESSOR (4 arquivos isolados)
import { ProfessorEscolarLayout } from './professor/ProfessorEscolarLayout';
import { ProfessorMesaHudLayout } from './professor/ProfessorMesaHudLayout';
import { ProfessorB2B0pxLayout } from './professor/ProfessorB2B0pxLayout';
import { ProfessorSuperAppLayout } from './professor/ProfessorSuperAppLayout';

// 3. ALUNO (4 arquivos isolados)
import { AlunoEscolarLayout } from './aluno/AlunoEscolarLayout';
import { AlunoMesaHudLayout } from './aluno/AlunoMesaHudLayout';
import { AlunoB2B0pxLayout } from './aluno/AlunoB2B0pxLayout';
import { AlunoSuperAppLayout } from './aluno/AlunoSuperAppLayout';

// 4. TORNEIOS (4 arquivos isolados)
import { TorneiosEscolarLayout } from './torneios/TorneiosEscolarLayout';
import { TorneiosMesaHudLayout } from './torneios/TorneiosMesaHudLayout';
import { TorneiosB2B0pxLayout } from './torneios/TorneiosB2B0pxLayout';
import { TorneiosSuperAppLayout } from './torneios/TorneiosSuperAppLayout';

// 5. RANKING (4 arquivos isolados)
import { RankingEscolarLayout } from './ranking/RankingEscolarLayout';
import { RankingMesaHudLayout } from './ranking/RankingMesaHudLayout';
import { RankingB2B0pxLayout } from './ranking/RankingB2B0pxLayout';
import { RankingSuperAppLayout } from './ranking/RankingSuperAppLayout';

// 6. STATS (4 arquivos isolados)
import { StatsEscolarLayout } from './stats/StatsEscolarLayout';
import { StatsMesaHudLayout } from './stats/StatsMesaHudLayout';
import { StatsB2B0pxLayout } from './stats/StatsB2B0pxLayout';
import { StatsSuperAppLayout } from './stats/StatsSuperAppLayout';

// 7. OS 4 NOVOS PARADIGMAS ESTRUTURAIS (Totalizando 8 layouts)
import { CommandCenterLayout } from './paradigms/CommandCenterLayout';
import { SplitScreenLayout } from './paradigms/SplitScreenLayout';
import { FloatingIslandLayout } from './paradigms/FloatingIslandLayout';
import { ZenFocusLayout } from './paradigms/ZenFocusLayout';

export type PortalType = 'admin' | 'professor' | 'aluno' | 'torneios' | 'ranking' | 'stats';

export interface LayoutRouterProps {
  portal?: PortalType;
  interfaceOption?: InterfaceOption;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  usuarioLogado?: any;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

/**
 * LayoutRouter: Roteador dinâmico de layout que resolve exatamente
 * a combinação de Portal (6 portais) × Interface (8 paradigmas estruturais),
 * todos completamente funcionais, com renderização reativa sem quebra de tela.
 */
export const LayoutRouter: React.FC<LayoutRouterProps> = ({
  portal,
  interfaceOption,
  children,
  activeTab,
  onTabChange,
  usuarioLogado,
  title,
  subtitle,
  headerActions,
}) => {
  const location = useLocation();
  const { currentGlobalInterface, setGlobalInterface, preferences } = useLayoutEngine();

  // Se o portal não for informado explicitamente nas props, resolve pela rota e query params
  const resolvedPortal: PortalType = portal || (() => {
    const path = location.pathname;
    const search = location.search;
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/professor')) return 'professor';
    if (search.includes('tab=torneios')) return 'torneios';
    if (search.includes('tab=ranking')) return 'ranking';
    if (search.includes('tab=desempenho') || search.includes('tab=stats')) return 'stats';
    return 'aluno';
  })();

  const journeyKey =
    resolvedPortal === 'admin'
      ? 'admin'
      : resolvedPortal === 'professor'
      ? 'teacher'
      : 'student';

  const portalInterface = preferences?.layoutPreset
    ? getInterfaceFromPreset(journeyKey, preferences.layoutPreset[journeyKey])
    : undefined;

  const currentInterface: InterfaceOption =
    interfaceOption ||
    portalInterface ||
    currentGlobalInterface ||
    'escolar';

  const handleInterfaceChange = (opt: InterfaceOption) => {
    setGlobalInterface(opt);
  };

  const commonProps = {
    children,
    activeTab,
    onTabChange,
    onInterfaceChange: handleInterfaceChange,
    usuarioLogado,
    title,
    subtitle,
    headerActions,
    portal: resolvedPortal,
  };

  // =========================================================================
  // OS 4 NOVOS PARADIGMAS GLOBAIS (5 a 8)
  // =========================================================================
  if (currentInterface === 'command_center') {
    return <CommandCenterLayout {...commonProps} />;
  }

  if (currentInterface === 'split_screen') {
    return <SplitScreenLayout {...commonProps} />;
  }

  if (currentInterface === 'floating_island') {
    return <FloatingIslandLayout {...commonProps} />;
  }

  if (currentInterface === 'zen_focus') {
    return <ZenFocusLayout {...commonProps} />;
  }

  // =========================================================================
  // OS 4 PARADIGMAS ESPECÍFICOS POR PORTAL (1 a 4)
  // =========================================================================
  // 1. PORTAL ADMIN
  if (resolvedPortal === 'admin') {
    if (currentInterface === 'escolar') return <AdminEscolarLayout {...commonProps} />;
    if (currentInterface === 'mesa_hud') return <AdminMesaHudLayout {...commonProps} />;
    if (currentInterface === 'b2b_0px') return <AdminB2B0pxLayout {...commonProps} />;
    return <AdminSuperAppLayout {...commonProps} />;
  }

  // 2. PORTAL PROFESSOR
  if (resolvedPortal === 'professor') {
    if (currentInterface === 'escolar') return <ProfessorEscolarLayout {...commonProps} />;
    if (currentInterface === 'mesa_hud') return <ProfessorMesaHudLayout {...commonProps} />;
    if (currentInterface === 'b2b_0px') return <ProfessorB2B0pxLayout {...commonProps} />;
    return <ProfessorSuperAppLayout {...commonProps} />;
  }

  // 3. PORTAL TORNEIOS
  if (resolvedPortal === 'torneios') {
    if (currentInterface === 'escolar') return <TorneiosEscolarLayout {...commonProps} />;
    if (currentInterface === 'mesa_hud') return <TorneiosMesaHudLayout {...commonProps} />;
    if (currentInterface === 'b2b_0px') return <TorneiosB2B0pxLayout {...commonProps} />;
    return <TorneiosSuperAppLayout {...commonProps} />;
  }

  // 4. PORTAL RANKING
  if (resolvedPortal === 'ranking') {
    if (currentInterface === 'escolar') return <RankingEscolarLayout {...commonProps} />;
    if (currentInterface === 'mesa_hud') return <RankingMesaHudLayout {...commonProps} />;
    if (currentInterface === 'b2b_0px') return <RankingB2B0pxLayout {...commonProps} />;
    return <RankingSuperAppLayout {...commonProps} />;
  }

  // 5. PORTAL STATS
  if (resolvedPortal === 'stats') {
    if (currentInterface === 'escolar') return <StatsEscolarLayout {...commonProps} />;
    if (currentInterface === 'mesa_hud') return <StatsMesaHudLayout {...commonProps} />;
    if (currentInterface === 'b2b_0px') return <StatsB2B0pxLayout {...commonProps} />;
    return <StatsSuperAppLayout {...commonProps} />;
  }

  // 6. PORTAL ALUNO (Padrão)
  if (currentInterface === 'escolar') return <AlunoEscolarLayout {...commonProps} />;
  if (currentInterface === 'mesa_hud') return <AlunoMesaHudLayout {...commonProps} />;
  if (currentInterface === 'b2b_0px') return <AlunoB2B0pxLayout {...commonProps} />;
  return <AlunoSuperAppLayout {...commonProps} />;
};

export default LayoutRouter;
