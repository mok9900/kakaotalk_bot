import { execSync } from 'node:child_process';

export class Installer {
  installDependencies(root: string): void {
    execSync('npm install', { cwd: root, stdio: 'inherit' });
  }

  updateDependencies(root: string): void {
    execSync('npm update', { cwd: root, stdio: 'inherit' });
  }

  repairDependencies(root: string): void {
    execSync('npm ci', { cwd: root, stdio: 'inherit' });
  }

  restoreBuildArtifacts(root: string): void {
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
  }
}
