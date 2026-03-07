import { EventEmitter } from 'node:events';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { StructuredLog, LogLevel } from '@shared/types/logging';

export class Logger extends EventEmitter {
  constructor(private readonly logsDir: string) {
    super();
  }

  async init(): Promise<void> {
    await mkdir(this.logsDir, { recursive: true });
  }

  async log(entry: Omit<StructuredLog, 'timestamp'>): Promise<void> {
    const payload: StructuredLog = { ...entry, timestamp: new Date().toISOString() };
    this.emit('log', payload);
    const filePath = join(this.logsDir, `${entry.subsystem}.log`);
    await appendFile(filePath, `${JSON.stringify(payload)}\n`, 'utf8');
  }

  info(subsystem: StructuredLog['subsystem'], event: string, message: string, metadata?: Record<string, unknown>) {
    return this.logWithLevel('info', subsystem, event, message, metadata);
  }

  warn(subsystem: StructuredLog['subsystem'], event: string, message: string, metadata?: Record<string, unknown>) {
    return this.logWithLevel('warn', subsystem, event, message, metadata);
  }

  error(subsystem: StructuredLog['subsystem'], event: string, message: string, metadata?: Record<string, unknown>) {
    return this.logWithLevel('error', subsystem, event, message, metadata);
  }

  private async logWithLevel(level: LogLevel, subsystem: StructuredLog['subsystem'], event: string, message: string, metadata?: Record<string, unknown>) {
    await this.log({ level, subsystem, event, message, metadata });
  }
}
