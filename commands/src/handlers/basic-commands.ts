import type { CommandDefinition } from '../registry/command-types';

export const basicCommands: CommandDefinition[] = [
  {
    id: 'ping',
    name: 'Ping',
    trigger: '!ping',
    description: 'Respond with pong',
    enabled: true,
    roomScope: 'global',
    permissionRules: [],
    cooldownMs: 500,
    handlerType: 'local',
    async execute() {
      return 'pong';
    }
  },
  {
    id: 'status',
    name: 'Status',
    trigger: '!status',
    description: 'Show runtime status summary',
    enabled: true,
    roomScope: 'global',
    permissionRules: [],
    cooldownMs: 1000,
    handlerType: 'local',
    async execute() {
      return 'System healthy. Use dashboard for full diagnostics.';
    }
  }
];
