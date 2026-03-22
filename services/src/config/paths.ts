import { homedir, platform } from 'node:os';
import { join } from 'node:path';
import type { AppPaths } from '@shared/types/system';

function resolveRootByPlatform(): string {
  if (platform() === 'win32') {
    return join(homedir(), 'AppData', 'Roaming', 'KakaoAgentManager');
  }

  return join(homedir(), '.kakao-agent-manager');
}

export function getAppPaths(): AppPaths {
  const root = resolveRootByPlatform();

  return {
    appDataDir: root,
    cacheDir: join(root, 'cache'),
    logsDir: join(root, 'logs'),
    configDir: join(root, 'config'),
    diagnosticsDir: join(root, 'diagnostics'),
    runtimeDir: join(root, 'runtime')
  };
}
