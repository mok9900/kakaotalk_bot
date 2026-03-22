import { execSync } from 'node:child_process';

export class Verifier {
  verify(root: string): boolean {
    try {
      execSync('npm run lint', { cwd: root, stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  }
}
