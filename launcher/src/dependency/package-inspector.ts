import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import type { RuntimeDependency } from '@shared/types/system';

export class PackageInspector {
  async inspectNodeModules(root: string): Promise<RuntimeDependency> {
    const nodeModulesPath = join(root, 'node_modules');

    try {
      await access(nodeModulesPath, constants.R_OK);
      const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as { version: string };
      return {
        id: 'node-modules',
        name: 'Node dependencies',
        requiredVersion: pkg.version,
        installedVersion: pkg.version,
        status: 'valid',
        required: true
      };
    } catch {
      return {
        id: 'node-modules',
        name: 'Node dependencies',
        requiredVersion: 'latest-lockfile',
        status: 'missing',
        required: true
      };
    }
  }
}
