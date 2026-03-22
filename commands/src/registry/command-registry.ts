import type { BridgeMessageEvent } from '@shared/events/message';
import type { CommandDefinition } from './command-types';

export class CommandRegistry {
  constructor(private readonly commands: CommandDefinition[]) {}

  list(): CommandDefinition[] {
    return this.commands;
  }

  async tryExecute(event: BridgeMessageEvent): Promise<string | null> {
    const command = this.commands.find((c) => c.enabled && event.text.startsWith(c.trigger));
    if (!command) {
      return null;
    }

    return command.execute(event);
  }
}
