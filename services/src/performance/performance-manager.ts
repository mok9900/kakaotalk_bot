import { cpus, freemem, totalmem, platform } from 'node:os';
import type { PerformanceMode, PerformanceSnapshot } from '@shared/types/system';

export class PerformanceManager {
  private mode: PerformanceMode = 'balanced';
  private protectionTriggered = false;
  private preferredGpu: 'external' | 'integrated' | 'unknown' = 'unknown';

  async initialize(): Promise<void> {
    this.preferredGpu = this.detectPreferredGpu();
  }

  setMode(mode: PerformanceMode): void {
    this.mode = mode;
  }

  getMode(): PerformanceMode {
    return this.mode;
  }

  snapshot(): PerformanceSnapshot {
    const totalCpu = cpus().length;
    const cpuLoadPercent = Math.min(100, Math.max(1, totalCpu * 8));
    const memoryTotalMb = Math.round(totalmem() / 1024 / 1024);
    const memoryUsedMb = memoryTotalMb - Math.round(freemem() / 1024 / 1024);

    if (this.mode === 'high-performance' && memoryUsedMb / memoryTotalMb > 0.92) {
      this.protectionTriggered = true;
      this.mode = 'safe';
    } else {
      this.protectionTriggered = false;
    }

    return {
      cpuLoadPercent,
      memoryUsedMb,
      memoryTotalMb,
      mode: this.mode,
      protectionTriggered: this.protectionTriggered,
      preferredGpu: this.preferredGpu
    };
  }

  private detectPreferredGpu(): 'external' | 'integrated' | 'unknown' {
    if (platform() !== 'win32') {
      return 'unknown';
    }

    // 실제 구현에서는 DXDiag/WMI 기반으로 외장 GPU를 탐지하고 우선 순위를 설정합니다.
    return 'external';
  }
}
