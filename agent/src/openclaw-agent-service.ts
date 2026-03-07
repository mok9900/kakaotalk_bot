import type { AgentService } from '@shared/contracts/agent';
import type { BridgeMessageEvent, AgentResponseAction } from '@shared/events/message';
import type { ServiceHealth } from '@shared/types/system';

export class OpenClawAgentService implements AgentService {
  private ready = false;
  private profileId = 'default';

  async initialize(): Promise<void> {
    this.ready = true;
  }

  async shutdown(): Promise<void> {
    this.ready = false;
  }

  async isReady(): Promise<boolean> {
    return this.ready;
  }

  async generateReply(context: BridgeMessageEvent): Promise<AgentResponseAction | null> {
    if (!this.ready) {
      return null;
    }

    return {
      roomId: context.roomId,
      text: `Agent (${this.profileId}) received: ${context.text}`,
      metadata: { provider: 'openclaw-compatible' }
    };
  }

  async runTool(toolRequest: Record<string, unknown>): Promise<Record<string, unknown>> {
    return { ok: true, toolRequest };
  }

  async getAgentStatus(): Promise<ServiceHealth> {
    return {
      name: 'agent',
      status: this.ready ? 'healthy' : 'degraded',
      lastCheckedAt: new Date().toISOString(),
      details: this.ready ? `Agent profile ${this.profileId} ready` : 'Agent not initialized'
    };
  }

  async reloadProfile(profileId: string): Promise<void> {
    this.profileId = profileId;
  }
}
