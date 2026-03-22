export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  subsystem:
    | 'bootstrap'
    | 'updater'
    | 'dependency-manager'
    | 'kakao-bridge'
    | 'agent-service'
    | 'firebase-sync'
    | 'ui'
    | 'command'
    | 'pipeline'
    | 'error-boundary';
  event: string;
  message: string;
  metadata?: Record<string, unknown>;
}
