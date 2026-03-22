import { useEffect, useMemo, useState } from 'react';
import { translations, type Locale } from '@shared/i18n/translations';

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

export function useRuntime() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [locale, setLocale] = useState<Locale>('ko-KR');

  useEffect(() => {
    void window.botApi.snapshot().then(setSnapshot);
    window.botApi.onLog((entry) => setLogs((prev) => [JSON.stringify(entry), ...prev].slice(0, 300)));

    const timer = setInterval(() => {
      void window.botApi.snapshot().then(setSnapshot);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const refresh = async () => {
    const next = await window.botApi.snapshot();
    setSnapshot(next);
  };

  const t = useMemo(() => translations[locale], [locale]);

  const selectLocale = (next: Locale) => {
    setLocale(next);
  };

  return {
    t,
    locale,
    logs,
    snapshot,
    selectLocale,
    start: async () => setSnapshot(await window.botApi.start()),
    stop: async () => setSnapshot(await window.botApi.stop()),
    restartBridge: async () => setSnapshot(await window.botApi.restartBridge()),
    setPerformanceMode: async (mode: PerformanceMode) => setSnapshot(await window.botApi.setPerformanceMode(mode)),
    refresh
  };
}
