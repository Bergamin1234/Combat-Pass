import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyPlatformTheme, getCurrentPlatformTheme } from './themeConfig';
import {
  InterfaceOption,
  getPresetFromInterface,
  useLayoutEngine,
} from './layoutEngine';

export interface SiteBuilderSections {
  showHub: boolean;
  showGaleria: boolean;
  showHorarios: boolean;
  showModalidades: boolean;
  showPlanos: boolean;
  showExperimental: boolean;
  showFaq: boolean;
}

export interface SiteBuilderPortals {
  enableStudentPortal: boolean;
  enableGamification: boolean;
  enableTeacherPortal: boolean;
  enableAttendantPortal: boolean;
}

export interface SiteBuilderInterfaces {
  landing: InterfaceOption;
  admin: InterfaceOption;
  student: InterfaceOption;
}

export interface SiteBuilderConfig {
  academyName: string;
  academySlogan: string;
  themeId: string;
  sections: SiteBuilderSections;
  portals: SiteBuilderPortals;
  interfaces: SiteBuilderInterfaces;
  completedAt: string | null;
}

const STORAGE_KEY = 'combat_pass_site_builder_v1';

export const DEFAULT_SITE_BUILDER_CONFIG: SiteBuilderConfig = {
  academyName: 'CT BORÜ CENTRO DE COMBATE',
  academySlogan: 'Centro de Treinamento em Artes Marciais & Alta Performance',
  themeId: getCurrentPlatformTheme() || 'neutral-dark',
  sections: {
    showHub: true,
    showGaleria: true,
    showHorarios: true,
    showModalidades: true,
    showPlanos: true,
    showExperimental: true,
    showFaq: true,
  },
  portals: {
    enableStudentPortal: true,
    enableGamification: true,
    enableTeacherPortal: true,
    enableAttendantPortal: true,
  },
  interfaces: {
    landing: 'escolar',
    admin: 'escolar',
    student: 'escolar',
  },
  completedAt: null,
};

interface SiteBuilderContextValue {
  config: SiteBuilderConfig;
  updateConfig: (partial: Partial<SiteBuilderConfig>) => void;
  updateSection: (key: keyof SiteBuilderSections, value: boolean) => void;
  updatePortal: (key: keyof SiteBuilderPortals, value: boolean) => void;
  updateInterface: (journey: keyof SiteBuilderInterfaces, opt: InterfaceOption) => void;
  selectTheme: (themeId: string) => void;
  markCompleted: () => void;
  resetBuilder: () => void;
}

const SiteBuilderContext = createContext<SiteBuilderContextValue | null>(null);

export const SiteBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setJourneyPreset } = useLayoutEngine();

  const [config, setConfig] = useState<SiteBuilderConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_BUILDER_CONFIG,
          ...parsed,
          sections: { ...DEFAULT_SITE_BUILDER_CONFIG.sections, ...(parsed.sections || {}) },
          portals: { ...DEFAULT_SITE_BUILDER_CONFIG.portals, ...(parsed.portals || {}) },
          interfaces: { ...DEFAULT_SITE_BUILDER_CONFIG.interfaces, ...(parsed.interfaces || {}) },
        };
      }
    } catch {
      // fallback padrão
    }
    return DEFAULT_SITE_BUILDER_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignora erro de quota
    }
  }, [config]);

  const updateConfig = (partial: Partial<SiteBuilderConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const updateSection = (key: keyof SiteBuilderSections, value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: value },
    }));
  };

  const updatePortal = (key: keyof SiteBuilderPortals, value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      portals: { ...prev.portals, [key]: value },
    }));
  };

  const updateInterface = (journey: keyof SiteBuilderInterfaces, opt: InterfaceOption) => {
    setConfig((prev) => ({
      ...prev,
      interfaces: { ...prev.interfaces, [journey]: opt },
    }));
    const preset = getPresetFromInterface(journey, opt) as any;
    setJourneyPreset(journey, preset);
  };

  const selectTheme = (themeId: string) => {
    applyPlatformTheme(themeId);
    setConfig((prev) => ({ ...prev, themeId }));
  };

  const markCompleted = () => {
    setConfig((prev) => ({ ...prev, completedAt: new Date().toISOString() }));
  };

  const resetBuilder = () => {
    setConfig({ ...DEFAULT_SITE_BUILDER_CONFIG });
    applyPlatformTheme(DEFAULT_SITE_BUILDER_CONFIG.themeId);
    setJourneyPreset('landing', getPresetFromInterface('landing', DEFAULT_SITE_BUILDER_CONFIG.interfaces.landing) as any);
    setJourneyPreset('admin', getPresetFromInterface('admin', DEFAULT_SITE_BUILDER_CONFIG.interfaces.admin) as any);
    setJourneyPreset('student', getPresetFromInterface('student', DEFAULT_SITE_BUILDER_CONFIG.interfaces.student) as any);
  };

  return (
    <SiteBuilderContext.Provider
      value={{
        config,
        updateConfig,
        updateSection,
        updatePortal,
        updateInterface,
        selectTheme,
        markCompleted,
        resetBuilder,
      }}
    >
      {children}
    </SiteBuilderContext.Provider>
  );
};

export function useSiteBuilder(): SiteBuilderContextValue {
  const ctx = useContext(SiteBuilderContext);
  if (!ctx) {
    throw new Error('useSiteBuilder deve ser usado dentro de SiteBuilderProvider');
  }
  return ctx;
}
