import type { BridgeMessageEvent } from '../events/message';
import type { ServiceHealth } from '../types/system';

export interface KakaoBridge {
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  getStatus(): Promise<ServiceHealth>;
  detectIncomingMessages(): Promise<BridgeMessageEvent[]>;
  sendMessage(room: string, text: string): Promise<void>;
  focusChatWindow(room: string): Promise<boolean>;
  syncRecentMessages(): Promise<BridgeMessageEvent[]>;
  healthCheck(): Promise<ServiceHealth>;
}
