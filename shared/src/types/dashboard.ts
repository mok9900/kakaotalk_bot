import type { ServiceHealth, PerformanceSnapshot } from './system';

export interface DashboardSnapshot {
  services: ServiceHealth[];
  performance: PerformanceSnapshot;
  updatedAt: string;
}
