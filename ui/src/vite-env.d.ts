/// <reference types="vite/client" />

type PerformanceMode = 'balanced' | 'high-performance' | 'safe';

type ServiceHealth = {
  name: string;
  status: string;
  details?: string;
  lastCheckedAt: string;
  metadata?: Record<string, unknown>;
};

type DashboardSnapshot = {
  services: ServiceHealth[];
  performance: {
    cpuLoadPercent: number;
    memoryUsedMb: number;
    memoryTotalMb: number;
    mode: PerformanceMode;
    protectionTriggered: boolean;
    preferredGpu: 'external' | 'integrated' | 'unknown';
  };
  updatedAt: string;
};

declare global {
  interface Window {
    botApi: {
      start: () => Promise<DashboardSnapshot>;
      stop: () => Promise<DashboardSnapshot>;
      snapshot: () => Promise<DashboardSnapshot>;
      restartBridge: () => Promise<DashboardSnapshot>;
      setPerformanceMode: (mode: PerformanceMode) => Promise<DashboardSnapshot>;
      onLog: (cb: (entry: unknown) => void) => void;
    };
  }
}

export {};
