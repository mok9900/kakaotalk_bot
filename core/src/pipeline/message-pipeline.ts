import type { KakaoBridge } from '@shared/contracts/bridge';
import type { AgentService } from '@shared/contracts/agent';
import { CommandRegistry } from '@commands/registry/command-registry';
import { Logger } from '@services/logging/logger';

export class MessagePipeline {
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly bridge: KakaoBridge,
    private readonly agent: AgentService,
    private readonly commands: CommandRegistry,
    private readonly logger: Logger
  ) {}

  start(intervalMs = 1500): void {
    this.timer = setInterval(async () => {
      const messages = await this.bridge.detectIncomingMessages();
      for (const event of messages) {
        await this.logger.info('pipeline', 'message.received', 'Incoming message detected', { roomId: event.roomId, sender: event.sender });

        const commandReply = await this.commands.tryExecute(event);
        if (commandReply) {
          await this.bridge.sendMessage(event.roomName, commandReply);
          await this.logger.info('command', 'command.executed', 'Command reply sent', { trigger: event.text.split(' ')[0] });
          continue;
        }

        const aiReply = await this.agent.generateReply(event);
        if (aiReply) {
          await this.bridge.sendMessage(event.roomName, aiReply.text);
          await this.logger.info('agent-service', 'agent.reply', 'Agent reply sent', { roomId: event.roomId });
        }
      }
    }, intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
