import { homedir } from 'node:os';
import { join } from 'node:path';
import type { AppPaths } from '@shared/types/system';

export function getAppPaths(): AppPaths {
  const root = join(homedir(), 'AppData', 'Roaming', 'KakaoAgentManager');

  return {
    appDataDir: root,
    cacheDir: join(root, 'cache'),
    logsDir: join(root, 'logs'),
    configDir: join(root, 'config'),
    diagnosticsDir: join(root, 'diagnostics')
  };
}
