import type { ServiceHealth } from '@shared/types/system';

export class HealthMonitor {
  private readonly states = new Map<string, ServiceHealth>();

  update(state: ServiceHealth): void {
    this.states.set(state.name, state);
  }

  snapshot(): ServiceHealth[] {
    return [...this.states.values()];
  }

  summary(): ServiceHealth {
    const states = this.snapshot();
    const unhealthy = states.find((s) => s.status === 'unhealthy');
    const degraded = states.find((s) => s.status === 'degraded');

    if (unhealthy) {
      return { name: 'overall', status: 'unhealthy', lastCheckedAt: new Date().toISOString(), details: 'One or more critical services are unhealthy' };
    }

    if (degraded) {
      return { name: 'overall', status: 'degraded', lastCheckedAt: new Date().toISOString(), details: 'One or more services are degraded' };
    }

    return { name: 'overall', status: 'healthy', lastCheckedAt: new Date().toISOString(), details: 'All services healthy' };
  }
}
