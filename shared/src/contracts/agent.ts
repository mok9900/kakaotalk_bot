import type { BridgeMessageEvent, AgentResponseAction } from '../events/message';
import type { ServiceHealth } from '../types/system';

export interface AgentService {
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  isReady(): Promise<boolean>;
  generateReply(context: BridgeMessageEvent): Promise<AgentResponseAction | null>;
  runTool(toolRequest: Record<string, unknown>): Promise<Record<string, unknown>>;
  getAgentStatus(): Promise<ServiceHealth>;
  reloadProfile(profileId: string): Promise<void>;
}
