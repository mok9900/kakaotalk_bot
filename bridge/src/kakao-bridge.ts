import type { KakaoBridge } from '@shared/contracts/bridge';
import type { BridgeMessageEvent } from '@shared/events/message';
import type { ServiceHealth } from '@shared/types/system';

export class DesktopAutomationKakaoBridge implements KakaoBridge {
  private running = false;
  private restartCount = 0;
  private lastSyncAt?: string;

  async start(): Promise<void> {
    this.running = true;
  }

  async stop(): Promise<void> {
    this.running = false;
  }

  async restart(): Promise<void> {
    await this.stop();
    this.restartCount += 1;
    await this.start();
  }

  async getStatus(): Promise<ServiceHealth> {
    return this.healthCheck();
  }

  async detectIncomingMessages(): Promise<BridgeMessageEvent[]> {
    if (!this.running) {
      return [];
    }

    return [];
  }

  async sendMessage(_room: string, _text: string): Promise<void> {
    if (!this.running) {
      throw new Error('Bridge not running');
    }
  }

  async focusChatWindow(_room: string): Promise<boolean> {
    return this.running;
  }

  async syncRecentMessages(): Promise<BridgeMessageEvent[]> {
    this.lastSyncAt = new Date().toISOString();
    return this.detectIncomingMessages();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      name: 'kakao-bridge',
      status: this.running ? 'healthy' : 'degraded',
      lastCheckedAt: new Date().toISOString(),
      details: this.running ? 'Desktop automation bridge active' : 'Bridge stopped',
      metadata: {
        readMethod: 'hybrid',
        lastSyncAt: this.lastSyncAt,
        restartCount: this.restartCount
      }
    };
  }
}
