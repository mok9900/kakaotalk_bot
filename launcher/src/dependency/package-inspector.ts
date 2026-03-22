import { access, readFile, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import type { RuntimeDependency } from '@shared/types/system';

export class PackageInspector {
  async inspectNodeModules(root: string): Promise<RuntimeDependency> {
    const nodeModulesPath = join(root, 'node_modules');
    const lockPath = join(root, 'package-lock.json');

    try {
      await access(nodeModulesPath, constants.R_OK);
      const lockStat = await stat(lockPath);
      const modulesStat = await stat(nodeModulesPath);
      const lockNewer = lockStat.mtimeMs > modulesStat.mtimeMs;

      const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as { version: string };
      return {
        id: 'node-modules',
        name: 'Node dependencies',
        requiredVersion: pkg.version,
        installedVersion: pkg.version,
        status: lockNewer ? 'outdated' : 'valid',
        required: true
      };
    } catch {
      return {
        id: 'node-modules',
        name: 'Node dependencies',
        requiredVersion: 'lockfile-sync',
        status: 'missing',
        required: true
      };
    }
  }

  async inspectBuildArtifacts(root: string): Promise<RuntimeDependency> {
    const distPath = join(root, 'dist');
    try {
      await access(distPath, constants.R_OK);
      return {
        id: 'build-assets',
        name: 'Build artifacts',
        requiredVersion: 'latest',
        installedVersion: 'present',
        status: 'valid',
        required: false
      };
    } catch {
      return {
        id: 'build-assets',
        name: 'Build artifacts',
        requiredVersion: 'latest',
        status: 'missing',
        required: false
      };
    }
  }
}
