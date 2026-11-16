// ============================================================================
// COMBAT-PASS / COMBAT-HUB — ARQUITETURA DE 24 LAYOUTS ISOLADOS
// 6 Portais (Admin, Professor, Aluno, Torneios, Ranking, Stats)
// × 4 Interfaces (1. Escolar, 2. Mesa HUD, 3. B2B 0px, 4. Super-App)
// ============================================================================

// 1. Portal ADMIN (4 layouts isolados)
export { AdminEscolarLayout } from './admin/AdminEscolarLayout';
export { AdminMesaHudLayout } from './admin/AdminMesaHudLayout';
export { AdminB2B0pxLayout } from './admin/AdminB2B0pxLayout';
export { AdminSuperAppLayout } from './admin/AdminSuperAppLayout';
export type { AdminLayoutProps } from './admin/AdminEscolarLayout';

// 2. Portal PROFESSOR (4 layouts isolados)
export { ProfessorEscolarLayout } from './professor/ProfessorEscolarLayout';
export { ProfessorMesaHudLayout } from './professor/ProfessorMesaHudLayout';
export { ProfessorB2B0pxLayout } from './professor/ProfessorB2B0pxLayout';
export { ProfessorSuperAppLayout } from './professor/ProfessorSuperAppLayout';
export type { ProfessorLayoutProps } from './professor/ProfessorEscolarLayout';

// 3. Portal ALUNO (4 layouts isolados)
export { AlunoEscolarLayout } from './aluno/AlunoEscolarLayout';
export { AlunoMesaHudLayout } from './aluno/AlunoMesaHudLayout';
export { AlunoB2B0pxLayout } from './aluno/AlunoB2B0pxLayout';
export { AlunoSuperAppLayout } from './aluno/AlunoSuperAppLayout';
export type { AlunoLayoutProps } from './aluno/AlunoEscolarLayout';

// 4. Portal TORNEIOS (4 layouts isolados)
export { TorneiosEscolarLayout } from './torneios/TorneiosEscolarLayout';
export { TorneiosMesaHudLayout } from './torneios/TorneiosMesaHudLayout';
export { TorneiosB2B0pxLayout } from './torneios/TorneiosB2B0pxLayout';
export { TorneiosSuperAppLayout } from './torneios/TorneiosSuperAppLayout';
export type { TorneiosLayoutProps } from './torneios/TorneiosEscolarLayout';

// 5. Portal RANKING (4 layouts isolados)
export { RankingEscolarLayout } from './ranking/RankingEscolarLayout';
export { RankingMesaHudLayout } from './ranking/RankingMesaHudLayout';
export { RankingB2B0pxLayout } from './ranking/RankingB2B0pxLayout';
export { RankingSuperAppLayout } from './ranking/RankingSuperAppLayout';
export type { RankingLayoutProps } from './ranking/RankingEscolarLayout';

// 6. Portal STATS (4 layouts isolados)
export { StatsEscolarLayout } from './stats/StatsEscolarLayout';
export { StatsMesaHudLayout } from './stats/StatsMesaHudLayout';
export { StatsB2B0pxLayout } from './stats/StatsB2B0pxLayout';
export { StatsSuperAppLayout } from './stats/StatsSuperAppLayout';
export type { StatsLayoutProps } from './stats/StatsEscolarLayout';

// Componentes comuns / navegação e Roteador Dinâmico
export * from './common/PortalNavBar';
export { LayoutRouter, default as LayoutRouterDefault } from './LayoutRouter';
export type { LayoutRouterProps, PortalType } from './LayoutRouter';
