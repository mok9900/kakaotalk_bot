import { execSync } from 'node:child_process';
import type { RuntimeDependency } from '@shared/types/system';

interface PackageManager {
  exists(): boolean;
  install(pkg: string): void;
  update(pkg: string): void;
}

class WingetManager implements PackageManager {
  exists(): boolean {
    try {
      execSync('winget --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  install(pkg: string): void {
    execSync(`winget install --id ${pkg} --accept-package-agreements --accept-source-agreements -h`, { stdio: 'inherit' });
  }

  update(pkg: string): void {
    execSync(`winget upgrade --id ${pkg} --accept-package-agreements --accept-source-agreements -h`, { stdio: 'inherit' });
  }
}

class ChocolateyManager implements PackageManager {
  exists(): boolean {
    try {
      execSync('choco -v', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  install(pkg: string): void {
    execSync(`choco install ${pkg} -y`, { stdio: 'inherit' });
  }

  update(pkg: string): void {
    execSync(`choco upgrade ${pkg} -y`, { stdio: 'inherit' });
  }
}

export class OsPackageAutomation {
  private readonly managers: PackageManager[];

  constructor() {
    this.managers = process.platform === 'win32' ? [new WingetManager(), new ChocolateyManager()] : [];
  }

  private findManager(): PackageManager | null {
    return this.managers.find((m) => m.exists()) ?? null;
  }

  ensure(dependency: RuntimeDependency): void {
    const manager = this.findManager();
    if (!manager || dependency.status === 'valid') {
      return;
    }

    const pkgName = dependency.installHint;
    if (!pkgName) {
      return;
    }

    if (dependency.status === 'missing' || dependency.status === 'corrupt') {
      manager.install(pkgName);
      return;
    }

    if (dependency.status === 'outdated') {
      manager.update(pkgName);
    }
  }
}
