import { execSync, spawn } from 'node:child_process';

export class AdminManager {
  isWindowsAdmin(): boolean {
    if (process.platform !== 'win32') {
      return true;
    }

    try {
      const result = execSync('powershell -NoProfile -Command "[Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent() | ForEach-Object { $_.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator) }"', { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim()
        .toLowerCase();
      return result.includes('true');
    } catch {
      return false;
    }
  }

  elevateIfNeeded(scriptPath: string): never | void {
    if (process.platform !== 'win32' || this.isWindowsAdmin()) {
      return;
    }

    const command = `Start-Process -FilePath \"${process.execPath}\" -ArgumentList \"${scriptPath}\" -Verb RunAs`;
    spawn('powershell', ['-NoProfile', '-Command', command], { detached: true, stdio: 'ignore' }).unref();
    process.exit(0);
  }
}
