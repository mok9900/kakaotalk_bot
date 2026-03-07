import type { BridgeMessageEvent } from '@shared/events/message';

export interface CommandDefinition {
  id: string;
  name: string;
  trigger: string;
  description: string;
  enabled: boolean;
  roomScope: 'global' | 'room';
  permissionRules: string[];
  cooldownMs: number;
  handlerType: 'local' | 'remote' | 'ai' | 'tool';
  execute(event: BridgeMessageEvent): Promise<string | null>;
}
