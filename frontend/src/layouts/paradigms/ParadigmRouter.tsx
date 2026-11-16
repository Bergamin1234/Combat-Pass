import React from 'react';
import { EscolarLayout } from './EscolarLayout';
import { MesaHudLayout } from './MesaHudLayout';
import { B2BLayout } from './B2BLayout';
import { SuperAppLayout } from './SuperAppLayout';
import { CommandCenterLayout } from './CommandCenterLayout';
import { SplitScreenLayout } from './SplitScreenLayout';
import { FloatingIslandLayout } from './FloatingIslandLayout';
import { ZenFocusLayout } from './ZenFocusLayout';

export type ActiveParadigm =
  | 'escolar'
  | 'mesa_hud'
  | 'b2b_flat'
  | 'super_app'
  | 'command_center'
  | 'split_screen'
  | 'floating_island'
  | 'zen_focus';

export interface ParadigmRouterProps {
  paradigm: ActiveParadigm | string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  usuarioLogado?: any;
  navItems?: Array<{ id: string; label: string; icon?: string; badge?: string; routeOrTab?: string }>;
  headerActions?: React.ReactNode;
}

export const PARADIGMS_CATALOG: Array<{
  id: ActiveParadigm;
  name: string;
  badge: string;
  icon: string;
  desc: string;
}> = [
  {
    id: 'escolar',
    name: '1. Sistema Escolar',
    badge: 'Sidebar Esquerdo',
    icon: '🎓',
    desc: 'Estrutura clássica de dashboard: sidebar fixo à esquerda (w-64) + conteúdo amplo à direita'
  },
  {
    id: 'mesa_hud',
    name: '2. Mesa HUD',
    badge: 'Zero Sidebar',
    icon: '⚡',
    desc: 'Estrutura de monitor/painel de controle: navbar densa no topo ocupando 100% de largura + zero sidebars'
  },
  {
    id: 'b2b_flat',
    name: '3. B2B 0px',
    badge: 'Grid Invertido 0px',
    icon: '🏛️',
    desc: 'Estrutura de matriz invertida: conteúdo principal na esquerda + sidebar de ações e filtros na direita, flat 0px'
  },
  {
    id: 'super_app',
    name: '4. Super-App',
    badge: 'Mobile-First',
    icon: '📱',
    desc: 'Estrutura mobile-first: container centralizado max-w-xl, navbar minimalista no topo e bottom nav flutuante'
  },
  {
    id: 'command_center',
    name: '5. Command Center',
    badge: 'Grid Terminal 12x6',
    icon: '💻',
    desc: 'Painel trader/IDE: grid rígido 12x6 sem rolagem geral, com scroll exclusivamente interno por bloco'
  },
  {
    id: 'split_screen',
    name: '6. Split-Screen',
    badge: 'Divisão 40/60',
    icon: '🌓',
    desc: 'Divisão vertical 40/60: 40% fixo com identidade e navegação à esquerda, 60% com scroll para dados à direita'
  },
  {
    id: 'floating_island',
    name: '7. Floating Island',
    badge: 'macOS Glass',
    icon: '🏝️',
    desc: 'Ilha flutuante centralizada sobre gradiente com backdrop-blur, cantos arredondados e botões traffic lights'
  },
  {
    id: 'zen_focus',
    name: '8. Zen Foco Total',
    badge: 'Estilo Notion',
    icon: '🧘',
    desc: 'Foco absoluto em leitura e dados: coluna central estreita max-w-3xl com margens laterais gigantes e topo invisível'
  }
];

export const ParadigmRouter: React.FC<ParadigmRouterProps> = ({
  paradigm,
  children,
  ...rest
}) => {
  switch (paradigm) {
    case 'escolar':
    case 'marketplace':
    case 'tatame_express':
    case 'tatame_fast':
    case 'executive':
      return <EscolarLayout {...rest}>{children}</EscolarLayout>;

    case 'mesa_hud':
    case 'tatame':
    case 'gamified_journey':
    case 'technical_perf':
    case 'operational_360':
      return <MesaHudLayout {...rest}>{children}</MesaHudLayout>;

    case 'b2b_flat':
    case 'corporate':
    case 'agenda_control':
    case 'partner_portal':
    case 'customizer_studio':
      return <B2BLayout {...rest}>{children}</B2BLayout>;

    case 'super_app':
    case 'classic':
    case 'complete_tabs':
    case 'classic_teacher':
    case 'complete_erp':
      return <SuperAppLayout {...rest}>{children}</SuperAppLayout>;

    case 'command_center':
      return <CommandCenterLayout {...rest}>{children}</CommandCenterLayout>;

    case 'split_screen':
      return <SplitScreenLayout {...rest}>{children}</SplitScreenLayout>;

    case 'floating_island':
      return <FloatingIslandLayout {...rest}>{children}</FloatingIslandLayout>;

    case 'zen_focus':
      return <ZenFocusLayout {...rest}>{children}</ZenFocusLayout>;

    default:
      return <EscolarLayout {...rest}>{children}</EscolarLayout>;
  }
};
