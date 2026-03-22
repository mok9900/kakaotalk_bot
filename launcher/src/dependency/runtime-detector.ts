import { execSync } from 'node:child_process';
import type { RuntimeDependency } from '@shared/types/system';

function major(version: string): number {
  return Number(version.split('.')[0] ?? '0');
}

function detectVersion(command: string): string | null {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().replace(/^v/, '');
  } catch {
    return null;
  }
}

export class RuntimeDetector {
  detectAll(): RuntimeDependency[] {
    return [
      this.detectNode('22.0.0'),
      this.detectNpm('11.0.0'),
      this.detectGit('2.40.0')
    ];
  }

  detectNode(requiredVersion: string): RuntimeDependency {
    const installedVersion = detectVersion('node -v');
    if (!installedVersion) {
      return {
        id: 'nodejs',
        name: 'Node.js',
        requiredVersion,
        status: 'missing',
        required: true,
        installHint: 'OpenJS.NodeJS.LTS'
      };
    }

    const status = major(installedVersion) < major(requiredVersion) ? 'outdated' : 'valid';
    return {
      id: 'nodejs',
      name: 'Node.js',
      requiredVersion,
      installedVersion,
      status,
      required: true,
      installHint: 'OpenJS.NodeJS.LTS'
    };
  }

  detectNpm(requiredVersion: string): RuntimeDependency {
    const installedVersion = detectVersion('npm -v');
    if (!installedVersion) {
      return {
        id: 'npm',
        name: 'npm',
        requiredVersion,
        status: 'missing',
        required: true,
        installHint: 'OpenJS.NodeJS.LTS'
      };
    }

    const status = major(installedVersion) < major(requiredVersion) ? 'outdated' : 'valid';
    return {
      id: 'npm',
      name: 'npm',
      requiredVersion,
      installedVersion,
      status,
      required: true,
      installHint: 'OpenJS.NodeJS.LTS'
    };
  }

  detectGit(requiredVersion: string): RuntimeDependency {
    const raw = detectVersion('git --version');
    const installedVersion = raw?.replace('git version ', '').trim() ?? null;
    if (!installedVersion) {
      return {
        id: 'git',
        name: 'Git',
        requiredVersion,
        status: 'missing',
        required: true,
        installHint: 'Git.Git'
      };
    }

    const status = major(installedVersion) < major(requiredVersion) ? 'outdated' : 'valid';
    return {
      id: 'git',
      name: 'Git',
      requiredVersion,
      installedVersion,
      status,
      required: true,
      installHint: 'Git.Git'
    };
  }
}
