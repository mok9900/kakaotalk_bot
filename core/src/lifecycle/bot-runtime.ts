import { DesktopAutomationKakaoBridge } from '@bridge/kakao-bridge';
import { OpenClawAgentService } from '@agent/openclaw-agent-service';
import { CommandRegistry } from '@commands/registry/command-registry';
import { basicCommands } from '@commands/handlers/basic-commands';
import { MessagePipeline } from '@core/pipeline/message-pipeline';
import { FirebaseService } from '@services/firebase/firebase-service';
import { HealthMonitor } from '@services/health/health-monitor';
import { Logger } from '@services/logging/logger';
import { getAppPaths } from '@services/config/paths';
import type { ServiceHealth } from '@shared/types/system';

export class BotRuntime {
  private readonly bridge = new DesktopAutomationKakaoBridge();
  private readonly agent = new OpenClawAgentService();
  private readonly commands = new CommandRegistry(basicCommands);
  private readonly firebase = new FirebaseService();
  private readonly healthMonitor = new HealthMonitor();
  private readonly logger = new Logger(getAppPaths().logsDir);
  private readonly pipeline = new MessagePipeline(this.bridge, this.agent, this.commands, this.logger);
  private running = false;

  async initialize(): Promise<void> {
    await this.logger.init();
    await this.firebase.initialize({
      apiKey: process.env.FIREBASE_API_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    await this.agent.initialize();
    await this.logger.info('pipeline', 'runtime.initialized', 'Runtime initialized');
  }

  async start(): Promise<void> {
    if (this.running) {
      return;
    }

    await this.bridge.start();
    this.pipeline.start();
    this.running = true;
    await this.logger.info('pipeline', 'runtime.started', 'Bot runtime started');
  }

  async stop(): Promise<void> {
    this.pipeline.stop();
    await this.bridge.stop();
    this.running = false;
    await this.logger.warn('pipeline', 'runtime.stopped', 'Bot runtime stopped');
  }

  async restartBridge(): Promise<void> {
    await this.bridge.restart();
    await this.logger.warn('kakao-bridge', 'bridge.restarted', 'Bridge restarted manually');
  }

  async status(): Promise<ServiceHealth[]> {
    const bridgeHealth = await this.bridge.healthCheck();
    const agentHealth = await this.agent.getAgentStatus();
    const firebaseHealth = await this.firebase.healthCheck();

    this.healthMonitor.update(bridgeHealth);
    this.healthMonitor.update(agentHealth);
    this.healthMonitor.update(firebaseHealth);
    this.healthMonitor.update({
      name: 'bot-runtime',
      status: this.running ? 'healthy' : 'degraded',
      lastCheckedAt: new Date().toISOString(),
      details: this.running ? 'Runtime active' : 'Runtime stopped'
    });

    return [...this.healthMonitor.snapshot(), this.healthMonitor.summary()];
  }

  onLog(listener: (entry: unknown) => void): void {
    this.logger.on('log', listener);
  }
}
