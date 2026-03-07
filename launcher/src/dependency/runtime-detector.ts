import { execSync } from 'node:child_process';
import type { RuntimeDependency } from '@shared/types/system';

export class RuntimeDetector {
  detectNode(requiredVersion: string): RuntimeDependency {
    try {
      const installedVersion = execSync('node -v').toString().trim().replace('v', '');
      const outdated = installedVersion.split('.')[0] !== requiredVersion.split('.')[0];
      return {
        id: 'nodejs',
        name: 'Node.js',
        requiredVersion,
        installedVersion,
        status: outdated ? 'outdated' : 'valid',
        required: true
      };
    } catch {
      return {
        id: 'nodejs',
        name: 'Node.js',
        requiredVersion,
        status: 'missing',
        required: true
      };
    }
  }
}
