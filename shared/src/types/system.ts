export type HealthState = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export type PerformanceMode = 'balanced' | 'high-performance' | 'safe';

export interface ServiceHealth {
  name: string;
  status: HealthState;
  lastCheckedAt: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

export interface RuntimeDependency {
  id: string;
  name: string;
  requiredVersion: string;
  installedVersion?: string;
  status: 'missing' | 'outdated' | 'valid' | 'corrupt';
  required: boolean;
  installHint?: string;
}

export interface BootstrapStepResult {
  step: string;
  success: boolean;
  durationMs: number;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface AppPaths {
  appDataDir: string;
  cacheDir: string;
  logsDir: string;
  configDir: string;
  diagnosticsDir: string;
  runtimeDir: string;
}

export interface RuntimeVersions {
  appVersion: string;
  nodeVersion: string;
  electronVersion: string;
  chromeVersion?: string;
}

export interface PerformanceSnapshot {
  cpuLoadPercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  mode: PerformanceMode;
  protectionTriggered: boolean;
  preferredGpu: 'external' | 'integrated' | 'unknown';
}
